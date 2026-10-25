# 07 Tuning numbers (draft)

Status: draft. Every number the first playable uses, in one place, so playtests
can say "too slow" and point at a number. Nothing here is balanced yet.

"From memory" means the value was recalled from Stardew Valley and not checked
against any source. Our own values are marked as such. Per ADR 0002 we copy no
content, so any value can change freely once playtests say so.

## Day and energy

Source: `src/core/clock.ts`, `src/core/energy.ts`, `src/core/day.ts`,
`src/scenes/FarmScene.ts`.

- The day runs from 6:00 am to 2:00 am (20 hours). From memory.
- One clock tick is 10 game minutes every 7 real seconds, so a full day is
  about 14 real minutes if the player only stands still. Ours, unchecked.
- Maximum energy is 270. From memory.
- Each tool use costs 2 energy and no game time. Ours: time per action is not
  modelled yet, so energy is the real limit and the clock is only pressure.
- Sleeping before the day is over restores all energy for free.
- Passing out costs 10 percent of money, capped at 1000. The next morning has
  50 percent energy after running out of energy and 75 percent after staying up
  too late. From memory.

## Money and shop

Source: `src/core/save.ts`, `src/core/toolbar.ts`, `src/content/crops.json`.

- A new game starts with 500g and 15 parsnip seeds. Money from memory, seeds
  ours.
- Seeds cost the listed seed price and goods sell for the listed sell price.
  Seeds can be sold back for half the price they cost (rounded down). Ours.

Crops (season, days to grow, seed price, sell price):

- Parsnip: spring, 4 days, 20g, 35g. From memory.
- Potato: spring, 6 days, 50g, 80g. From memory.
- Cauliflower: spring, 12 days, 80g, 175g. From memory.
- Melon: summer, 12 days, 80g, 250g. From memory.
- Tomato: summer, 11 days, 50g, 60g. From memory.
- Radish: summer, 6 days, 40g, 90g. From memory.

A crop grows one day for each day it was watered. It does not regrow after
harvest, and it withers when its season ends. Rain waters every plot overnight.

## Seasons and weather

Source: `src/core/calendar.ts`, `src/core/weather.ts`.

- A season is 28 days and there are two (spring, summer). From memory for the
  length.
- Chance of rain per day is 20 percent in spring and 15 percent in summer. The
  first day of a season is always sunny. Ours.

## Foraging

Source: `src/core/forage.ts`, `src/content/forage.json`.

- Up to a quarter of the farm's forage spots hold a good each morning, and the
  count is random from none to that cap. Ours.
- Spring goods: daffodil 30g, wild leek 60g, dandelion 40g, wild horseradish
  50g. Summer goods: wild grape 80g, spice berry 80g, sweet pea 50g. The prices
  are ours and unchecked.

## Skills

Source: `src/core/skills.ts`.

- Ten levels. Total XP needed: 100, 380, 770, 1300, 2150, 3300, 4800, 6900,
  10000, 15000. From memory.
- A forage pickup gives 7 XP. A harvest gives `floor(16 * ln(0.018 * price + 1))`.
  From memory.
- Levels raise the chance of better quality goods (next section). They have no
  other effect yet.

## Quality

Source: `src/core/quality.ts`. Quality is part of the item id (`parsnip@gold`),
so each tier stacks and sells separately. Bundles take any tier.

- Tiers: normal, silver (x1.25 price), gold (x1.5 price). Iridium is left out
  until there is a source for it. From memory.
- Crops: gold chance is `0.2 * farmingLevel / 10 + 0.01`; silver chance is twice
  that, so a level 10 farmer gets about 21 percent gold and 21 percent silver.
  Stardew's fertiliser term is left out. From memory.
- Forage: gold chance is `foragingLevel / 30`, silver up to `foragingLevel / 15`.
  From memory.

## Village hall

Source: `src/content/bundles.json`.

- Five bundles: Spring Foraging (all 4 goods, reward 15 parsnip seeds), Summer
  Foraging (all 3, 15 radish seeds), Spring Crops (any 3 of 3, 300g), Summer
  Crops (any 3 of 3, 400g) and Pantry (any 4 of 7 mixed goods, 500g). Contents
  and rewards are ours.
- Foraging bundles are easy. A simulation of a player who sweeps all 14 farm
  spots every morning finished Spring Foraging in a median of 5 days (90th
  percentile 9) and Summer Foraging in 3 (90th percentile 6), with no failures
  in 2000 runs. A real player walks and spends time, so expect longer.

## Open questions for playtests

First answers are in `08_playtest_personas.md`: 500g is far more than enough
(a parsnip returns 35g on a 20g seed in 4 days) and an expert finishes all five
bundles on day 41 of 56.

- Is 14 real minutes a day too long on a tablet?
- Does energy set the pace, now that forage is plentiful?
- Is 500g enough to start, and do the later crops pay back their seed?
- Can all five bundles be finished in the two seasons?
