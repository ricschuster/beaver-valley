# Manual playtest scripts

Scripted playthroughs of the game in headless Chromium. They are run by hand
only. They are not part of `npm run check` or CI, and nothing here is a test
that gates a merge.

A script plays with key presses (plus one mouse click on the end screen) and
reads the live game state after each action to check the result. It reports
findings (a wrong price, a failed hand-in, bad crop growth) and any console
errors. The game's weather and forage are random, so reruns differ.

## Run

1. Once per Playwright version: `npx playwright install chromium`.
2. Start the dev server: `npm run dev`. The scripts need the dev build, because
   they use `window.farmDebug`.
3. In another terminal: `npm run playtest -- expert` (or `intermediate`, or
   `casual`). A full run takes 10 to 20 minutes.
4. `npm run playtest:late` leaves a new game standing until 2 am and checks the
   pass-out. It takes about 14 minutes.

5. `npm run playtest:touch` plays one short loop with touch events only, in a
   tablet-sized touch browser (1200x700 CSS pixels, like the SM-T500): the
   stick, the toolbar, till, plant, water and harvest, a second finger on Use
   while the stick is held, the shop, the hall, the bed in the house, the report and Continue
   on the title screen. It also checks touch target sizes. About 40 seconds.

Screenshots and saves go to `playtest-out/` (git-ignored).

Settings, as environment variables:

- `BASE_URL`: the dev server, default `http://localhost:5173/`.
- `CHROMIUM_PATH`: use this browser instead of the one Playwright installed.
- `DEVICE_CDP`: drive Chrome on a real Android tablet instead of a headless
  browser. Connect it with USB debugging, then run
  `adb reverse tcp:5173 tcp:5173`, open `http://localhost:5173/` in Chrome on
  it, and `adb forward tcp:9222 localabstract:chrome_devtools_remote`. Set
  `DEVICE_CDP=http://localhost:9222`. Close other game tabs on the device
  first. Works for `npm run playtest:touch`.
- `PROFESSION`: `1` (default) or `2`, the key pressed when a skill reaches level 5
  and the profession scene opens.
- `MAX_DAY`: stop after this day, default 84 (the calendar wraps into year 2).

The three runs can go at the same time against one dev server.

## Personas

- `expert`: knows every bundle, plants each bundle crop on day 1, forages every
  day. The fastest path.
- `intermediate`: knows the bundles, farms a small patch, forages on most days,
  batches shop and hall trips, sometimes forgets to water.
- `casual`: plays about 3 days in 4, sells everything it picks, forgets to
  water, and once works until the energy runs out. Deliberately harsh: a check
  on the floor.

Results from the first runs are in `docs/design/08_playtest_personas.md`. Rerun
all three after a change to prices, bundles, growth or energy.

## Files

- `lib.mjs`: browser launch, pathfinding walk, facing and tool use. It also
  answers the profession scene (key 1, or `PROFESSION=2`) after a Space press.
- `play.mjs`: the daily routine and the personas.
- `late.mjs`: the stay-up-late test.
- `touch.mjs`: the touch persona. It uses the Chrome DevTools protocol to send
  real multi-touch events. It is an emulator: it cannot judge how the targets
  feel under a finger, the frame rate, or Android Chrome's own behaviour.

The farm layout in `play.mjs` (soil rows at y 11 and 13, aisle at y 12) and the
door tile in `lib.mjs` match `src/content/maps/farm.json`. Update them if the
map changes.
