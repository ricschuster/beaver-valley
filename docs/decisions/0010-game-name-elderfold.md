# Game name: Elderfold

## Status

Accepted (owner, 2026-11-06). Closes issue #138. The availability check below is
open.

## Context

"Beaver Valley" is a working title. The owner wants nothing beaver related, a
name that is cosy and easy to say, and a setting that feels earthy and old, in
the spirit of Middle-earth without borrowing its names (ADR 0003). Place names
from the lore, Hearthwell and Brimmer, were rejected: hard to say, and the valley
holds a mix of peoples. The map is not really a valley, so "Valley" was dropped.

## Decision

- The game is called **Elderfold**.
- Elder is the elderfruit, our rare boost item (`docs/design/39_completion_total.md`),
  and a plant to forage. Fold is an old word for the enclosure where a flock
  belongs and is kept safe, so the name reads as "where the elderfruit belongs".
- It is one word, easy to say and spell, with no doom and no Tolkien vocabulary
  ("-mark" and "-hold" were avoided on purpose).
- Elderfold is the title only. It is not a place in the lore yet. Whether the
  valley or the farm takes the name is a later design question.

## Consequences

- Unblocks the wrapper, store pages and art branding.
- "Beaver Valley" stays in the repo, package and window title until a rename
  change is made. That change is a separate, small task.
- Availability check, open: a web search on 2026-11-06 found no game called
  Elderfold, but a very close name, "Welcome to Elderfield" (a farming sim with
  a dark, horror-manga look, due on PC in September 2026). Same genre and one
  letter apart. The owner decides whether that is too close. Also check app
  stores, domains and trademark registers before release (a free hobby release,
  so low priority, but the title is public).
