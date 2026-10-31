# 33 Build order (draft)

Status: draft. Decided with the owner on 2026-10-31. This note turns the
designed systems (notes 16 to 32) into an order of build slices. It replaces
the "M3 is one slice" idea in `13_m3_scope.md` and `26_seasons.md`. Nothing here
is built. Where it differs from those two notes, this one wins.

## Why

Design has run well ahead of the build. M2 is built, and notes 16 to 32 settle
fishing, mines, animals, machines, cooking, four seasons, farm growth and more.
M3 was written on 2026-10-27 as a small slice (bundle hints, one festival, hats
and furniture) and then grew to hold four seasons and every system after it.
The roadmap warns that a slice feels nearly done at about 20 percent of the
work (`03_milestones.md`). So the work needs slicing, with each slice playable
on its own.

## Decisions (2026-10-31)

1. **One hall room per slice.** The village hall is the spine of the game
   (`16_bundles.md`). Each slice builds the systems a room needs and finishes
   that room, so every slice ends with something to hand in and a reward to
   use. This replaces building one system whole and wiring bundles at the end.
2. **The first slice is year one**, as in Stardew: all four seasons, 112 days,
   with farming, foraging and the hall's new format. The finish line of slice 1
   is playing from spring day 1 to the end of winter. This is the owner's
   choice over a two season first slice. It means fall and winter are in slice
   1, not later.
3. **Later slices add systems, not seasons.** Each adds a way to spend the
   year (fishing, mines, animals) and so fills the winter that slice 1 leaves
   thin.
4. **Design before build still holds.** Each slice lists the design notes it
   waits on. A slice does not start until they exist.

## The slices

### Slice 1: year one on the farm

Rooms finished: the Foragers' Shelf, and the crop half of the Larder (bundles
7 to 10).

Builds:

1. Bundle data model and the hall rooms screen: rooms, N-of-M rules, hints and
   the soft gate (#179, #180). First, since it is the `next-payoff` item and
   everything else hands goods in through it.
2. The shipping bin (`28_shipping_bin.md`).
3. Weeds, then sprinklers and fertilizer, with Fiber and Sap as items
   (`29_weeds.md`, `31_farm_growth.md`).
4. Fall and winter: crops, forage, nightfall, weather, snow and thunderstorms
   (`26_seasons.md`, #61).
5. The greenhouse, fruit trees and the farm cave (`31_farm_growth.md`).
6. The crafting list and the machines the farm alone can feed: seed maker,
   charcoal kiln, preserves jar, keg, bee house (`24_processing_and_cooking.md`).
7. The hat parade, hats and a first set of furniture, with a festival per
   season as content once the first works (`13_m3_scope.md`, `14`).
8. Farm types: Standard and Woodland (`32_farm_types.md`).

Bundles that can be filled: 1 to 10. Bundle 12 (Artisan Goods) works if its
pool of six is drawn from slice 1 machines (jam, pickles, wine, juice, honey,
seeds). Bundle 11 waits for animals.

Design still needed first: the crafting list note, the bundle item pools for
bundles 1 to 10 and 12 (#181), the fall and winter crop and forage lists (#61),
and the Fiber and Sap items.

Winter is thin in this slice: forage, the greenhouse, machines and a festival
carry it. That is accepted, since slices 2 to 4 fill it.

Cuts, in this order, if the slice runs long: farm types beyond Standard, the
farm cave, fruit trees, furniture count, extra festivals.

### Slice 2: fishing and the Water room

Rooms finished: the Water room (bundles 13 to 18), and its reward, the lake
cove.

Builds the four fishing slices in `21_fishing.md`: the bar and one water, the
roster and the skill, bait, lures and conditions, then pots, the cove and the
legend.

Bundle 16 (Night Fishing) gives a glow ring, which needs the equipment slot (see
slice 3). It gives a placeholder reward until then.

Design still needed first: nothing blocks. The water plants, trash items and the
recycler's odds (`21_fishing.md`) are numbers and can be settled in the slice.

### Slice 3: the mines and the Hearth

Rooms finished: the Hearth in part (bundles 19 and 20). Bundle 21, Weaver's,
needs cloth, which needs wool and so animals. The Hearth room reward, the carts,
therefore arrives in slice 4.

Builds the mines slices 1 to 3 in `22_mines.md`: floors 1 to 10 and the lift,
the smith dwarf and bars, then health, starter weapons and the first creatures.
The rest of the mines (more bands, the combat skill, dangerous mode) is
unscheduled until this slice is played.

Design still needed first: **the equipment slot** for rings and boots, which
bundles 16 and 28 and the mines' own drops lean on. Rings and Footwear are
absent from `25_stardew_system_review.md`.

### Slice 4: animals, cooking and friendship

Rooms finished: the rest of the Larder (bundle 11), the Hearth (bundle 21) and
the Guests' Board (bundles 22 to 26).

Builds: the coop and barn and the care loop (`23_animals.md`), the machines
that animals feed (cheese press, loom, mayonnaise machine), cooking and the
kitchen, the dye vat, and friendship with gifts and the recipe mail
(`24_processing_and_cooking.md`).

Design still needed first: **friendship and gift tastes**, which have no
mechanics yet. Also the bundle pools for 22 to 26 and the inn kitchen's stock.

### Slice 5: the Last Seat

Rooms finished: the Last Seat (bundles 27 to 30). It asks for goods from every
other room, so it can only be played after slices 1 to 4.

Builds: the four bundles, the bridge, the letter and the end of the first ring.
It also settles the quantities (#181) against real production rates.

Design still needed first: the Last Seat numbers, and whether year one's last
day or the bridge ends the game (see Open).

Ring 2 is M4 (`03_milestones.md`) and not part of these slices.

## What each slice leaves unbuilt

| Slice | Left for later |
| --- | --- |
| 1 | Animals, fishing, mines, cooking, a kitchen |
| 2 | Mines, animals, cooking |
| 3 | Animals, cooking, the rest of the mines |
| 4 | The deepest mines, the cask, a second year of content |
| 5 | Ring 2 and the regions |

## Changes this makes to other notes

- `03_milestones.md`: M3 becomes "Vertical slice, slices 1 to 5", with slice 1
  the first target.
- `13_m3_scope.md`: its list becomes part of slice 1. Its cuts stay.
- `26_seasons.md`: "Fall and winter are built in M3" now reads "in slice 1".
- Handoffs and issues refer to slices by number from now on.

## Time box

Set a time box when slice 1 starts, as the roadmap asks. Its first item, the
bundle data model, is the check: if it takes much longer than a session or two,
slice 1 is too big and the cuts above apply. Keep a short log of real time per
item.

## Open

- **Does year one end the game?** `26_seasons.md` left this open. With year one
  as the slice's finish line, the end screen still comes from finishing the
  Last Seat, so a player who has not finished simply plays on into year two.
  The first slice then needs only a "year one complete" report, not an ending.
  This is a proposal, not settled.
- Whether slice 1 is too large with four seasons. The first item is the check.
- **Bars in slice 1.** Sprinklers, the keg and the bee house need copper and
  iron bars, and the mines are slice 3 (`34_crafting.md`). The smith dwarf's
  ore shop and furnace gift may need to move into slice 1.
- Where the completion tracker (#196) and the mines' later bands sit. Both are
  unscheduled until slice 3 is played.
- The order of the four design notes still needed (the crafting list, the
  equipment slot, friendship and gift tastes, bundle pools), set by which slice
  starts next.
