# 17 Call feedback, 2026-10-28

Status: recorded 2026-10-28. A weekly call where Joe relayed feedback from two
friends (Cecil and Pam) and the two of us talked about the game. The feedback
is of some interest. The discussion is worth more. Nothing here is built, and
the items below are proposals until a section says "decided".

## Feedback from the readers

| From | Point | Outcome |
| --- | --- | --- |
| Cecil | Puzzles, in the Zelda or Machinarium sense | Adopted as optional only (decided 2026-10-28). See "Puzzles". |
| Cecil | Optional fighting, with a training dummy | Fighting is already planned as gentle and optional in the mines. The dummy is adopted (decided 2026-10-28). |
| Cecil | An optional boss fight | Not adopted. Bosses clash with the no-pressure core. A second friend on the call also disliked them. |
| Pam | The pitch document needs more passion and working images | Not acted on. The game is not being pitched. Applies loosely to the lore notes, which are dry. |

Cecil found Stardew Valley too slow and cozy, so he is not the target player.
He liked the concept. Take his points as a view from the edge of the audience.

## Puzzles (decided 2026-10-28)

Optional logic puzzles, never gating and never punishing, with a reward that
is a bonus and not a need. Candidate homes: bundle hints, the hermit's odd
requests, the warden head's errands, ruins in the mines. Needs a design note
before anything is built. Ring 3's open question about hazard navigation or
puzzles (`01_system_map.md`) is related.

## Training dummy (decided 2026-10-28)

A safe place in or beside the mines to practise with a weapon, with no loss
on a miss. It lets a player who never fights learn the controls without
risk. It belongs in the mines design note.

## Generated dialogue needs a voice per character (proposed)

The call raised random or generated dialogue for festivals and daily lines,
so the same event does not read the same every year. It only works if each
character has a voice of their own, or the variants sound fake. So:

- Write a short voice sheet per character before any variant lines: how they
  speak, what they care about, what they never say.
- Decide whether any dialogue is generated at runtime or only authored in
  variants. A runtime language model in a free browser game brings cost,
  offline play and consistency problems. Authored variants from a voice sheet
  get most of the benefit. Leaning: authored variants.
- This is one more reason to write the cast (#136) properly before dialogue.

## Late-game surprises (proposed)

Stardew's surprises stop, and the late game drifts into profit optimising. The
answers so far are the later centres (`09_story_and_lore.md`, `16_bundles.md`)
and variant festival scenes. A cheap further step is a small pool of random
seasonal events with a positive or neutral result. Never a ruinous one: the
rule that no surprise can wreck the player stays.

## Dry-streak protection for rare finds (proposed)

Stardew raises the chance of finding a mine ladder after each miss. Use the
same idea for rare forage, artifacts and mine finds: each miss raises the odds
a little and a find resets them. This avoids the missable-item grind for a
completionist and fits the no-grind tone. Goes into the mines and forage
notes, with numbers in `07_tuning_numbers.md`.

## Travel and the second farm (already covered)

The call confirmed the rejection of a Ginger Island style second farm. The
home base problem and the open outposts option are already in
`01_system_map.md`. Fairy rings that go out from the farm (`09_story_and_lore.md`)
remain the travel answer. No change.

## Fishing (open)

Fishing is disliked by the owner and draws the most complaints in Stardew.
The Water room has six fishing bundles and The Catch (bundle 28) also needs
it. Open: shrink the Water room, or make fishing a gentle minigame
(`11_minigames.md`). Tracked in #181.

## Reference: My Time at Portia

A game that borrows from Stardew Valley and Zelda, as this project does.
Worth a look, and maybe a playthrough, for:

- The workshop and workbench: building machines on the farm to make things.
  A reference for crafting (not a plan to copy it).
- A cozy home village with a darker place the player can enter when they
  choose. This matches our optional ring 2 and ring 3 danger.
- Gift giving and request missions with villagers. Its dialogue is weaker
  than Stardew's, which is a thing to learn from.

Also worth a read: player reactions to the characters in Stardew Valley
Expanded, a mod with many added villagers. Use it to see what resonates and
what fails. Per ADR 0002, take no names, text or art from it.

## Working style: design before build

The owner prefers settling the design in full before building, and the call
backed this. A small pilot (three bundles, two seasons) loses the big picture
and ends up bolted on, like the parts of Stardew added later. The rule is in
`CLAUDE.md`. Code is still built for gates already agreed (the milestones),
but new systems wait for a design note.
