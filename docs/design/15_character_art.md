# 15 Character art: portraits and a shared sprite body

Status: proposed 2026-10-27. The shared body was agreed with the owner. The
details below are suggestions to settle before the art pass (#58) or the
customisation work (#133). Nothing here is built in the game. It answers the
open question in `10_customisation.md` ("does the character look change the
sprite in the world, or only a portrait?") and touches the cut order in
`13_m3_scope.md`.

## Why

A test on 2026-10-27 turned the owner's pencil drawing of a witch into two
things: a cutout portrait and a 16 by 32 walking sprite with four directions
and four walk frames. Both read clearly as the same character. The test showed
where the cost is. A portrait is cheap and keeps the hand-drawn look. A walking
sprite is about 16 frames of pixel art, and doing that by hand for every
character does not scale.

## Decisions

1. **Portraits are hand drawn.** Dialogue portraits are the owner's drawings,
   cut out and scaled. Target size is a 64 by 64 box shown at 4x (256 pixels on
   the 960 by 540 screen), as in Stardew Valley. The pencil texture is kept on
   purpose. It is the game's own look, and it is cheap.
2. **World characters share one sprite body.** The player and villagers are
   built from one body template, 16 by 32 pixels, four directions (down,
   right, up, left) and four walk frames each. Characters differ by layers on
   top, not by new full sheets.
3. **Left is the right-facing row, mirrored.** Only three rows are drawn.
4. **Hats are a layer.** This makes hats in the world sprite affordable, so
   `10_customisation.md` can answer its open question with "yes, both".

## Sprite layers

Draw order, back to front:

| Layer | Notes |
| --- | --- |
| Hair, back | Long hair behind the body. Absent for short styles. |
| Body | Skin, boots and the base pose. One sheet shared by everyone. |
| Outfit | Dress, shirt or coat. Recolourable. |
| Hair, front | Fringe and side locks. |
| Hat | Sits on the head. Optional. |
| Held item | Broom, tool or basket. Optional. |

- Every layer uses the same sheet layout (4 rows by 4 columns of 16 by 32
  frames) so compositing is just stacking the same frame from each sheet.
- The head bobs one pixel on walk frames 1 and 3. Layers that sit on the head
  (hair, hat) must bob with it. Drawing them per frame is simplest. If hats
  multiply, a hat can later be one sprite per direction plus a small per-frame
  offset table.
- Hair, skin and outfit colours come from tinting grey layer art, so one hair
  shape gives many colours. Hats and held items keep their own colours.
- The finished look is composited once into a texture and cached, so drawing a
  character costs the same as drawing a single sprite.

## Walk cycle

- Frames 0 and 2 stand, frames 1 and 3 step. Idle uses frame 0.
- About 130 ms a frame while moving, about 48 pixels a second.
- Arms swing opposite to the feet in the front and back views. Legs scissor in
  the side view.

## What is saved

A look is stored as ids, never as pixels: body, hair style and colour, outfit
and colour, hat. This fits the one planned save version bump in
`13_m3_scope.md`, which already gives older saves "no hat". Characters other
than the player have fixed looks in content data.

## Where the files live

- Source drawings: `art-source/` at the repo root, outside `public/` so they
  are not shipped.
- Processed art the game loads: `public/art/`.
- Every file is listed in `ASSET_LICENCES.md` with its source and licence. That
  file currently says all art is drawn in code, so the first shipped image file
  must update it.
- Placeholder pixel art can stay drawn in code (`src/scenes/art.ts`). Final
  pixel art should be image files, not code, because rectangles in code are
  slow to polish and hard for an artist to edit.

## What the test found

- The test sprite was placed pixel by pixel in code. It is recognisable but
  rough: the front-view face is a few pixels, and the hat brim is narrower
  than in the drawing because a wide brim hides the face at 16 pixels.
- The pencil portrait and a flat pixel sprite sit a little apart in style. That
  is acceptable for this game, but it should be a choice, not an accident.
- Not checked: the sprite on real farm tiles, and on a small phone screen.
- The test code is not part of the game. It lives on the branch
  `test/witch-portrait` as a reference only (a portrait scene, a walking scene
  and `src/scenes/witch-art.ts`).

## Cost

- One body sheet, three rows by four frames, drawn once.
- A hair style is a back and a front sheet. An outfit is one sheet. A hat is
  one sheet, or four sprites with an offset table.
- A new villager is then mostly a choice of existing layers, plus one drawn
  portrait. Only distinctive characters need their own sheets.

## Cuts

`13_m3_scope.md` already cuts "hats in the world sprite (use a portrait only)"
last. That stays. The body and layer system should be built only as far as
issue 133 needs: body, one hair style and a few hats.

## Open

- Who draws the final pixel body: the owner, a commissioned artist, or an
  asset pack? An asset pack needs a licence check first (`ASSET_LICENCES.md`).
- Is 16 by 32 enough for the style the art pass wants? Taller or wider frames
  change every layer, so decide before drawing.
- Do child or tall villagers need a different body? If yes, they get their own
  shared template.
- Does the player get a drawn portrait, given that the look can change? One
  option is a portrait per hair and outfit set, another is no player portrait.
- Frame and portrait sizes are Stardew's, recalled from memory and not checked
  against the game.
