# 40 Village hall layout: physical rooms

Status: decided with the owner on 2026-10-31 (layout and slice scope), at the
start of #180. Revised the same day: four walled rooms and two alcoves, after
the owner shared Stardew's ruined and restored screenshots. Details marked "proposed" are mine and open to change. Per ADR
0002 this follows the idea of Stardew's Community Center, not its art, text or
names.

## Why

The hall was a menu list. `16_bundles.md` already treats it as a place being
restored, and the owner wanted a layout that shows that. The Stardew wiki's
images (the saved `Bundles` page) show six separate ruined rooms, each with a
framed scroll on the floor or wall, a visible object for its reward, and a
restored look once the room is done. The wiki does not describe the hand-in
menu itself, so the scroll opening a menu is from memory.

## Decisions (2026-10-31)

1. **The hall is one walkable interior map**, with a main room and six rooms
   joined to it, one per room in `16_bundles.md`. It is a Tiled map like the
   farmhouse. Entering the hall on the farm map loads it. The map is one wide
   interior (about twice as wide as tall); the camera follows the player, with
   no screen switching. The main room is about one screen. Corridors run left
   and right from it. Stardew's layout does the same.
   - **Four walled rooms** off the corridors: Foragers' Shelf, Larder, Hearth
     and The Last Seat.
   - **Two alcoves**, not walled rooms: the Water room is a tank on the main
     room's back wall, and the Guests' Board is a board on a corridor wall.
     Each still has its scroll and its ruined and restored states. This
     matches Stardew (Pantry, Crafts, Boiler and Vault are walled; the Fish
     Tank and Bulletin Board are not).
2. **Each room has a scroll the player interacts with.** It opens the hand-in
   panel for that room's bundles (the current hall scene's list, counts and
   hint lines, scoped to one room). Touch uses the same tap-to-interact as the
   rest of the game.
3. **Restoration is the progress display.** A room starts ruined and is drawn
   restored when all its bundles are done. There is no separate progress menu
   in slice 1.
4. **The room reward is shown as an object in the room**, ruined until the room
   is done and whole after (Stardew's shelf, tank and safe do this). It is
   placeholder art. Who grants the reward is unchanged: the hall shows it and
   each system reads `Hall.completedRooms` (`16_bundles.md`, "Who grants a room
   reward").
5. **All six rooms are drawn in slice 1**, ruined and restored, though only two
   hold bundles. This is the owner's choice over drawing only the two with
   content.
6. **Ruined and restored share one footprint.** Each room is two tile layers,
   ruined and restored, plus a lighting tint. Ruined is dim, with vines, floor
   holes, cobwebs and bare walls; restored is warm, with furniture and rugs.
   The swap is the progress display (decision 3).

7. **The main room is a hub with a progress plaque** (decided 2026-10-31).
   Above the hearth on the back wall is a plaque with six marks, one lit per
   finished room. It is read-only and gives progress at a glance without a
   menu. Stardew's screenshot shows a plaque there, but what it does in
   Stardew is not checked; this use is ours. The rest is decor with no
   function. There is no hall keeper character (scope: no deep
   relationships).
8. **Floor plan follows Stardew's shape** (decided 2026-10-31). The entrance
   is at the bottom centre of the main room. A corridor leaves the left and
   right sides. The walled rooms hang off the corridors. The Water room tank
   sits on the main room's back wall (right of the hearth) and the Guests'
   Board on a corridor wall. This is a design of function and layout only; the
   look is placeholder until #58.

## Proposed details

- **A locked room is a blocked doorway** (rubble). Interacting with it shows
  the gate hint ("finish one more bundle"). This follows the soft gate in
  `src/core/bundles.ts`. Stardew hides locked rooms, so this is a departure
  and is open to change.
- **A room with no bundles yet** stays blocked even when its gate is met, and
  the hint says it is not ready. Four of the six rooms are in this state in
  slice 1. They open as later slices add their bundles.
- **The Last Seat** is a walled room, drawn last and most prominent (Stardew's
  Vault). Its
  bridge reward is seen outside the hall, not in the room.
- **The end screen** is replaced by a short restored-hall moment when the last
  room is done. Its content belongs to #258's finishing scene, not here.

## Build scope (#180)

Two to three PRs: the hall map and the walk-in; the scrolls, panel and room
states; then the end screen, touch and playtest updates. The playtest scripts
must walk to a scroll instead of opening a menu.

## Open

- Decor in the main room (seating, rug, shelves) is placeholder art and not
  designed beyond the layout in decisions 7 and 8.
- Art for ruined and restored rooms is placeholder until the art pass (#58).
- The Pantry bundle fits no room. Drop it or reshape it into the Larder.
- Whether a restored room shows each finished bundle as a visible item.
