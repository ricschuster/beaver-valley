# 06 Map style

Status: **decided** in ADR 0005 (issue #67). The layout of the valley is still
open. This note records the style, the comparison behind it, the contract
changes it needs, and what remains open.

## Decisions

- Separate areas joined by exits, one Tiled map each, one loaded at a time.
- Buildings (house, shop, hall) are interior maps.
- The home valley is several areas.
- Tile size is 16 px with whole number zoom.

## Comparison

| | Areas joined by exits (chosen) | One continuous world |
| --- | --- | --- |
| Fit with the rings model | Matches edge links and gates by tool or event | Gates become physical obstacles |
| Solo scope | Small maps, authored and tested one at a time | One huge map, half built regions in the world from the start |
| Layered content | A new region is a new file | A new region edits the shared world |
| Tablet performance | One map in memory | Needs chunk streaming |
| Gating | An exit stays blocked until unlocked | Scripted barriers in the world |
| Fast travel, waystations | Jump to a named entry | Separate teleport layer |
| Sense of place | Weaker, with loading breaks | Stronger |
| Tests | Contract and reachability already work per map | Whole world reachability, single spawn does not fit |
| Cost of changing later | Low | High |

## Tile size and zoom

Tiles are 16 px, as in the original (which draws at about 4x). The placeholder
already uses 16 px at 2x. Zoom is a per device setting, not an art decision:

- Use whole number zoom only, to keep pixels sharp.
- Pick the largest whole zoom that still shows a minimum number of tiles. The
  minimum tile count is to be tuned on the SM-T500 (landscape 1920 by 1200).
- A different tile size later would mean redrawing the art.

## Contract changes

These replace the contract in `docs/design/05_farm_map_placeholder.md` when
the scene moves to multiple maps. They are a technical interface, not layout.

- `spawn` becomes `entry`: any number per map, each with a unique `name`.
  A new game starts at a named entry on a named map.
- `door` and edge exits become `exit`: a rectangle with a target map id and a
  target entry name. A building door is an exit to an interior map.
- `forage` is unchanged.
- The reachability check runs per map, from every entry to every exit and
  forage spot. Every exit target must name a map and entry that exist (checked
  across all maps in the content folder).
- A map id is its file name without extension. Code loads maps by id and
  nothing assumes where a map sits relative to another.
- An exit can be gated by a named condition (for example a tool or an event).
  Conditions are data, and the rules live in `src/core/`.

## Still open

- The valley layout is decided in `19_valley_layout.md` (areas, exits, river).
  Area sizes and the real Tiled maps are still to do (#67).
- The minimum visible tile count for the zoom rule.
- The transition look (fade length, a peek at the neighbouring area).
- Whether the first playable uses a menu stand-in for building interiors.
- Interiors and day state: how time passes and NPC routines work in interiors.

## Next steps

1. A work package to load maps by id, with entries, exits and the new checks.
2. Update `docs/design/05_farm_map_placeholder.md` when that lands.
3. Design the valley layout, then author the real maps in Tiled.
