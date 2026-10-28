# 18 Dialogue and voice

Status: decided 2026-10-28 in a question session with the owner. Nothing is
built. Per-character conversation counts wait for the cast list (#136).

## Goals

Dialogue should make the world feel alive, build relationships over time, be
funny and charming, and teach and hint without a quest log.

## Source of text (decided)

Every line is authored and shipped as data. Nothing is generated at runtime.
The earlier question in `17_call_feedback_2026-10-28.md` is closed.

## Line pools and selection (decided)

Each character has a small base pool (about 8 generic lines per season) and a
larger reactive layer. Reactive lines carry conditions: weather, season, hall
progress, gifts, hearts, flags.

Selection uses strict priority tiers. The highest tier with an eligible line
wins; within a tier, unseen lines come first.

1. Event
2. Hall or story reaction
3. Weather or season
4. Hearts
5. Generic base line

## Talking (decided)

One tap gives the daily line. A separate Talk button opens branching
conversations. A marker on the greeting shows when a new conversation is
available. This works on touch without slowing a daily round.

## Branching (decided)

Full branching in regular talk, held down by a cap.

- A conversation is an authored node graph of about 4 to 8 nodes. Branches
  rejoin quickly so they share lines.
- A validator checks that every path ends, every node is reachable and every
  flag is defined.
- A branch can change hearts and set flags that change later lines. It cannot
  change other characters' opinions (no gossip) and cannot unlock rewards. Both
  are out for now.
- Flags are per character by default. A short named list of global flags
  (hall milestones, season events, key story beats) can be read by anyone.
- Conversations unlock at heart thresholds. Hearts never fall. Choices change
  how fast hearts rise or which lines appear.
- A seen conversation leaves the Talk list. A journal or menu lets the player
  reread it.

## Release layers (decided)

Each layer is shippable on its own.

1. Base lines for every villager.
2. Reactive lines (weather, season, hall progress, gifts).
3. Branching talks.
4. Heart events and story.

Every villager gets layer 1 before anyone gets layer 3.

## Depth by tier (decided in principle)

Rich for all, tiered by role. Deep characters are marriage candidates, hall and
bundle figures, the beach elf and the courier. The count of conversations per
character is set by the cast list (#136), with marriage candidates from #137.
Budget warning: about 30 villagers at several hundred lines each is a large
writing load for one developer, so the layers above are how it is paced.

## Voice sheets (decided)

One per character, written before any variant lines. Each is a writing guide
plus a review checklist (banned words, quirks to keep, scripted checks such as
the no em dash rule). Characters differ on four axes: sentence length and
rhythm, vocabulary and dialect, recurring quirks, and emotional register.
Template to be drafted with the first cast members.

## Data (decided)

One JSON file per character under `src/content/`, like crops and bundles. Lines
have stable ids and text sits in a separate string table, so a translation can
be added later without touching logic. Localisation is possible later, not
planned.

## Open

- The exact condition vocabulary for reactive lines.
- Heart thresholds and how fast hearts rise.
- The list of global flags.
- Journal or recall menu design.
- The voice sheet template.
