# 22 Mines and gentle combat

Status: **decided with the owner on 2026-10-30**, in a first round of three big
choices and a second round of questions on the drafted parts. A few items are
still our draft and are listed under "Open". Every number is a placeholder.
Stardew facts are from memory or from unverified search results, and are marked.
Nothing here is built. It answers the design half of the mines item in
`16_bundles.md` and feeds the fifth tool tier (#194).

## Why

The Hearth room needs bars, and so do tool upgrades, lamps and the Smith's
bundle (`16_bundles.md`). The brief wants optional fighting with a training
dummy and no boss (`17_call_feedback_2026-10-28.md`). The system map says mining
must work without combat (`01_system_map.md`). The mines are also where the
fifth tool tier comes from (`21_fishing.md`, #194). This note settles all of that
before any code, so the mines do not feel bolted on.

## Decided with the owner (2026-10-30)

First round:

1. **Combat is real-time and forgiving.** Swing a weapon at slow, cartoonish
   creatures. Big telegraphs, no chains of knockback, one tap or click to swing,
   works on touch. The training dummy teaches it.
2. **Defeat follows Stardew.** The player is carried out, wakes up the next
   morning, loses a share of money and some items for good, and gets one item
   back in the post. Details below.
3. **The mine is the size of Stardew's:** 120 floors, in three bands of 40.
   (We first labelled a 40 floor option "Stardew-like" by mistake. Stardew's mines
   are 120 floors and its rarest metal comes from a separate Skull Cavern.)

Second round:

4. **An Assist toggle and a "no creatures" setting, both.**
5. **Combat is a fifth skill.**
6. **The farm has rocks and the pickaxe is a starter tool.** Old Greencoat gives
   nothing at the opening, only the news.
7. **No endless cavern at the mine.** Like Stardew, once the player reaches the
   bottom floor they can flip a switch that makes the mine more dangerous. A
   Skull Cavern style place is wanted, but not at the mine site, and probably in
   ring 2 (see "Open").
8. **No pickaxe gate.** Any pickaxe digs any ore, Hearthsilver included.
9. **The fifth tier metal is Hearthsilver.** The upgrade costs bars only, no gold.
10. **The smith dwarf sells copper, iron and gold ore, and coal.** She does not
    sell bars.
11. **The furnace is a gift from the smith,** not for sale, delivered the morning
    after the player first hands over copper ore. It can also be crafted
    (see "Ore, coal and bars").
12. **The Smith's bundle (19) gives a charcoal kiln and its recipe,** not the
    furnace. The big furnace is a ring 2 reward.
13. **Rest camps stay, with no healing.** The lift stops at every floor once
    reached. A chest on every 10th floor holds items to take, and cannot be used
    to stash things.
14. **Edgier creatures:** cave bats, rock crabs and beetles, old miner skeletons
    and goblin-ish thieves, all still cartoonish.
15. **Three weapon families,** and the first build has a few from each.
16. **Defeat can take any stack in the bag** except the safe types.
17. **One health bar,** shown only where health can be lost.
18. **A ladder can also appear when a monster is killed,** with the same
    dry-streak odds.
19. **Dry-streak numbers and special floors (about 1 in 15) are kept.**
20. **The mines open on Spring day 5.**

Third round (the small open items):

21. **Ore prices at the smith are about 2.5 times the bar's sale value.** Copper
    ore 25g, iron ore 50g, gold ore 100g, coal 50g (placeholders).
22. **The Nabbler steals nothing.** It is a hit-and-run nuisance that costs health
    only. Defeat is the only way to lose items.
23. **The furnace the smith gifts is the first.** Crafting at mining level 4 is
    kept to make more furnaces.
24. **The dangerous mode lever is on floor 120 only,** and is gated by reaching
    floor 120 and then a short errand from the warden head (see "Dangerous
    mode"). The lift can bring the player back up afterwards.

Already decided elsewhere and kept: the mines are in ring 1, off the Mountain,
and open on a fixed day announced by Old Greencoat (`16_bundles.md`, "The
mines"). A training dummy and no boss fights. The trainer is a human woman, deep
tier (`20_ring1_cast.md`). The smith dwarf and the stonekeeper dwarf live on the
Mountain (`19_valley_layout.md`).

## Rules for the whole mine

- **Mining works with no fighting.** Every floor can be crossed and every ore
  can be dug without killing anything. Stairs come from breaking rocks. A
  killed creature can also reveal one (same odds), so fighting helps and is
  never needed. A creature never spawns on a stair or a ladder.
- **Combat is a choice with a reward,** not a gate. No bundle needs a monster
  drop (see "Drops and bundles").
- **No death.** The worst case is the defeat rule below, which is the same
  mild and recoverable shape as passing out (`src/core/day.ts`).
- **No boss.** The owner and a second friend disliked them. The deepest floor
  has a switch (see "Dangerous mode"), not a fight.
- **No missable item.** Rare finds use dry-streak odds, so a completionist is
  not stuck on bad luck.
- **Touch first.** Move with a thumb stick or tap to walk, one button to swing.
  Checked on a real tablet before the slice is called done.

## The mine, floor by floor

120 floors in three bands. The names are placeholders and ours.

| Band | Floors | Look | Ore | Creatures |
| --- | --- | --- | --- | --- |
| The Upper Galleries | 1 to 40 | Brown stone, old dwarf lamps | Copper | Pebblebacks, Dustmoths, Rock Crabs, Mossbeetles, Gloop (green) |
| The Cold Deeps | 41 to 80 | Blue rock and frost, breath clouds | Iron | Frostnibblers, Icicle Hoppers, Cave Bats, Nabblers, Gloop (blue) |
| The Ember Deeps | 81 to 120 | Red rock, warm glow, old forge halls | Gold, and Hearthsilver from floor 100 | Cinder Pups, Lanternmoths, Old Diggers, Gloop (red) |

- **Floors are made fresh each day** from a seed of the day and the floor, so a
  save and a reload give the same floor. A ladder or stair is hidden under a
  rock, and the player breaks rocks to find it. Some floors also have a free
  stair in sight (about 1 floor in 4, placeholder).
- **The lift stops at every floor once reached.** Any floor the player has been
  to can be returned to from the entrance. This is more forgiving than Stardew,
  whose lift stops every 5 floors (from memory). Note for tuning: it makes the
  deep floors cheap to reach each day, so the day clock and energy are the only
  limit.
- **The entrance** is a hall with the lift, a lost-and-found counter for the
  trainer's posted item, the trainer and the dummy, and a shipping bin for ore only.
- **Rest camps.** Every 10th floor has a lamp-lit camp with a bench and a chest.
  The chest holds a few items to take (a gift from the old dwarf lamp-keepers,
  refilled each day), and cannot be used to stash things. No healing. The camp
  is a cozy beat and a small goal, not a safe zone.
- **Special floors.** About 1 floor in 15 has a theme, such as a floor of
  geodes, a floor of Gloop that never attacks, or a quiet ruin with a puzzle
  (hook for the puzzles note, `17_call_feedback_2026-10-28.md`).
- **Leaving is always free.** Take the ladder up or the lift. The day clock
  still runs in the mine. Running out of energy or time uses the normal
  pass-out rule, not the defeat rule (exhaustion is not combat).

### Finding the way down (dry streak)

Each rock broken without a ladder under it adds a little to the odds that the
next one hides it, and finding it resets the odds. Placeholder: base 1 percent,
plus 0.5 percent per miss, capped at 25 percent. A killed creature rolls the
same chance, from the same counter (decided). The same counter idea is used for
rare gems and artifact spots, each with its own counter. Stardew does this for
ladders, from memory. Numbers go in `07_tuning_numbers.md`.

### Dangerous mode

A lever in the last hall of floor 120 (decided: floor 120 only) turns the mine
into a harder version, like Stardew's toggle. The player can flip it back at any
time, and the lift can bring them up afterwards.

- **The gate (decided).** Reach floor 120, then do a short errand for the warden
  head. She sets the player a task ("prove you can make the descent again within a
  week") and the lever then works. This is our version of Stardew's quest, where
  Mr. Qi's "Danger in the Deep" asks the player to reach floor 120 within a week
  and a shrine on that floor then switches on the dangerous mines (fan guides,
  unverified). The errand is a placeholder until the warden head's note
  (#177) exists. Until then the lever works once the bottom is reached.
- More creatures per floor, with harder hits.
- Better drops and more ore per node.
- The Assist settings still apply, so the dangerous mine is reachable for
  everyone who wants it.
- Nothing needs it. It is a chosen challenge, with a reward for liking it.

## Mining

- **Mining is a skill,** the fourth skill category from the system map. It uses
  the existing skill levels (ten levels, same XP table, profession at level 5,
  `07_tuning_numbers.md`). A rock gives a few XP, ore gives more.
- **Rocks and nodes.** Plain rocks give stone and a little XP. Nodes give ore
  (one node, 1 to 3 ore, level raises the chance of 2 or 3). Coal rocks give
  coal. Geodes give a geode. Gem nodes are rare.
- **The pickaxe does not gate ore** (decided). Any pickaxe digs any node,
  Hearthsilver included. A better pickaxe breaks rocks in fewer swings and costs
  less energy per swing, as the hoe does now (`07_tuning_numbers.md`). Stardew
  gates deeper ore by tool, from memory. Ours does not, so a player never walks
  away from ore they can see. A weak pickaxe just takes many swings on a deep
  node, and the placeholder rock hardness rises by band.
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
| Hearthsilver | 100 to 120 | Hearthsilver bar | 5 ore, 2 coal |

Placeholders from memory of Stardew's pattern. Coal drops from coal rocks and
from Gloop. A furnace takes a day per batch, as in Stardew.

**The smith dwarf's shop (decided).** She sells copper, iron and gold ore, and
coal. She does not sell bars and does not sell Hearthsilver ore. Stardew's
blacksmith sells ore and coal too, from memory. A non-miner can therefore
buy ore, smelt it and finish the Smith's bundle without fighting or digging.
Prices (decided, placeholders): copper ore 25g, iron ore 50g, gold ore 100g, coal
50g, about 2.5 times the bar's sale value (60g, 120g and 250g, from memory). A bar
then costs about 175g, 300g and 550g to buy and smelt, so buying never beats
digging. A non-miner finishing bundle 19 by buying pays about 4000g, a real
stretch but within reach late in the first two seasons.

**The furnace (decided).**

- **A gift from the smith, not for sale.** The morning after the player first
  hands over copper ore (a short scene at the farm door, Stardew's pattern as
  search results show it, unverified), she brings a furnace. A non-miner buys the
  ore from her and hands it over, so the gift is open to everyone.
- **More furnaces can be crafted** at mining level 4 (placeholder, decided), so a
  player can run several batches at once. The gift is the first furnace.
- **The Smith's bundle needs bars, so the furnace comes first,** which breaks the
  old circle where the bundle gave the furnace.
- **The big furnace is a ring 2 reward** (smelts more at once). It is too early
  in the game for ring 1.

**The Smith's bundle reward (decided): a charcoal kiln and its recipe.** The kiln
turns wood into coal, so a player who does not dig still has fuel (10 wood for 1
coal, placeholder, Stardew's ratio from the wiki). In Stardew the kiln is a
recipe of Foraging level 2 and also a reward of its Crafts Room construction
bundle, per search results, unverified. Placeholder crafting cost: 2 copper bars
and wood. The Hearth room's other two bundles give torches and a loom
(`16_bundles.md`), so this fits the machine pattern.

## Gentle combat

### The rules of a fight

- **One health bar** (decided), separate from energy. Placeholder: 100 at the
  start, plus 5 per combat level. It is shown only where health can be lost
  (a mine floor, and later any other place with creatures), so a player who
  never fights never sees it. The HUD rule is "show when a loss is possible",
  not "show in the mines", so combat can appear elsewhere without a new bar.
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
  value). Going up restores none, and the rest camps do not heal.
- **The Assist toggle** (decided, as for fishing, `21_fishing.md`): halves damage
  taken and widens telegraphs. In assist mode, defeat loses no items (money
  still goes). It is a setting, off by default, and never changes drops or
  rewards.
- **A "no creatures" setting** (decided): floors with no creatures at all, for a
  player who wants to dig only. Creature drops are then not available, which is
  fine because nothing needs them.

### Weapons

Three families, all found, bought or forged (decided). One slot, with a swap.
Names are placeholders, in the cozy register, and none is from Stardew.

| Family | Feel | Start |
| --- | --- | --- |
| Blade | Quick short arc, the all round weapon | Hazel Switch (free from the trainer) |
| Club | Slow wide swing, hits several creatures | Rolling Pin (a Brimmer joke, in the bakery spirit) |
| Sling | Soft ranged shot with pebbles, short reach | Pocket Sling |

- **Four tiers per family,** by band: the starter, then a copper, iron and gold
  weapon forged by the smith dwarf from bars, and a Hearthsilver weapon at the
  end. Fifteen weapons in all.
- **The first build has a few from each family,** not only the blade (decided):
  the starter and the copper tier of each, six in all. This means the sling needs
  aiming on touch from the start, so it gets an early tablet check.
- **Forging costs bars plus gold,** with no wait. Weapons are never rolled
  at random, so there is no weapon grind. A floor chest gives a weapon from the
  band, as a choice of fixed ones.
- **Stats are simple:** damage, speed and reach. No crit, no enchant at first.
  (Stardew has both, and rings. Our ring slots are covered by bundle rewards,
  `16_bundles.md`.)
- **Fighting is not needed for tools.** All tool upgrades need gold and
  bars. Bars come from digging, or from the furnace and bought ore, not from
  monsters.

### Creatures

Our own cartoonish creatures (decided: some edgier ones added). None copies
Stardew's creatures or names (ADR 0002). Each has one clear behaviour, so a
player learns it in one meeting. The edgier ones stay in the comic register, with
no gore, and no shadow or Surt creatures in ring 1 (`09_story_and_lore.md`).

| Creature | Band | Behaviour | Drops |
| --- | --- | --- | --- |
| Pebbleback | 1 | A walking stone that shuffles toward you and bumps | Stone, copper ore |
| Dustmoth | 1 | Drifts in slow loops, a soft puff of dust on contact | Moth dust (a crafting good), a little fibre |
| Rock Crab | 1 | Plays dead as a rock until you come near, then pinches. Armoured from the front, so hit from behind or with a club | Stone, shell |
| Mossbeetle | 1 | A slow armoured beetle that rolls into a ball and bounces off walls | Moss, a little fibre |
| Gloop | all (green, blue, red) | A bouncing blob. Splits once when hit. Harmless unless you stand on it | Gloop jelly, coal |
| Frostnibbler | 2 | Scurries in a line, then stops to wriggle | Iron ore, frost berry (food) |
| Icicle Hopper | 2 | Hops in a fixed three step pattern | Ice shard (lamp good) |
| Cave Bat | 2 | Hangs, then swoops in a long clear arc and retreats. Fast, so the arc is shown first | Bat wing (a crafting good), a little coal |
| Nabbler | 2 | A goblin-ish thief that darts in, bumps you with a cheeky grab at your pockets, and scampers off. It takes nothing | A pocket coin |
| Cinder Pup | 3 | A little ember dog that charges after a clear bark | Coal, a warm ember (a lamp good) |
| Lanternmoth | 3 | Floats in a ring around a light, shoots a slow glow | Oil, a little gold ore |
| Old Digger | 3 | A skeleton of a long dead miner that shuffles, swings a pickaxe with a comic wind up, and falls apart in a pile of bones that reassembles if left alone | Old tools (a lore item), a little gold ore |

- **One rare creature per band** (a golden Gloop, and two others later). It
  appears with dry-streak odds, gives a fun drop, and is a quiet part of the
  completion tracker (#196).
- **Count per floor** is small: 2 to 5 early, 4 to 8 deep (placeholder). A floor
  never feels like a swarm.
- **The Nabbler steals nothing** (decided). It only costs a little health, so
  it is the cheeky edge of the roster without a second loss rule.

### Combat skill

A fifth skill category, **Combat** (decided), with the same ten levels and XP
table. It raises health (see above). A creature gives XP by its band. At level 5,
a profession (ours): **Steady** (+25 health) or **Nimble** (a hit leaves 2.5
seconds of grace, not 1.5). The system map kept combat out; this note brings it
in, as the owner now wants gentle combat in ring 1. The skills screen and
`skills.ts` need a fifth row.

### Drops and bundles

No bundle asks for a monster drop. Bars and gems come from digging, or from
bought ore. The Lamplighter's bundle (bundle 20) asks for lamps, oil and
torches, and oil can come from a creature, but it also comes from crafting, so a
non-fighter can finish it. Monster drops are for crafting, cooking and the lamp
trade only.

## Defeat (decided with the owner, Stardew's way)

When health reaches zero:

1. The player is carried out. The screen fades, and it is the next morning.
2. **Money:** 10 percent is lost, capped at 1000g. This is the same rule as
   passing out and it reuses that code (`src/core/day.ts`).
3. **Items:** up to 3 random stacks from the bag are lost for good. Any stack is
   eligible except the safe types: a tool, a weapon, a seed packet and a bundle
   item are never taken (decided). So a defeat can take a crop, forage, a fish or
   a gold quality item, as in Stardew. Placeholder: each eligible stack has a 1
   in 3 chance, at most 3. A stack is lost whole or halved by a coin flip (our
   own choice).
4. **One item comes back.** The trainer posts one lost stack in the morning
   mail with a note. In Stardew, one lost item is returned by mail from a helper,
   from memory. Our version has the trainer be the helper. This is the soft part.
5. **Energy** on waking is the pass-out value (`PASS_OUT_WAKE_ENERGY`).

The loss is real and small, as the owner asked. A player who flees by ladder
loses nothing. In assist mode, no items are lost (money still is, so there is
one honest cost). The defeat rule applies only to health at zero, not to
exhaustion or lateness. It applies in any place with creatures, not only the
mines.

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

- **Day:** Spring day 5 (decided), as in Stardew. Old Greencoat comes to the farm
  door that morning, says the way is clear, and gives nothing else (decided). A
  rockfall blocks the entrance until then.
- **The pickaxe** is a starter tool (decided), and the farm has rocks to break
  from the first day. Stone is therefore available early for crafting and the
  Last Seat. The farm map may need rocks added (`05_farm_map_placeholder.md`).
- **The first week:** the trainer asks nothing. The smith dwarf offers ore for
  sale, and brings the furnace the morning after the first copper ore is handed
  over.

## The fifth tool tier (answers part of #194)

- **Name:** Hearthsilver (ore and bar), chosen by the owner for its feel of a
  fabled light metal in the old tales. A warm, pale metal that holds light, found
  only in the bottom 20 floors. It ties to the dwarf lamp-makers
  (`09_story_and_lore.md`): the lamp-makers say the old lamps burned it. The name
  is ours, but it sits close to the Hearth room and to Hearthwell, so text must
  keep "Hearth" (the bundle room), "Hearthwell" (the town) and "Hearthsilver"
  (the metal) clearly apart.
- **Where:** floors 100 to 120, in nodes, with dry-streak odds. Placeholder: 1 to
  2 ore a node, about 6 nodes on a floor from 100 on.
- **No gate** (decided). Any pickaxe digs it.
- **Price (decided): bars only, no gold.** Placeholder: 5 Hearthsilver bars per
  tool. The smith dwarf does not sell it, and the furnace smelts it (2 coal a bar).
  It is the one tier that needs the deep mine, and it is a late goal, as the
  10000g tier already is. Stardew pairs its top tier with 25000g and bars, from
  memory. Ours skips the gold on purpose, so the deep mine is the cost.
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
  bundle.
- **Found things** (old dwarf cups, a buckle, a bent key, the Old Diggers' tools)
  are lore items for the Storyteller's bundle (bundle 26) and the completion
  tracker. They are found in ruins, in the quiet floors and from Old Diggers.
  Their number and names come with the tracker note.

## Tuning and the pacing check

The mine is a repeatable activity, so it needs to stay equal with farming and
fishing and never be the best always (`01_system_map.md`, "No always best
activity"). A first check, to test in a playtest:

- A trip of 10 floors takes about 5 to 8 minutes for a new player, so a 14 minute
  day allows one good dive and some farming.
- A band of 40 floors takes about 5 to 8 days of play to get through. With a lift
  that stops at every floor, the way back down is free, so this is the pace of
  digging, not of walking.
- Ore sells below crops per energy at the start, and above in the late
  game. The bars give the pull, as tools and the Hearth need them.
- Bought ore must cost more than a bar is worth, or buying would beat digging
  and make the smith the best activity.
- The placeholders are listed in `07_tuning_numbers.md`.

## Touch and accessibility

- Movement by a thumb stick, or tap to walk. One swing button. No two finger
  gestures.
- The Assist toggle and the "no creatures" setting (both decided).
- The sling needs aiming on touch. It is in the first build, so it gets an early
  tablet check.
- Check on a real tablet that fingers do not cover the swing button and the
  health bar.

## Build slices (when the time comes)

1. The mine scene with floors 1 to 10: rocks, ladders with dry-streak odds,
   copper, the lift, the opening day, and rocks on the farm. No creatures.
2. The smith dwarf's ore shop, the furnace gift, bars, and the Smith's bundle
   with the charcoal kiln.
3. Health, the starter weapons of all three families, the trainer, the dummy, and
   the first two creatures. Defeat and the lost item by post.
4. Bands 2 and 3, the other creatures, the other weapon tiers, the combat skill
   and professions, the rest camps.
5. The fifth tier, with the axe and pickaxe tier ladder (#194), and dangerous
   mode.
6. Special floors, ruins and puzzles. The deep cavern is a separate design, in
   ring 2.

## Open

- **Where the Skull Cavern style place goes:** the owner wants it, not at the
  mine site, and thinks ring 1 or ring 2. Our lean is ring 2, which the owner
  has agreed to as the likely home. It needs its own note with the ring 2
  design.
- **The big furnace** is a ring 2 reward. Its exact source is for the ring 2
  notes.
- **Ore prices** are a first guess, checked against bar sale values from memory.
- **Hearthsilver:** the name is decided, but the lore line about the old lamps
  needs the smith dwarf's voice sheet.
- **How the Weaver's loom and the charcoal kiln** fit the machines note
  (processing, not yet written).
- **The warden head's errand** that gates the dangerous mode lever (#177), and
  the exact dangerous mode numbers.
- **The Skull Key analogue:** in Stardew, floor 120 also yields the key to the
  Skull Cavern. Ours may use the same beat to open the ring 2 deep dig.
- **The lift at every floor** and its effect on pacing, to test.
- **Names:** the creatures, the weapons and the bands. All placeholders.
- **Stardew facts used from memory or from unverified search results** (the
  defeat rule, floor counts, the furnace and kiln recipes and prices) need a check
  against the wiki before numbers are fixed.
- **The trainer's name, voice and line count** (cast and dialogue notes).
- **How the completion tracker counts mine finds** (#196).
- **Tablet check:** stick, swing button, sling aiming and health bar on a real
  device.
