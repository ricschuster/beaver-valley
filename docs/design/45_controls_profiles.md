# 45 Controls: two profiles and the options screen (draft)

Status: draft. Decided with the owner on 2026-11-01. Build steps 1 and 2 are done
(bindings, the settings record, the two profiles in `src/scenes/controls.ts`). It
extends `27_touch_controls.md`, which covers the touch schemes, and adds the
split between desktop and touch and the first options screen. Reference: the
saved Stardew Valley Wiki Controls and Mobile Controls pages, read only (ADR
0002). No Options page is saved, so what else Stardew puts on its Options screen
is not checked.

## Decisions

- **Two profiles, never mixed.** `desktop` (keyboard and mouse) and `touch`
  (finger or stylus). Each has its own input code, its own on-screen interface
  and its own help text. Today one `Controls` class reads the keyboard and the
  stick together ("touch wins over the keyboard"), and any `pointerdown`, a
  mouse click included, starts the stick. That ends.
- **Desktop is keyboard plus mouse in one scheme (Stardew).** There is no
  keyboard-only or mouse-only mode in Stardew's pages, and ours does not add
  one. Both work together: keys move and select, the mouse uses and acts.
- **Touch keeps the two schemes of note 27:** tap-to-move (default) and the
  stick with a use button and an action button. The choice lives inside the
  touch profile only.
- **Gamepads are parked.** Stardew has fixed per-console maps that cannot be
  reassigned. We add none for now, and the profile list leaves room for a third.
- **Every desktop key can be rebound (Stardew).** The Options screen lists each
  action with its key. Touch has nothing to rebind.
- **Options opens from the title screen and the in-game menu.** One screen, two
  doors. Stardew's saved pages give only the in-game Options tab, so the title
  door is ours.
- **Options holds controls only for now.** The profile, the touch scheme and the
  keys. Sound, display and a UI scale wait for the systems they need.

## Choosing the profile

- **First run:** read the primary pointer with `matchMedia("(pointer: coarse)")`.
  Coarse is `touch`, anything else is `desktop`. `navigator.maxTouchPoints` alone
  is not used, since a touch laptop reports touch points but plays with a mouse.
- **Never switch during play.** A stray touch on a laptop or a mouse click on a
  tablet must not change the profile. Only the options screen changes it.
- **A wrong guess costs one tap.** The title screen shows the current profile
  next to an Options button, so it can be fixed before a game starts.
- **Saved per device, not per save.** A save moves between a laptop and a tablet
  and each device keeps its own profile (see "Storage").

## Desktop profile

- **Default keys are Stardew's (decided 2026-11-01).** Read from the saved
  Controls page. Its table lost some key glyphs in the saved text, so the Tab and
  Left Shift rows are worth a check against the page image. This changes the
  keys built today (Space, Q, E, F, K, Z), and the playtests and help text move
  with them.

| Action | Default | Source |
| --- | --- | --- |
| Move | W A S D, and the arrow keys | Stardew (arrows ours) |
| Use the held tool | C, or left-click | Stardew |
| Action (check, talk, open) | X, or right-click | Stardew |
| Open the menu | E or Esc | Stardew |
| Next toolbar slot | Tab, or the mouse wheel | Stardew (wheel from memory) |
| Shift the toolbar to the next row | Left Shift | Stardew |
| Pick a slot | 1 to 9, 0, minus and equals (12) | Stardew |
| Eat the held food | F | Ours |
| Skills | K | Ours |
| End the day | Z | Ours |

  Stardew has no key for the last three. It has no eat key (food is used from
  the toolbar), it shows skills in its menu, and the day ends in bed. F is
  Stardew's Journal key, and we have no journal, so F for Eat is the one place
  where ours takes a Stardew key. Open.

- **Mouse (decided 2026-11-01, Stardew from memory):** left-click uses the held
  tool on the faced tile and right-click is the action. The saved pages list
  keys only, so the mouse rules are not checked. Needs the farmer to face the
  cursor, which is not built. It comes after the profile split (build order,
  step 5), and keys alone work until then.
- **Right-click and the browser menu (ours):** a right-click on the canvas opens
  the browser's context menu by default, which would cover the screen on every
  Action. The desktop profile calls Phaser's `input.mouse.disableContextMenu()`
  once, which affects the game canvas only, and reads `pointer.rightButtonDown()`
  for Action. A Mac two-finger tap or Ctrl-click counts as a right-click and
  works the same. Not yet checked in a browser.
- **Long press on touch (ours):** a long press on a tablet can also fire a
  context menu, and hold-to-chop is a long press. Check it on the real tablet
  (#59, #63). The touch playtest uses synthetic events and may not show it.
- **Rebindable:** every action in the table above, plus the ones that arrive
  later (action, menu, journal and so on). The slots 1 to 9 are one group each.
- **Not rebindable (ours, decided):** menu navigation (the arrows, Enter and Esc inside a
  screen). Stardew's pages say all hotkeys can be reassigned and do not say
  whether menu keys are included, so this is our simplification. Menus also take
  the mouse.
- **Conflicts:** pressing a key already bound asks "Swap with <action>?" (ours).
  Esc cancels a rebind. A reserved key (Esc, Enter and the browser's own
  function keys) is refused with a short line.
- **Reset to defaults** for one action and for all of them.
- **No on-screen buttons, no stick, no dead edge margin.** Those belong to touch.

## Touch profile

- Tap-to-move, the stick scheme and the dead-margin toolbar rules are in note 27
  and are not repeated.
- **No keyboard hints.** Prompts read "Tap" and "Hold", never a key name.
- **Menus** are tap lists with no hold, as the bin screen is.

## One input seam

- Both profiles produce the same small set of **intents**, and nothing else
  reads devices: `move(vector)`, `use`, `action`, `selectSlot(n)`, `nextRow`,
  `eat`, `openMenu`, `openSkills`, `endDay`, and `back` for menus.
- A profile is an object that turns device events into intents. The scenes
  (`FarmScene` and the menu scenes) ask the active profile and never name a key.
  `FarmScene.ts` names its keys directly today. They move behind the bindings.
- Rules stay in `src/core/`. A new `src/core/bindings.ts` holds the default
  bindings, rebinding and conflict logic, and (de)serialising. It is free of
  Phaser and the DOM and is unit tested. `src/scenes/` holds the two profile
  implementations.

## The options screen

- **Layout:** a title, a Controls section, and a Back button.
  - "Controls": a Desktop / Touch selector.
  - **Touch selected:** a Tap-to-move / Stick selector, and nothing else.
  - **Desktop selected:** the action list with each key, a Reset all button.
- **Rebinding is by tap or click on a row,** then a key. A touch-profile player
  never sees this list.
- **Changes apply at once** and are saved when the screen closes.
- **Where it opens:** a title screen button, and a line in the in-game menu. The
  in-game menu is not built yet, so the in-game door arrives with it. Until then the options screen is reached
  from the title screen only.
- **Mid game:** changing the profile takes effect on returning to play. The
  scene restarts its input, with no reload and no lost day.

## Storage

- A separate settings record, not the save: `beaver-valley-settings` in
  `localStorage` next to the save key in `src/scenes/storage.ts`, versioned
  like the save. It holds the profile, the touch scheme and the bindings
  (`action -> key code`).
- Reads and writes never throw, as the save store does. A missing or unreadable
  record gives the defaults.
- The bindings store key codes (`KeyW`, not `w`), so they hold across keyboard
  layouts. The label shown to the player comes from the key, and where the layout
  is known, the layout's own character.

## Testing

- Unit tests on `bindings.ts`: defaults, a rebind, a conflict swap, a reserved
  key, reset, and a round trip through the saved record, including a bad one.
- A profile-choice test with the coarse-pointer query stubbed both ways.
- Playtests: `npm run playtest` runs the desktop profile and `playtest:touch`
  the touch one. Both should set the profile explicitly rather than rely on the
  detection, so a run never depends on the machine it is on.
- A browser check that a mouse click on the desktop profile does not start the
  stick, and a touch on the touch profile does not read the keyboard.

## Build order

1. `bindings.ts` and the settings record, with tests. No visible change. Done.
2. The input seam, the desktop profile and the touch profile. Remove the mixed
   `Controls`. Done, with Stardew's default keys. The desktop profile hides the
   touch buttons and shows a hint built from the bindings. The two touch
   schemes both use the stick until tap-to-move is built.
3. The options screen from the title, with the profile and the touch scheme.
   Done. The key list is read only until step 4.
4. Rebinding. Done: Change and Default per row, a swap prompt on a clash.
5. Tap-to-move on touch, and the mouse on desktop, if taken (note 27 holds its
   own steps).

Steps 1 to 3 come first because they fix the mixing. Rebinding rides on a stable
seam.

## Open

- **Eat on F:** keep it, or move it so F stays free for a journal later.
- **Layout detection** for key labels, and non-QWERTY layouts, until it is
  checked in a browser.
- **The context menu** on right-click and on a touch long press: the fix is
  above, the long press is unchecked.
- **The mouse wheel** for the toolbar, and the mouse rules above, are from
  memory.
- **A gamepad profile,** parked.
- The touch values in note 27 still wait on a real tablet check (#59, #63).

Settled 2026-11-01: Stardew's default keys, mouse use on desktop, fixed menu
keys, and no run key (we have no run speed, and Stardew's saved pages list no
run key).

## Not taken from Stardew

- The controller maps and the emote, chat and screenshot keys. We have none of
  those systems.
- The Switch 2 mouse mode.
- Stardew's other mobile control styles beyond the two kept in note 27.
