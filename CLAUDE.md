# CLAUDE.md

Working rules and durable context for this project. This file is loaded into
context automatically, so keep it to direction and rules, not a task list.

## Project name

Beaver Valley (working title; the name is still a placeholder, see
`docs/design/00_project_brief.md`).

## Project purpose

A cozy farming-life game with its own setting, played in the browser and on
tablets. The player farms, forages and hands goods in to the village hall to
finish a chain of community projects. It is a free hobby project by a solo
developer. See `docs/design/00_project_brief.md` for the full brief.

## Project status

Engine chosen (ADR 0004). Current milestone: M2, the first playable. Every
feature on its done list works in the browser (farming, foraging, shop, hall,
save, title and end screens) with placeholder art. Some M3 items were built
early: quality tiers, tool upgrades, eating, a weather forecast, more crops
and forage, house tier 1, farm trees with the axe, and the shipping bin. Left:
the real-tablet check and open design questions. Tiers 2 and 3 and the
cellar are M3. Placeholder numbers are listed in
`docs/design/07_tuning_numbers.md`. The roadmap is `docs/design/03_milestones.md`; GitHub issues
are the live tracker, grouped by milestone. The issues labelled `next-payoff`
are the few items that matter most right now. Start each session by reading
the latest handoff in `docs/handoffs/` and that label.

## Scope

The first playable is one farm, two seasons, selling, farming and foraging
skills, and five village hall bundles. It is deliberately NOT: regions beyond
the home valley, combat, multiplayer, deep relationships, generated content,
or final art and name. Do not expand scope without a design note in
`docs/design/` or an ADR in `docs/decisions/`.

This project is Stardew Valley inspired. Do not copy its name, art, audio,
characters, text or code. See
`docs/decisions/0002-stardew-valley-inspired.md`.

## Stack

TypeScript, Phaser 3, Vite, and Tiled maps (JSON). Installed apps wrap the web
build; the wrapper is a later ADR. Game rules stay free of Phaser and the DOM
under `src/core/` so they are unit-testable. Content (items, crops, bundles)
is data files, not code. See `docs/decisions/0004-engine-and-language.md`.

## Commands

Node 22 and npm. Gates (run in CI, non-zero exit blocks a merge) are marked.

- `npm run dev`: run the game locally with hot reload.
- `npm run format:check` (gate), `npm run format`: Prettier.
- `npm run lint` (gate): ESLint.
- `npm run typecheck` (gate): TypeScript.
- `npm test` (gate): Vitest unit tests under `tests/`.
- `npm run build` (gate): typecheck and production build to `dist/`.
- `npm run overview` (gate: `overview:check`): rebuild `docs/overview.html`, the
  clickable design map, from the hand-kept `docs/overview.json`. Update the JSON
  when a design decision or open question changes. `npm run overview:refresh`
  re-fetches issue titles and states with `gh`. Open the HTML from disk.
- `npm run check`: all of the gates in order. Run before pushing.
- `npm run playtest -- <expert|intermediate|casual>`, `npm run playtest:late`:
  scripted playthroughs in a browser. Manual only, not a gate and not in CI.
  `npm run playtest:touch` is a short touch-only run in a tablet-sized browser.
  Needs `npm run dev` running. See `scripts/playtest/README.md`.

## Repo structure

- `src/core/`: game rules, free of Phaser and the DOM (unit tested).
- `src/content/`: data files (crops, forage, bundles, maps).
- `src/scenes/`: Phaser scenes and the on-screen interface.
- `tests/`: Vitest unit tests. `scripts/playtest/`: manual browser playtests.
- `docs/`: `design/` notes, `decisions/` ADRs, `handoffs/` session notes.

## Working rules

- Branch from `main`; one short-lived branch per change. Open a pull request
  into `main`; CI must pass before merge.
- After opening a pull request, enable auto-merge with squash
  (`gh pr merge --auto --squash <number>`) without being asked.
- Conventional Commits (for example `feat: ...`, `fix: ...`, `chore: ...`,
  `docs: ...`).
- No em dashes in code, comments, docs, commit messages, or user-facing text.
- Significant technical or design decisions get an ADR in `docs/decisions/`.
- Design notes live in `docs/design/`; session handoffs in `docs/handoffs/`.
- Keep changes small and focused; update docs when behaviour or design changes.
- Design before build. Settle a system's design in a note before building it,
  and do not propose small pilots to avoid the design work. The owner wants the
  big picture first, so features do not feel bolted on
  (`docs/design/17_call_feedback_2026-10-28.md`). Start new sessions by asking
  what to design, not by offering to build.
- Questions to the owner: when asking the owner to choose between options, one
  option must always be what Stardew does, labelled "(Stardew)" in its label.
  If the Stardew behaviour is not known or not checked, say so in that option
  instead of guessing. Put the recommendation first, and mark it
  "(Recommended)" as well when the Stardew option is not the recommended one.
- Stardew wiki pages: the wiki's `robots.txt` blocks Claude's crawler, so do not
  fetch it (no WebFetch, curl, Playwright or similar). Claude writes a list of
  page URLs, one per line, and the owner runs `wget --input-file=urls.txt
  --wait=2 --random-wait --adjust-extension --restrict-file-names=windows
  --trust-server-names` from `docs/reference/stardew/`. No `--recursive`, no
  `--mirror`, no spoofed user agent. Claude then reads the saved files from
  disk. The folder is gitignored and the text is for reference only, never
  copied into the repo (`docs/decisions/0002-stardew-valley-inspired.md`).
- Stardew Valley Guidebook: the owner's PDF in `docs/reference/stardew/` is only
  the free 5th edition supplement (new and changed 1.6 pages, v1.6.8, 119 PDF
  pages), not the full book. The wiki stays the main source. Do not build an
  extraction pipeline or rebuild its tables as data. Read it on demand with
  `pdftotext -layout -f <page> -l <page>` when a note needs a 1.6 fact, and
  treat its tables as unreliable text: check numbers against the page image.
  Where it and the wiki disagree, flag the conflict. Cite it in notes by
  printed page, never by quote. Same gitignore and copy rules as the wiki.
