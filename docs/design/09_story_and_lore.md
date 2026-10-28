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
- Reveal (decided 2026-10-27): the Dawn Carriers are not mentioned in ring 1.
  At the start of ring 2 they reveal themselves to the player, and one of them
  helps the player reach the elves. Before then they are only ordinary
  couriers. Changed 2026-10-28 for their leader only: she appears early and is
  revealed bit by bit (see the warden head under Other peoples). The group
  stays unnamed and unexplained in ring 1.

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
- Method (decided 2026-10-27): his power and his story fade together. In the
  old days he was a known terror. Since then the truth has slipped from memory
  to story, from story to myth, from myth to a whisper, and in ring 1 to
  nothing at all. Nobody in the valley remembers him, and the game does not
  mention him there. His distinctiveness is that he is almost forgotten, and
  that forgetting is part of how he survives. Only the Dawn Carriers still
  remember. The owner described him as like Sauron in many ways. That is
  shorthand for the feel only. Under ADR 0003 his image and method stay our
  own (see the off limits list above).

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

- Ring 2 opens when the last room of the hall is finished (decided 2026-10-28):
  that room mends the bridge, with one gate and no second room behind it. It is
  the hardest and latest thing in ring 1. Individual regions are then gated by
  their own tool or bridge upgrade. See `16_bundles.md`.
- Ring 2 regions (decided 2026-10-27): all four kinds are wanted, with about
  two reachable first. An elven woodland haven (where the relative retired), a
  mountain pass (dwarves, ore, mushrooms), a river marsh and a coast or lake.
  Which two come first, and how each is gated, is for the ring 2 design (#20).
- Ring 3 stays behind centre 2, optional and late.
- The last room opens the road by mending the old bridge. This ties to the
  bridge-upgrade gating and is easy to read on the map. Its last bundle, The
  Long Road, gives a letter to the elves from Old Greencoat.
- Bundles (decided 2026-10-27): each bundle unlocks one thing. Stonekeeper
  dwarves relate to the bridges and smith dwarves to the tools. The mapping to
  unlocks is now set per room (decided 2026-10-28): see `16_bundles.md`.
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
  Ring 1 does not mention him at all, even as a whisper (see the Method note
  above). The player's real awareness of Surt begins only when ring 2 opens.
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
- Type (decided 2026-10-27): in plain words the Brimmers are halflings, in the
  way that other peoples are elves or dwarves (see Other peoples). Brimmers
  stays their own name. The type word is general fantasy, but the traits above
  are what make them ours, so keep them (hats, ledgers, long ears, no hobbit
  habits).
- Small, with long ears that poke through or around the hats. This keeps them
  clearly apart from hobbits.

Naming style: mixed by place. Plain, cozy names in the valley, odder ones in
the crossroads town, strange ones in ring 2 and beyond.

## Other peoples

General fantasy types, written our own way. They can use the plain words
(wizard, dwarf, elf), with our own traits for each group so that two groups of
the same kind are not alike.

- The hermit is a witch (decided 2026-10-28; she was a wizard before). A
  witch-like figure living in the woods. An absent-minded hermit who forgets
  things and gives odd requests. She does not know Oriel (decided 2026-10-27).
  The Wanderer, below, is the one who knows the relative.
  Role (decided 2026-10-27): mainly a teacher of the old customs. She explains
  why the Brimmers keep hats and ledgers, so the lore reaches the player in
  character. Secondarily, odd requests and rare items. The gentle push toward
  ring 2 belongs to the Wanderer, not to her (decided 2026-10-27). The
  game is mostly about play, and no villager pushes the player into a story
  line.
  Fairy rings (decided 2026-10-28; first called obelisks, in the way of the
  Wizard's Tower in Stardew Valley, then changed so the idea is our own). She
  teaches the player to grow rings of toadstools on the farm. Each ring
  carries the player to a matching ring far away. The player pays for them
  with rare items, many of them the ones her odd requests bring in, and each
  is built from something local: mountain stone, beach shells, elf-garden
  moss.
  There are four, set on the farm (decided 2026-10-28): mountain (the
  dwarves' mountains), beach, island (warps to the elf part of ring 2) and one
  for ring 3. The ring 3 one has no destination until ring 3 is designed. The
  Hearth's carts already link farm, hall, town and mines (`16_bundles.md`), so
  those need no ring. A fifth is held open: if ring 2 has another region
  beyond the elves (#20), it is the natural fifth. Her home is in the woods;
  the look is open.
  Getting back (decided 2026-10-28): rings only go out from the farm, as
  Stardew Valley's obelisks do. The way home is a consumable warp totem to
  the farm, and a permanent version that a one-off seller offers, in the way
  Krobus sells the Return Scepter.
  The permanent item (decided 2026-10-28): a homecoming pin, a brooch or
  feather. It is not a hat, because hats are a feature (hat standing), and
  changing hats to go home would be awkward. It is an inventory item that
  takes a slot, like Stardew Valley's Return Scepter, so the player can select
  it on the toolbar and use it. It could double as a ledger stamp. The name is
  ours and still open: "pin" is a working name, and the Stardew name must not
  be used (see `docs/decisions/0002-stardew-valley-inspired.md`). Who sells it
  is open. Candidates: the warden head (couriers and travel), the hermit, or
  an odd one-off of the road. Other ideas from the same talk, in case the pin
  is dropped: a hearth lantern, a latchkey, a farm bell, a homing pigeon.
  None of this is needed for the first playable.
  Manner (decided 2026-10-27): the owner likened her to Radagast, a gentle,
  scatty woodland hermit at home with animals and plants. Shorthand for feel
  only; her name, look and habits must be our own (ADR 0003). The pencil
  drawing of a witch in `15_character_art.md` is the starting look.
- The Wanderer (decided 2026-10-27; the earlier text called him "a second
  wizard"). The Wanderer and Old Greencoat are one character: the notes say
  "the Wanderer", and valley folk say "Old Greencoat" (see Name and look
  below). He is a wandering wizard who acts as a guide
  between the rings. The owner likened this one to Gandalf. This is the figure
  most at risk of reading as Tolkien's, so he needs our own name, look, voice
  and method, and no staff-and-grey-cloak shorthand. His name, appearance and
  what he does for the player are open. Keep him light too: a guide, not a
  quest giver who pushes the player.
  Kind (decided 2026-10-27): a storytelling wizard who also carries goods,
  mostly herbs and seeds. He keeps the old stories alive, which suits the
  fading from memory to myth (see the dark lord's method), and his seeds tie
  to the farm. Role (decided 2026-10-27): he opens each road in a small way,
  and he also helps the player connect with the character. His part grows with
  the rings: a little in ring 1, more in ring 2 and more again in ring 3.
  "The character" is the player character (decided 2026-10-27): he gets to
  know the player over time, more than a trader would. He also knows Oriel
  well (decided 2026-10-27), so he can tell stories about the relative. That
  gives the player a gentle way to learn who Oriel was. He is also the one who
  knows where Oriel went (decided 2026-10-27), so he, not the hermit, can
  give the light, optional push toward ring 2 when the player is ready.
  Name and look (decided 2026-10-27): valley folk call him "Old Greencoat",
  and his true name changes with the people and place, with old names to be
  written for the other rings. Ring 1 does not talk about his age, since he is
  much older than people and that stays in the background. Look: tall and lean
  with a bushy beard, a green coat and a wide-brimmed hat. No special props
  are needed, since little of this shows in game. Keep his names tied to what
  he did for each people, not a puzzle of names to collect, so he does not
  read as Tolkien's Gandalf (ADR 0003).
- The hermit's quirk (decided 2026-10-27): she talks to the animals and mixes
  them up.
- The warden head, a Qi-type figure (decided 2026-10-28): the leader of the
  couriers, who are the secret wardens (see The crossroads town). She is a
  third person, not the Wanderer, whose part is a light guide. The owner wants
  one character with a long story arc who gives optional challenges, in the way
  of Qi in Stardew Valley, and likened her to Aragorn. Aragorn is shorthand for
  feel only: a quiet leader who has walked the road a long time and carries
  more than she shows. Her name, look, voice and method must be our own (ADR
  0003), so no ranger's cloak, no hidden crown and no sword-reforged plot. This
  keeps to the rule that the wardens must not read as Tolkien's Rangers. She
  appears early and is revealed over time (decided 2026-10-28), as Qi is in
  Stardew Valley: mysterious first, then a little more each stage. Everything
  she offers is optional. Her arc is the long one: the wardens, the Dawn
  Carriers and what is left of the dark lord's story. Her name, look and what
  she asks are open. Her gender is not fixed. She is written as a woman for now, to
  match the cast balance below, and the owner can change it.
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
  One people, several houses (decided 2026-10-27): the elves are one people
  split into houses, in the way of Tolkien's elves. The number of houses is
  not fixed. It is settled when rings 2 and 3 are designed. Each house needs
  its own traits and names, so two houses are not alike.
- Tall road-folk, stout craftspeople, fey wanderers and odd one-offs also pass
  through the crossroads town.
- The valley village is mostly the hatted folk.

### The warden head's reveal (proposed 2026-10-28)

Stages, each optional and each only adding to what the player knows. The
timings are placeholders, to be tuned against the seasons we have.

1. Ring 1, first year: a courier at the carrier post in Hearthwell who is a
   little too watchful. She says little and gives no name. Her only offer is
   a small, odd errand now and then. Nothing marks her as a warden.
2. Ring 1, later: a mystery-note thread. Short notes arrive in the farm
   mailbox, signed with a mark and not a name, with small gifts or odd asks
   (a favour for the road, a lost parcel). Following them leads back to her.
   She gives a name that is plainly an alias. No mention of the Dawn Carriers
   yet, and no dark lord (ring 1 has no whispers of him).
3. Start of ring 2: the Dawn Carriers reveal themselves, and she is shown to
   be their head. Her real name is given and the aliases make sense. Her
   optional challenges open here.
4. Ring 2 onward: her past and her tie to the old story, a little at a time.
5. Ring 3: the long arc closes, in step with the ending.

Tone: no scares and no pressure. A note unread or an errand skipped costs
nothing and she never mentions it (see Neglect).

## Cast balance

The owner wants more women in the cast (2026-10-28). Rule of thumb for new
named characters: lean female until the cast is roughly even, and do not
change a role to fit a number. The state so far:

| Character | Gender | Note |
| --- | --- | --- |
| The hermit | Female | Changed from a wizard to a witch on 2026-10-28 |
| The Wanderer (Old Greencoat) | Male | Set, with a look (green coat, beard) |
| The warden head | Female (for now) | Leader of the couriers, Qi-type, Aragorn-like |

Open slots. The gender column is a suggestion (proposed 2026-10-28), not a
decision. With these, the named cast is about six women and five men, plus the
mixed groups.

| Slot | Where | Suggested gender |
| --- | --- | --- |
| Smithy and mender (stout craftsperson, tool upgrades) | Hearthwell | Female |
| Inn and kitchen keeper | Hearthwell | Male |
| General store and carrier post keeper | Hearthwell | Female |
| Healer | Hearthwell | Female |
| Librarian | Hearthwell | Male |
| Smith dwarf (tools and lamps) | Mountains | Female |
| Stonekeeper dwarf (bridges and stonework) | Mountains | Male |
| Elf house heads (the number is not fixed) | Ring 2 | Mixed |
| Valley Brimmers (the hatted folk) | Valley | Mixed, no list yet |
| Other couriers (the Dawn Carriers) | The road | Mixed |
| Marriage candidates | Rings 1 to 3 | Open, see `12_marriage.md` |

Two gaps need an owner decision. The valley village has no named list (#136),
and it is where most marriage candidates will come from. The number of
candidates is open, and `12_marriage.md` leaves their pairings to the cast
writing.

Fill the open slots with the balance in mind when they are named.

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
- Calendar proposed 2026-10-27 in `14_festival_calendar.md`: Hat Parade spring
  day 10, Cake Day summer day 8, and two placeholder festivals.

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
- Final names for the two placeholder festivals (`14_festival_calendar.md`).
- The number of elf houses, and what sets each apart (settled with rings 2 and
  3). The dwarf groups are decided above.
- The Wanderer's true name, what he gives at each road, and how he differs
  from Tolkien's Gandalf.
- The hermit witch's name, look and tower, what the fairy rings cost and what makes them look different from each other, and
  how she differs from Radagast.
- The warden head: her name and look, what she asks of the player, how late
  she appears, and whether she should be a woman.
- Who fills the open named slots in the cast balance table.
- The crossroads town's full building list.
- The shadow in ring 3 (issue #5, what centre 3 is).
- Whether any of this needs an ADR once settled.
