# 55 Farm layout (draft)

Status: draft, started 2026-11-03. Nothing here is built. The placeholder farm
(`05_farm_map_placeholder.md`) stays until a real map is authored in Tiled. This
note decides where things stand on the home farm, so the farm map, the house
(`41_house.md`), the bin (`28_shipping_bin.md`), the greenhouse and cave
(`31_farm_growth.md`), trees (`43_wood_source.md`), weeds (`29_weeds.md`) and
the exits (`19_valley_layout.md`) fit one picture and not seven.

Reference: the owner's screenshot of Stardew's Standard farm on day 1
(`docs/reference/stardew/screenshot_standard_farm_day1.png`, gitignored). Black
box only (ADR 0002). We copy ideas of placement, never the map itself, so our
farm is drawn fresh and is not a trace.

## What the screenshot shows

Read from the image, not from memory. Positions are as seen on screen.

- **The house, top right.** The farmhouse stands in the north-east corner on a
  strip of grass, with a fence along its north side. The bin stands just to the
  right of the house. A mailbox stands by the house on the fence line.
- **The field is one big open block of bare ground,** filling the middle and
  the west. Grass is only a border around it.
- **The field starts full.** Trees of several kinds (broadleaf, pine) stand over
  most of it, with stumps, boulders, branches, bushes and weeds between them.
  It reads as a cleared-by-hand job, not an empty lawn.
- **The ruined greenhouse is top left of centre,** a scaffold on a patch of
  grass inside the field, near the north edge.
- **The farm cave is a small opening in the north cliff,** top left, a short
  walk west of the greenhouse. The north edge is a raised cliff line there.
- **A big pond in the south centre** and a **small pond on the east side.**
- **Exits:** a path leaves at the top centre, and an opening at the bottom
  centre. The edges left and right are grass strips and trees; a dark opening
  sits in the bottom right corner. Which of those are real exits is not clear
  from the image.
- **Flowering trees** line the outer corners and edges as a decorative border.

## Layout principles (draft, ours)

1. **The house is the anchor.** The player wakes there, the bin and mailbox are
   beside it, and the road out leaves from near it. Short trips on day 1.
2. **Work flows away from the house.** The first fields sit nearest the house
   and the pond, and the harder ground (trees, rocks) is farthest.
3. **One big open field, not rooms.** Fits tap-to-move (`48_tap_to_move.md`)
   and gives sprinkler and scarecrow layouts room.
4. **Landmarks in the corners and edges,** so the player can name a place
   ("by the cave", "south pond") and so the map reads at a glance on a tablet.
5. **Hand-placed clutter** (`32_farm_types.md`). Nothing is random on day 1.
6. **Grass borders hold no crops.** The `soil` layer marks the field only, per
   the map contract.

## Where each thing goes (draft)

| Thing | Place | Note |
| --- | --- | --- |
| House | North-east corner, door facing south | `41_house.md`. Footprint 9 by 5 and never changes |
| Bin | Right of the house door, a few tiles from it | `28_shipping_bin.md`, owner SC-03 |
| Mailbox | By the house, on the path to the road | `51_mail_and_letters.md` |
| Greenhouse ruin | North, left of centre, on a grass patch | `31_farm_growth.md`. Repaired in place by the Larder reward |
| Farm cave | North cliff, west of the greenhouse | `31_farm_growth.md`. Empty until the earnings mark |
| Big pond | South centre | Watering can. River fish table (`32_farm_types.md`) |
| Small pond | East side | Optional, decorative. A second refill point |
| Exits | See below | `19_valley_layout.md` |
| Trees, stumps, rocks, weeds | Scattered over the field, thinner near the house | See "Starting clutter" |

## Exits

`19_valley_layout.md` gives the farm three exits: Forest, Hearthwell and River
delta. A draft assignment, to match where the house sits and where the sea is:

- **North:** Forest. The path leaves the top of the field.
- **East, beside the house:** Hearthwell. The road starts by the mailbox.
- **South:** River delta. The opening at the bottom, past the big pond.

Entries sit beside each exit, not inside it (the map contract). The new game
starts at a `start` entry by the house door.

## Starting clutter

Note 43 plans about 30 mature trees on day 1. The screenshot shows far more
trees than that, plus a lot of stone and weed. Our clutter is a tuning matter:
it must be enough to feel like a neglected farm and not so much that the first
day is only clearing.

Proposal: keep note 43's wood economy as the cap (about 500 wood to clear), so
a denser look uses more bushes, stumps and weeds, which give little or nothing,
and not more trees. Numbers go in `07_tuning_numbers.md` after the map exists.

## Size

Not settled. The placeholder is 40 by 30 tiles. The real size follows the
tile count the tablet can show (`06_map_style.md`) and the tillable share in
`32_farm_types.md` (Standard is 100 percent). Decide with the first Tiled draft.

## Open

- **Size and shape of the field** in tiles, and the tillable count.
- **Exit directions** above, and whether the farm shows a fourth, hidden exit
  later (the cave reward, a back gate).
- **How dense the day 1 clutter is** (see above).
- **Whether the small pond exists.** Note 19 says the farm has a pond for the
  watering can. A second one is extra work for little.
- **Stardew unchecked:** whether the house, bin, greenhouse and cave positions
  are fixed on Standard, and how large its field is (SC-24, SC-25).
- **Other farm types** (Woodland, Riverside, Hilltop, Meadow) each need their
  own layout note later. This one covers Standard only.

## Build order

1. Settle the open items with the owner and update this note.
2. Author `farm.json` in Tiled to the contract in note 05, replacing the
   placeholder (`gen-farm-map.mjs` is deleted then).
3. Hand-place clutter and trees from a data list, not code.
4. Add the greenhouse ruin and cave as placed, locked objects once their
   systems exist.
