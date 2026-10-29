# 21 Fishing

Status: **decided with the owner on 2026-10-29** (catch form, skill, rods,
what decides a bite, traps, roster size, quality; the first round of open
questions was settled the same day). Numbers are placeholders.
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
   shifts the mix of fish toward a kind or a rarity. Names, prices and the
   number of rods are open.
6. **What decides a bite:** the water body, the season, the time of day and the
   weather. Weather ties to the forecast already in the game.
7. **Fish quality is the Stardew way, in our own numbers.** A hidden size roll
   from fishing level, fish type and cast distance sets normal, silver or gold
   (Stardew's cut-offs are a third and two thirds of the roll; ours are
   tuning numbers). A **perfect catch** (the fish never
   leaves the zone) lifts silver or gold by one grade. There is no iridium
   tier. This is an extension of the crop and forage roll in
   `src/core/quality.ts`.
8. **Roster: about 45 fish** in ring 1, sketched below. Each needs an icon and
   a bar motion.
9. **Traps (bundle 18): a passive way to fish, for shellfish only, and
   optional.** A pot at the water gives crabs and the like the next day, never
   fish. Fresh and salt water pots. Nothing requires a pot: every pot catch can
   also be had another way (see the rare shellfish below).
10. **Fish uses:** sold in the shop, cooked into dishes, and given as gifts.
    Some villagers like or dislike fish (a liked-gift list per villager).
11. **The Water room keeps all six bundles** (13 to 18). The N-of-M rules give
    choice of fish.
12. **The cove is for the rarest fish.** The Lake cove holds the rarest
    ordinary fish and the one legend. It opens only when the Water room is done.
    No Water room bundle needs cove fish, including the legend.
13. **One legend fish, caught under a set condition**: the cove, one season,
    dusk, rain, and the top rod. The forecast shows the rain, so it can be
    planned for, and it can be caught again each year for a small reward. It is
    a post-room goal and is not in a bundle.
14. **Assist has two levels.** The first is a bigger bar and calmer fish. The
    second skips the fight. A skipped fight gives a normal-grade catch from the
    size roll and no perfect bonus, and gold stays reachable through the level
    roll, so no setting locks a player out.
15. **Professions are deferred.** The skill ships with levels and quality. The
    pair for level 5 is chosen later, in the pattern of `professions.ts`.
16. **A fifth tool tier** is wanted for all tools, above gold, in the way
    Stardew has iridium. Decided on 2026-10-29: it is made from **a rare metal
    from the deepest mine levels**, with our own name (not iridium, ADR 0002).
    The rod is not part of it, since the rod has its own line. This reaches
    beyond fishing: it needs the mines note, `07_tuning_numbers.md` (tool
    upgrades) and `src/core/upgrades.ts`, and it is tracked as #194.

## The waters

| Water | Open | Sketch of the fish | Placeholder count |
| --- | --- | --- | --- |
| River (Mountain, Hearthwell, delta) | From the start | Stream fish, bundle 13 | 8 |
| Forest lake | From the start | Lake fish, bundle 14 | 6 |
| Mountain lake | From the start | Lake fish, bundle 14 | 6 |
| Delta marsh lake | From the start | Lake fish, bundle 14 | 6 |
| Sea (Beach) | From the start | Sea fish, bundle 15; night fish | 9 |
| Lake cove | Water room reward | The rarest ordinary fish and the legend | 8 |

Total 43 fish plus the legend: about 45. Night fish for bundle 16 are drawn
from the sea and the lakes. Crab pot catches are separate and are not counted.

## Draft roster (placeholder names, 2026-10-29)

A first draft for the owner to edit. All names are placeholders of our own, and
none are taken from Stardew. Season names follow the calendar, and the first
playable has two seasons, so fish in other seasons wait. Rarity is common,
uncommon or rare. Time is dawn, day, dusk, night, or any. Bundle numbers show
which bundle a fish can fill (`16_bundles.md`).

### River (8)

| Fish | Season | Time | Rarity | Bundle |
| --- | --- | --- | --- | --- |
| Reedling | All | Day | Common | 13 |
| Brookslip | Spring | Day | Common | 13 |
| Millrun | Summer | Day | Common | 13 |
| Ferrywhisker | Autumn | Any | Uncommon | 13 |
| Hearthside Dace | All | Dusk | Uncommon | 13 |
| Tallow Eel | Winter | Night | Uncommon | 16 |
| Silverthread | All | Dawn | Rare | 17 (stream) |
| Old Mossback | Autumn | Rain | Rare | spare |

### Forest lake (6)

| Fish | Season | Time | Rarity | Bundle |
| --- | --- | --- | --- | --- |
| Pondling | All | Day | Common | 14 |
| Hollow Perch | Spring | Day | Common | spare |
| Fernfin | Summer | Day | Uncommon | spare |
| Mushroom Loach | Autumn | Dusk | Uncommon | spare |
| Moonmirror | All | Night | Uncommon | 16 |
| Hermit Trout | All | Rain | Rare | 17 (lake) |

### Mountain lake (6)

| Fish | Season | Time | Rarity | Bundle |
| --- | --- | --- | --- | --- |
| Cold Quill | All | Day | Common | 14 |
| Snowmelt Char | Winter, Spring | Day | Common | spare |
| Granite Gudgeon | All | Any | Uncommon | spare |
| Echo Pike | All | Rain | Uncommon | spare |
| Ember Trout | Summer | Dusk | Uncommon | spare |
| Glacier Ghost | Winter | Night | Rare | spare |

### Delta marsh lake (6)

| Fish | Season | Time | Rarity | Bundle |
| --- | --- | --- | --- | --- |
| Marshlight | All | Day | Common | 14 |
| Bogwhisker | Spring, Summer | Day | Common | spare |
| Sunk Boot Loach | All | Any | Common | spare |
| Reed Cat | All | Night | Uncommon | spare |
| Mirelurker | All | Rain | Uncommon | spare |
| Glassy Elver | Spring | Dawn | Rare | spare |

### Sea, at the Beach (9)

| Fish | Season | Time | Rarity | Bundle |
| --- | --- | --- | --- | --- |
| Tidepenny | All | Day | Common | 15 |
| Skiff Sprat | All | Day | Common | 15 |
| Saltbeard | Summer, Autumn | Day | Common | 15 |
| Dune Mullet | Spring | Dawn | Common | 15 |
| Kelp Ribbon | All | Dusk | Uncommon | 15 |
| Harbour Ray | Summer | Any | Uncommon | 15 |
| Pale Moonfish | All | Night | Uncommon | 16 |
| Lantern Squid | Autumn, Winter | Night | Uncommon | 16 |
| Crowned Tunny | Summer | Day | Rare | 17 (sea) |

### Lake cove, after the Water room (8, plus the legend)

| Fish | Season | Time | Rarity | Bundle |
| --- | --- | --- | --- | --- |
| Pearlback | All | Day | Uncommon | none |
| Cove Lantern | All | Night | Uncommon | none |
| Still-water Gar | Spring, Summer | Day | Uncommon | none |
| Velvet Koi | Autumn | Dusk | Rare | none |
| Hush | All | Dawn | Rare | none |
| Dusk Opal | All | Dusk | Rare | none |
| Deepglow | Winter | Night | Rare | none |
| Shell Ghost | All | Rain | Rare | none |
| The legend (unnamed) | One season | Dusk, rain | Legend | none (top rod) |

### What the draft covers

- Bundle 13 has five stream fish, 14 has four lake fish, 15 has six sea fish
  and 16 has four night fish, so every N-of-M rule has exactly its M. Add a
  spare or two per bundle if the rules should leave a choice of fish.
- Bundle 17 takes Silverthread, Hermit Trout and Crowned Tunny, plus the rare
  shellfish.
- The Catch (28) needs a gold fish of the stream, lake, sea and night kinds.
  Any fish in those groups counts, and gold stays reachable through the level
  roll on assist.
- No Water room bundle uses a cove fish.

## Changes to bundle 17 (Specialty Fish)

Bundle 17 was "one rare fish each from stream, lake and sea, plus one legend".
The legend lives in the cove, and the cove opens only after the Water room, so
the legend cannot be in the room's own bundle. It is now **one rare fish each
from stream, lake and sea, plus one rare shellfish**, such as a giant crab,
decided 2026-10-29. Pots are optional, so the shellfish can also be caught on
the rod, at low odds, in the sea. Reward unchanged: 5 fish dishes.

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

- Rod names, prices and how many, and the bait and lure types.
- Owner edits to the draft roster, and a spare fish or two per bundle.
- The legend's name and reward.
- The rare shellfish's name and its rod odds.
- Fishing professions (deferred).
- The fifth tool tier: its metal's name, the mine depth, the price and which
  tools use it.
