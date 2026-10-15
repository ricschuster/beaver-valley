# CLAUDE.md

Working rules and durable context for this project. This file is loaded into
context automatically, so keep it to direction and rules, not a task list.

## Project name

{{PROJECT_NAME}}

## Project purpose

{{One or two paragraphs: what this project is, who it is for, and the core
idea in plain terms. See `docs/design/00_project_brief.md` for the full
brief.}}

## Project status

Engine chosen (ADR 0004) and project skeleton in place. Current milestone: M2,
build the first playable. The roadmap is `docs/design/03_milestones.md`; GitHub issues
are the live tracker, grouped by milestone. The issues labelled `next-payoff`
are the few items that matter most right now. Start each session by reading
the latest handoff in `docs/handoffs/` and that label.

## Scope

{{What this project is, and just as importantly, what it deliberately is NOT.
Do not expand scope without a design note in `docs/design/` or an ADR in
`docs/decisions/`.}}

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

## Repo structure

{{Optional: a short map of top-level directories, only if it adds real
orientation beyond exploring the tree. Keep it brief and expect it to drift;
when in doubt, explore the tree rather than trusting this section.}}

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
