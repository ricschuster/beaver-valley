# 43 Wood source: trees on the farm, the axe and the supply (draft)

Status: draft. Decided with the owner on 2026-11-01. Nothing here is built.
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
  day 1. Chopping them and lifting their stumps gives about 600 wood, so the
  450 for house tier 1 is one season of chopping, not a grind. Planting is then
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
does not exist in code yet.

| Thing | Rule (ours, placeholders) |
| --- | --- |
| Swings per tree | 5 at tier 0, then 4, 3, 2, 1 at tiers 1 to 4 and 5. This matches note 22, where tier 5 fells a tree in 1 swing. Stardew's tier 0 swing count is not checked. |
| Swing energy | The formula in note 22: `2 - 0.25 * tier - 0.1 * level`, never under 0.5. The level is foraging. |
| Hold repeat | One swing every 0.4 seconds while held and facing a tree. It stops at 0 energy or when the tree falls. |
| Stump | 3 swings at tier 0, scaled down the same way, never under 1. |
| Young tree, seedling, loose seed | Always 1 swing, as note 36. |
| Foraging XP | Awarded when the tree falls and when the stump is removed, as note 36. |

- A tree chopped this way falls in its facing direction. On touch, drops land
  on the player's tile (note 36). On keyboard they land in the bag, or beside the
  player if the bag is full, and are never lost (note 36).
- The axe tier ladder is #194 (note 22). Slice 1 builds tier 0 only. The swing
  table above is the contract the ladder fills in.

## Trees on the farm map

- **Hand-placed, as note 32 says of all clutter.** Nothing random at the start
  of a new game. The map holds a `tree` object layer, one point per mature
  tree, plus a `stage` property for the seedlings and young trees (0 to 5).
  The map contract in `05_farm_map_placeholder.md` gains the `tree` class.
- **Count on the placeholder farm:** 30 trees, a handful of them young. At most
  10 stand on `soil` tiles, so the 96 tillable tiles are not eaten. The rest
  stand on plain ground. A bigger real farm scales the count (ours).
- **Blocking:** a tree tile and a stump tile block movement. The `collision`
  layer is not edited. Core reads trees from its own state, so a felled tree
  frees its tile with no map change.
- **Seasons:** trees do not change with the season in slice 1. Winter growth
  stops, as note 36.
- **Valley trees later.** Forest and Mountain are the first valley places, and
  they can carry denser stands. The regrowth rule in note 36 is already for
  them.

## Supply and demand (slice 1)

| Source | Wood |
| --- | --- |
| One mature tree | 12 to 16, plus up to 4 more at foraging level (note 36, ours) |
| Its stump | 4 to 9 |
| 30 starting trees, all chopped and all stumps lifted | about 600 |
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

## What gets built (a slice, in order)

1. The axe tool at tier 0, with the hold repeat and the swing table.
2. Core: `trees.ts` for the state (position, stage, stump), the nightly tick and
   the chop and stump rules, unit tested. Saved with the farm.
3. The `tree` object layer and the placement on the farm map, drawn with
   placeholder art.
4. Wood, sap and tree seed items. Planting: the player plants a tree seed on any
   free grass or dirt tile of the farm (note 36 and the open item below).
5. A playtest persona run that reaches house tier 1 from the starting trees.
   Check the 450 target and the hold repeat on the real tablet.

## Open

- **Planting rules.** Stardew's allowed ground for a tree seed is not checked.
  Proposed: any free tile of the farm that is not tilled soil and not next to
  another seedling (note 36's 8 neighbour rule for stage 4 only).
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
