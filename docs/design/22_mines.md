# 22 Mines and gentle combat

Status: **decided with the owner on 2026-10-30** for the three big choices
(real-time forgiving combat, a Stardew-style defeat, a Stardew-sized mine). The
rest is drafted by us as a first full pass, and every number is a placeholder.
Stardew facts are from memory and unchecked. The open items at the end are not
decided. Nothing here is built. It answers the design half of the mines item in
`16_bundles.md` and feeds the fifth tool tier (#194).

## Why

The Hearth room needs ore, and so do tool upgrades, lamps and the Smith's
bundle (`16_bundles.md`). The brief wants optional fighting with a training
dummy and no boss (`17_call_feedback_2026-10-28.md`). The system map says mining
must work without combat (`01_system_map.md`). The mines are also where the
fifth tool tier comes from (`21_fishing.md`, #194). This note settles all of that
before any code, so the mines do not feel bolted on.

## Decided with the owner (2026-10-30)

1. **Combat is real-time and forgiving.** Swing a weapon at slow, cartoonish
   creatures. Big telegraphs, no chains of knockback, one tap or click to swing,
   works on touch. The training dummy teaches it.
2. **Defeat follows Stardew.** The player is carried out, wakes up the next
   morning, loses a share of money and a few items for good, and gets one item
   back in the post. Details below.
3. **The mine is the size of Stardew's:** 120 floors, in three bands of 40, with
   elevator stops. (We first labelled a 40 floor option as "Stardew-like" by
   mistake. Stardew's mines are 120 floors and its rarest metal comes from a
   separate Skull Cavern. This note keeps 120 floors and puts our rarest metal at
   the bottom of them. A second, endless cavern is open, see the end.)

Already decided elsewhere and kept: the mines are in ring 1, off the Mountain,
and open on a fixed day announced by Old Greencoat (`16_bundles.md`, "The
mines"). A training dummy and no boss fights. Dry-streak odds for rare finds
(proposed in `17_call_feedback_2026-10-28.md`, adopted here). The trainer is a
human woman, deep tier (`20_ring1_cast.md`). The smith dwarf and the stonekeeper
dwarf live on the Mountain (`19_valley_layout.md`).

## Rules for the whole mine

- **Mining works with no fighting.** Every floor can be crossed and every ore
  can be dug without killing anything. Stairs come from breaking rocks, never
  from clearing creatures. A creature never spawns on a stair or a ladder.
- **Combat is a choice with a reward,** not a gate. No bundle needs a monster
  drop (see "Drops and bundles").
- **No death.** The worst case is the defeat rule below, which is the same
  mild and recoverable shape as passing out (`src/core/day.ts`).
- **No boss.** The owner and a second friend disliked them. The deepest floor
  has a lamp-lit camp, not a fight.
- **No missable item.** Rare finds use dry-streak odds, so a completionist is
  not stuck on bad luck.
- **Touch first.** Move with a thumb stick or tap to walk, one button to swing.
  Checked on a real tablet before the slice is called done.

## The mine, floor by floor

120 floors in three bands. The names are placeholders and ours.

| Band | Floors | Look | Ore | Creatures |
| --- | --- | --- | --- | --- |
| The Upper Galleries | 1 to 40 | Brown stone, old dwarf lamps | Copper | Pebblebacks, Dustmoths, Gloop |
| The Cold Deeps | 41 to 80 | Blue rock and frost, breath clouds | Iron | Frostnibblers, Icicle Hoppers, Gloop (blue) |
| The Ember Deeps | 81 to 120 | Red rock, warm glow, old forge halls | Gold, and Deepglim from floor 100 | Cinder Pups, Lanternmoths, Gloop (red) |

- **Floors are made fresh each day** from a seed of the day and the floor, so a
  save and a reload give the same floor. A ladder or stair is hidden under a
  rock, and the player breaks rocks to find it. Some floors also have a free
  stair in sight (about 1 floor in 4, placeholder).
- **Elevator stops every 5 floors.** Once reached, a floor can be returned to by
  the lift at the entrance. This is Stardew's pattern.
- **The entrance** is a hall with the lift, a lost-and-found chest, the trainer
  and the dummy, and a shipping bin for ore only (so a trip does not end in a
  long walk home with a full bag).
- **Rest floors.** Every 10th floor has a lamp-lit camp with a bench. Sitting
  there restores a little energy and health once a day (placeholder 10 percent
  of each), and a storage chest. This is our own softener, since Stardew has
  none.
- **Special floors.** Some floors have a theme, such as a floor of geodes, a
  floor full of Gloop that never attacks, or a quiet ruin with a puzzle
  (hook for the puzzles note, `17_call_feedback_2026-10-28.md`). One in 15 floors
  placeholder.
- **Leaving is always free.** Take the ladder up or the lift. The day clock
  still runs in the mine. Running out of energy or time uses the normal
  pass-out rule, not the defeat rule (exhaustion is not combat).

### Finding the way down (dry streak)

Each rock broken without a ladder under it adds a little to the odds that the
next one hides it, and finding it resets the odds. Placeholder: base 1 percent,
plus 0.5 percent per miss, capped at 25 percent. The same counter idea is used
for rare gems and artifact spots (separate counters). Stardew does the same for
ladders. Numbers go in `07_tuning_numbers.md`.

## Mining

- **Mining is a skill,** the fourth skill category from the system map. It uses
  the existing skill levels (ten levels, same XP table, profession at level 5,
  `07_tuning_numbers.md`). A rock gives a few XP, ore gives more.
- **Rocks and nodes.** Plain rocks give stone and a little XP. Nodes give ore
  (one node, 1 to 3 ore, level raises the chance of 2 or 3). Coal rocks give
  coal. Geodes give a geode. Gem nodes are rare.
- **The pickaxe does not gate ore.** Unlike Stardew, any pickaxe digs any
  node. A better pickaxe breaks rocks in fewer swings and costs less energy per
  swing, as the hoe does now (`07_tuning_numbers.md`). Why: a gate would make a
  player walk away from ore they can see, which feels bad in a cozy game.
  Stardew does gate deeper ore by tool, from memory. The one exception
  is Deepglim, see below.
- **Energy.** A swing costs the same formula as other tools, with the mining
  level in place of farming. Rocks cost more than crops, so a long trip is
  tiring. Placeholder: 2 energy per swing at tier 0.
- **Mining professions at level 5** (ours): **Prospector** (one extra ore from a
  node, 25 percent of the time) or **Rockhound** (geodes and gems drop
  twice as often). Level 10 choices are not built, as for the other skills.

### Ore, coal and bars

| Ore | Band | Bar | Smelt |
| --- | --- | --- | --- |
| Copper | 1 to 40 (and later bands, rarer) | Copper bar | 5 ore, 1 coal |
| Iron | 41 to 80 | Iron bar | 5 ore, 1 coal |
| Gold | 81 to 120 | Gold bar | 5 ore, 1 coal |
| Deepglim | 100 to 120 | Deepglim bar | 5 ore, 2 coal |

Placeholders from memory of Stardew's pattern. Coal drops from coal rocks and
from Gloop. A furnace takes a day per batch, as in Stardew.

**A circle to fix: the Smith's bundle needs bars before the furnace.** Bundle 19
asks for copper, iron and gold bars and gives the furnace as its reward
(`16_bundles.md`). Proposal: **the smith dwarf smelts for the player** before
the furnace exists. The player brings ore and coal, pays a small fee (placeholder
10g a bar) and collects the bars the next day. After the furnace, the player can
do it at home, and the smith keeps smelting only for Deepglim, which needs her
heat (a tie to the lamp-maker lore, `09_story_and_lore.md`). The smith also
cracks geodes for a fee.

## Gentle combat

### The rules of a fight

- **Health is its own bar,** separate from energy. Placeholder: 100 at the
  start, plus 5 per combat level. It is shown only inside the mines, so a player
  who never fights never sees it.
- **Creatures are slow and say what they will do.** Every attack has a clear
  wind up (about 0.6 seconds, a bounce, a puff, a glow). Nothing hits from off
  screen. No creature is faster than walking speed except at a fixed, shown dash.
- **Hits are small.** A touch costs 4 to 12 health depending on the band. After a
  hit the player has 1.5 seconds of grace with a flicker, so no chain of hits.
- **No knockback loops** and no creature that traps the player in a corner. A
  creature that hits steps back and pauses.
- **Creatures lose interest.** Walk 6 tiles away for 3 seconds and they wander.
  They never follow through a stair.
- **Restoring health.** Eating restores health as well as energy (the existing
  food values, `07_tuning_numbers.md`, with health as a share of the energy
  value). The rest camps restore some. Going up restores none.
- **The Assist toggle** (the same idea as fishing assist, `21_fishing.md`): halves
  damage taken and widens telegraphs. In assist mode, defeat loses no items. It
  is a setting, off by default, and never changes drops or rewards. Proposed, not
  yet agreed.

### Weapons

Three families, all found, bought or forged. One slot, with a swap. Names are
placeholders, in the cozy register, and none is from Stardew.

| Family | Feel | Start |
| --- | --- | --- |
| Blade | Quick short arc, the all round weapon | Hazel Switch (free from the trainer) |
| Club | Slow wide swing, hits several creatures | Rolling Pin (a Brimmer joke, in the bakery spirit) |
| Sling | Soft ranged shot with pebbles, short reach | Pocket Sling |

- **Four tiers per family,** by band: the starter, then a copper, iron and gold
  weapon forged by the smith dwarf from bars, and a Deepglim weapon at the end.
  Twelve weapons plus starters is 15 in all. The slice builds only the blade
  family first.
- **Forging costs bars plus gold,** with no wait. Weapons are never rolled
  at random, so there is no weapon grind. A floor chest gives a weapon from the
  band just as a choice of fixed ones.
- **Stats are simple:** damage, speed and reach. No crit, no enchant at first.
  (Stardew has both, and rings. Our ring slots are covered by bundle rewards,
  `16_bundles.md`.)
- **Fighting is not needed for tools.** All tool upgrades need gold and
  bars. Bars come from digging, not from monsters.

### Creatures

Our own cartoonish creatures. None copies Stardew's creatures or names (ADR 0002).
Each has one clear behaviour, so a player learns it in one meeting.

| Creature | Band | Behaviour | Drops |
| --- | --- | --- | --- |
| Pebbleback | 1 | A walking stone that shuffles toward you and bumps | Stone, copper ore |
| Dustmoth | 1 | Drifts in slow loops, a soft puff of dust on contact | Moth dust (a crafting good), a little fibre |
| Gloop | all (green, blue, red) | A bouncing blob. Splits once when hit. Harmless unless you stand on it | Gloop jelly, coal |
| Frostnibbler | 2 | Scurries in a line, then stops to wriggle | Iron ore, frost berry (food) |
| Icicle Hopper | 2 | Hops in a fixed three step pattern | Ice shard (lamp good) |
| Cinder Pup | 3 | A little ember dog that charges after a clear bark | Coal, a warm ember (a lamp good) |
| Lanternmoth | 3 | Floats in a ring around a light, shoots a slow glow | Oil, a little gold ore |

- **One rare creature per band** (a golden Gloop and two others later). It appears
  with dry-streak odds, gives a fun drop, and is a quiet bit of the completion
  tracker (#196).
- **No scary creatures.** No bats, spiders or ghosts, to keep the tone rules
  (`09_story_and_lore.md`). Creatures are chubby and a bit silly.
- **Count per floor** is small: 2 to 5 early, 4 to 8 deep (placeholder). A floor
  never feels like a swarm.

### Combat skill

A fifth skill category, **Combat**, with the same ten levels and XP table. It
raises health (see above). A creature gives XP by its band. At level 5, a
profession (ours): **Steady** (+25 health) or **Nimble** (a hit leaves 2.5 seconds
of grace, not 1.5). The system map kept combat out; this note brings it in, as the
owner now wants gentle combat in ring 1. The skills screen and `skills.ts` need a
fifth row.

### Drops and bundles

No bundle asks for a monster drop. Bars and gems come from digging. The
Lamplighter's bundle (bundle 20) asks for lamps, oil and torches, and oil can
come from a creature, but it also comes from crafting, so a non fighter can
finish it. Monster drops are for crafting, cooking and the lamp trade only.

## Defeat (decided with the owner, Stardew's way)

When health reaches zero:

1. The player is carried out. The screen fades, and it is the next morning.
2. **Money:** 10 percent is lost, capped at 1000g. This is the same rule as
   passing out and it reuses that code (`src/core/day.ts`).
3. **Items:** up to 3 random stacks from the bag, from stone, ore, forage and
   monster drops, are lost for good. A tool, a weapon, a seed packet and a
   bundle item are never taken. Placeholder: each eligible stack has a 1 in 3
   chance, at most 3. A stack is lost whole or halved by a coin flip (our own
   choice).
4. **One item comes back.** The trainer posts one lost stack in the morning
   mail with a note. In Stardew, one lost item is returned by mail from a helper,
   from memory. Our version has the trainer be the helper. This is the soft part.
5. **Energy** on waking is the pass-out value (`PASS_OUT_WAKE_ENERGY`).

The loss is real and small, as the owner asked. A player who flees by ladder
loses nothing. In assist mode, no items are lost (money still is, so there is
one honest cost). The defeat rule applies only to health at zero in the mines,
not to exhaustion or lateness.

## The training dummy and the trainer

- **Where:** in the hall at the mine entrance. Open from the day the mines open.
- **The dummy** takes hits and shows damage numbers and a swing timer. It never
  hurts and it never ends. It has two settings: stand still, and a slow walk
  that teaches telegraphs. No loss, no reward but the lesson.
- **The trainer** (a human woman, deep tier, `20_ring1_cast.md`) gives the first
  weapon free on the first visit, teaches the three weapon families on request,
  and is the one who posts back the lost item. Her name and voice sheet wait
  for the cast and dialogue notes (`18_dialogue.md`).
- **A first fight is optional.** The player is never forced to fight. The
  trainer offers once and then waits to be asked.

## Opening the mines

- **Day:** Spring day 5, as in Stardew, as a placeholder for `07_tuning_numbers.md`
  (it was an open question in `16_bundles.md`). Old Greencoat comes to the farm
  door that morning and says the way is clear. A rockfall blocks the entrance
  until then.
- **The pickaxe.** The farm needs a pickaxe from the start, or a player cannot
  clear its rocks. Whether our farm has rocks to break is not settled in
  `05_farm_map_placeholder.md`. Proposal: Old Greencoat gives the pickaxe at the
  same visit, as the first part of the gift.
- **Rest of the first week:** the trainer asks nothing. The smith dwarf offers
  smelting on the first ore the player brings.

## The fifth tool tier (answers part of #194)

- **Name:** Deepglim (ore and bar), a placeholder. A warm, pale metal that holds
  light, found only in the bottom 20 floors. It ties to the dwarf lamp-makers
  (`09_story_and_lore.md`): the lamp-makers say the old lamps burned Deepglim.
  The lore name can change. It is not Stardew's metal and not Tolkien's.
- **Where:** floors 100 to 120, in nodes, with dry-streak odds. Placeholder: 1 to
  2 ore a node, about 6 nodes on a floor from 100 on.
- **Gate:** the one gate in the mine. A Deepglim node needs at least a steel
  tier pickaxe, so a starter player does not cross the whole mine for a node
  they cannot dig. This is not a surprise, as the tier is shown on the node. It
  is our single exception to "no gating".
- **Price (placeholder):** 20000g and 5 Deepglim bars per tool, smelted by the
  smith dwarf. Existing tiers cost gold only (2000, 5000 and 10000g,
  `07_tuning_numbers.md`), so this is the first tier that needs bars. It is a
  late goal, as the 10000g tier already is. Stardew pairs its top tier with
  25000g and bars, from memory.
- **Tools:** hoe, watering can, axe and pickaxe (the rod has its own line,
  `21_fishing.md`). The axe and pickaxe have no tiers yet, so the tier ladder
  needs building for them first, and a copper, steel and gold tier each.
- **Effect per tool, at tier 5:** hoe and can reach a 9 tile line, as the
  charge grows (placeholder); the axe fells a tree in 1 swing; the pickaxe
  breaks any rock in 1 swing. Swing energy follows `2 - 0.25 * tier -
  0.1 * level`, never under 0.5, so tier 5 and a high level hit the floor.

## Geodes, gems and found things

- **Geodes** come from nodes and some creatures. The smith dwarf cracks them
  for a small fee, and the result is a gem, a stone or a found thing.
- **Gems** sell, and go in the lamp trade. A handful feed the Storyteller's
  bundle and the museum item list if one exists (not in this note).
- **Found things** (old dwarf cups, a buckle, a bent key) are lore items for
  the Storyteller's bundle (bundle 26) and the completion tracker. They are
  found in ruins and in the quiet floors. Their number and names come with the
  tracker note.

## Tuning and the pacing check

The mine is a repeatable activity, so it needs to stay equal with farming and
fishing and never be the best always (`01_system_map.md`, "No always best
activity"). A first check, to test in a playtest:

- A trip of 10 floors takes about 5 to 8 minutes for a new player, so a 14 minute
  day allows one good dive and some farming.
- A band of 40 floors takes about 5 to 8 days of play to get through.
- Ore sells below crops per energy at the start, and above in the late
  game. The bars give the pull, as tools and the Hearth need them.
- The placeholders are listed in `07_tuning_numbers.md`.

## Touch and accessibility

- Movement by a thumb stick, or tap to walk. One swing button. No two finger
  gestures.
- The Assist toggle (proposed). A "no creatures" setting is open: floors
  with no creatures at all, for a player who wants to dig only. It costs little,
  as the creature spawner just returns nothing, and it keeps the promise that
  mining works without fighting. The drops they give would then not be available.
- Check on a real tablet that fingers do not cover the swing button and the
  health bar.

## Build slices (when the time comes)

1. The mine scene with floors 1 to 10: rocks, ladders with dry-streak odds,
   copper, the lift, the opening day and the pickaxe. No creatures.
2. Smelting at the smith dwarf, the furnace, bars, and the Smith's bundle.
3. Health, the blade, the trainer, the dummy, and the first two creatures. Defeat
   and the lost item by post.
4. Bands 2 and 3, the other creatures, the other weapon families, the combat
   skill and professions, rest camps.
5. The fifth tier, with the axe and pickaxe tier ladder (#194).
6. Special floors, ruins and puzzles, and the second cavern if wanted.

## Open

- Owner review of the whole drafted note. Everything outside the three decisions
  is our draft.
- Whether to add a second, endless cavern, like Stardew's Skull Cavern, after the
  120 floors. This note puts Deepglim in floors 100 to 120 so it is not needed.
- The Assist toggle and the "no creatures" setting: agree, or drop.
- Whether Combat becomes a fifth skill, or is folded into Mining. Proposed as a
  fifth, with the skills screen change.
- Whether the Deepglim steel pickaxe gate stays, as our one gate.
- Smith dwarf smelting before the furnace (the Smith's bundle circle).
- Whether the farm has rocks, and when the player first owns a pickaxe.
- The opening day, and Old Greencoat's gift.
- Names: the metal, the creatures, the weapons and the bands. All placeholders.
- Stardew facts used from memory (the defeat rule, floor counts, prices) need a
  check against the real game or the wiki before numbers are fixed.
- The trainer's name, voice and line count (cast and dialogue notes).
- How the museum or collection counts mine finds (the completion tracker, #196).
- Tablet check: stick, swing button and health bar on a real device.
