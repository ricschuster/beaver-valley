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
- Green bean: spring, 10 days then regrows every 3, 60g, 40g. From memory.
- Kale: spring, 6 days, 70g, 110g. From memory.
- Garlic: spring, 4 days, 40g, 60g. From memory.
- Hot pepper: summer, 5 days then regrows every 3, 40g, 40g. From memory.
- Corn: summer, 14 days then regrows every 4, 150g, 50g. From memory.
- Red cabbage: summer, 9 days, 100g, 260g. From memory.

A crop grows one day for each day it was watered. It does not regrow after
harvest, and it withers when its season ends. Rain waters every plot overnight.

## Seasons and weather

Source: `src/core/calendar.ts`, `src/core/weather.ts`.

- A season is 28 days and there are two (spring, summer). From memory for the
  length.
- Chance of rain per day is 20 percent in spring and 15 percent in summer. The
  first day of a season is always sunny. Ours.
- Tomorrow's weather is rolled a day ahead and shown when the player uses the
  bed, like Stardew's TV forecast.

## Foraging

Source: `src/core/forage.ts`, `src/content/forage.json`.

- Up to a quarter of the farm's forage spots hold a good each morning, and the
  count is random from none to that cap. Ours.
- Spring goods: daffodil 30g, wild leek 60g, dandelion 40g, wild horseradish
  50g. Summer goods: wild grape 80g, spice berry 80g, sweet pea 50g. Later additions: spring onion 8g, salmonberry 5g (spring) and
  fiddlehead fern 90g (summer). The prices
  are ours and unchecked.

## Skills

Source: `src/core/skills.ts`.

- Ten levels. Total XP needed: 100, 380, 770, 1300, 2150, 3300, 4800, 6900,
  10000, 15000. From memory.
- A forage pickup gives 7 XP. A harvest gives `floor(16 * ln(0.018 * price + 1))`.
  From memory.
- Levels raise the chance of better quality goods, and farming levels trim
  swing energy (see below). At level 5 each skill asks for a profession (see
  Professions). Stardew's level 10 choices are not built.

## Professions

Source: `src/core/professions.ts`. One choice per skill at level 5, permanent.
After Stardew's level 5 choices, but with the animal and wood options replaced
by ones that fit our game. Ours, unchecked.

- Farming: Tiller (crops sell for 10 percent more) or Agriculturist (crops grow
  10 percent faster, which saves a day on a 12 day crop and nothing on a 4 day
  one).
- Foraging: Gatherer (20 percent chance of a second good) or Botanist (forage is
  never plain, at least silver).

## Tool upgrades and energy

Source: `src/core/upgrades.ts`. The hoe and watering can have four tiers (basic,
copper, steel, gold) bought in the shop for 2000g, 5000g and 10000g. From
memory for prices; Stardew also needs bars and a wait, which we skip.
A fifth tier above gold is planned (decided 2026-10-29, `21_fishing.md`): a rare
metal from the deepest mine levels. Not built, and its price is open (#194).

- A swing costs `2 - 0.25 * tier - 0.1 * farmingLevel`, never under 0.5. The
  level term is from memory, the tier term is ours. Energy can now be
  fractional and the HUD rounds up.
- With 500g to start, an upgrade is a mid game goal.
- Playtest check (expert run, no upgrades bought): 7322g in hand when the last
  bundle was handed in on day 41 and 8297g after the end screen. So the 2000g
  and 5000g tiers are reachable well inside two seasons. The 10000g tier
  is not reached by day 41 by an expert who also funds every bundle; it is a
  late goal, which fits. A casual player will not reach it.

## Eating

Source: `src/core/actions.ts` (`eat`), `energy` fields in the content files.

- The player eats the held item with F or the Eat button. It takes no game time
  and is refused at full energy, so food is not wasted.
- Crops and most forage restore energy, with values from memory of Stardew:
  parsnip 25, potato 25, cauliflower 75, melon 113, tomato 20, radish 45,
  green bean 25, kale 50, garlic 20, hot pepper 13, corn 25, red cabbage 75,
  leek 40, dandelion 25, horseradish 13, wild grape 38, spice berry 25,
  salmonberry 25, fiddlehead fern 25, spring onion 5. Daffodil and sweet pea are
  not food.
- Silver restores x1.4, gold x1.8.

## Backpack

Source: `src/core/inventory.ts`, `src/core/upgrades.ts`. The backpack starts at
12 slots and can grow to 24 (2000g) and then 36 (10000g), bought in the shop.
Sizes and prices from memory. The toolbar shows 12 slots at a time; Tab or the
Row button moves to the next row, as in Stardew.

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

## Fishing (draft, not built)

Source: `21_fishing.md`. All of these are ours and are placeholders.

- Rods: Reed Pole 50g, Hazel Rod 400g, Heron Rod 1500g, Hearthwell Rod 4000g.
  Only the Reed Pole limits fish (common only). Rare fish need fishing level 5.
- Bar width as a share of the track: 0.30, 0.36, 0.42, 0.50 by rod. Assist adds
  30 percent. Cast range in tiles: 4, 6, 8, 10.
- Bait: Plain 3g (wait x0.7), Fine 12g (x0.5), Salted 8g (sea only, x0.5).
  Lures last 20 casts: Glint 250g, Moth 150g, Storm 150g, Whirligig 200g (wait
  x0.7), Wide Float 200g (bar +15 percent), Magpie Hook 300g (1 cast in 5 gives
  a small treasure: a coin purse of `40 + 15 * level` gold 6 times in 10, else a
  trinket worth 30 to 120g). The Heron Rod has one lure slot, the Hearthwell Rod two.
- Fish sell prices by rarity: common 40 to 90g, uncommon 100 to 200g, rare 250
  to 500g, cove fish 400 to 700g. Legends: Hearthwell Carp 4000g, Valley King
  3500g, Moonlit Mother 3500g, Grandmother Hush 3000g, Great Hearthfin 3000g.
  Pearl Lobster 800g.
- Pots: 150g in the shop, one catch a day. Fresh: Crayfish 35 in 100 (40g),
  River Mussel 35 (45g), Ladle Snail 20 (70g), Marsh Clam 10 (90g). Salt: Crab
  30 (60g), Periwinkle 30 (50g), Spiny Shrimp 20 (100g), Pearl Lobster 20
  (800g).
- Pearl Lobster odds: about 3 in 100 sea bites on a rod, about 1 in 5 a day in
  a salt water pot.
- XP: the harvest formula on the fish price, times 1.5 for a perfect catch. The
  level curve is the shared one in Skills.
- Quality: size roll `random(0,1) * (0.5 + 0.05 * level) + 0.1 * castDistance`.
  Silver at 0.33, gold at 0.67. A perfect catch lifts silver or gold one grade.
  A skipped fight (assist level two) gives no perfect lift.

## Village hall

Source: `src/content/bundles.json`.

- Five bundles: Spring Foraging (any 4 of 6 goods, reward 15 parsnip seeds),
  Summer Foraging (any 3 of 4, 15 radish seeds), Spring Crops (any 3 of 3,
  300g), Summer Crops (any 3 of 3, 400g) and Pantry (any 4 of 9 mixed goods,
  500g). Contents and rewards are ours. The foraging bundles and the Pantry
  took the new goods; the crop bundles are unchanged, as decided in
  `08_playtest_personas.md`.
- Foraging bundles are easy (the simulation below ran before the extra goods
  made them easier). A simulation of a player who sweeps all 14 farm
  spots every morning finished Spring Foraging in a median of 5 days (90th
  percentile 9) and Summer Foraging in 3 (90th percentile 6), with no failures
  in 2000 runs. A real player walks and spends time, so expect longer.

## Full hall (proposed, not built)

Source: `16_bundles.md`. All placeholders, ours unless marked.

- 30 bundles in six rooms (6, 6, 6, 3, 5, 4). The counts follow Stardew.
- Rooms appear by bundles finished: Foragers' Shelf at the start, Larder and
  Water room after 1, Hearth after 2, Guests' Board after 3, The Last Seat after
  20 of the other 26. Stardew's pattern comes from a forum reply and is
  unchecked.
- The Last Seat asks for 3 of each of four dishes, four gold fish, 10 bars, 5
  lamps, 5 bolts of cloth, 3 dyes, and for the last bundle 100 wood, 100
  stone, 20 bars, 10 bolts of cloth and 5,000g.
- The mines open on a fixed day announced by Old Greencoat. The day is not
  chosen.

## Open questions for playtests

First answers are in `08_playtest_personas.md`: 500g is far more than enough
(a parsnip returns 35g on a 20g seed in 4 days) and an expert finishes all five
bundles on day 41 of 56.

- Is 14 real minutes a day too long on a tablet?
- Does energy set the pace, now that forage is plentiful?
- Is 500g enough to start, and do the later crops pay back their seed?
- Can all five bundles be finished in the two seasons?
