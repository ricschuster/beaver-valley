# 07 Tuning numbers (draft)

Status: draft. Every number the first playable uses, in one place, so playtests
can say "too slow" and point at a number. Nothing here is balanced yet.

"From memory" means the value was recalled from Stardew Valley and not checked
against any source. Our own values are marked as such. Per ADR 0002 we copy no
content, so any value can change freely once playtests say so.

## Day and energy

Source: `src/core/clock.ts`, `src/core/energy.ts`, `src/core/day.ts`,
`src/scenes/FarmScene.ts`.

- The day runs from 6:00 am to 2:00 am (20 hours). From memory.
- One clock tick is 10 game minutes every 7 real seconds, so a full day is
  about 14 real minutes if the player only stands still. Ours, unchecked.
- Maximum energy is 270. From memory.
- Each tool use costs 2 energy and no game time. Ours: time per action is not
  modelled yet, so energy is the real limit and the clock is only pressure.
- Sleeping before the day is over restores all energy for free.
- Passing out costs 10 percent of money, capped at 1000. The next morning has
  50 percent energy after running out of energy and 75 percent after staying up
  too late. From memory.

## Money and shop

Source: `src/core/save.ts`, `src/core/toolbar.ts`, `src/content/crops.json`.

- A new game starts with 500g and 15 parsnip seeds. Money from memory, seeds
  ours.
- Seeds cost the listed seed price and goods sell for the listed sell price.
  Seeds can be sold back for half the price they cost (rounded down). Ours.

Crops (season, days to grow, seed price, sell price):

- Parsnip: spring, 4 days, 20g, 35g. From memory.
- Potato: spring, 6 days, 50g, 80g. From memory.
- Cauliflower: spring, 12 days, 80g, 175g. From memory.
- Melon: summer, 12 days, 80g, 250g. From memory.
- Tomato: summer, 11 days, 50g, 60g. From memory.
- Radish: summer, 6 days, 40g, 90g. From memory.
- Green bean: spring, 10 days then regrows every 3, 60g, 40g. From memory.
- Kale: spring, 6 days, 70g, 110g. From memory.
- Garlic: spring, 4 days, 40g, 60g. From memory.
- Hot pepper: summer, 5 days then regrows every 3, 40g, 40g. From memory.
- Corn: summer, 14 days then regrows every 4, 150g, 50g. From memory.
- Red cabbage: summer, 9 days, 100g, 260g. From memory.

Fall crops (decided 2026-10-31, `35_bundle_pools.md`). The owner chose to match
the saved Stardew Fall Crops page for our equivalents, as spring and summer do.
Our names and items. Unchecked in play:

- Pumpkin: fall, 13 days, 100g, 320g. Not food.
- Eggplant: fall, 5 days then regrows every 5, 20g, 60g.
- Sweet potato: fall, 10 days, 60g, 160g.
- Beet: fall, 6 days, 20g, 100g.
- Cranberry: fall, 7 days then regrows every 5, 240g, 75g. Gives 2 berries a
  harvest, so crops need a yield field in `crops.json`.
- Artichoke: fall, 8 days, 30g, 160g. Stardew holds it back to year 2. Ours is
  open in year one, which makes it the best value fall crop. Check in play, and
  hold it back if it does too much.
- Corn already grows in summer and fall (14 days then every 4, 150g, 50g). Its
  season list in `crops.json` adds fall.
- Crops that are alive when fall ends die, as spring and summer crops do. There
  are no winter crops outdoors, and no greenhouse until slice 4.

A crop grows one day for each day it was watered. It does not regrow after
harvest, and it withers when its season ends. Rain waters every plot overnight.

## Seasons and weather

Source: `src/core/calendar.ts`, `src/core/weather.ts`.

- A season is 28 days and there are four (spring, summer, fall, winter, see
  `26_seasons.md`; the first playable has two). From memory for the length.
- Chance of rain per day is 20 percent in spring and 15 percent in summer. The
  first day of a season is always sunny. Ours.
- Tomorrow's weather is rolled a day ahead and shown when the player uses the
  bed, like Stardew's TV forecast.

Fall, winter and storms (decided 2026-10-31, from the saved Stardew Weather and
Lightning Rod pages where marked, otherwise ours and unchecked):

- Rain chance per day: fall 20 percent (ours, matching spring). Winter has no
  rain and no storms, as in Stardew. Winter snow replaces it: 30 percent of
  days (ours, the saved pages give no chance). Snow is only a look and a
  forecast, since no crop grows outdoors.
- Storms: a rain day in spring, summer or fall is a thunderstorm 25 percent of
  the time (ours). A storm waters the plots like rain and the forecast names
  it. Storms never happen in winter, and a festival day is always sunny, so a
  festival beats a storm.
- Fixed storms (Stardew): summer day 13 and day 26 are always storms, every
  year, on top of the random ones. The first day of a season stays sunny.
- Strikes (Stardew's model, with our numbers): on a storm day, every 10 game
  minutes while the farmer is awake there is a 3 percent chance of a strike
  (ours). About 2 to 3 strikes if the farmer is up from 6 am to 8 pm, and more
  the longer they stay up, as the saved page says.
- A strike lands on a lightning rod with chance `1 - (charged rods / all rods)²`
  (Stardew's formula). With no rod, or when it misses, it does nothing: our
  storms never harm the farm (`34_crafting.md`). A rod that is hit makes one
  battery pack the next morning and ignores more strikes that day. A rod can be
  anywhere on the farm map, and the player need not be on the farm when the
  strike lands (both Stardew).
- Expected packs: a single rod always catches the first strike, and a storm
  day has at least one strike about 9 times in 10 (3 percent over 84 ten
  minute ticks), so one rod makes about 0.9 packs a storm. A second rod only
  pays if a second strike falls. At 20, 15 and 20 percent rain with a quarter
  of rain days stormy there are about 1.4, 1 and 1.4 random storms a season,
  plus the 2 fixed ones in summer, so roughly 6 storms in the three seasons.
  Packs are only wanted from slice 3, when the rod arrives (bat wing, decided
  2026-10-31), so storms are weather only in slice 1. Six storms may be too few
  if lamp-posts, the crystalarium and more are each wanted.
  Raise the storm share or the strike chance if play finds packs scarce.

## Foraging

Source: `src/core/forage.ts`, `src/content/forage.json`.

- Up to a quarter of the farm's forage spots hold a good each morning, and the
  count is random from none to that cap. Ours.
- Spring goods: daffodil 30g, wild leek 60g, dandelion 40g, wild horseradish
  50g. Summer goods: wild grape 80g, spice berry 80g, sweet pea 50g. Later additions: spring onion 8g, salmonberry 5g (spring) and
  fiddlehead fern 90g (summer). The prices
  are ours and unchecked.
- Fall goods (decided 2026-10-31, from the saved Stardew Fall page where our
  good has an equivalent, otherwise ours): bramble berry 20g (energy 25),
  hazelnut 90g (30), wild plum 80g (25), field mushroom 40g (38), crab apple
  30g (20), rose hip 45g (15), chestnut 50g (30), wild garlic 35g (15).
  Bramble berry, crab apple, rose hip, chestnut and wild garlic are ours. The
  bramble berry price is from memory.
- Winter goods (from the saved Stardew Winter page where matched): crocus 60g
  (not food), snowdrop 80g (not food), winter cress 40g (20), pine nut 70g (25),
  holly sprig 80g (not food), frost root 70g (10) and snow tuber 100g (30). The
  last two come from the soil, not forage spots (below). Snowdrop, winter
  cress and pine nut are ours.
- Winter soil digging (decided 2026-10-31, as in Stardew's Winter page):
  tilling farm soil in winter has a small chance to turn up a frost root or a
  snow tuber. Placeholder: 3 percent a tile, two thirds frost root. Stardew's
  chance is not in the saved page. The hoe gives no clay or ore on the farm.
- Rare finds (bundle 6): morel 150g (spring), chanterelle 160g (fall, energy
  75), snowcap mushroom 140g (winter), wild ginger 120g (any season, energy 20)
  and cave mushroom 200g (mine floors 1 to 10). Ours, with morel and chanterelle
  near Stardew's. A rare spawn is 5 percent of forage spawns in the season, and
  3 percent of the mine floor's forage spots. Placeholders.
- Forage spawn cap is unchanged in fall and winter (a quarter of spots).

## Skills

Source: `src/core/skills.ts`.

- Ten levels. Total XP needed: 100, 380, 770, 1300, 2150, 3300, 4800, 6900,
  10000, 15000. From memory.
- A forage pickup gives 7 XP. A harvest gives `floor(16 * ln(0.018 * price + 1))`.
  From memory.
- Levels raise the chance of better quality goods, and farming levels trim
  swing energy (see below). At level 5 each skill asks for a profession (see
  Professions). Stardew's level 10 choices are not built.

## Professions

Source: `src/core/professions.ts`. One choice per skill at level 5, permanent.
After Stardew's level 5 choices, but with the animal and wood options replaced
by ones that fit our game. Ours, unchecked.

- Farming: Tiller (crops sell for 10 percent more) or Agriculturist (crops grow
  10 percent faster, which saves a day on a 12 day crop and nothing on a 4 day
  one).
- Foraging: Gatherer (20 percent chance of a second good) or Botanist (forage is
  never plain, at least silver).

Planned, not built (`23_animals.md`, decided 2026-10-30): Stardew's tree for
farming. Level 5 is Rancher (animal goods sell for 20 percent more) or Tiller.
Level 10 is Coopmaster or Shepherd under Rancher, Artisan (artisan goods 40
percent more) or Agriculturist under Tiller. Agriculturist moves to level 10.

Foraging professions, decided 2026-10-31 (planned, not built). After Stardew's
foraging tree, with our names. Level 5 is Forester or Gatherer. Level 10 is
Lumberjack or Tapper under Forester, Botanist or Tracker under Gatherer.
Gatherer stays as built. Botanist moves from level 5 to level 10, as
Agriculturist did. Botanist makes forage always the top grade (see Quality).
Tracker points arrows at off-screen forage, which also helps on a tablet.
Lumberjack and Tapper wait until trees and wood are a real system.

## Tool upgrades and energy

Source: `src/core/upgrades.ts`. The hoe and watering can have four tiers (basic,
copper, steel, gold) bought in the shop for 2000g, 5000g and 10000g. From
memory for prices; Stardew also needs bars and a wait, which we skip.
A fifth tier above gold is planned (decided 2026-10-29, `21_fishing.md`): a rare
metal from the deepest mine levels. Not built, and its price is open (#194).

- A swing costs `2 - 0.25 * tier - 0.1 * farmingLevel`, never under 0.5. The
  level term is from memory, the tier term is ours. Energy can now be
  fractional and the HUD rounds up.
- With 500g to start, an upgrade is a mid game goal.
- Playtest check (expert run, no upgrades bought): 7322g in hand when the last
  bundle was handed in on day 41 and 8297g after the end screen. So the 2000g
  and 5000g tiers are reachable well inside two seasons. The 10000g tier
  is not reached by day 41 by an expert who also funds every bundle; it is a
  late goal, which fits. A casual player will not reach it.

## Eating

Source: `src/core/actions.ts` (`eat`), `energy` fields in the content files.

- The player eats the held item with F or the Eat button. It takes no game time
  and is refused at full energy, so food is not wasted.
- Crops and most forage restore energy, with values from memory of Stardew:
  parsnip 25, potato 25, cauliflower 75, melon 113, tomato 20, radish 45,
  green bean 25, kale 50, garlic 20, hot pepper 13, corn 25, red cabbage 75,
  leek 40, dandelion 25, horseradish 13, wild grape 38, spice berry 25,
  salmonberry 25, fiddlehead fern 25, spring onion 5. Daffodil and sweet pea are
  not food. Fall crops: eggplant 20, sweet potato 45, beet 30, cranberry 38,
  artichoke 30. Pumpkin is not food. The fall and winter forage values are
  with their prices above.
- Silver restores x1.4, gold x1.8.

## Backpack

Source: `src/core/inventory.ts`, `src/core/upgrades.ts`. The backpack starts at
12 slots and can grow to 24 (2000g) and then 36 (10000g), bought in the shop.
Sizes and prices from memory. The toolbar shows 12 slots at a time; Tab or the
Row button moves to the next row, as in Stardew.

## Quality

Source: `src/core/quality.ts`. Quality is part of the item id (`parsnip@gold`),
so each tier stacks and sells separately. Bundles take any tier.

- Tiers: normal, silver (x1.25 price), gold (x1.5 price). Iridium is left out
  until there is a source for it. From memory.
- Crops: gold chance is `0.2 * farmingLevel / 10 + 0.01`; silver chance is twice
  that, so a level 10 farmer gets about 21 percent gold and 21 percent silver.
  Stardew's fertiliser term is left out. From memory.
- Forage: gold chance is `foragingLevel / 30`, silver up to `foragingLevel / 15`.
  From memory.
  Checked against the wiki on 2026-10-31: both formulas match.
- Top grade (decided 2026-10-31, not built): a fourth tier above gold, named
  after the rare metal, Hearthsilver (`22_mines.md`). Using the metal's name
  for the grade is an assumption, since the mines note only names the metal.
  Crops and forage get it, with Botanist guaranteeing it for forage. Its price
  and energy multipliers are open.
- Wild seeds (decided 2026-10-31): forage is crafted into seasonal seeds that
  grow into forage goods and give foraging XP. Built in M3 with crafting.

## Fishing (draft, not built)

Source: `21_fishing.md`. All of these are ours and are placeholders.

- Rods: Reed Pole 50g, Hazel Rod 400g, Heron Rod 1500g, Hearthwell Rod 4000g.
  Only the Reed Pole limits fish (common only). Rare fish need fishing level 5.
- Bar width as a share of the track: 0.30, 0.36, 0.42, 0.50 by rod. Assist adds
  30 percent. Cast range in tiles: 4, 6, 8, 10.
- Bait: Plain 3g (wait x0.7), Fine 12g (x0.5), Salted 8g (sea only, x0.5).
  Lures last 20 casts: Glint 250g, Moth 150g, Storm 150g, Whirligig 200g (wait
  x0.7), Wide Float 200g (bar +15 percent), Sounding Float 200g (shows the hooked fish), Magpie Hook 300g (1 cast in 5 gives
  a small treasure: a coin purse of `40 + 15 * level` gold 6 times in 10, else a
  trinket worth 30 to 120g). The Heron Rod has one lure slot, the Hearthwell Rod two.
- Fish sell prices by rarity: common 40 to 90g, uncommon 100 to 200g, rare 250
  to 500g, cove fish 400 to 700g. Legends: Hearthwell Carp 4000g, Valley King
  3500g, Moonlit Mother 3500g, Grandmother Hush 3000g, Great Hearthfin 3000g.
  Pearl Lobster 800g.
- Pots: 150g in the shop, one bait a day (any bait), junk 38 in 100 or 30 with
  Fine Bait, else one catch. The odds below are for a catch day. Fresh: Crayfish 35 in 100 (40g),
  River Mussel 35 (45g), Ladle Snail 20 (70g), Marsh Clam 10 (90g). Salt: Crab
  30 (60g), Periwinkle 30 (50g), Spiny Shrimp 20 (100g), Pearl Lobster 20
  (800g).
- Pearl Lobster odds: about 3 in 100 sea bites on a rod, about 1 in 5 a day in
  a salt water pot on a catch day, so about 12 in 100 a day after junk.
- XP: the harvest formula on the fish price, times 1.5 for a perfect catch. The
  level curve is the shared one in Skills.
- Quality: size roll `random(0,1) * (0.5 + 0.05 * level) + 0.1 * castDistance`.
  Silver at 0.33, gold at 0.67. A perfect catch lifts silver or gold one grade.
  A skipped fight (assist level two) gives no perfect lift.

## Village hall

Source: `src/content/bundles.json`.

- Five bundles: Spring Foraging (any 4 of 6 goods, reward 15 parsnip seeds),
  Summer Foraging (any 3 of 4, 15 radish seeds), Spring Crops (any 3 of 3,
  300g), Summer Crops (any 3 of 3, 400g) and Pantry (any 4 of 9 mixed goods,
  500g). Contents and rewards are ours. The foraging bundles and the Pantry
  took the new goods; the crop bundles are unchanged, as decided in
  `08_playtest_personas.md`.
- Foraging bundles are easy (the simulation below ran before the extra goods
  made them easier). A simulation of a player who sweeps all 14 farm
  spots every morning finished Spring Foraging in a median of 5 days (90th
  percentile 9) and Summer Foraging in 3 (90th percentile 6), with no failures
  in 2000 runs. A real player walks and spends time, so expect longer.

## Full hall (proposed, not built)

Source: `16_bundles.md`. All placeholders, ours unless marked.

- 30 bundles in six rooms (6, 6, 6, 3, 5, 4). The counts follow Stardew.
- Rooms appear by bundles finished: Foragers' Shelf at the start, Larder and
  Water room after 1, Hearth after 2, Guests' Board after 3, The Last Seat after
  20 of the other 26. Stardew's pattern comes from a forum reply and is
  unchecked.
- The Last Seat asks for 3 of each of four dishes, four gold fish, 10 bars, 5
  lamps, 5 bolts of cloth, 3 dyes, and for the last bundle 100 wood, 100
  stone, 20 bars, 10 bolts of cloth and 5,000g.
- The mines open on a fixed day announced by Old Greencoat. The day is not
  chosen.

## Mines and combat (draft, not built)

Source: `22_mines.md`. All of these are ours and are placeholders. Stardew facts
are from memory and unchecked.

- 120 floors in three bands of 40 (copper, iron, gold). Hearthsilver on floors 100
  to 120. The lift stops at every floor once reached. A rest camp with a loot chest
  every 10 floors, no healing.
- Opening day: Spring day 5. Dry-streak ladder odds: 1 percent plus 0.5 percent per
  miss, capped at 25 percent. A killed creature rolls the same chance.
- Smelting: 5 ore and 1 coal a bar (2 coal for Hearthsilver), a day per batch.
  The smith dwarf sells copper, iron and gold ore and coal, never bars. She gifts
  the furnace the morning after the first copper ore is handed over. Crafting it
  at mining level 4 makes more furnaces.
- Smith ore prices: copper ore 25g, iron ore 50g, gold ore 100g, coal 50g (about
  2.5 times the bar's sale value). Bars sell for about 60g, 120g and 250g, from
  memory.
- Charcoal kiln (Woodland bundle reward): 10 wood for 1 coal. Craft cost 2 copper
  bars and wood.
- Health 100, plus 5 per combat level. A touch costs 4 to 12. Grace after a hit is
  1.5 seconds (2.5 with the Nimble profession).
- Defeat: 10 percent of money lost, capped at 1000g (the pass-out rule), up to 3
  random stacks lost (1 in 3 each), one stack posted back. No loss of tools,
  weapons, seeds or bundle items. Assist mode loses no items.
- Professions at level 5: Prospector or Rockhound (mining), Steady or Nimble
  (combat).
- Fifth tool tier: 5 Hearthsilver bars per tool, no gold. Any pickaxe digs it.
- Weapons: three families, four tiers each. The first build has the starter and
  copper tier of each.

## Animals (draft, not built)

Source: `23_animals.md`. All of these are placeholders. Stardew facts were
checked against the Stardew Valley Wiki on 2026-10-30.

- Coop and barn, three tiers each, holding 4, 8 and 12. Building costs start near
  Stardew's: 4000g, 10000g and 20000g, plus wood and stone.
- Animals: chicken 800g, cow 1500g, duck 1200g, goat 4000g, rabbit and sheep
  8000g, pig 16000g. Each tier opens its species.
- Timers: chicken and cow daily, duck and goat every 2 days, sheep every 3 days,
  rabbit every 4 days, pig daily when let out (none in winter or rain).
- Friendship 0 to 1000 and mood 0 to 255, as in Stardew. Sleeping outside costs
  mood and that day's product, never friendship.
- A young animal grows up in about 4 to 5 days. The incubator hatches in about 6.

## Day, energy and season check against the wiki (2026-10-31)

Checked against the Stardew Valley Wiki pages Day Cycle, Energy, Spring, Summer,
Fall and Winter. Reference only, nothing copied (ADR 0002).

Confirmed, so "from memory" can become "checked": the 6 am to 2 am day, 14 real
minutes for a full day (10 game minutes per 7 seconds), 270 maximum energy, the
10 percent pass-out loss capped at 1000g, a 50 percent morning after exhaustion,
28 day seasons, spring crops dying on day 1 of summer, and the spring and
summer crop rows for parsnip, potato, cauliflower, garlic, kale, melon, radish
and red cabbage (days, seed price, sell price).

Decided with the owner on 2026-10-31 (not built yet):

- Late sleep gets a graded penalty: full energy up to midnight, then a growing
  loss per 10 minutes after it, and half at 2 am. A pass-out at 2 am is the
  half case, so the flat 75 percent goes.
- Exhaustion works like Stardew. Warnings near 20 and 15 energy. At 0 the player
  is exhausted: slow, tools still work and drain below zero. The day ends at
  -15. The next morning has half energy, even if the player ate in between.
- Pass-out loses money only outside the farmhouse.
- The morning after a skill level gives full energy, whatever the night was.

- Nightfall moves by season, as in Stardew: 8 pm in spring and summer, 7 pm in
  fall, 6 pm in winter, with a gradual darkening outdoors. Only the two earlier
  hours are used until fall exists.
- The clock stops while any menu or dialog is open (shop, hall, inventory,
  prompts), so slow touch menus never cost game time.
- Seasons three and four get their own design note (fall and winter), written
  before M3 so the calendar, crops and bundles are planned together.

Differences found (the four above are now decided):

- Late sleep: Stardew restores less the later you go to bed after midnight
  (nothing lost until 12:10 am, a small step per 10 minutes, a bigger drop at
  1 am, half at 2 am). We restore fully for any sleep before the day is over and
  75 percent after a time pass-out. Passing out at 2 am is the 50 percent case
  there, so our 75 percent is too kind.
- Exhaustion: in Stardew, 0 energy is a state (slow, tools still work) and the
  day only ends at -15. We end the day at 0.
- Pass-out location: Stardew charges nothing for falling asleep inside the
  farmhouse. We charge always. Matters once the farm has more than one place.
- Level-up morning: Stardew gives full energy the morning after a skill level,
  whatever the night was. We do not.
- Nightfall: 8 pm in spring and summer, 7 pm in fall, 6 pm in winter, with a
  gradual darkening. We have no darkness yet.
- Pauses: the clock stops in menus and dialogs there. Ours should too on a
  tablet (check).
- Seasons: new forage, logs, rocks and grass appear on the farm at the start of
  each spring. Winter clears crops and weeds and stops outdoor growth. Both
  matter for the third and fourth season, which are out of scope for now.
- Not on these pages: the rain chance per season. Our 20 and 15 percent stay
  ours, and fall and snow chances are ours too (above).

## Weeds, fiber, sap and common trees (2026-10-31)

Full rules in `36_gathering_trees_sap_fiber.md`.

- Fiber: 50 percent from a cut weed. Grass gives hay only (as Stardew).
- Sap: 5 from chopping a mature tree, 1 from its stump (as Stardew).
- Tree chop: 12 to 16 wood, 0 to 2 seeds. Stump: 4 to 9 wood. Young tree: 4.
- Loose seed 5 percent a day, spread 15 percent a night within 3 tiles, off-farm
  regrowth 20 percent a night (all as Stardew).
- Ours, placeholder: 20 weeds on day 1 of spring, summer and fall, capped by
  free tillable tiles; weed spread 10 percent a night (rain 20, summer 15).
- Tree growth is Stardew's: 20 percent a night per stage, stage 4 twice as
  long, none in winter, fertilizer 5 days.

## Start options (decided 2026-10-31, not built)

- Profit margin: a difficulty dial on sell prices, offered when starting a game.
  Useful for a casual tablet audience. Steps and default are open. Bundle remix
  and a year-one guarantee are not offered for now.

## Farm tools, trees and machines (2026-10-31)

Decided with the owner. Prices and formulas are Stardew's, from the saved
Sprinkler, Fertilizer, Fruit Trees, The Cave and Artisan Goods pages, unless
marked ours. Recipes are in `34_crafting.md`.

- Sprinkler sell prices: sprinkler 100g, quality sprinkler 450g, iridium
  sprinkler 1,000g. Sprinklers are crafted and never sold in the shop.
- Fertilizer shop: basic fertilizer, basic retaining soil and speed-gro cost
  100g from Spring 15 of year 1. Quality fertilizer, quality retaining soil and
  deluxe speed-gro cost 150g from year 2. Sell prices: basic fertilizer 2g,
  quality fertilizer 10g, basic retaining soil 4g, quality retaining soil 5g,
  speed-gro 20g, deluxe speed-gro 40g.
- Fertilizer yield per craft: basic fertilizer 1, quality fertilizer 2, basic
  retaining soil 1, quality retaining soil 2, speed-gro 5, deluxe speed-gro 5.
  Our speed fertilizer takes the speed-gro slot (`34_crafting.md`).
- Sprinkler add-ons are out of the game for now. Stardew sells 4 for 20 Qi Gems
  in the Walnut Room and rarely drops them from monsters in special quests
  (saved Pressure Nozzle and Enricher pages). We have neither, and the owner
  chose Stardew's source over a craft recipe. They return when a source exists.
  Their Stardew rules, for then: both sell for 200g, a sprinkler takes one
  add-on, a nozzle widens reach to 3x3, 5x5 or 7x7 by tier, an enricher holds
  one fertilizer type, and a picked-up sprinkler gives its add-on back as an
  item.
- Fruit sapling prices, from Pierre's: apricot 2,000g, cherry 3,400g, peach
  6,000g, orange 4,000g, apple 4,000g, pomegranate 6,000g, 25,400g for all six.
  Banana and mango are Ginger Island trees and are left out.
- Fruit trees: 7 days a stage, 28 in all. Apricot and cherry bear in spring,
  peach and orange in summer, apple and pomegranate in fall.
- Fruit sell prices (normal quality, silver and gold use our x1.25 and x1.5):
  apricot 50g, cherry 80g, orange 100g, apple 100g, peach 140g, pomegranate
  140g. A tree's fruit gains one grade per year of age after maturity, to gold
  after two years. A third year waits for the top grade (see Quality).
- Farm cave mark: 25,000g of total earnings over the whole game.
- Fruit bats: each night an empty cave gets no fruit 48 percent, 1 fruit 25,
  2 fruit 13, 3 fruit 7, 4 or more 7 (about 1.06 a night). Fruit stays until
  picked and takes space, so a full cave spawns less. The cave has 50 floor
  tiles. Each fruit gives 7 foraging experience.
- Mushroom cave: six boxes, each makes a mushroom every second day, always
  normal quality, 5 foraging experience each. Stardew's chances are common
  70 percent, chanterelle 7, red 12, morel and purple 2.5 or less. Which of
  these we have is open until the forage list is checked. Stardew gives a free
  dehydrator, which we do not have, so the reward is open.
- Machine times are Stardew's minutes. A machine counts 1,600 minutes a day, the
  1,200 awake plus 400 overnight (this is what makes Stardew's 10,000 minute
  wine 6.25 days). This is derived, so check it against play.
  - Preserves jar: jelly and pickles 4,000 min (2.5 days).
  - Keg: wine 10,000 min (6.25 days), juice 6,000 min (3.75 days), beer 1,750
    min (about 1.1 days), mead 600 min.
  - Bee house: honey every 4 nights, none in winter, flowers within 5 tiles
    change it.
- Artisan sell prices: jelly and pickles 2 x base price + 50, wine 3 x base,
  juice 2.25 x base, beer 200g, mead 300g. Wild honey 100g. Flower honey by
  flower: tulip 160g, blue jazz 200g, sunflower 260g (spring and fall),
  summer spangle 280g, poppy 380g, fairy rose 680g. Our flower set is open,
  so each of ours takes the nearest Stardew value. The Artisan profession adds
  40 percent later (`23_animals.md`).
- Charcoal kiln: 10 wood for 1 coal in 30 minutes. Seed maker: 20 minutes, and
  it gives 1 to 3 seeds of the input crop, 2 on average. It takes crops and
  four forage items, not fruit tree fruit. Stardew's rare mixed and ancient
  seed results are left out. Both from the saved Charcoal Kiln and Seed Maker
  pages.

## Open questions for playtests

First answers are in `08_playtest_personas.md`: 500g is far more than enough
(a parsnip returns 35g on a 20g seed in 4 days) and an expert finishes all five
bundles on day 41 of 56.

- Is 14 real minutes a day too long on a tablet?
- Does energy set the pace, now that forage is plentiful?
- Is 500g enough to start, and do the later crops pay back their seed?
- Can all five bundles be finished in the two seasons?
