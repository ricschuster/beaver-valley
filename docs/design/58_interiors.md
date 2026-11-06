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

- Sizes of the coop, barn and greenhouse maps, and which tier parts show.
- Whether the animals' farmstead is an interior only, or a small area with
  paddocks (`19_valley_layout.md`, still open).
- Day state and NPC routines inside interiors (`06_map_style.md`).
