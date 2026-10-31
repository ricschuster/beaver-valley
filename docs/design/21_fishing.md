# 21 Fishing

Status: **decided with the owner on 2026-10-29** (catch form, skill, rods,
what decides a bite, traps, roster size, quality; the first round of open
questions was settled the same day). On 2026-10-31 the Stardew Fish, Fishing,
Crab Pot, Recycling Machine, Fish Pond and Skills pages were read (reference
only, ADR 0002) and the differences were settled with the owner; see "Catch
details and Stardew differences". Numbers are placeholders.
The open items at the end are not decided. It answers the design half of
issue #181. Nothing here is built.

## Why

The Water room has six fishing bundles, and The Catch (bundle 28) needs it too
(`16_bundles.md`). The owner dislikes Stardew's fishing, and it draws the most
complaints in that game (`17_call_feedback_2026-10-28.md`). This note keeps a
catch minigame but softens it, and gives players who dislike it a way through.

## What players say (searched 2026-10-29)

Anecdotal, from forums and press, not a survey.

- The bar is called stressful and repetitive. Big fish escape at a small slip.
- The creator says it is controversial, he thinks it is fun, and the early
  bar is too hard.
- Players are split. Some call fishing minigames the worst part of any game.
- Touch: one player argues fingers cover the bar on a tablet. Not measured.
- A few games offer a casual mode beside the minigame.

## Decided

1. **Catch form: a softened Stardew-style bar.** Cast, wait for a bite, then
   keep a marker on the fish in a zone until a meter fills. Fish can get away,
   and a lost fish costs only the wait.
2. **Soft by design.** The bar starts wide enough for a new player, and rods
   only widen it, so the early game is not the hard part. An **assist toggle in
   the options** gives a larger bar and calmer fish.
3. **Cast distance.** Hold and release sets how far out the line lands. Farther
   water is harder to reach and gives bigger fish. The assist setting fixes a
   middle distance.
4. **A third skill: fishing**, beside farming and foraging. Levels raise the
   size roll and unlock rod tiers. Professions follow the shape of the other
   skills (`professions.ts`).
5. **Rod, bait and lure each change the odds.** The rod has its own line, in
   our own names, like Stardew's separate rods and not the shared tool tiers:
   a cheap starter rod with a very wide bar that catches only common fish, then
   mid rods, then a top rod. Each widens the bar and the cast range. Bait
   shortens the wait and is spent per cast, whether or not a fish bites. A lure
   shifts the mix of fish toward a kind or a rarity. The set is four rods,
   three baits and seven lures (see "Rods, bait and lures").
6. **What decides a bite:** the water body, the season, the time of day and the
   weather. Weather ties to the forecast already in the game.
7. **Fish quality is the Stardew way, in our own numbers.** A hidden size roll
   from fishing level, fish type and cast distance sets normal, silver or gold
   (Stardew's cut-offs are a third and two thirds of the roll; ours are
   tuning numbers). A **perfect catch** (the fish never
   leaves the zone) lifts silver or gold by one grade. There is no iridium
   tier. This is an extension of the crop and forage roll in
   `src/core/quality.ts`.
8. **Roster: 46 fish** in ring 1, sketched below. Each needs an icon and
   a bar motion. The motion and difficulty are in the roster tables.
9. **Traps (bundle 18): a passive way to fish, for shellfish only, and
   optional.** A pot at the water gives crabs and the like the next day, never
   fish. Fresh and salt water pots. Nothing requires a pot: every pot catch can
   also be had another way (see the rare shellfish below).
10. **Fish uses:** sold in the shop, cooked into dishes, and given as gifts.
    Some villagers like or dislike fish (a liked-gift list per villager).
11. **The Water room keeps all six bundles** (13 to 18). The N-of-M rules give
    choice of fish.
12. **The cove is for the rarest fish.** The Lake cove holds the rarest
    ordinary fish and the legends. It opens only when the Water room is done.
    No Water room bundle needs cove fish, including the legend.
13. **The first legend is the Hearthwell Carp** (decided 2026-10-29): an
    enormous carp of the same kind as the common Carp, caught in the cove in
    **autumn**, at **dusk in rain**, with the top rod. The forecast shows the
    rain, so it can be planned for. **The reward is the fish itself**: it is very
    valuable to sell, cook or keep, and it can be caught again each year. It is
    a post-room goal and is not in a bundle.
13a. **Four more legends follow once the fishing bundles are done** (13 to
    18), in the Stardew way, five in all. The Hearthwell Carp is the only cove
    legend. Each of the others has its own water, season, time and weather, and
    each is worth a lot. See "The legends" below. Every legend counts toward
    the completion tracker.
13b. **Completion tracker (to design, #196).** All fish, the legends included, count
    toward a Perfection-style total for the whole game. Other things will count
    too (bundles, skills, collections), so this is a game-wide system and not a
    fishing rule. It needs its own design note before anything is built.
14. **Assist has two levels.** The first is a bigger bar and calmer fish. The
    second skips the fight. A skipped fight gives a normal-grade catch from the
    size roll and no perfect bonus, and gold stays reachable through the level
    roll, so no setting locks a player out.
15. **Professions follow Stardew's tree** (decided 2026-10-31, replaces the
    earlier deferral). See "Professions".
16. **A fifth tool tier** is wanted for all tools, above gold, in the way
    Stardew has iridium. Decided on 2026-10-29: it is made from **a rare metal
    from the deepest mine levels**, with our own name (not iridium, ADR 0002).
    The rod is not part of it, since the rod has its own line. This reaches
    beyond fishing: it needs the mines note, `07_tuning_numbers.md` (tool
    upgrades) and `src/core/upgrades.ts`, and it is tracked as #194.

## The waters

| Water | Open | Sketch of the fish | Count |
| --- | --- | --- | --- |
| River (Mountain, Hearthwell, delta) | From the start | Stream fish, bundle 13 | 9 |
| Forest lake | From the start | Lake fish, bundle 14 | 6 |
| Mountain lake | From the start | Lake fish, bundle 14 | 6 |
| Delta marsh lake | From the start | Lake fish, bundle 14; night fish | 7 |
| Sea (Beach) | From the start | Sea fish, bundle 15; night fish | 10 |
| Lake cove | Water room reward | The rarest ordinary fish and the legend | 8 |

Total 46 fish plus the legend. Night fish for bundle 16 are drawn from the sea
and the lakes. Crab pot catches are separate and are not counted.

## Draft roster (2026-10-29, edited with the owner)

Names are a mix on purpose: real, well-known fish for the common ones (Carp,
Salmon, Cod) and our own funny or whimsical names for the rest. None are taken
from Stardew. All four seasons are planned for. Rarity is common, uncommon or
rare. Time is dawn, day, dusk, night, rain, or any. Bundle numbers show which
bundle a fish can fill (`16_bundles.md`).

### River (9)

| Fish | Season | Time | Rarity | Bundle | Bar |
| --- | --- | --- | --- | --- | --- |
| Reedling | All | Day | Common | 13 | mixed 25 |
| Brookslip | Spring | Day | Common | 13 | dart 20 |
| Millrun | Summer | Day | Common | 13 | mixed 30 |
| Ferrywhisker | Autumn | Any | Uncommon | 13 | sinker 40 |
| Salmon | Autumn | Day | Uncommon | 13 | mixed 50 |
| Hearthside Dace | All | Dusk | Uncommon | 13 | dart 40 |
| Tallow Eel | Winter | Night | Uncommon | 13, 16 | sinker 45 |
| Silverthread | All | Dawn | Rare | 17 (stream) | dart 70 |
| Old Mossback | Autumn | Rain | Rare | spare | sinker 60 |

### Forest lake (6)

| Fish | Season | Time | Rarity | Bundle | Bar |
| --- | --- | --- | --- | --- | --- |
| Carp | All | Day | Common | 14 | smooth 15 |
| Perch | Spring | Day | Common | spare | mixed 25 |
| Fernfin | Summer | Day | Uncommon | 14 | mixed 40 |
| Mushroom Loach | Autumn | Dusk | Uncommon | spare | sinker 40 |
| Moonmirror | All | Night | Uncommon | 16 | smooth 45 |
| Hermit Trout | All | Rain | Rare | 17 (lake) | mixed 65 |

### Mountain lake (6)

| Fish | Season | Time | Rarity | Bundle | Bar |
| --- | --- | --- | --- | --- | --- |
| Cold Quill | All | Day | Common | 14 | dart 25 |
| Arctic Char | Winter, Spring | Day | Common | 14 | mixed 30 |
| Granite Gudgeon | All | Any | Uncommon | spare | sinker 40 |
| Echo Pike | All | Rain | Uncommon | spare | dart 50 |
| Ember Trout | Summer | Dusk | Uncommon | spare | mixed 45 |
| Glacier Ghost | Winter | Night | Rare | 16 | floater 75 |

### Delta marsh lake (7)

| Fish | Season | Time | Rarity | Bundle | Bar |
| --- | --- | --- | --- | --- | --- |
| Marshlight | All | Day | Common | 14 | smooth 20 |
| Bogwhisker | Spring, Summer | Day | Common | 14 | dart 25 |
| Sunk Boot Loach | All | Any | Common | spare | sinker 20 |
| Reed Cat | All | Night | Uncommon | 16 | sinker 45 |
| Catfish | All | Dusk | Uncommon | spare | sinker 40 |
| Bullhead | All | Rain | Uncommon | spare | sinker 40 |
| Glassy Elver | Spring | Dawn | Rare | spare | dart 75 |

### Sea, at the Beach (10)

| Fish | Season | Time | Rarity | Bundle | Bar |
| --- | --- | --- | --- | --- | --- |
| Sardine | All | Day | Common | 15 | dart 30 |
| Skiff Sprat | All | Day | Common | 15 | dart 25 |
| Mackerel | Summer, Autumn | Day | Common | 15 | smooth 30 |
| Mullet | Spring | Dawn | Common | 15 | mixed 30 |
| Cod | Winter | Day | Common | 15 | mixed 35 |
| Kelp Ribbon | All | Dusk | Uncommon | 15 | floater 45 |
| Harbour Ray | Summer | Any | Uncommon | 15 | floater 50 |
| Herring | All | Night | Uncommon | 16 | smooth 40 |
| Lantern Squid | Autumn, Winter | Night | Uncommon | 16 | floater 55 |
| Crowned Tunny | Summer, Autumn | Day | Rare | 17 (sea) | smooth 70 |

### Lake cove, after the Water room (8, plus the legend)

| Fish | Season | Time | Rarity | Bundle | Bar |
| --- | --- | --- | --- | --- | --- |
| Pearlback | All | Day | Uncommon | none | smooth 40 |
| Cove Lantern | All | Night | Uncommon | none | floater 50 |
| Still-water Gar | Spring, Summer | Day | Uncommon | none | sinker 45 |
| Velvet Koi | Autumn | Dusk | Rare | none | smooth 65 |
| Hush | All | Dawn | Rare | none | dart 70 |
| Dusk Opal | All | Dusk | Rare | none | mixed 65 |
| Deepglow | Winter | Night | Rare | none | floater 75 |
| Shell Ghost | All | Rain | Rare | none | sinker 70 |
| The Hearthwell Carp | Autumn | Dusk, rain | Legend | none (top rod) | smooth 95 |

### What the roster covers

- Bundle 13 has seven eligible fish for 3 of 5, 14 has six for 3 of 4, 15 has
  seven for 4 of 6 and 16 has six for 3 of 4, so every rule leaves a choice.
- No season blocks a bundle. In the worst season there are still enough fish:
  13 has three in winter, 14 has four in winter, 15 has four in winter and 16
  has three in spring.
- Bundle 17 takes Silverthread, Hermit Trout and Crowned Tunny (confirmed by the
  owner, 2026-10-29), plus the rare
  shellfish. Crowned Tunny runs Summer and Autumn.
- The Catch (28) needs a gold fish of the stream, lake, sea and night kinds.
  Any fish in those groups counts, and gold stays reachable through the level
  roll on assist.
- No Water room bundle uses a cove fish.
- Rarity mix: 15 common, 20 uncommon, 11 rare.

## The legends (decided 2026-10-29, conditions are placeholders)

Five in all. The first is open once the Water room is done (it needs the cove).
The other four open after the fishing bundles (13 to 18) are done. Each is worth
a lot as the fish itself, and can be caught again each year.

| Legend | Water | Season | Time and weather | Idea | Bar |
| --- | --- | --- | --- | --- | --- |
| The Hearthwell Carp | Cove | Autumn | Dusk, rain | An enormous carp. | smooth 95 |
| Grandmother Hush | Forest lake | Spring | Dusk, rain | A huge old fish, kin to the cove's Hush. | dart 100 |
| The Valley King | River | Autumn | Dawn, rain | The king of the river. | mixed 100 |
| Moonlit Mother | Mountain lake | Winter | Night, clear | A pale giant char. | sinker 100 |
| Great Hearthfin | Sea | Summer | Day, any weather | A huge sea fish, the easy one with no weather. | floater 85 |

The seasons are spread (decided 2026-10-29): spring Grandmother Hush, summer
Great Hearthfin, autumn the Valley King and the Hearthwell Carp (different
waters, dawn and dusk), winter Moonlit Mother. The delta marsh lake has no
legend. Times, weather and prices stay placeholders.

## The rare shellfish

The **Pearl Lobster** (decided 2026-10-29) fills the shellfish slot of bundle 17.
It is a rare lobster that carries a small pearl. It is caught in the sea in any
season and at any time, so no season blocks the bundle. A rod catches it at low
odds (placeholder: about 3 in 100 sea bites), and a salt water pot catches it
more often (placeholder: about 1 in 5 a day). A pot is never required. The odds
are in `07_tuning_numbers.md`.

## Shellfish pots (decided 2026-10-29, numbers placeholders)

A pot sits on a fishable water tile and gives one shellfish catch each morning.
It takes no bait, has no season gate, and gives shellfish only, never fish.
Fresh water pots go on rivers and lakes (the cove included). Salt water pots go
on the sea at the Beach. The shop price is 150g, and bundle 18 gives three.

**Eight catches, four per water**, in a mix of real and our own names. Bundle
18 takes 5 of the 8, and the Pearl Lobster is never required, so seven catches
are always enough.

| Water | Catch | Odds per pot day | Sells |
| --- | --- | --- | --- |
| Fresh | Crayfish | 35 in 100 | 40g |
| Fresh | River Mussel | 35 in 100 | 45g |
| Fresh | Ladle Snail | 20 in 100 | 70g |
| Fresh | Marsh Clam | 10 in 100 | 90g |
| Salt | Crab | 30 in 100 | 60g |
| Salt | Periwinkle | 30 in 100 | 50g |
| Salt | Spiny Shrimp | 20 in 100 | 100g |
| Salt | Pearl Lobster | 20 in 100 | 800g |

- Pot catches take the same quality roll as fish, using the fishing level and
  no cast distance. There is no perfect catch.
- Every pot catch counts toward the completion tracker, as fish do.
- Pot catches also feed cooking and gifts, as fish do (decision 10).

## Changes to bundle 17 (Specialty Fish)

Bundle 17 was "one rare fish each from stream, lake and sea, plus one legend".
The legend lives in the cove, and the cove opens only after the Water room, so
the legend cannot be in the room's own bundle. It is now **one rare fish each
from stream, lake and sea, plus one rare shellfish**, the Pearl Lobster,
decided 2026-10-29. Pots are optional, so the shellfish can also be caught on
the rod, at low odds, in the sea. Reward unchanged: 5 fish dishes.

## Rods, bait and lures (drafted 2026-10-29, all numbers placeholders)

**Four rods**, in our own line and names. A rod sets the bar width, the cast
range and which slots it has. A rod is bought from **the fisher at the River
delta** (decided 2026-10-29), who also sells the bait and the lures. The cast
note lists her as "ferry keeper or fisher" (`20_ring1_cast.md`); she is now the
fisher, and whether she also runs the ferry is left to the cast note.

| Rod | Price | Slots |
| --- | --- | --- |
| Reed Pole | 50g | None |
| Hazel Rod | 400g | Bait |
| Heron Rod | 1500g | Bait, one lure |
| Hearthwell Rod | 4000g | Bait, two lures |

**What gates a fish** (decided 2026-10-29, after Stardew, where rods mostly do
not gate species): the water, season, time and weather, as in decision 6, plus
two gates of our own.

- **Only the starter rod is limited.** The Reed Pole lands common fish only, as
  in decision 5. Every other rod can hook any fish the conditions allow.
- **Rare fish need fishing level 5.** Below that a rare bite is lost. This is
  what stops a rich new player from buying a better rod and skipping the skill.
- **Legends need the Hearthwell Rod** (decision 13), and the cove is open only
  after the Water room. There is no extra level gate.

Notes:

- The Reed Pole is cheap enough to buy on day one out of the 500g start. The
  Hazel Rod is the real first upgrade, since it adds the bait slot.
- Bundle 17 needs rare fish, so fishing level 5 is the gate to finish the Water
  room. Check this against the pacing target.
- **Pacing check for level 5** (rough). Level 5 is 2150 XP on the shared curve.
  A 60g common fish gives 11 XP and a 150g uncommon gives 20, before the 1.5
  perfect bonus. So level 5 is about 100 uncommon catches or 190 common ones,
  which is roughly 15 to 25 days of regular fishing at 8 catches a day. That
  fits a Water room in the middle of the 1.5 year target, but only a playtest
  will say. It is a tuning number and not a rule.
- Prices follow the tool tiers (2000g, 5000g, 10000g): the top rod is a mid to
  late goal, not the latest one.

**Three baits.** Bait goes in the bait slot, is spent per cast whether or not
a fish bites, and shortens the wait for a bite. It never changes which fish.

| Bait | Price | Wait |
| --- | --- | --- |
| Plain Bait | 3g | Times 0.7 |
| Fine Bait | 12g | Times 0.5 |
| Salted Bait | 8g | Sea only: times 0.5 |

Bundle 13 gives 30 Plain Bait. Pots take no bait.

**Seven lures** (Stardew's tackle idea, in our own names and effects). A lure goes
in a lure slot and lasts 20 casts. Different lures stack on the Hearthwell Rod,
which has two slots. Odds lures change the mix among fish the water, season,
time and weather already allow. They never add an out-of-condition fish and
never lift the starter rod's limit or the level 5 gate for rare fish.

| Lure | Price | Effect |
| --- | --- | --- |
| Glint Lure | 250g | Rare fish are twice as likely |
| Moth Lure | 150g | Night fish are three times as likely |
| Storm Lure | 150g | Rain fish are three times as likely |
| Whirligig | 200g | The wait for a bite is times 0.7, on top of bait |
| Wide Float | 200g | The bar is 15 percent wider |
| Magpie Hook | 300g | One cast in five also brings up a small treasure |
| Sounding Float | 200g | Shows which fish is hooked (see "Catch details") |

- **The Magpie Hook treasure** (decided 2026-10-29): when a treasure comes up
  it is a coin purse about 6 times in 10 and a trinket about 4 times in 10. A
  purse holds `40 + 15 * fishingLevel` gold. A trinket is a sellable, giftable
  curio: Brass Button, Tin Spoon, Glass Bead, Cracked Locket, Ring Box. Trinkets
  sell for 30 to 120g, rarer ones at the high end. The odds and amounts are
  placeholders. Trinkets are plain items for now, with no collection.
- **No double catch** (decided 2026-10-29). The Magpie Hook already adds a
  second kind of reward, and a double catch would muddy quality and the
  completion tracker.
- The Wide Float overlaps with the assist bar. The two add together, so a
  player who needs help can use both. Check this on the tablet.

Bundle 14's reward is one Glint Lure.

**Skill and quality, in numbers.** Fishing uses the same ten levels and XP
curve as the other skills. A catch gives the harvest formula on the fish price,
and a perfect catch gives one and a half times that. The size roll is
`random(0,1) * (0.5 + 0.05 * level) + 0.1 * castDistance` (distance from 0 to
1). Silver is 0.33 or more and gold is 0.67 or more. So a level 0 player never
sees gold, and a level 10 player at full distance gets gold about 43 percent of
the time before the perfect catch lift.

## Catch details and Stardew differences (decided 2026-10-31)

These came from reading the saved Stardew Fish, Fishing, Crab Pot, Recycling
Machine, Fish Pond and Skills pages. Where a rule is Stardew's it says so. The
numbers are placeholders.

**Bar behaviours (Stardew's five, with a difficulty).** Every fish has one of
five motions and a difficulty from 0 to 100, in the roster tables ("Bar"
column). Behaviours:

- **Mixed:** the basic movement.
- **Smooth:** steadier.
- **Sinker:** drops faster.
- **Floater:** rises faster.
- **Dart:** moves more randomly, with a bigger swing as difficulty rises.

Difficulty bands, placeholders: common about 15 to 40, uncommon about 35 to 60,
rare about 55 to 80, legends 85 to 100. Legends are the only deliberately hard
fish. The assist toggle calms every behaviour, and a skipped fight (assist
level 2) ignores them.

**The first catch cannot fail (Stardew's tutorial catch).** The first fish the
player hooks is always a common one, the controls are shown, and the meter does
not drain, so it cannot escape. Every cast counts as the tutorial until one is
caught. If the bite is not a common fish (a legend, a plant, trash), a common
fish is used instead, as in Stardew.

**The catch screen (Stardew).** A catch shows the fish's name and its length,
taken from the hidden size roll. A new longest length shows "New record!", and
the first catch of a species shows "First Catch!". Records and the first catch
show in the collection, and feed the completion tracker (#196). Lengths are our
own ranges per fish, in our own units, set when the fish are put into data.

**Water plants and jellies (Stardew, with our own names).** Rod casts can also
lift a small set of water things with no bar: a few water plants and jellies.
They give fishing XP and feed crafting, cooking and later fish ponds. The set
is open (see "Open"). Jellies and plants never count as fish for the fish
bundles.

**Trash and a recycler (Stardew).**

- Weaker waters (placeholder: the farm pond and the delta marsh lake) give
  trash on some bites, about 15 in 100. The better waters give almost none.
- Trash is hauled in with no bar. Stardew uses the bar for junk too, but a bar
  for a bad result is the stress we are softening. This is our change.
- Trash can be binned or recycled. The recycler is a craftable machine at
  fishing level 4, costing wood, stone and an iron bar (Stardew's list). It
  takes an hour per item and turns trash into stone, coal, iron ore, wood,
  torches or cloth. Our own trash items, and the recycler's output odds, are
  placeholders.
- The recycler is one more machine beyond the eleven in
  `24_processing_and_cooking.md`.

**Which fish is hooked (Stardew).** The bar shows no fish type. The exception
is a legend, which wears a crown in the bar, as in Stardew. The Sounding Float
lure (200g, one lure slot) shows the hooked fish. Players otherwise guess from
the place, season, time and weather.

**Fish ponds later (own note).** Fish ponds are not in the first version. The
pond is a farm building with its own rules, so it gets its own note, with the
carpenter and processing notes. Stardew's pond is 5000g, 5x5, holds one species
and grows its population, gives roe, and has a simplified harvest with no XP.

**Pots give fishing XP (Stardew, proposed).** Each pot harvest gives a small
amount of XP, 5 in Stardew. A harvest counts even when it holds a common catch.

**The Magpie Hook and a perfect catch (Stardew, proposed).** Fetching the
treasure does not break a perfect catch, since the hook already adds a
reward. This follows Stardew's Treasure Hunter tackle.

**Sell prices for ordinary fish (placeholder bands).** Scaled to rarity. Stardew
values for comparison: sardine 40g, bream 45g, salmon 75g, a bass 100g,
pufferfish 200g, using real fish as the anchor.

| Rarity | Sells, placeholder |
| --- | --- |
| Common | 30 to 65g |
| Uncommon | 70 to 150g |
| Rare | 180 to 350g |
| Cove rare | 300 to 500g |
| Legend | 1500g and up |

A fish's own price sits in the band, higher for a harder bar. The exact table
goes in `07_tuning_numbers.md`, not here.

### Professions

Stardew's tree, checked against the Skills page.

- **Level 5:** Fisher (fish sell for 25 percent more) or Trapper (pots are
  cheaper to make).
- **Level 10 under Fisher:** Angler (fish sell for 50 percent more) or Pirate
  (treasure chance doubled, here the Magpie Hook's one in five).
- **Level 10 under Trapper:** Mariner (pots give no junk) or Luremaster (pots
  need no bait).
- **A problem with Trapper.** Our pots never take bait (decision 9) and give
  shellfish only, never trash. So Luremaster and Mariner do nothing. See "Open"
  for the proposed swap.
- Level 10 needs the choice screen for every skill (`24_processing_and_cooking.md`).
- The level 5 and level 10 choices change `professions.ts`, its tests and the
  skills screen.

## Touch and accessibility

- Tap anywhere to lift the marker, as the bar is one input. Check on a real
  tablet whether fingers hide it (the tablet check is already on the list).
- The assist toggle is the main accommodation. A plan to skip the fight
  entirely is open.

## Build slices (when the time comes)

1. Water tiles that can be fished, a rod, the cast and a bite, with a fixed
   fish.
2. The bar, the roster for one water, quality and the fishing skill.
3. More waters, bait and lures, time, season and weather rules.
4. Crab pots, the cove and the legend.

## Open

- Owner review of the drafted rods, baits and lures and the fishing numbers
  (`07_tuning_numbers.md`).
- Owner edits to the draft roster, and a spare fish or two per bundle.
- The Trapper branch. Proposed swap: Mariner makes pots catch the rarer
  shellfish more often, and Luremaster lets a pot be harvested twice in a
  day's visit (a second catch rolls straight away). Alternatively, give our
  pots an optional bait. Needs a decision, and the Stardew behaviours do not
  apply.
- The set of water plants and jellies, our trash items and the recycler's
  output odds.
- The lengths per fish, and the units.
- The exact sell prices of every fish, in `07_tuning_numbers.md`.
- The four new legends: final times, weather and sell prices.
- The completion tracker: what counts, the weights and the reward (a note of its
  own).
- The Pearl Lobster's final rod and pot odds (tuning). At 1 in 5 a pot day with
  three pots it may be too easy to get.
- Tablet check: fingers hiding the bar, and the Wide Float adding to the assist
  bar (needs a real device).
- The Trapper branch needs a swap, because our pots take no bait and give no
  junk (see "Professions").
- The fifth tool tier: its metal's name, the mine depth, the price and which
  tools use it.
