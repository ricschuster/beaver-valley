# 11 Minigames (draft)

Status: draft. Written from reader 1's feedback (a minigame like Stardew's mine
cart "could go in") and the design talk of 2026-10-27, which asked for a few
minigames, not one. Nothing here is built. It is outside the first playable and
needs this note before any code. Target: M3 or later, after the core loop and
the first customisation slice.

## Why

People who play Stardew Valley often spend many hours on its minigames. They
give a break from the farm loop and a way to win rewards through skill. For a
solo developer they are also self-contained: a minigame is a small scene with
a score and a prize.

## Rules for every minigame

- Cozy: no death and no scares (see the tone rules in `09_story_and_lore.md`).
  Failing ends the round; it never costs the player anything.
- Optional. No bundle, upgrade or ending depends on one. Rewards are cosmetic or
  small conveniences.
- Short, a few minutes a round, and playable with touch on a tablet.
- Self-contained: its own scene, no changes to the farm rules in `src/core/`,
  one reward function that hands out items.
- Rewards are tokens or items spent at a prize counter, for example at a
  festival, so the minigame ties to decoration and hats.

## Candidates

1. **A cart ride.** A side-scrolling run along an old road, jumping gaps and
   collecting coins. Natural fit for the ruined road in the lore. Cozy version:
   no lives, a round ends at the finish or after a fall.
2. **A card or tile game at the inn.** A simple game against villagers, with a
   win giving tokens and a little friendship talk. Cheap to build.
3. **A festival game.** A skill or luck game at each festival, such as a
   hat-toss or a cake-sorting round. These double as festival content.
4. **Fishing.** If fishing is added to the farm loop, a catch minigame is the
   usual form. Decided separately.
5. **A rhythm or memory game.** A hearth song at the inn. Low priority.

## Suggested order

Start with one festival game, since festivals are planned for M3, then the cart
ride, then the inn game. Each is a separate small issue.

## Open

- What the prize counter sells and which currency is used.
- Whether scores are kept (a best score per game).
- Whether the cart ride is a player-built track or a fixed run.
- Touch controls for each.
