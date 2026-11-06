# Game name: Elderglen

## Status

Accepted (owner, 2026-11-06). Supersedes ADR 0010. Closes issue #138. The
register and store check below is open.

## Context

ADR 0010 chose Elderfold, then a web search on the same day found two clashes:

- Elderfold is a working farm and holiday-cottage business in Hayfield, in the
  Peak District, with the elderfold.com domain.
- "Welcome to Elderfield" is a farming game that launched on Steam on 10 September
  2026, one letter from Elderfold, in the same genre.

Other Elder names were also checked and dropped: Elderkin (a Nova Scotia farm),
Eldervale (a board game, Dwellings of Eldervale) and Elderglade (a blockchain
game). Names without Elder (Rowanglen, Bracken Glen, Sorrel Glen, Alderglen,
Hazelglen) were clear but did not feel right to the owner.

## Decision

- The game is called **Elderglen**.
- Elder is the elderfruit, our rare boost item (`docs/design/39_completion_total.md`),
  and a forage plant. A glen is a small wooded valley, so the name reads as
  "where the elders grow". It is one word, easy to say and spell, earthy and old,
  and uses no Tolkien vocabulary.
- Elderglen is the title only. It is not a place in the lore yet. Whether the
  farm and forest take the name is a later design question.

## Consequences

- Unblocks the wrapper, store pages and art branding.
- Renamed everywhere (page, title screen, package, save keys, repo) in the same
  session. Old saves still load from the "beaver-valley" keys.
- Known overlap, accepted by the owner: a Shire-themed fan site (Bramblebury
  Gazette) lists a village called Elderglen. It is a hobby page, not a business,
  game or trademark. Three web searches found no game, farm or brand with the
  name.
- Open check: a web search is not a register check. Before the title goes on a
  store page, look up Elderglen in the USPTO and UK trademark registers, Steam,
  app stores and the .com domain. Low priority for a free hobby release.
