# 03 Milestones (draft)

Status: draft. This is the one place the overall order of work lives. Live
tasks and open questions are GitHub issues, grouped by the GitHub milestones
named below. Filter by label `next-payoff` for the few items that matter most
right now.

How to pick a payoff: choose the item that gets something playable sooner, or
settles a decision that many other items wait on. Review this list at the start
and end of each session, and update the status column.

Ranking from the project brief: home valley is Must, the regions are Should,
the dark edge is Could.

| # | Milestone | Payoff (done when) | Status | Main blocker |
| --- | --- | --- | --- | --- |
| M1 | Define the first playable | The first playable's scope and done list are written below, and the audience, identity, core loop of a day and multiplayer questions are answered. | Done | None |
| M2 | First playable | Day and energy cycle, farming, selling and a small centre 1 run in the home valley, with rough art. Engine chosen in an ADR. | In progress | M1, engine ADR (#19) |
| M3 | Vertical slice | One full cycle of centre 1, near-final quality. Scope fixed before building. | Not started | M2, bundle format (#21) |
| M4 | Ring 2 prototype | A haven and about 2 regions reachable from the home valley. Centre 2 in small form. | Not started | M3, ring 2 shape (#20) |
| M5 | Ring 3 and centre 3 | A logistics-only frontier outpost. Optional, late. Only if M1 to M4 prove fun. | Not started | M4, centre 3 (#5) |

## First playable scope (draft, issue #12)

Decided in discussion on 2026-10-15. Still draft until played.

In:

- Day and energy cycle.
- Farming: plant, tend, harvest.
- Foraging: wild goods found near the farm.
- Skills for farming and foraging, leveled by doing.
- Two short seasons with different crops and foraging goods.
- Selling goods.
- A small version of centre 1 (village hall) with a few bundles.
- Rough placeholder art.

Out (non-goals for now, see the project brief): regions, ring 3, combat,
multiplayer, generated content, deep relationships, final name and polish.

### Centre 1 in the first playable

- **Size.** Five bundles, each asking for 4 to 6 items.
- **Requests.** Modelled on the original's approach, in our own names and
  items. A bundle names specific goods, and some bundles accept "any N of these
  M" so the player has choices. Some goods are tied to one of the two seasons,
  so what matters shifts over time and both foraging and farming are needed.
- **Starting set.** Season 1 foraging, season 2 foraging, season 1 crops,
  season 2 crops, and one mixed bundle that draws on all of them. Exact items
  wait for the crop and forage lists.
- **Hand-in.** The player hands items in one by one at the village hall. Each
  bundle remembers its progress between visits. The hall is always open.
- **Rewards.** Finishing a bundle gives a small reward (placeholder: seeds or a
  little money, to be tuned). Finishing all five ends the first playable with a
  simple end screen.
- **Quality tiers, skill gates, tool upgrades.** Not in the first playable.

### Done list

The first playable is done when all of these are true:

1. A day runs with energy and a clock, and the player can pass out and wake at
   home with a small cost.
2. The player can plant, tend and harvest crops, and forage wild goods.
3. Farming and foraging skills level up by doing.
4. Two short seasons run, each with its own crops and foraging goods.
5. The player can sell goods.
6. The village hall shows five bundles, accepts item hand-ins one by one, and
   keeps progress between visits.
7. Finishing a bundle gives its reward, and finishing all five shows an end
   screen.
8. The game can be saved and loaded between days.
9. It runs with rough placeholder art and no audio requirement.

A new idea during the build becomes an issue, not scope.

## Scope control

- New ideas become issues, not scope.
- Each feature gets a time box with a cut, iterate or ship decision at the end.
- Keep a short log of how long things really take, so estimates improve.
- The vertical slice often feels nearly done but is about 20% of the total
  work. Fix its scope before building.
