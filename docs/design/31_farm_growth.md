# 31 Farm growth tools (draft)

Status: draft. Decided with the owner on 2026-10-31. Nothing here is built; the
game has hand watering and plain crops only. Reference: the Stardew Valley Wiki
Sprinkler, Scarecrow, Fruit Trees, Greenhouse, The Cave and Fertilizer pages,
read only (ADR 0002). Costs and recipes are placeholders until the tuning note.

## Decisions

### Sprinklers

- Three tiers, as in Stardew: a basic one that waters the four tiles next to
  it, a quality one that waters the eight around it, and a late one that waters
  the 24 around it. Unlocked by farming level, around levels 2, 6 and 9, and
  crafted from our smelted bars (`22_mines.md`). Exact recipes go in
  `07_tuning_numbers.md`.
- Two upgrade add-ons are in, as in Stardew: a nozzle that widens a sprinkler's
  reach, and an enricher that is loaded with fertilizer and applies it to
  seeds planted nearby. One add-on per sprinkler. Picking a sprinkler up keeps
  its add-on.
- A sprinkler waters tilled tiles only, every morning. It does not work on
  sand, which only matters if a sandy farm is ever added (`30_farm_types.md`).
- Rain waters everything already, as now. Sprinklers matter on dry days.

### Scarecrows

- No crows, so no protective scarecrow. We skip the loss mechanic.
- Decorative scarecrows are wanted eventually, as farm decoration. That belongs
  to `10_customisation.md`, not here.

### Fruit trees

- Built as in Stardew, in M3 with fall and winter. Saplings come from the shop.
- A tree takes 28 days to mature, then bears one fruit a day in its season and
  holds a few days of fruit until picked. It needs no watering and does not die
  in winter.
- To grow, a young tree needs a clear 3x3 of ground. Weeds that land in that
  square stop its growth and a message names the tree on waking
  (`29_weeds.md`). Grass does not count. Two trees cannot share their 3x3.
  Once mature, the surrounding ground no longer matters.
- Fruit gains a quality tier for each year of tree age after maturity.
- The player's crop price bonus (Tiller) and artisan price bonus
  (`23_animals.md`) apply to fruit and to what is made from it.
- Chopping a tree gives wood and returns a sapling.

### Fertilizer

- First two tiers only for now, with the three lines of Stardew: quality (a
  better chance of higher grades), speed (faster growth) and retaining (a chance
  the soil stays watered overnight). The third tier waits.
- One fertilizer per tilled tile. It stays until the season ends, then wears
  off, except under a multi-season crop that is still growing, and always in
  the greenhouse.
- Quality fertilizer adds a term to the crop grade formula in
  `07_tuning_numbers.md`, which has left it out so far.
- Recipes unlock by farming level and some are sold in the shop. Where they come
  from is a tuning question. The bundle rewards of fast-grow and quality
  fertilizer (`16_bundles.md`) stand.
- A separate tree fertilizer waits for trees and wood to be a real system.

### Greenhouse

- The Larder room reward is the greenhouse (`16_bundles.md`). Every farm starts
  with a ruined building that the reward repairs. Once repaired it can be moved
  at the carpenter.
- Inside, crops grow in any season. They still need watering, and sprinklers
  can go on the border. Multi-harvest crops never die when the season changes,
  which is the main prize.
- Fruit trees can be planted inside and bear fruit every day after maturity.
- It answers the winter question in `26_seasons.md`: winter has no outdoor crops
  but the greenhouse carries a small year-round income.
- Crows, lightning and giant crops do not exist for us, so they are not an issue.

### Farm cave

- A small cave on the farm, empty at first. When total earnings pass a mark
  (Stardew uses 25,000g, ours is a tuning number), a villager asks to use it
  and the player chooses fruit bats or mushrooms. The choice is permanent.
- Fruit bats leave fruit in the cave overnight, on a chance, including foraged
  berries out of season. Mushrooms grow there and are picked by hand.
- Items stay until picked up. The botanist profession makes fruit top grade, and
  the gatherer profession gives a chance of a double (`07_tuning_numbers.md`).
  Picking gives foraging experience.
- The cave is a gentle, foraging-flavoured payoff and needs no creatures, which
  keeps it inside the no-monsters farm rule (`25_stardew_system_review.md`).

## Why these choices

Farming is the core loop and these tools are its progression: sprinklers cut
the watering chore, fertilizer deepens each plot, trees give a slow investment,
and the greenhouse gives winter something to do. Dropping crows removes the one
part that is pure loss. Everything else is a reward the player chooses.

## Build order

1. Sprinklers and fertilizer. They build on the crops that exist.
2. The greenhouse, with the Larder room.
3. Fruit trees and the farm cave, with fall and winter in M3.

## Open

- Sprinkler and fertilizer recipes and prices, the cave's earnings mark, tree
  prices and the fruit tables. All go in `07_tuning_numbers.md`.
- How fertilizer and add-ons are shown and picked on a tablet.
- Whether the greenhouse can hold both crops and sprinklers without a layout
  puzzle (the Stardew greenhouse needs soil tiles given up for sprinklers).
- Fiber and sap, used by some recipes, must exist as items first. Fiber comes
  from weeds (`29_weeds.md`).
