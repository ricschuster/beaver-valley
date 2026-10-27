# 12 Marriage (draft)

Status: draft. Written from the design talk of 2026-10-27. Nothing here is
built. Marriage is not in the first playable or M3; it follows once the
friendship system (M3) and ring 1's cast exist. Needs this note before any
code (see CLAUDE.md, Scope). Target: after M3, with the ring 1 cast.

## Why

Marriage is a long-term goal in Stardew Valley and a main reason players keep
going. The owner wants it eventually. It also deepens the "few full
relationships" idea: in rings 2 and 3, only a few villagers get the full
treatment, and some of those can be marriage candidates.

## Shape (follows Stardew, in our own content)

1. **Friendship hearts** build as set out in `09_story_and_lore.md`: talk,
   gifts, events. No decay (see Neglect there).
2. **Candidates.** A marked subset of villagers can be courted. Not everyone.
   The rest stay friends at any heart level.
3. **Courtship.** At a set heart level the player can give a courtship gift.
   Our own item, not a copy of Stardew's. Candidates then have extra events
   and a higher heart cap.
4. **Proposal.** A second item and a high heart level. The candidate can accept
   or the player can wait; refusal ends nothing.
5. **Wedding.** A short scene and a day off. The spouse then moves to the farm.
6. **Married life.** A spouse has a daily routine on the farm and a few lines
   per day. They may help in small ways, such as watering a few crops or
   feeding animals. They give a gentle bonus, never a duty (see Rules).

## Rules for this game

- No decay and no anger, as for every villager. A spouse never nags,
  scolds or leaves.
- No divorce. Nothing a player does breaks a marriage. Leaving it out is
  simpler and fits the cozy tone. Revisit if readers ask for it.
- Optional. Nothing in the bundles, the hall or the ending requires marriage.
- Who can be a candidate is a matter of cast writing, not code. The player
  character's look and the candidates' roles stay open to any pairing the
  writing supports; this should be decided when the cast is written, not here.
- Children: not planned. Open.

## Fit with the lore

- The Brimmers keep favour ledgers and wear hats that show standing. A wedding
  could be a ledger event: two ledgers joined, with hats given. This ties
  marriage to the hat customs (see `10_customisation.md`).
- A marriage candidate in a distant ring (say a road-folk, dwarf or elf) can
  ask the player to complete a task in their home ring, which gives a reason to
  explore.
- A wedding is a good festival-sized event and gives a reason for clothes.

## Data and build

- A marriage-candidate flag and a heart cap per villager (a villager row, not a
  new system).
- A save field for spouse and wedding state, in the save version bump when
  friendship ships.
- A spouse as a non-player character on the farm map needs a routine, a bed
  and a home placement in the house.
- Sprites for each candidate: wedding clothes, home animations.

## Suggested slices

1. Marriage flag and heart cap in villager data, built with friendship (M3).
2. One candidate's courtship, proposal and wedding, end to end, to prove the
   loop.
3. Spouse routine and small helping jobs.
4. More candidates, as the cast is written.

## Open

- Number of candidates in ring 1, and in rings 2 and 3.
- What the courtship gift and the proposal item are.
- Whether the spouse helps with farm work, and how much.
- Whether children exist.
- Whether the player can have a second home or the spouse can visit other
  rings.
- The look of the wedding scene and festival.
