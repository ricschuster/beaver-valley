# 09 Story and lore (draft)

Status: draft, in discussion. Written from the design talk of 2026-10-26 on
issues #16 (the player's story and ending) and #17 (emphasis between farming,
relationships and expeditions). Nothing here is final. Anything marked "open"
still needs a decision.

All of this must stay original. The feel comes from the fantasy tradition; the
names, characters, places and lore are our own. See
`docs/decisions/0003-middle-earth-style-setting.md` and
`docs/decisions/0002-stardew-valley-inspired.md`.

## Emphasis (issue #17)

Decided order of weight:

1. Farming and crafting depth. The core loop.
2. Expeditions. The hook of the setting; they feed back into the farm.
3. Relationships. They start small but matter from the first week, as in
   Stardew Valley, and grow into a heart-level system.

Relationships timing:

- From M3: every villager has a friendship value that is saved. Daily talk,
  gifts (loved, liked, disliked), a heart display, at least one early event per
  villager, and small rewards such as recipes, discounts and requests.
- Later, in the ring 2 era: more villagers, schedules, deeper events and a
  closer bond. Ring 2 adds people; it does not gate the system.
- Villagers are data, so adding one never means reworking the system.

Cast size:

- Ring 1 (the home valley and Hearthwell) aims at about the size of Stardew
  Valley's cast (roughly 30 named villagers). Decided 2026-10-27. This is a
  destination, not the first playable, which keeps "a few simple villagers"
  (see the brief). Reader 1 thought 10 to 20 was right and 40 too many; we keep
  closer to Stardew and treat that as a cap on how the cast is shown, not a
  target to shrink to.
- Rings 2 and 3 add more people, but only a few in each get the full
  relationship treatment (hearts, events, gifts, marriage). The rest are
  traders, quest givers and passers-by.
- Open: how to phase it. Writing and art cost for a solo developer at 5 to 10
  hours a week is large. Candidate: a few full villagers first, with more added
  in layers.

Marriage:

- To be built eventually, in the Stardew Valley manner: marriage candidates, a
  courtship that gates on hearts, a wedding, and a spouse who lives on the
  farm. It is not in the first playable or M3.
- Needs its own design note before building: who can marry (and whom), what a
  spouse does day to day, children or not, and how it fits the favour-ledger
  and hat customs of the Brimmers.
- See `12_marriage.md` for the working design.
- Villager data should leave room for it now: a marriage-candidate flag and a
  heart cap that a courtship raises.

## The story (issue #16)

### The premise

The player inherits a neglected farm from an eccentric relative who has
vanished down the road. The valley is quiet and warm. The village hall is the
remains of an old waystation, and finishing the hall bundles restores it.

### The lore so far

- A kingdom once stood along the old road. A dark lord broke it and was in turn
  driven back, then banished far away. He is not in the game as a physical
  presence. His influence can leak back in.
- The valley was the kingdom's kitchen garden. It fed the road. It survived
  because it was too small and dull for the dark lord to bother with.
- The valley folk descend from the kingdom's servants. They keep the old
  customs (hospitality, the favour ledgers, hats) without remembering why. They
  are the "forgetful caretakers".
- The waystation was an inn and granary on the road, where travellers rested,
  ate and were seen on their way. That is what the hall bundles (crops, goods,
  cooking) literally restore.
- Secret wardens still watch the road. They pass as ordinary carriers and
  couriers, under the name the Dawn Carriers, moving post and parcels between towns. They are cheerful in cover
  and quietly dutiful underneath. They must not read as Tolkien's Rangers.

### The dark lord

- Wants what a dark lord wants: rule from the darkness. This is a general
  fantasy trope.
- Off limits: a ring, an eye, a tower, orcs, "one thing that must be
  destroyed", and any name close to a Tolkien name.
- Direction: the Hollow Crown, an empty crown and robes that rule without a
  body, with shadow and a great voice mixed in. Working title only.
- Seen or unseen (decided 2026-10-27, after a reader could not tell): he is
  never seen directly. The player meets his effects: shadow, a voice, the
  creatures at the edges of the regions. The empty crown shows only at the end,
  if at all. The lore note and any packet text should say this plainly.
- How he shows (decided 2026-10-27): in small things going wrong, never in
  scares. Crops grow a little odd, lamps gutter, hats go grey, a voice hums
  near the road at night. Eerie or funny at most, in line with the tone rules.
  Ring 2 creatures and visuals follow the same register. None of it appears in
  ring 1 (see Method below).
- Name and element (decided 2026-10-27): his name is Surt, from the Norse fire
  giant Surtr, and folk call him "the Smoulderer". Norse myth is old and
  shared, but Tolkien also mined it, so we avoid the Norse dwarf-name list and
  any wizard names from it. The element is embers and ash, kept subtle: a
  banked fire that never quite went out. No volcano, lava, fire eye or fiery
  demon, since those are Tolkien's pictures. The small wrongs fit it: grey
  hats are ash, lamps flicker, bread scorches, a smudge of smoke on the horizon.
  It is the dark mirror of the Hearthwell hearth.
- Tone: the game is lighthearted. The dark parts are very minor and stay in the
  background. The empty crown remains his emblem and the Hollow Crown is an
  old-book title for him. The Hollow Crown stays as an old-book name (decided 2026-10-27): folk say
  "the Smoulderer", while old books and the elves say "the Hollow Crown". Two
  names also show how the valley folk forgot.
- Open: his method. His distinctiveness has to come from his method and image,
  since his aim is generic.

### The relative

- A gardener who went adventuring, a keeper of rare seeds who left to find more.
- Quiet and shrewd, with a deep curiosity about the world and its history. Did
  go on a long adventure in the past.
- The player and the relative share one family name. The family name is
  Thimblemoss. The relative's first name is Oriel (decided 2026-10-27, an owl-like name for age
  and wisdom): Oriel Thimblemoss.
- Why they left (decided 2026-10-27): ring 2 is a place the relative knew
  from their adventuring days, and they loved the company of its elves. When
  they felt it was time to leave the farm, they went there to retire. The
  player does not learn this at the start. It is answered later, as a gentle
  push toward ring 2. It is a warm reason, not a danger: the relative is not
  lost, only far away and happy. Ring 2 is therefore a haven in the lore, not
  only a frontier (see `03_milestones.md`, M4).
- Naming: the ring 2 haven is a placeholder idea modelled on an elven refuge.
  Its name must be our own and not close to any Tolkien place name (ADR 0003).
  Its name is Evenglade (decided 2026-10-27).
- Legacy is a light steer only: a trunk of odd seeds and one note, a plain
  welcome. For example "The soil is good, the neighbours are better, do come and
  meet them." Nothing tells the player what to do.
- The hint toward the hall comes from a villager, the way the mayor does in
  Stardew Valley. Not from the note.
- The player's freedom matters more than a forced path.

### The ending

No real ending. A celebration (a village feast and a short scene) when the last
bundle of centre 1 is done, and play goes on afterwards.

Decided 2026-10-27: the feast is a thank-you scene, then play goes on. The
village gathers and the hats are worn. It sets up ring 2 and, where it fits,
hints at the answer about the relative. No credits and no end state.

Restoring The Long Table (decided 2026-10-27) makes the valley visibly warmer.
Each finished bundle brings a visible change: lit windows, travellers on the
road, a new stall. The hall's restoration is the progress bar, and it is also
the quiet counter to the shadow's small wrongs.

### When rings 2 and 3 open

- Ring 2 opens partway through the bundle chain (for example after bundle 3 of
  5), so the player can go out while the hall is unfinished. Individual regions
  are then gated by their own tool or bridge upgrade.
- Ring 2 regions (decided 2026-10-27): all four kinds are wanted, with about
  two reachable first. An elven woodland haven (where the relative retired), a
  mountain pass (dwarves, ore, mushrooms), a river marsh and a coast or lake.
  Which two come first, and how each is gated, is for the ring 2 design (#20).
- Ring 3 stays behind centre 2, optional and late.
- The bridge bundle opens the road: mending the old bridge. This ties to the
  bridge-upgrade gating and is easy to read on the map.
- Bundles (decided 2026-10-27): each bundle unlocks one thing. For example
  one gives a tool upgrade tier, another mends the bridge to the first ring 2
  region. Stonekeeper dwarves relate to the bridges and smith dwarves to the
  tools. Open: the exact mapping of the five bundles to unlocks.
- Wardens (decided 2026-10-27): the Dawn Carriers reveal themselves when the
  road opens, as below.
- First signs of the shadow: a courier breaks cover to warn that the road is
  not as safe as it was, which reveals the wardens as a story beat. After that,
  strange creatures appear at the edges of the new regions as the player
  travels.
- Method (decided 2026-10-27): spark-borne rot, and very gentle. Cinders drift
  on the wind from the far edge and settle on things: a grey fleck on a hat, a
  scorch on bread, a crop that ripens too fast and thin. Each is a tiny wrong
  the player can brush off or fix. Ring 1 has none of it and stays very cozy.
  At the very most, ring 1 has old stories and whispers with no name. The
  player's real awareness of Surt begins only when ring 2 opens.
- Ring 1 is peaceful. The shadow first appears when the road opens. Before that,
  the lore reaches the player through customs and the relative's note, not
  through danger.

## The valley folk

Not hobbits. An invented small, homely people. Working traits:

- Look: elaborate hats, a hat for each occasion and trade.
- Habit: favour ledgers. Neighbours keep ledgers of favours given and owed.
- Nature: hospitable to a fault.
- Idea to test: a hat shows standing in the ledger. A new neighbour wears a
  plain cap, a respected host wears something elaborate, and the player's own
  hat grows as they do favours. This ties hats, ledgers, hospitality and
  friendship together.
- Decided 2026-10-27: hat standing is a light mechanic that rides on the
  friendship system. A hat is a visible readout of the player's overall
  standing among the Brimmers, a cosmetic tier. There is no separate favour
  currency and no ledger screen. Ledgers stay as flavour in dialogue and
  decoration. This works with the M3 plan of hats shown in a portrait only
  (`13_m3_scope.md`).
- Avoid anything specific to hobbits: hairy feet, pipe-weed, second breakfast,
  hillside burrows.
- They are called Brimmers (from the brim of a hat).
- Small, with long ears that poke through or around the hats. This keeps them
  clearly apart from hobbits.

Naming style: mixed by place. Plain, cozy names in the valley, odder ones in
the crossroads town, strange ones in ring 2 and beyond.

## Other peoples

General fantasy types, written our own way. They can use the plain words
(wizard, dwarf, elf), with our own traits for each group so that two groups of
the same kind are not alike.

- A wizard-like figure living in the woods. An absent-minded hermit who forgets
  things and gives odd requests, and who also knew the vanished gardener and is
  the closest thing to an answer about where they went.
  Role (decided 2026-10-27): mainly a teacher of the old customs. He explains
  why the Brimmers keep hats and ledgers, so the lore reaches the player in
  character. Secondarily, odd requests and rare items. Eventually he can give
  a gentle push toward ring 2 (a letter or a clue he forgot to hand over), but
  it is light and optional: the game is mostly about play, and no villager
  pushes the player into a story line.
- Dwarves in the mountains (decided 2026-10-27): two groups, so there is more
  than one dwarf NPC. Stonekeepers of the road, who built and maintain its
  bridges and stonework (and so tie to the bridge bundle). Smiths and
  lamp-makers, who make tools and the lamps the Smoulderer's ash dims (and so
  tie to tool upgrades).
- Elves (decided 2026-10-27): kept broad on purpose. An ancient people who like
  many things and act as stewards of land and creatures. Gardens and seeds are
  one hook, and the arts are another: music, weaving and decoration, which fit
  tailoring and furnishing (`10_customisation.md`). Not tied to Tolkien's
  elves; the traits are our own and get fixed when ring 1 and ring 2 are
  designed (M4). Elves live in the ring 2 haven.
- Tall road-folk, stout craftspeople, fey wanderers and odd one-offs also pass
  through the crossroads town.
- The valley village is mostly the hatted folk.

## The crossroads town

A mixed town on the road, in the role of a Bree-like waystation town. Its name
is Hearthwell. Stardew-like in layout. It holds the old waystation, now the
village hall, called The Long Table. The farm sits out in the quiet valley as a home base.

Buildings chosen:

- General store and carrier post (the couriers are the secret wardens).
- Smithy and mender (tool upgrades, run by a stout craftsperson).
- Inn and kitchen.
- Healer, library and a festival green.

Open: the full list of building types, and how big the town is.

## Festivals

- Two festivals per season (decided 2026-10-27, from reader 1's request for
  "lots or a few"). The first playable has none; plan them from M3.
- The first seasonal festival is a hat parade: everyone shows off their best hat
  and their standing in the ledger. It shows the folk's culture and is good for
  sprites.
- A second candidate, from reader 1: a Brimmer "cake day" where everyone dresses
  in food-looking clothes. It suits the folk's hospitality and gives a reason
  for clothes and hats (see `10_customisation.md`).
- A festival can hold a minigame and a prize counter (see `11_minigames.md`).
- Open: the rest of the festival calendar, including which seasons the two above
  fall in.

## Tone rules

- No scares. No jump scares and no frightening creatures. Ring 2 and ring 3
  creatures are odd, funny or eerie at most.
- No lose state. Passing out means starting a new day at home with a small
  cost, as in Stardew Valley. Nothing ends the game or deletes progress.
- The dark lord is never seen (see above).

## Neglect

Checked against Stardew Valley on 2026-10-27 (wiki and forum sources):

- Villagers. Stardew does decay friendship a little for each day the player does
  not talk to a villager, until a cap (about 10 hearts for friends, 8 for
  unmarried candidates, none for a full meter). It is slow, and nobody gets
  angry. A spouse and a bouquet-holder lose more.
- Animals. Stardew lowers an animal's friendship and mood if it is not fed,
  not petted, or left out at night or in bad weather. Friendship and mood only
  affect the quality of what it produces. They do not hurt the player.

Rule for this game, in the same spirit:

- Neglect costs only potential: lower quality, a slower gain, a pause in
  progress. It never removes a thing the player already has.
- No villager or animal gets angry, scolds the player or refuses to deal with
  them. No dialogue punishes absence.
- Animals: neglect lowers the quality of their products, as in Stardew.
- Villagers: no friendship decay at all (decided 2026-10-27). Skipping days
  never costs a heart. This departs from Stardew Valley on purpose, because
  reader 1 listed angry people as a chore.
- Animals: follow Stardew. Unfed, unpetted or out-at-night animals lose
  friendship and mood, which lowers the quality of their products. Nothing
  else happens to them.
- Crops wait without spoiling and animals cope for a few days of absence (see
  the absence rules in `01_system_map.md`).

## Open questions

- The exact mapping of the five bundles to unlocks (#21).
- How to phase the cast toward the long-term size.
- Marriage: the open questions in `12_marriage.md`.
- Which seasons the hat parade and cake day fall in, and the rest of the
  calendar.
- The wizard, dwarf and elf groups: how many, and what sets each apart.
- The crossroads town's full building list.
- The shadow in ring 3 (issue #5, what centre 3 is).
- Whether any of this needs an ADR once settled.
