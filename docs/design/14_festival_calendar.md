# 14 Festival calendar

Status: proposed 2026-10-27 (issue #131). Design only. The festival system
(#132) builds from this. Dates and the two placeholder festivals are ours and
cheap to change; change them with a new dated decision here.

## Rules

- Two festivals per season (`09_story_and_lore.md`). The game has two seasons
  today (spring, summer; `src/core/calendar.ts`), so the calendar has four
  festivals. Later seasons add two each.
- A festival falls on a fixed day of the season, every year.
- Not on day 1 (the always sunny start of a season) and not in the last week,
  so a festival never competes with the end-of-season crop rush.
- Festival days are always sunny, like day 1. A festival never costs the
  player a crop or a lost chance to water.
- The village changes for the day (decoration, villagers gathered at the
  green). The festival opens at midday so the player can still do the morning
  chores, and it ends the day when it finishes. Nothing is lost by skipping it.
- No pressure: no timer on joining, no penalty for missing one, no score
  required. A prize counter or minigame is a bonus (`11_minigames.md`).

## The calendar

| Season | Day | Festival | Notes |
| --- | --- | --- | --- |
| Spring | 10 | Hat Parade | The M3 festival. Everyone shows off their best hat. |
| Spring | 22 | Seedswap Fair (placeholder) | Neighbours trade seeds. Mostly a prize counter. |
| Summer | 8 | Cake Day | Brimmers dress in food-looking clothes. |
| Summer | 20 | Lamplight Evening (placeholder) | A quiet lantern gathering at dusk. |

## Why these dates

- **Hat Parade in spring, day 10.** Spring is the first season, so the parade
  is the first thing the player sees the village do. Day 10 gives nine days to
  find or earn a first hat (`10_customisation.md`), and it is the first
  festival a new player meets. It also shows the folk's hat culture early,
  which the lore wants (hats as a readout of standing).
- **Seedswap Fair, spring day 22.** Late enough to follow the first bundles,
  early enough to leave a week clear before the season ends. A placeholder:
  it exists to meet the two per season rule and can be swapped.
- **Cake Day in summer, day 8.** Cake day suits a season of plenty, and a
  summer date keeps it clear of the parade so the two costume festivals are
  not back to back. Early in the season for the same reason as the parade.
- **Lamplight Evening, summer day 20.** A calm counterpoint late in the run.
  It is also a natural place for the first light touch of the ember and ash
  theme later (a few lamps gutter), without any threat. A placeholder.

Each season has its two festivals twelve days apart, so a player always has a
festival to look ahead to.

## What the player sees

- The calendar (or the sleep summary) shows the next festival and its day.
  Needs a small UI change in #132, not here.
- The day before a festival, the morning message says it is tomorrow.

## Hooks for #132

- Each festival is data: season, day, name, a map or map overlay, a list of
  villagers and where they stand, an optional prize counter, and an optional
  minigame id. Content stays in data files, not code.
- A festival lookup lives in `src/core/` and is pure: given a date, return the
  festival or nothing. Unit test it against this table.
- Weather: a festival date forces sunny weather in `src/core/weather.ts`.
- Save: nothing new is stored for the calendar itself. Whether the player has
  joined this year's parade is stored when the prize counter needs it.

## M3 cut

Only the Hat Parade is built in M3 (`13_m3_scope.md`). The other three rows are
the plan, not a promise. The Seedswap Fair is the cheapest second festival,
because it is mostly a prize counter.

## Open

- Final names. The two placeholders are marked; Hat Parade and Cake Day come
  from the lore note.
- Whether a festival closes the shop. Proposal: no, the shop stays open until
  its normal closing time, so the player is never blocked from selling.
