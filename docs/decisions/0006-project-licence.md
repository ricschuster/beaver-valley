# Project licence: PolyForm Noncommercial for code, CC BY-NC for content

## Status

Accepted

## Context

The repo `LICENSE` was the GPL-3.0 template default (issue #63). The game is a
free hobby release and the repo is public. The owner wants the work open for
others to read, learn from and build on, but does not want others to resell it.
Installed apps in the stores may wrap the web build later (a later ADR, #62).
Nothing is copied from Stardew Valley (ADR 0002).

## Decision

- **Code: PolyForm Noncommercial License 1.0.0** (`LICENSE`). Anyone may use,
  change and share it for non-commercial purposes. Commercial use needs the
  owner's permission.
- **Content and art: CC BY-NC 4.0** (`LICENSE-CONTENT.md`), covering data files,
  pictures and the design notes with the story and names.
- The owner is the copyright holder and can still ship the game, free or paid,
  under any terms.
- This is source-available, not open source in the OSI sense, which requires
  allowing commercial use. The README says so.
- Third party assets keep their own licence and are listed in
  `ASSET_LICENCES.md`.

## Consequences

- Positive: the resale worry is covered by licence terms, and both licences use
  one non-commercial idea. The code licence includes patent terms.
- Positive: GPL's conflict with some app store terms no longer applies.
- Negative: others cannot use the code in commercial projects, and some
  contributors and hosts treat non-OSI licences as less open.
- Negative: no licence stops a determined reseller. It gives grounds for a
  takedown request. Registering the final name as a trademark helps more (#138).
- Negative: two licences to explain and keep in step.
- Choosing a licence is not legal advice. Check it before any paid release.
