# 60 Building placement (draft)

Status: draft. Decided with the owner on 2026-11-06. Nothing here is built. It
settles how the player places, moves and removes farm buildings: the stable
(`59_horse.md`) first, and likely the coop and barn (`23_animals.md`).

## Decisions (owner, 2026-11-06)

- **The player places a building on any free spot** of the farm, as Stardew. The
  saved Carpenter's Shop page says every tile of the footprint must be free
  (green), and rocks, twigs, weeds and placed items block it (red). Stable
  footprint is 4 by 2 tiles (saved Stable page).
- **Placement is only through the carpenter's menu,** in the village, as Stardew.
  Build, move and remove all happen there, then the player walks back to the farm.
- **Touch: drag the footprint, then press Confirm.** A ghost footprint follows
  the finger, green when free and red when blocked, with Confirm and Cancel
  buttons. Our choice, because a single tap is easy to misplace with a finger.
  Stardew uses a cursor click, from memory. Desktop can use the same ghost with a
  click to place and the same Confirm.
- **Moving is free and instant,** and the contents move with the building (saved
  Carpenter's Shop page, as Stardew). The building need not be empty, so animals
  and chests travel with it. Starter buildings can be moved too.
- **Removing refunds a share of the cost.** The owner wants some resources back.
  Placeholder: half of the gold and materials, rounded down, to tune in note 07.
  Stardew's refund is on no saved page. Removing the stable also removes the
  horse (saved Stable page).
- **A coop or barn with animals inside cannot be removed.** The remove button is
  greyed with the reason, and the player sells or moves the animals first, so no
  animal is lost (note 23: nothing is removed or lost in our design).

- **Every farm building uses it,** as Stardew: stable, coop, barn, silo and well
  (and the shipping bin can be moved, saved Carpenter's Shop page). Note 32's
  `buildSite` marks are then at most default spots.
- **What blocks a spot:** the saved page's rocks, twigs, weeds and placed items,
  plus water, cliffs, trees, stumps and boulders, and the exit corridors, the
  front of the house door and the bin tiles, so a building can never wall off an
  exit or trap the player. The reserved corridor rule is ours. Whether trees
  block is not on the saved page (checked, trees are not named there).
- **The preview shows green and red tiles, and outlines the objects in the way**
  (rocks, weeds, trees), so a tablet player on the dense day 1 farm sees what to
  clear. The outline is ours, Stardew shows only the tiles.
- **Buildings can be painted,** as Stardew: building, trim and roof colours in any
  combination (saved Carpenter's Shop page). Needs layered, tintable sprites for
  each building. Not built, and when it is built is open.

## Open

- **Map data.** The footprint check needs the tillable, clutter and water layers,
  and a way to mark the reserved corridors on each map.
- **Build time.** Two days for the stable (saved page). Whether the building shows
  as under construction on the map meanwhile.
- **Painting detail.** Colour choices, and whether the house is painted the same
  way (the saved page allows it only once the house is fully upgraded).
- **Multiplayer** (note 53, milestone M4): one stable each follows from `59_horse.md`.
- **Unbuilt UI.** The menu layout and a tablet size check, in a UI note.
