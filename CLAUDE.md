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
early: quality tiers, tool upgrades, eating, a weather forecast and more crops
and forage. Left: the real-tablet check, the art pass (#58) and open design
questions. Placeholder numbers are listed in
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
