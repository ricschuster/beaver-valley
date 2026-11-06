# 56 Valley map

Status: reference asset, built 2026-11-06. Design only. Nothing here is built
into the game.

## Why

The valley layout (`19_valley_layout.md`), the cast (`20_ring1_cast.md`) and the
farm (`55_farm_layout.md`) each describe part of one place. This note records
the picture that joins them, so the areas, main buildings and people can be
looked at together like a map.

## Decisions (owner, 2026-11-06)

1. **It is a design reference only.** It is not in-game Map tab art and it is
   not a layout. Positions are diagrammatic. It decides nothing about tile
   sizes, real building spots or the map style (`06_map_style.md`).
2. **Two views.** The whole valley, and a zoomed Hearthwell. Stardew has a world
   map and a town view; that is from memory and unchecked (note 54).
3. **Everyone is on it, with placeholder labels.** The 30 people from note 20
   appear as role labels such as "Smith dwarf" and "Inn keeper's child", not
   names. Marriage candidates carry a heart.
4. **One SVG page, built from data.** `docs/valley-map.json` is hand kept.
   `npm run valley-map` writes `docs/valley-map.html`, which opens from disk, can
   be dragged and zoomed, and shows a detail panel on click.

## What it assumes

- Areas and exits are note 19. The river is one line from the Mountain through
  Hearthwell to the delta.
- Hearthwell has 11 households (note 20). Eight are services that live in their
  shop (store and post, smithy, inn, healer, library, sawmill, hatter, hall).
  The other three (retired couple, gardener, young adults) are drawn as
  placeholder burrows, because note 19 says the number of homes is open. Their
  positions are not decided.
- The courier is drawn at the store and carrier post, where the courier works.
  The courier lodges at the inn.
- Farm positions follow note 55. The two ponds are the big south pond and the
  small east pond.

## Keeping it honest

`npm run valley-map:check` is part of `npm run check`. It fails when the page is
stale, a design note link is missing, or the people count drifts from note 20
(30 people, 14 marriage candidates). Update the JSON when note 19, 20 or 55
changes, then run `npm run valley-map`.

## Still open

- Real positions and sizes. The map is not to scale.
- Whether the Hearthwell homes beyond the shops are separate burrows (note 19).
- Names. Labels change when the names are written (#136).
