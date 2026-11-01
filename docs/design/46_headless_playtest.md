# 46 Headless playtest (draft)

Status: decided 2026-11-01 for issue #319. Nothing is built yet.

## Problem

The browser playtests (`scripts/playtest/`) take 10 to 30 minutes a run. The
game clock ticks in real time (7 s per 10 game minutes, `TICK_MS` in
`FarmScene`), and the scripts add fixed sleeps after key presses. Weather,
forage and trees are random, so comparing two builds needs several runs.
`SEED` helps, but timing still varies, so runs are close, not identical.

What we want to know most (economy balance, the numbers in note 07, whether
a change slowed the bundle chain) does not need a browser. It needs the rules,
a plan, and many runs.

## What the code already gives us

`src/core/` is free of Phaser and the DOM (ADR 0004), and it already holds
almost everything a bot needs:

- `newGame()`, and `till`, `water`, `plant`, `harvest`, `forage`, `chop`,
  `eat`, `plantTree` in `actions.ts`, each returning an `Outcome`.
- `sleep()` in `sleep.ts`: pass-out cost, bin payout, crop growth, weather,
  trees, forage respawn, house build. It takes `random`, so a seeded generator
  makes a run exactly repeatable. No browser seed trick is needed.
- `shop.ts`, `bundles.ts` (`Hall`), `shipping.ts`, `upgrades.ts`, `skills.ts`.

So the bot can call the same functions the scene calls, and the headless run
is the real rules, not a copy.

## What lives only in `FarmScene`

These are the gaps. A headless bot would miss them unless it models them.

| Gap | Where | Effect on a bot |
| --- | --- | --- |
| Game time passes only by the real-time tick. Actions cost energy but no minutes. | `FarmScene` tick, `actions.ts` comment | A bot has no time pressure. It must add minutes itself. |
| Walking: speed, collision, distance to a target | `update`, `movement.ts` | Real days are limited by walking and the 26:00 limit. A bot that teleports overstates output. |
| Day end wiring: `sleep()` args (forage spots, map, `Math.random`) | `endDay` | Small. Copy the call, or move it into core as `endDay(g, random)`. |
| Profession choice after a level up | `afterAction` | The bot must pick one, as the scripts do with `PROFESSION`. |
| Ground piles picked up by walking | `pickUp` | Bot must collect them (they are in `g.ground`). |
| Festival hours, exits that are shut | `openFestival`, `exitOpen` | Out of scope for a first bot. |

The conclusion: little needs moving into core. The one real gap is time. The
fix is a small cost model in the bot (minutes per action, plus walking minutes
from tile distance divided by `SPEED`), not a change to the game. Moving
walking into core is not worth it for this.

## Options considered

1. **Headless bot on `src/core/`** (recommended). A Node script under
   `scripts/sim/` driven by a seeded generator. Runs a year in about a second,
   so it can run hundreds of seeds and give a spread, not one lucky run. It
   checks economy and progress, not input or scenes.
2. **Speed up the browser runs.** Playwright's `page.clock` can fast forward
   timers. It cannot be trusted for movement: `update` caps the step at 50 ms
   per frame, so walking does not speed up with the clock. Shorter waits and a
   dev-only faster `TICK_MS` help a little. This stays a cheap follow-up, not
   the answer, because the runs would still be minutes long.
3. **Fuzz or property tests of the rules** in Vitest (random action
   sequences, check invariants such as money never negative, inventory never
   over capacity). Cheap, and it fits the existing gate. It finds bugs, not
   balance, so it complements option 1 rather than replacing it.
4. **Record and replay inputs.** Gives exact repeats of a browser run, but
   needs recording code and breaks with every control change. Not now.

How other projects do it, in brief: simulation-heavy games commonly run the
rules with a fixed time step and a seeded random source and drive them with
scripted "personas", which is option 1. Replay and fuzzing are used for
regressions. This matches the split the issue suggests.

## Proposal

- Build option 1 as `npm run sim` (manual, not a gate, like the playtests).
  Option 3 can follow as ordinary unit tests.
- Personas are the same three as note 08 (expert, intermediate, casual),
  written as plans over the core actions, so the numbers stay comparable.
- Time model: each action costs a fixed number of game minutes (table in the
  bot, tuned once against a browser run), walking costs tiles divided by
  `SPEED`, using a breadth-first search over `map.isBlocked`. The day ends at
  26:00 or when energy runs out, through the same `sleep()`.
- Output: days to each bundle, money by season, days passed out, crops
  withered. Print a median and range over N seeds. Compare two builds by
  running the same seeds on both.
- The browser scripts stay for input, scenes, HUD and touch.

## Calibration

The first check is that the headless expert lands near the browser expert in
note 08 (all bundles around day 41 to 45, with the Pantry dropped). If it is
far off, the time model is wrong and gets fixed before any result is trusted.

## Out of scope

Pathfinding quality beyond shortest tile distance (#317 is the browser bot
getting stuck, a separate problem), festivals, the carpenter, combat, and any
change to game rules.

## Decisions

Decided by the owner on 2026-11-01:

1. Build option 1, the headless bot on `src/core/`. The browser speed-ups
   (option 2) wait.
2. The time model (fixed minutes per action, walking from tile distance,
   calibrated against a browser run) is close enough.
3. The first result to report is bundle-chain pace (days to each bundle and
   to all bundles). Money by season comes second.
