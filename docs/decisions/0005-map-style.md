# Map style: separate areas joined by exits

## Status

Accepted

## Context

The world is a set of rings around a home valley (`docs/design/01_system_map.md`)
with screen-edge links and gates by tool or event. The map style was open: one
continuous world, or separate areas joined by exits. The developer is solo, works
5 to 10 hours a week, and adds content in layers. The minimum device is a 2020
tablet (ADR 0004). The placeholder map (`docs/design/05_farm_map_placeholder.md`)
is disposable and must not shape the answer.

## Decision

- **Separate areas joined by exits.** Each place is its own Tiled map, loaded
  one at a time. Walking off an edge or through a door loads the next map.
- **Buildings are interior maps**, not menus.
- **The home valley is several areas**, not one large map.
- **Tile size is 16 px.** Art stays 16 px and the game scales it by a whole
  number zoom chosen per device. Code reads the tile size from the map.

The detail (map contract changes, zoom rule, what is still open) is in
`docs/design/06_map_style.md`.

## Consequences

- Positive: each map is small enough to author, test and ship alone. New regions
  are new files. Gates are an exit that stays blocked. Fast travel is a jump to a
  named entry. Only one map is in memory at a time.
- Positive: a continuous look can be faked later with art at area edges, whereas
  cutting a large map into areas later would be costly.
- Negative: loading breaks weaken the sense of place. Art and fade transitions
  must make up for it.
- Negative: the map contract (one `spawn`, named doors) must change to named
  entries and exits with targets, and the scene must load maps by id.
- Negative: interior maps mean more maps to author than menus would. The first
  playable can use a menu stand-in for a building until its interior exists.
