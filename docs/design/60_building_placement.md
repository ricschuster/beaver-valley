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

## Open

- **Which buildings use it.** The stable now. Whether coop, barn, silo and well
  follow, and then whether `buildSite` in note 32 stays only as a default spot.
- **Map data.** The footprint check needs the tillable, clutter and water layers.
  Whether a tile type blocks placement (water, paths) beyond what the saved page
  lists.
- **Clearing first.** On the dense day 1 farm (note 55) a 4 by 2 free spot must be
  cleared by the player. Whether a preview shows which clutter blocks it.
- **Build time.** Two days for the stable (saved page). Whether the building shows
  as under construction on the map meanwhile.
- **Painting.** Stardew lets the player paint buildings. Not discussed.
- **Multiplayer** (note 53, milestone M4): one stable each follows from `59_horse.md`.
- **Unbuilt UI.** The menu layout and a tablet size check, in a UI note.
