# 24 Processing and cooking (draft)

Status: draft. The machine rules, the kitchen and the recipe count were decided
with the owner on 2026-10-31 (answers to the open questions in the 2026-10-30b
handoff). Machine numbers, dish lists and prices are our draft and are
placeholders. Nothing here is built. Stardew facts were checked against the
saved wiki pages Artisan Goods and Cooking, read only (ADR 0002). No text or
tables are copied, and the dish names below are ours.

## Why

Bundles 11, 12, 23, 25 and 27 already assume machines and cooked dishes
(`16_bundles.md`), and animals, mines and farm types lean on this note for
their goods (`23_animals.md`, `22_mines.md`, `32_farm_types.md`). Processing
turns raw goods into higher value goods over time, and cooking turns them into
food with energy and a buff. This note settles both before any code.

## Decided with the owner (2026-10-31)

- **Machines: the bundle gives the first, then the player can craft more.** The
  hall reward is the first machine and its recipe. More cost materials only, so
  a second keg needs no hall trip. This is how the furnace and the charcoal kiln
  already work (`22_mines.md`).
- **The cask is not in the first version.** It is the first machine to come
  back, for aged wine and cheese, with the farmhouse cellar.
- **The kitchen comes with the first farmhouse upgrade,** as in Stardew. A
  portable cookout kit at foraging level 3 cooks anywhere.
- **Recipe count: as many as Stardew has in total,** and spread across the
  rings. Each of ring 2 and ring 3 brings its own recipes. See "Dishes".

## Earlier recommendations that stand

These came from the 2026-10-30b handoff and were not contradicted:

- Eight machines in the first version, one input and one batch each.
- Most goods ignore ingredient quality and sell for about 2 to 3 times the raw
  item. Cloth is the exception: better wool gives a better chance of 2 cloth.
- Wine is the best use of fruit and jam suits cheap fruit.
- One timed food buff at a time, and a separate drink slot.
- The Artisan profession adds 40 percent to machine goods, except oil and
  coffee. It needs the level 10 farming choice (`23_animals.md`, "Professions").
- Fertilizer is a farming feature and lives in `31_farm_growth.md`.

## Machines

Eight machines. Times are in game hours and placeholders. A machine runs
overnight and while the player is away, and the clock follows the game day
(`07_tuning_numbers.md`). The furnace is in `22_mines.md` and is not repeated.

| Machine | Input | Output | Time | Bundle that gives it |
| --- | --- | --- | --- | --- |
| Preserves jar | Fruit, or vegetable | Jam, or pickles | 3 to 4 days | 10, Quality Crops |
| Keg | Fruit, or vegetable, or grain, or honey | Wine, juice, beer, mead | 1 to 7 days | 12, Artisan Goods |
| Cheese press | Milk, or goat milk | Cheese, or goat cheese | 3 hours | 11, Animal Goods |
| Mayonnaise machine | Egg, or duck egg | Mayonnaise | 3 hours | None yet (see Open) |
| Loom | Wool | Cloth | 4 hours | 21, Weaver's |
| Oil maker | Truffle, or corn, or sunflower | Truffle oil, or oil | 1 hour to 2 days | None yet (see Open) |
| Bee house | None (produces) | Honey, or flower honey | 4 days | 9, Autumn Crops |
| Charcoal kiln | Wood | Coal | 1 hour | 5, Woodland, and 19, Smith's (`22_mines.md`) |

- **One input, one batch.** Put one item in and get one item out, as in Stardew.
  The tablet player never fills a queue.
- **Quality is ignored** for every good except cloth, which uses the wool's
  quality to raise the chance of 2 cloth.
- **Craft recipes** use wood, stone and bars from `22_mines.md`. Costs start near
  Stardew's and are rebalanced to our economy. Bars mean a copper or iron trip,
  so machine crafting follows the mines. The exact lists go in
  `07_tuning_numbers.md`.
- **Bee houses** do not run in winter, and flowers in range change the honey,
  with the reach set at about five tiles. A flower pot also counts.
- **A machine sits where the player puts it,** on the farm, as with any placed
  object. A cask later goes in the cellar (see "Left for later").
- **Selling.** Machine goods sell through the shipping bin and the shop at the
  same price (`28_shipping_bin.md`). The Artisan profession adds its 40 percent
  when the good is made, so the price is fixed then.

### Placeholder prices

Our own rule of thumb, tuned in playtests:

- Jam and pickles sell for about twice the raw item plus a flat sum.
- Wine sells for about three times the fruit. It is the best fruit use.
- Cheese and mayonnaise sell for about two to three times the raw egg or milk.
- Truffle oil sells for far more than a truffle, to make the pig worth its
  price. Oil from corn or sunflower is cheap and mostly an ingredient.
- Honey sells by flower type, with rare flowers worth the most.

## The kitchen

- The first farmhouse upgrade adds a kitchen with a stove and a fridge. The
  stove is the cooking screen. The fridge has 36 slots and counts as part of
  the inventory for any recipe.
- The cookout kit at foraging level 3 lets the player cook in the field, using
  only the pack.
- The player starts with one recipe, a simple fried egg.
- All other recipes must be learned before they can be cooked. A locked recipe
  shows as a silhouette.
- Our house upgrade list is not designed (see `25_stardew_system_review.md`,
  "Farmhouse and upgrades"). This note only needs the first upgrade to exist and
  to carry the kitchen.

## Buffs and eating

- One food buff is active at a time. A new food with a buff replaces the old
  buff. A food with no buff leaves the active buff in place.
- A drink buff is a separate slot and stacks with one food buff.
- Buffs are only for stats we have: farming, foraging, fishing, mining,
  maximum energy and walking speed. No luck, defence, attack or magnetism until
  those exist.
- Eating already exists (M3 early build). Dishes restore energy only. We have no
  health, so there is no health value.
- A cooking-quality item (the equivalent of Qi Seasoning) is not planned.

## Dishes

The owner wants the full Stardew count and a share for every ring, so the
total target is **81 recipes**, the number the saved Cooking page lists. Our
own names, flavour and ingredients apply to every one.

| Ring | Share (placeholder) | Source of ingredients | How they are learned |
| --- | --- | --- | --- |
| 1, the home valley | about 40 | Farm crops, forage, fish, animals, machines | Friendship mail, inn kitchen, skill levels, cookbooks |
| 2, the regions | about 25 | Regional ingredients, new crops and fish | Regional friendship, a regional cookbook per region |
| 3, the dark edge | about 16 | Rare late ingredients | A few cookbooks and late rewards |

- **The 81 includes more than ring 1 can supply.** Some Stardew recipes come
  from a TV chef show or from Ginger Island, and we have neither. Those slots
  go to ring 2 and ring 3 as dishes of our own, not to copies. I did not count
  how many, and the Guidebook is not checked for this.
- **Ring 2 and ring 3 recipes wait for those rings.** Their regions are not
  designed yet. This note reserves the count, and each region note lists its
  dishes. The first build and M3 need ring 1 only.
- **Recipe sources.** The Stardew set is a mix, and ours follows it:
  - Friendship mail from the cast at 3 and 7 hearts (our 5 and 10 steps are
    tuned in the cast notes).
  - A skill level reward, one dish at certain levels of each skill.
  - The inn kitchen, which sells a few dishes (`20_ring1_cast.md`, the inn
    keeper's family).
  - A cookbook, bought or found. No TV show.
  - A bundle reward (bundles 17 and 22 already give dishes).
- **Bundle dishes stay satisfiable in ring 1.** Bundles 22, 24 and 27 ask for
  dishes. Each must be cookable from ring 1 ingredients, or the hall chain
  would be gated on ring 2.
- **A dish list is data,** in a new file under `src/content/`, one record per
  dish: id, ingredients, energy, buff and duration, source, sell price. The
  design lists them in a note once the first 40 are drafted, not in this one.

### Achievement tie

The completion tracker (#196) has three cooking goals in Stardew: cook 10,
cook 25 and cook all. The same three fit our tracker, scaled to the list.

## Why this shape

Machines turn farm output into a second loop of waiting and collecting, which
is gentle on a tablet because there is no queue and no fail state. Cooking turns
the same goods into a buff with a reason to plan the day. Tying the kitchen to
the house upgrade gives the upgrade a payoff, and tying recipes to friendship,
skills and rings gives each of them a second use.

## Left for later

- **The cask,** first to return. It needs the cellar from a house upgrade and
  long timers. Aged wine, cheese, ale and mead come with it.
- **A dehydrator, a seed maker and a fish smoker.** See "Open" for the bundle
  and Riverside conflicts.
- **A crystalarium, recycling and a worm bin,** all deep Stardew machines.
- **Artisan goods from trees and tapping** (maple syrup and similar). They need
  trees and the Tapper profession (`26_seasons.md` and the foraging
  professions).

## Open

- **No bundle gives the mayonnaise machine or the oil maker.** The bundle gives
  the first machine (decided), so these two need another first source.
  Recommended: a recipe from a cast member's friendship mail, with the first
  machine crafted from it.
- **Seed maker, dye vat and duplicator conflict with the eight machines.**
  `16_bundles.md` gives a seed maker (bundle 4), a dye vat (bundle 23) and a
  duplicator (bundle 27) as rewards. This note leaves the seed maker out.
  Recommended: add the dye vat as a ninth machine now, since the loom's chain
  needs it, and settle the seed maker and duplicator in the crafting list note.
- **Riverside's smoker.** `32_farm_types.md` has Riverside start with a fish
  smoker. That machine is not in the eight. Recommended: add it as a ninth
  machine that only Riverside starts with, craftable by anyone later.
- Machine craft costs, times and sell prices to put in `07_tuning_numbers.md`.
- The first farmhouse upgrade: price, materials and what else it adds.
- The inn kitchen's stock and prices.
- The split of the 81 recipes between rings once the regions are designed.
- Bundle 12 (Artisan Goods) and the other bundle rewards (issue #201) need a
  pass now that machines are craftable.
- Whether the level 10 choice screen for Artisan ships with this or after it.
