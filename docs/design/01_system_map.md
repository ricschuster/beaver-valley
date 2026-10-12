# 01 System Map (draft)

Status: draft. Nothing here is decided. This is a list of candidate systems
and open questions, to be argued with and rewritten. All names, numbers and
content are to be original (see `docs/decisions/0002-stardew-valley-inspired.md`).

## Candidate systems

Each line is a system and a one-line "our version" idea.

- **Time and energy.** A day cycle with a limited energy budget, so each day
  forces choices about what to do.
- **Seasons and weather.** Seasons change what can grow and what is available.
  Weather could also affect water levels.
- **Farming.** Plant, tend, harvest, sell. Open: what is our own twist on
  the basic loop?
- **Building and crafting.** A chain from raw materials through processing to
  built structures and goods. Generic item names, our own quantities.
- **Foraging, fishing, mining.** Secondary ways to gather resources and vary
  the day.
- **Animals.** Care for animals for regular output. Open: which animals.
- **Relationships.** Villagers with routines, gifts and growing friendship.
  Open: cast, personalities and how deep this goes.
- **Goals and events.** A long-term community goal plus seasonal events.
  Open: what the goal is.
- **Progression.** Tool and building upgrades that open new areas.

## Candidate hook (not decided)

A cozy farming life as a home base, with expeditions into a larger and more
dangerous world and a distant threat that slowly grows. The mood is pastoral
comfort under quiet threat, in a generic high-fantasy setting. The setting must
use original names, places, characters and lore. It must not use the names or
specific content of any existing fantasy franchise.

Tone (not decided): warm, wry comic fantasy, with affectionate humor about
everyday life and eccentric villagers. Humor could also take the edge off the
ambient threat. As with the setting, all names, places, characters and jokes
must be original.

## Threat model (open)

A growing threat conflicts with the relaxed, no-pressure feel we want. Options
under consideration:

1. Backdrop only: the danger shapes the story and mood, but nothing worsens if
   ignored.
2. Progress-driven: the threat advances only when the player expands or
   explores, never with time alone.
3. Soft consequences: visible effects (quieter village, scarcer goods) that
   ease when pushed back, with no game over.
4. Real clock with an off switch: a true deadline for players who want
   tension.

Leaning toward 1, with some of 3. Options 2 and 3 can be added later without
reworking the base.

Current answers (still draft):

- Losses are mild and recoverable, like passing out in the original: a setback
  such as waking up back home, not a permanent loss.
- The threat is ambient. It is not a goal to defeat.
- Expeditions carry risk, such as dropping some items on failure. Some items
  are protected and cannot be lost this way.

## Open questions

- Theme and hook: what makes this game its own? The working name is only a
  placeholder and no theme is chosen.
- Which systems are in the first playable and which come later?
- Engine and language (needs an ADR when chosen).
- Single player only, or multiplayer later?

## Next steps

- Fill in `docs/design/00_project_brief.md`.
- Pick a small first slice and record it in `docs/design/03_milestones.md`.
