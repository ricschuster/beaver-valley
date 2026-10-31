# 03 Milestones (draft)

Status: draft. This is the one place the overall order of work lives. Live
tasks and open questions are GitHub issues, grouped by the GitHub milestones
named below. Filter by label `next-payoff` for the few items that matter most
right now.

How to pick a payoff: choose the item that gets something playable sooner, or
settles a decision that many other items wait on. Review this list at the start
and end of each session, and update the status column.

Ranking from the project brief: home valley is Must, the regions are Should,
the dark edge is Could.

| # | Milestone | Payoff (done when) | Status | Main blocker |
| --- | --- | --- | --- | --- |
| M1 | Define the first playable | The first playable's scope and done list are written below, and the audience, identity, core loop of a day and multiplayer questions are answered. | Done | None |
| M2 | First playable | Day and energy cycle, farming, selling and a small centre 1 run in the home valley, with rough art. Engine chosen in an ADR. | In progress | Tablet pass and placeholder art (#58) |
| M3 | Vertical slice | One full cycle of centre 1, near-final quality, built as five slices, one hall room each, starting with year one on the farm (`33_build_order.md`). | Not started | M2, bundle data model (#179) |
| M4 | Ring 2 prototype | A haven and about 2 regions reachable from the home valley. Centre 2 in small form. | Not started | M3, ring 2 shape (#20) |
| M5 | Ring 3 and centre 3 | A logistics-only frontier outpost. Optional, late. Only if M1 to M4 prove fun. | Not started | M4, centre 3 (#5) |

## First playable scope (draft, issue #12)

Decided in discussion on 2026-10-15. Still draft until played.

In:

- Day and energy cycle.
- Farming: plant, tend, harvest.
- Foraging: wild goods found near the farm.
- Skills for farming and foraging, leveled by doing.
- Two short seasons with different crops and foraging goods.
- Selling goods.
- A small version of centre 1 (village hall) with a few bundles.
- House upgrades: three paid tiers (`41_house.md`), added 2026-10-31.
- Rough placeholder art.

Out (non-goals for now, see the project brief): regions, ring 3, combat,
multiplayer, generated content, deep relationships, final name and polish.

### Centre 1 in the first playable

- **Size.** Four bundles (five until the Pantry was dropped, 2026-10-31), each asking for 3 to 6 items.
- **Requests.** Modelled on the original's approach, in our own names and
  items. A bundle names specific goods, and some bundles accept "any N of these
  M" so the player has choices. Some goods are tied to one of the two seasons,
  so what matters shifts over time and both foraging and farming are needed.
- **Starting set.** Season 1 foraging, season 2 foraging, season 1 crops,
  season 2 crops, and one mixed bundle that draws on all of them. Exact items
  wait for the crop and forage lists.
- **Hand-in.** The player hands items in one by one at the village hall. Each
  bundle remembers its progress between visits. The hall is always open.
- **Rewards.** Finishing a bundle gives a small reward (placeholder: seeds or a
  little money, to be tuned). Finishing all of them ends the first playable with a
  simple end screen.
- **Quality tiers, skill gates, tool upgrades.** Planned for M3, but quality
  tiers and tool upgrades were built early (#94, #97). Skill gates and
  professions are not built.

### Done list

The first playable is done when all of these are true:

1. A day runs with energy and a clock, and the player can pass out and wake at
   home with a small cost.
2. The player can plant, tend and harvest crops, and forage wild goods.
3. Farming and foraging skills level up by doing.
4. Two short seasons run, each with its own crops and foraging goods.
5. The player can sell goods.
6. The village hall shows its bundles, accepts item hand-ins one by one, and
   keeps progress between visits.
7. Finishing a bundle gives its reward, and finishing all bundles shows an end
   screen.
8. The game can be saved and loaded between days.
9. It runs with rough placeholder art and no audio requirement.
10. The house can be upgraded three times at the carpenter, each tier opening
    new rooms inside the same footprint (`41_house.md`).

A new idea during the build becomes an issue, not scope.

### Early M3 work

Built during M2 because it needed no design input and copies Stardew: quality
tiers, tool upgrades, eating, a weather forecast, a skills screen, a weekday
date, six more crops and three more forage goods. Numbers are in
`07_tuning_numbers.md`. This does not move the M3 scope, which is still fixed
by a design note before building.

### M3 candidates from reader feedback

Decided 2026-10-27 from reader 1's feedback. None are built. The M3
scope is in `13_m3_scope.md` (accepted, #130).

- Two festivals per season, one in M3 (`09_story_and_lore.md`): calendar #131, system
  #132.
- Bundle hints: a short hint per bundle, from a villager line or a tooltip.
  Part of the bundle format, #21.
- Customisation, first slice: house furniture and hats
  (`10_customisation.md`): #133. Furniture rewards are part of #21.
- Minigames, starting with a festival game (`11_minigames.md`): #134.
- The neglect rules and tone rules in `09_story_and_lore.md`: #135.
- The scope note that picks what is in and out of M3: #130.
- Later, not M3: marriage, which needs its own design note (#137, parked).
  Also unscheduled: the ring 1 cast list (#136) and the final name (#138).

### CI and the build check

The `build` job in `.github/workflows/ci.yml` runs format, lint, typecheck,
tests and the production build. On 2026-10-25 the `main` branch protection
required only `repo-hygiene`, so auto-merge does not wait for `build`. Making
`build` required is a repository setting left to the owner. Until then, run
`npm run check` before pushing.

## Scope control

- New ideas become issues, not scope.
- Each feature gets a time box with a cut, iterate or ship decision at the end.
- Keep a short log of how long things really take, so estimates improve.
- The vertical slice often feels nearly done but is about 20% of the total
  work. Fix its scope before building.
