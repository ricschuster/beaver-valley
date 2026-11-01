# 43 Wood source: trees on the farm, the axe and the supply (draft)

Status: built in the axe and tree slice (2026-11-01). Decided with the owner on 2026-11-01.
It finishes the open item "where common trees stand on the farm" in
`36_gathering_trees_sap_fiber.md`, and answers why `wood` has no source today
(`src/core/items.ts`), so the house upgrade can only be bought with the debug
menu (`41_house.md`, `42_debug_menu.md`). The tree rules themselves (chop
yields, stumps, growth, spread, regrowth) stay in note 36 and are not repeated.

## Decisions

- **Wood comes from farm trees in the first playable.** The Forest map does not
  exist, so the farm is the only place for trees now. The carpenter does not
  sell wood yet (`41_house.md`). The Forest adds more trees when it is built.
- **Many trees, so wood is easy.** About 30 mature trees stand on the farm on
  day 1: 27 mature, 2 young and 1 seedling. Chopping the mature ones and
  lifting their stumps gives about 500 wood at foraging level 0 and about 600 at
  level 4, so the 450 for house tier 1 is one season of chopping, not a grind. Planting is then
  a choice for the player who wants wood forever, and not a chore to reach the
  house. This is ours. Stardew's starting tree count is not checked.
- **Trees are scattered across the field, as Stardew's clutter is.** They
  stand on the ground the player later wants to farm, so clearing them is part
  of making room. Stardew's exact tree layout is not checked.
- **Growth is Stardew's random rule** (note 36): 20 percent a night per stage,
  median 24 days, no growth in winter. The fixed 24 days fallback in note 36 is
  not taken. Check on a tablet whether the wait feels too uncertain.
- **Chopping is held, as Stardew's tools are.** The player faces a tree and
  holds the action to repeat the swing. A tap swings once. On touch the player
  holds on the tree's tile (`27_touch_controls.md`).

## The axe

The axe is a starter tool, with the hoe, can and pickaxe (`22_mines.md`). It
is in the toolbar from tier 0. The tiers are #194.

| Thing | Rule |
| --- | --- |
| Swings per tree | Stardew's Axe page: 10, 8, 6, 4, 2 at tiers 0 to 4. Our fifth tier takes the iridium number. |
| Swings per stump | Stardew: 5, 4, 3, 2, 1. |
| Swing energy | The formula in note 22: `2 - 0.25 * tier - 0.1 * level`, never under 0.5 (ours). The level is foraging. A tier 0 tree costs about 20 energy and its stump about 10. |
| Hold repeat | One swing every 0.4 seconds (ours) while Use is held and a tree or stump is faced. Stardew's mobile controls repeat tool use while the button is held. |
| Young tree, loose seed | 1 swing. |
| Seedling or planted seed | 1 swing from any tool except the can on a seed. The hoe and axe lift a seed back to an item (foraging level 1), as note 36. |
| Foraging XP | When the tree falls and when the stump is removed, as note 36. |

- **Drops and the full bag.** Goods go to the backpack. Any that do not fit land
  on the nearest open tile within 3 tiles and are saved, so nothing is lost.
  The player pulls them in by walking within the pickup radius, as far as there
  is room. Stardew's tree products scatter and are collected by magnetism,
  and rings widen that radius by 1 or 2 tiles. The saved pages do not say what
  Stardew does with a full pack. The base radius is 1 tile (ours), in
  `pickupRadius()` so a ring or buff can add to it later.
- **Holding carries on.** One hold fells the tree and then uproots its stump, as
  a held tool repeats. It stops when the tile is clear or the player lets go.
  A player who wants to keep a stump must release in time. This is inferred
  from Stardew's repeat and not stated on its pages.
- **Stumps are real.** Stardew leaves a stump after a mature tree, and removing
  it gives 4 to 9 wood and 1 foraging XP.
- Stages in code are 1 (seed), 2 and 3 (seedlings), 4 (young) and 5 (mature).
- The axe tier ladder is #194 (note 22). Slice 1 builds tier 0 only. The swing
  table above is the contract the ladder fills in.

## Trees on the farm map

- **Hand-placed, as note 32 says of all clutter.** Nothing random at the start
  of a new game. The map has a `tree` object class, one point per tree, with
  an integer `stage` property (1 to 5, 5 if absent), and an optional `paths`
  tile layer that keeps seeds off paths. Both are in the map contract in
  `05_farm_map_placeholder.md`. The border trees stay as scenery tiles and
  cannot be chopped.
- **Count on the placeholder farm:** 30 trees. 8 stand on `soil` tiles (rows 14
  to 17 of the patch, so the playtest rows stay clear), and the rest on open
  grass. A bigger real farm scales the count (ours).
- **Blocking:** seedlings, young and mature trees and stumps block movement. A
  seed in the ground does not. The `collision` layer is not edited. Core reads
  trees from its own state (`GameState.trees`, saved with the game), so a felled
  tree frees its tile with no map change. The map check treats the starting
  trees as solid, so a layout cannot wall off an exit or forage spot.
- **Seasons:** trees do not change with the season in slice 1. Winter growth
  stops, as note 36.
- **Valley trees later.** Forest and Mountain are the first valley places, and
  they can carry denser stands. The regrowth rule in note 36 is already for
  them.

## Supply and demand (slice 1)

| Source | Wood |
| --- | --- |
| One mature tree | 12, plus 1 per foraging level up to 4, so 12 to 16 (note 36, ours) |
| Its stump | 4 to 9 |
| The 27 mature starting trees, all chopped and all stumps lifted | about 500 at level 0, 600 at level 4 |
| Young tree | 4 |

| Sink | Wood |
| --- | --- |
| House tier 1 | 450 |
| Chest | 50 |
| Wood fence | 2 each |
| Campfire, brazier, torch, machines | 1 to 60 each (`34_crafting.md`) |

- Fences and machines compete with the house. Fencing 40 tiles costs 80, and
  one machine is 40. A player who builds early still reaches 450 by the end of
  summer from the first stand plus spread, since each tree plants a seed 15
  percent a night (note 36). Check in a playtest.
- Sap and moss come with the same chop, so trees also feed fertilizer and
  crafting (note 36). Sap needs no extra work here.
- The debug menu's wood row stays for testing.

## What was built (a slice, in order)

1. The axe tool at tier 0, with the hold repeat and the swing table.
2. Core: `trees.ts` for the state (position, stage, stump), the nightly tick and
   the chop and stump rules, unit tested. Saved with the farm.
3. The `tree` object layer and the placement on the farm map, drawn with
   placeholder art.
4. Wood, sap and tree seed items. Planting: the player plants a tree seed on any
   free tile that is not tilled, a path, an exit, an entry or a service tile.
   A hand on a mature tree shakes down a loose seed.
5. Still to do: a playtest persona run that reaches house tier 1 from the
   starting trees. Check the 450 target and the hold repeat on the real tablet.

## Open

- **Planting rules.** Stardew's allowed ground for a tree seed is not checked.
  Built as: any free tile that is not tilled, a path, an exit, an entry or a
  service tile. Seeds also spread onto untilled soil, and the player lifts them
  with any tool (only the axe does so far).
- **The pickaxe** also lifts seedlings and seeds (note 36) once it exists.
  The hoe and can already do so. The hand does not.
- **Old saves** get the map's starting trees, wherever they fall, so a tree can
  appear on land the player already uses. Trees are never placed on a plot, and
  the player can fell them.
- **Hold repeat on touch.** Whether holding on the tree's tile conflicts with
  hold to ship one on the shipping bin (`28_shipping_bin.md`). Settle in the
  tablet check.
- **Stump swing count and its energy.** Placeholders until the ladder.
- **The tree count** is ours. Playtest sets it, with the 450 target.
- **Hardwood** and large stumps wait for the Woodland farm type
  (`32_farm_types.md`) and the axe tiers.
- **Tapper and Lumberjack professions and the sawmill** still wait for a later
  note (note 36).

## Not taken from Stardew

- Species by region and the mushroom, mystic and green rain trees (note 36).
- Lightning on trees (note 36).
