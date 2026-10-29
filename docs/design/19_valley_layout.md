# 19 Valley layout

Status: **decided with the owner on 2026-10-28** (areas, links, river, what
lives where). The open items at the end are not decided. It answers the layout
half of issue #67. The map style is already settled in `06_map_style.md` and
ADR 0005. Nothing here is built, and the placeholder maps stay until real maps
are authored in Tiled.

## Why

The valley layout shapes the cast list (#136), the animals, fishing and mines
notes, and every map the scenes load. The farm needed a clear place in the
world, the river needed to be one line that runs through it, and the town
needed a sensible home for about 30 villagers.

## The areas

Nine areas in the home valley, each one Tiled map, joined by exits (ADR 0005).
Buildings are interior maps. Ring 2 lies beyond them.

| Area | What lives there |
| --- | --- |
| Farm | The home base: house, fields and a pond for the watering can. |
| Forest | A lake. The hermit (the witch), the Wanderer (Old Greencoat), and a farmstead with the animals. Rare forage. |
| Secret Woods | Off the Forest, behind a massive log that an upgraded axe clears. Rare forage. |
| Mountain | A mountain lake. The smith dwarf and the stonekeeper dwarf. The source of the river. |
| Mines | Off the Mountain. Ring 1, gentle combat, open early on a fixed day (`16_bundles.md`). |
| Hearthwell | The crossroads town. Every Brimmer lives here. The shops and services listed below. The river runs through it. |
| River delta | Where the river ends. Fishing. The ferry landing for the Lake cove. |
| Beach | The sea. The odd elf who sells the Homeward pin. |
| Lake cove | Off the River delta, by ferry. Opened by the Water room reward (`16_bundles.md`). |
| Ring 2 | Across the river, reached by the bridge in Hearthwell (see below). |

## The map

```text
 [Secret Woods]--[FOREST]--------[MOUNTAIN]----[Mines]
                    |                 ~
                    |                 ~  river
                 [FARM]-----------[HEARTHWELL]--> bridge to ring 2
                    \                 ~
                     \                ~
                      +--------[River delta]--[Beach]
                                      |
                                 [Lake cove] (ferry)
```

## Exits

| From | To |
| --- | --- |
| Farm | Forest, Hearthwell, River delta |
| Forest | Farm, Secret Woods, Mountain |
| Mountain | Forest, Mines, Hearthwell (the river road) |
| Hearthwell | Mountain, Farm, River delta, the ring 2 bridge |
| River delta | Hearthwell, Farm, Beach, Lake cove (ferry) |
| Beach | River delta |

The farm has three exits, so it is a home between places and not a dead end.

## Decisions

1. **The river is one line.** It flows from the Mountain through Hearthwell to
   the River delta, and the areas along it are linked by exits in that order.
2. **Two loops.** Farm, Hearthwell, delta, farm. And farm, Forest, Mountain,
   Hearthwell, farm. A player is never forced to walk back the way they came.
3. **The Mines are two hops from the farm** (Forest, then Mountain). The Hearth
   room carts (`16_bundles.md`) ease that walk later.
4. **All Brimmers live in Hearthwell.** There is no separate hamlet. The Forest
   farmstead holds the animals and its keeper.
5. **The waystation, the village hall called The Long Table, stands a short
   way outside Hearthwell**, on the road toward the bridge. It was an old inn
   on the road, not a part of the town. It is the east end of the Hearthwell
   map, not its own area.
6. **Ring 2 lies across the river.** The road out of Hearthwell crosses a
   broken bridge. Finishing the Last Seat mends it (`16_bundles.md`, decision
   3). That is the single gate.
7. **The carpenter works at a sawmill on the river in Hearthwell.** The carpenter
   handles house upgrades and farm buildings.
8. **Water on the farm is a pond**, not a river link. It supplies the
   watering can.
9. **The Wanderer lives in the Forest.** This is the natural place for the
   announcement that opens the mines.
10. **The Secret Woods are gated by a massive log**, as in the original idea of
    a blocked path. An upgraded axe clears it. Which tier is for the tool
    tuning (`07_tuning_numbers.md`).
11. **The cove is a bundle reward.** The Water room opens it (`16_bundles.md`).
    That note calls it a lake cove and also repairs a ferry, so the cove is
    named the Lake cove here. It hangs off the River delta and is reached by the
    ferry. There is no second cove on the Beach.
12. **Water bodies for fishing:** the river, the Forest lake, the Mountain lake,
    the Lake cove and the sea at the Beach. Which fish live where, and what
    makes the cove special, belong to the fishing note (#181).

## Hearthwell buildings

From `09_story_and_lore.md`, with the sawmill added:

- General store and carrier post
- Smithy and mender
- Inn and kitchen
- Healer
- Library
- Sawmill and carpenter, on the river
- Festival green
- Homes for the Brimmers (number set by the cast list, #136)

## Still open

- How many homes Hearthwell needs, and which are interiors you can enter. This
  follows the cast list (#136).
- What lies beyond the bridge. Ring 2 is a separate design.
- Size of each area, and the minimum visible tile count for zoom
  (`06_map_style.md`).
- The transition look between areas.
- Whether a pond also lets the farm fish, or fishing stays at the delta, beach
  and cove (#181).
- Where the animals' farmstead keeper lives, and whether the farmstead is an
  interior or its own area.

## Next steps

1. Update `09_story_and_lore.md` for the waystation, and the overview map.
2. Write the cast list (#136) using Hearthwell as the home of the village.
3. Write the mines, animals and fishing notes against these areas.
4. Author the real maps in Tiled and replace the placeholder.
