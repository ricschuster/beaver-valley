# 36 Gathering: weeds, fiber, sap and common trees (draft)

Status: draft. Decided with the owner on 2026-10-31. Nothing here is built.
Reference: the saved Stardew Valley Wiki pages Weeds, Grass, Scythe and Trees,
read only (ADR 0002). Every choice below is what Stardew does, picked by the
owner from a labelled option each time. Numbers marked "ours" are placeholders
for `07_tuning_numbers.md`.

## Decisions

- **Fiber comes from weeds only.** A cut weed has a 50 percent chance of 1
  fiber, as set in `29_weeds.md`. Grass drops no fiber. Grass gives hay when the
  player has a silo (`23_animals.md`), as in Stardew. This keeps grass and
  weeds as two different jobs.
- **Sap comes from common trees, not from weeds or grass.** Chopping a mature
  tree gives 5 sap. Removing its stump gives 1 sap. This replaces the sap
  source in `31_farm_growth.md` (a small chance from weeds, grass and woods
  forage), which is dropped. No forage item gives sap.
- **Common trees are adopted as in Stardew,** with one kind in slice 1. Species
  and seed names are content and can come later. Tappers are not in slice 1, so
  sap comes from chopping only.
- **Weed rate:** Stardew's saved pages give no day 1 count and no spread chance,
  and the formula is unchecked. Slice 1 uses a placeholder (below) and the rate
  is open until the owner saves a source or a playtest sets it.

## Common trees

Facts from the saved Trees page. Amounts are Stardew's unless marked ours.

| Thing | Rule |
| --- | --- |
| Chop a mature tree | 12 to 16 wood, 5 sap, 0 to 2 seeds, 12 foraging XP. Seeds need foraging level 1. |
| Stump | Left behind after a chop. An axe removes it for 4 to 9 wood, 1 sap and 1 XP. |
| Wood bonus | The 4 extra wood come from foraging level and luck. Ours: 1 extra per foraging level 1 to 4, no luck term. |
| Young tree (stage 4) | An axe fells it for 4 wood. |
| Seedling (stages 2 and 3) | Any tool removes it. An axe may drop 1 wood, at 10 percent per foraging level. |
| Seed in the ground (stage 1) | An axe, hoe or pickaxe lifts it back to a seed (foraging level 1). |
| Loose seed | A mature tree has 5 percent a day of holding one. Shaking the tree drops it. |
| Spread on the farm | A mature tree has 15 percent a night to plant one seed on a random tile within 3 tiles, if that tile is empty. Trees never destroy paths or crops. |
| Growth | Four stages to maturity, no watering, no clear ground needed. Each night a seedling has a 20 percent chance to reach the next stage, and stage 4 takes twice as long. Median 24 days, 90 percent mature by day 38. No growth in winter. A seedling stops at stage 4 with a mature tree on any of its 8 neighbours. |
| Regrowth off the farm | A tree chopped in the valley, with its stump removed, has 20 percent a night to return as a stage 3 seedling, even in winter. A kept stump never regrows. |
| Tree fertilizer | Ours: 5 fiber, 5 stone, foraging level 7 (`34_crafting.md`). One stage a night, 5 days in total, and it works in winter. |

- Trees fall left or right away from the player and drop items in that
  direction. On a tablet, tap-to-act chops from the tile the player stands on
  and drops land on the player's tile, so there is no off-centre standing
  (`27_touch_controls.md`). This is ours.
- Items lost in water are not copied. Dropped goods go straight to the bag or to
  the ground beside the player.
- Moss is a separate small tree good (1 to 2 a tree, any tool, not in winter,
  as set in `34_crafting.md`).
- Lightning does not touch trees in slice 1 (storms are weather only). When
  storms matter in slice 3, Stardew's rule is that a common tree hit is
  destroyed and leaves a stump with some wood or sap.
- Farm trees and fruit trees are separate. A fruit tree needs a clear 3x3
  (`31_farm_growth.md`). A common tree seed that spreads onto that ground is a
  weed-like nuisance, and the player lifts it with any of the tools above.

## Weed numbers (placeholders, ours)

- **Day 1 count:** a fixed 20 weeds on day 1 of spring, summer and fall, capped
  by the free tillable tiles. Winter day 1 clears them (`29_weeds.md`). It is
  a count, not a rate per tile, so a small tablet farm still gives enough fiber.
  The placeholder farm has only 96 tillable tiles, and a per-tile rate would
  give 2 weeds there. A bigger farm type can scale the count later.
- **Source:** none found. The saved Weeds, Grass, Gold Clock and Modding Maps
  pages and an online search give no Stardew count or spread chance (the game
  code holds them). Both numbers are ours until a playtest sets them.
- **Spread:** each weed has a 10 percent chance a night to spread to one free
  adjacent tillable tile. The chance is 20 percent on a rainy night and 15
  percent in summer. These are the three triggers Stardew names (day 1, rain
  and summer), with our own numbers.
- **Weeds never destroy placed items** (`29_weeds.md`). That stays softer than
  Stardew.

## Supply and demand

Slice 1 asks for these amounts.

| Use | Fiber | Sap |
| --- | --- | --- |
| Bundle 5 (Woodland) | 30 | 0 |
| Campfire | 10 | 0 |
| Wooden and stone braziers, tree fertilizer | 5 each | 0 |
| Basic fertilizer, per craft | 0 | 2 |
| Torch, per craft | 0 | 2 |
| Speed fertilizer, bee house, keg | 0 | 1 each |

- At 50 percent, 30 fiber is about 60 weeds. Day 1 gives 20 a season, so three
  growing seasons give 60 before spread, about 30 fiber. Bundle 5 is then a
  year's work without spread, and spread should shorten it. Check in play.
- One chopped tree gives 5 sap, plus 1 from its stump, so 6 sap. That is 3
  basic fertilizers. A forest of regrowing trees makes sap steady, but only
  where the player walks, so basic fertilizer is no longer a farm-only chore.
- Sap and fiber have no sale use in slice 1. Their sell price is still to set
  with the other item prices (`07_tuning_numbers.md`).

## Open

- Weed day 1 count and spread chance, from a playtest or a saved source page.
- Where common trees stand on the farm and in the valley, and how many. The
  farm map and valley layout need a pass (`05_farm_map_placeholder.md`,
  `19_valley_layout.md`).
- The sawmill and the Lumberjack and Tapper professions wait for a later note.
- Whether random tree growth (median 24 days) suits a tablet player. A fixed 24 days is the fallback.

## Not taken from Stardew

- Species by region (maple, oak, pine, mahogany) and the mushroom, mystic and
  green rain trees. Slice 1 has one common kind.
- Palm trees, fiddlehead ferns and Qi's Walnut Room seeds.
