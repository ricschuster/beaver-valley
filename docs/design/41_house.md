# 41 The player's house: a burrow home that grows inward

Status: decided with the owner on 2026-10-31 (style, growth rule, scope, spouse
room, cellar). Details
marked "proposed" are mine and open to change. Per ADR 0002 this follows the
idea of Stardew's farmhouse, not its art, text or names. Per ADR 0003 the look
is our own and takes nothing from Tolkien's works.

## Why

The house is where the player sleeps, cooks, stores things and, later, decorates
and shares a home. `10_customisation.md` says "larger house in steps, paid in
coin and materials" and `12_marriage.md` needs a spare room for children, but
the upgrade list was still open. The owner also wanted the house to feel like a
cozy hobbit home. This note settles both.

## What Stardew does (checked, saved `Farmhouse` page, 2026-10-31)

- Start: one small room, inner size 10 by 7, with a bed, fireplace and TV.
  Floor, wallpaper and furniture can all be changed.
- Upgrade 1 (10,000g and 450 wood): a kitchen with a fridge and a sink, and a
  bedroom with a double bed. Allows marriage.
- Upgrade 2 (65,000g and 100 hardwood): two more rooms (one empty, one with a
  crib and two child beds), and a larger kitchen and bedroom. Unlocks
  renovations.
- Upgrade 3 (100,000g): a cellar with casks, reached from the kitchen.
- Each upgrade takes the carpenter three days. A spouse or roommate gets an
  extra room in their own style.
- Renovations (open bedroom, attic, cubby, dining room and more, 10,000g to
  150,000g) come after upgrade 2.
- The outer footprint is a 9 by 5 rectangle. The page does not say whether the
  outside changes by tier, so that is not checked.

## Decisions (2026-10-31)

1. **The player's home is a burrow house**, dug into a hillside on the farm: a
   round door, a mound roof with a chimney, small round windows. This lifts the
   "no hillside burrows" line in `09_story_and_lore.md` for the player's home
   only. The other hobbit specifics stay avoided (hairy feet, pipe-weed, second
   breakfast), and so do all Tolkien names and anything copied from the books
   and films (no "Bag End", no green round door). Our own door
   colour and a hat peg by the door make it ours.
2. **Three paid tiers add rooms.** Like Stardew's three upgrades, each paid in
   coin and materials. More rooms mean more space to decorate
   (`10_customisation.md`).
3. **The building footprint never changes.** An upgrade changes the inside and
   the art, not the tiles the building covers on the farm map. This is the
   owner's rule for every building, not only the house: coop, barn and the rest
   (`23_animals.md`) keep one footprint across their tiers. It keeps map
   placement, collision and save data simple. A burrow suits it, since the
   rooms grow into the hill, not outward.
4. **Every Brimmer home is a burrow**, not only the player's. The lore note
   says so.
5. **The spouse gets a room of their own**, as in Stardew, from tier 2.
6. **The cellar is in, on a separate level** reached by stairs down from the
   kitchen, as in Stardew. It is its own small map.
7. **House upgrades are in the first playable** (`03_milestones.md`): all three
   tiers can be bought. The first playable has no marriage, no children and no
   cask, so the spouse room, the nursery and the cellar casks are built but
   sealed or empty until those systems arrive. Marriage and the cask stay out
   of the first playable.

## Proposed details

- **Tier contents follow Stardew's**:
  - Start: one room with a bed, hearth and a door mat. The current
    `house.json` is 10 by 8 and stays.
  - Tier 1: a kitchen (cooking, a fridge chest, a sink that refills the
    watering can) and a bedroom with a double bed. Allows marriage
    (`12_marriage.md`).
  - Tier 2: a spare room and a nursery with a crib, which is the "spare room"
    that `12_marriage.md` needs for children, and larger kitchen and bedroom.
  - Tier 3: a cellar for casks, reached from the kitchen, if casks are in
    (`24_processing_and_cooking.md`).
- **Numbers start at Stardew's**: 10,000g and 450 wood, 65,000g and 100
  hardwood, 100,000g, three days each. They are placeholders for
  `07_tuning_numbers.md`, and 65,000g and 100,000g may be too steep for two
  seasons. Check against the playtest income.
- **One interior map, with sealed earth.** Each tier opens an earth-filled
  area of the same Tiled map (like the hall's blocked rooms in
  `40_hall_layout.md`), instead of loading a different map. Positions and saves
  stay valid across a tier change. The alternative is one map per tier.
- **No renovations** in the first version.
- **The carpenter builds it**, as in Stardew, with the three days shown as a
  closed door and scaffold on the farm, then the new rooms the morning after.

## Settled 2026-10-31 (open items)

- **Interior maps.** The above-ground rooms are one Tiled map with sealed
  earth that each tier opens, and the cellar is a separate small map reached
  by stairs. Not one map per tier and not one map per room. Stardew: the
  Farmhouse page shows one connected space that grows, but does not say how it
  is stored, so that part is not checked.
- **Prices stay at Stardew's** for the first playable: 10,000g and 450 wood,
  65,000g and 100 hardwood, 100,000g, three days each. Tiers 2 and 3 will
  probably be out of reach in two seasons, so they act as long-term goals.
  Tune after a playtest (`07_tuning_numbers.md`).
- **The furniture catalogue follows Stardew: after tier 1.** The saved
  Furniture and Carpenter's Shop pages say the carpenter sells the Furniture
  Catalogue only after the first house upgrade (200,000g there). This matches
  `10_customisation.md`. The first draft of this answer said the catalogue was
  not tied to a tier, which was wrong. The owner picked the Stardew option, so
  the Stardew behaviour stands. Furniture itself can be added at any time.
  Flooring and wallpaper can come from a shop or a catalogue.
- **Sealed rooms read as waiting.** The spouse room and the nursery are open,
  bare and tidy, with a short line from Old Greencoat or the carpenter that
  they are for later. They are not shown as broken or blocked, which matches
  the hall's greyed rooms.

## Open

- Room sizes and the floor plans for each tier, and the cellar map (a map task
  for the build).
- Where the catalogue is sold and what it costs (`10_customisation.md`).
- The house build is in the tracker as #280 (interior map and tiers), #281
  (carpenter and upgrade flow) and #282 (cellar map), all M2. It is not yet
  placed in `33_build_order.md`.
