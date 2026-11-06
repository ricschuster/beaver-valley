# 58 Interiors (draft)

Status: draft. Decided with the owner on 2026-11-06. Nothing here is built. It
settles which buildings the player can walk into, and so how many interior maps
the game needs. ADR 0005 says buildings are interior maps, not menus.

## Why

The notes fixed 14 interiors and left about a dozen open: the animal buildings,
the greenhouse, the homes of the eight people who live outside Hearthwell, and
the Outpost steward's rooms. A solo developer needs the real number before the
map work is planned.

## Decisions (owner, 2026-11-06)

1. **Coop and barn are walked into, one layout per building type.** The big and
   deluxe tiers add parts to the same base layout, as the farmhouse tiers do
   (`41_house.md`). So there is one coop map and one barn map, each with tier
   parts switched on. The owner recalls this as Stardew's way (SC-36).
2. **The greenhouse is walked into.** Note 31 already says "as in Stardew". It
   is one map, locked as a ruin until the Larder room reward.
3. **Everyone outside Hearthwell with a shop or home gets an interior, and
   shop and home are one map.** Five maps (see the table). The stonekeeper
   dwarf, the Mines trainer and the Wanderer have none. They work or wander
   outdoors.
4. **The Outpost has two maps**: the post room, and a separate map for the
   steward's rooms. This is the one place note 20 decision 2 (a shop family is
   one map) does not hold. Stardew is not checked for this (SC-37).

5. **The farmstead has visual paddocks (owner, 2026-11-06).** The Forest
   farmstead is the keeper's house and shop (one interior) plus a few paddocks
   outside, with animals drawn in them. They are scenery only: no interaction,
   no feeding, no selling from them. The farmstead stays part of the Forest map,
   not its own area.

## Stardew sizes

From the saved wiki pages for the Barn, Coop and Greenhouse (reference only,
not copied into the repo). The wiki gives outside footprints, not the interior
maps.

| Building | Footprint outside | Interior |
| --- | --- | --- |
| Coop (all 3 tiers) | 6 by 3 tiles | Not on the wiki page. One picture per tier. |
| Barn (all 3 tiers) | 7 by 4 tiles | Not on the wiki page. One picture per tier. |
| Greenhouse | 7 by 6 plus 3 by 2 | Soil plot 12 columns by 10 rows. A one tile wood border round it, then a two tile margin to the walls. That works out at about 18 by 16 floor tiles, my sum from the page and not a stated number. |

Capacity by tier (animals): coop 4, 8, 12 and barn 4, 8, 12 on the wiki. Ours
are in note 23. Footprint is the same at every tier, which fits decision 1: one
outside sprite per type, only the inside grows.

The interior sizes of the coop and barn are open (SC-38). The Guidebook
supplement has no building sizes either. The owner can count tiles in game or
from the saved interior pictures.

## The count

| Group | Maps | Detail |
| --- | --- | --- |
| Hearthwell shop-and-home | 7 | General store, smithy and mender, inn and kitchen, healer, library, sawmill and carpenter, hatter's shop |
| The Outpost | 2 | Post room, and the steward's rooms |
| Hearthwell burrows | 3 | Gardener, retired couple with grandchild, two young adults (`19_valley_layout.md`, decision 14) |
| The Long Table (hall) | 1 | Main room and six rooms (`40_hall_layout.md`) |
| Farm buildings | 3 | Farmhouse (`41_house.md`), farm cave (`55_farm_layout.md`), greenhouse |
| Coop and barn | 2 | One map each, tier parts added |
| Outside Hearthwell | 5 | Hermit's tower (Forest), farmstead keeper's house with the animal shop (Forest), smith dwarf's forge (Mountain), fisher's shop and home (River delta), the Beach elf's house and Homeward pin stall (Beach) |

By place:

| Place | Maps |
| --- | --- |
| Hearthwell | 12 |
| The Long Table | 1 |
| Farm (house, cave, greenhouse, coop, barn) | 5 |
| Forest | 2 |
| Mountain | 1 |
| River delta (with the Beach) | 2 |
| **Total** | **23** |

The Mines, the Secret Woods and the Lake cove are areas, not interiors.

## No interior

The stonekeeper dwarf (works on bridges and stonework, Mountain), the Mines
trainer (stands at the practice dummy), the Wanderer (wanders the Forest), the
courier (lodges at the inn, so she uses its map), and the festival green.

## Keeping the build small

- **Templates, not 23 one-offs.** Three shared shells carry most of the work:
  a shop-and-home (about 8 maps, counting the Outpost post room and the farmstead), a small
  burrow (3 maps), and a one-room hut (hermit, elf, fisher, forge). Each map then
  differs in furniture and counter.
- **M2 stays as it is.** Only the farmhouse tier 1 is in the first playable
  (`33_build_order.md`). Other buildings keep their menu stand-in until their
  interior exists (`06_map_style.md`).
- **Each interior brief** is one room about 14 by 10 tiles with one door, the
  Outpost note's placeholder (`57_the_outpost.md`), unless its own note says more.

## Still open

- Interior sizes of the coop and barn (SC-38), and which tier parts show.
  Until checked, use the placeholder of one room about 14 by 10 tiles for the
  base tier. The greenhouse placeholder is 18 by 16.
- Day state and NPC routines inside interiors (`06_map_style.md`).
