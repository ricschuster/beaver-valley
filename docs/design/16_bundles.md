# 16 Village hall bundles: rooms, rewards and unlocks

Status: proposed 2026-10-28. The structure, unlocks, rules and the Last Seat
were decided with the owner in conversation. Every item, count and reward below
is a placeholder to be tuned. Nothing here is built in the game. It answers
issue #21 (bundle format for centre 1) and extends the five-bundle first
playable described in `03_milestones.md` and `07_tuning_numbers.md`.

## Why

The first playable has five bundles. A full centre 1 needs a structure that
lasts about 1.5 years for an experienced player (`01_system_map.md`), gives
every system a reason to exist, and ends in the bridge to ring 2. The shape
follows Stardew Valley's community centre (rooms, a count-based soft gate and a
reward per bundle). Per ADR 0002 and ADR 0003 the names, items and rewards
here are our own.

## Decisions

1. **Six rooms, 30 bundles.** The per-room counts follow Stardew: 6, 6, 6, 3, 5
   and 4.
2. **Rooms appear by the total number of bundles finished**, not by finishing a
   whole room. Only the Foragers' Shelf is open at the start.
3. **One gate to ring 2.** Finishing the Last Seat mends the bridge and
   opens the road. There is no second room behind it.
4. **The Last Seat is the last and hardest thing in ring 1.** Its bundles
   ask for finished goods from three or four other rooms, so they cannot be
   filled early.
5. **Each bundle gives a useful item.** Finishing a whole room gives a larger
   unlock. Rewards lean towards machines and tools, seeds and consumables, and
   wearable equipment.
6. **The last room is called The Last Seat** (decided 2026-10-28), to avoid
   clashing with the hall, which keeps the name The Long Table. The name hints
   at a place left at the table for someone still to come.
7. **Rewards are designed in full now and tagged with the system they need.**
   A reward whose system does not exist yet stays a placeholder until that
   system has a design note.

## Room appearance (the soft gate)

| Room | Bundles | Appears after |
| --- | --- | --- |
| Foragers' Shelf | 6 | Open at the start |
| Larder | 6 | 1 bundle done |
| Water room | 6 | 1 bundle done |
| Hearth | 3 | 2 bundles done |
| Guests' Board | 5 | 3 bundles done |
| The Last Seat | 4 | 20 of the other 26 bundles done |

- Stardew's own thresholds (1, 2, 3 and 4 for its later rooms) come from one
  forum reply and were not checked against the wiki or the game data. Ours
  follow the same pattern and are placeholders.
- A player may skip up to 6 of the other 26 bundles and still reach the Long
  Table. They will miss the room reward of any room left unfinished.
- A room reward needs every bundle in that room finished.
- The Last Seat needs all four of its own bundles for the bridge.
- Open: whether to require at least one bundle from every room before the Long
  Table appears. The default is no.

## Rooms and bundles

Counts are "N of M": the player hands in N items from a pool of M. "All" means
every listed item. Bundles accept any quality unless a minimum is given.
"Needs" is the system tag: where it says "exists" the goods are in the game
today.

### 1. Foragers' Shelf (open at the start)

Room reward: Old Greencoat sets up a herb and seed stall at the hall.

| # | Bundle | Rule | Reward | Needs |
| --- | --- | --- | --- | --- |
| 1 | Spring Foraging | 4 of 6 | 15 parsnip seeds | Exists |
| 2 | Summer Foraging | 3 of 4 | 15 radish seeds | Exists |
| 3 | Autumn Foraging | 4 of 6 | 15 autumn seeds | Autumn forage and crop |
| 4 | Winter Foraging | 3 of 5 | Seed maker | Winter forage, seed maker |
| 5 | Woodland | All: 50 wood, 50 stone, 30 fibre | Charcoal kiln | Gathering, crafting |
| 6 | Rare Finds | 3 of 5 rare forage | 5 forage dishes | New forage, eating (exists) |

### 2. Larder

Room reward: the greenhouse.

| # | Bundle | Rule | Reward | Needs |
| --- | --- | --- | --- | --- |
| 7 | Spring Crops | 4 of 6 | 20 fast-grow fertiliser | Exists (crops), fertiliser |
| 8 | Summer Crops | 4 of 6 | 20 quality fertiliser | Exists (crops), fertiliser |
| 9 | Autumn Crops | 4 of 6 | Bee house | Autumn crops, bee house |
| 10 | Quality Crops | 3 of 4 crops, 5 each, silver or better | Preserving jar | Minimum-quality rule, preserves |
| 11 | Animal Goods | 4 of 5 | Cheese press | Animals, processing |
| 12 | Artisan Goods | 4 of 6 | Keg | Processing |

Spring pool: parsnip, potato, cauliflower, green bean, kale, garlic. Summer
pool: melon, tomato, radish, hot pepper, corn, red cabbage.

### 3. Water room

Room reward: the ferry is repaired and a lake cove opens inside ring 1. No
bundle in this room may need cove fish, since the cove opens only when the
room is done (decided 2026-10-29). Lake fish come from the three open lakes. It
replaces Stardew's panning, which the owner dislikes. Ring 1 also has a coast
(decided 2026-10-28), which the Sea Fish bundle uses.

| # | Bundle | Rule | Reward | Needs |
| --- | --- | --- | --- | --- |
| 13 | Stream Fish | 3 of 5 | 30 bait | Fishing |
| 14 | Lake Fish | 3 of 4 | Lure | Fishing, the Forest, Mountain and delta lakes |
| 15 | Sea Fish | 4 of 6 | 5 warp charms | Fishing, a coast, travel |
| 16 | Night Fishing | 3 of 4 | Glow ring | Fishing, night, equipment slot |
| 17 | Specialty Fish | All 4: one rare fish each from stream, lake and sea, plus one rare shellfish | 5 fish dishes | Fishing, cooking |
| 18 | Trap Catch | 5 of 8, fresh and salt water | 3 crab pots | Fishing, traps |

### 4. Hearth

Room reward: carts between the farm, the hall, the town and the mines.

| # | Bundle | Rule | Reward | Needs |
| --- | --- | --- | --- | --- |
| 19 | Smith's | All: 5 copper bars, 5 iron bars, 3 gold bars | Furnace | Smelting, ore from the mines |
| 20 | Lamplighter's | 2 of 3: 3 lamps, 10 oil, 20 torches | Torches for the mines | Light, crafting |
| 21 | Weaver's | Both: 10 cloth, 5 thread | Loom | Cloth, tailoring |

The mines are not unlocked by the Hearth (see "The mines" below).

### 5. Guests' Board

Room reward: a hat standing boost, plus festival extras.

| # | Bundle | Rule | Reward | Needs |
| --- | --- | --- | --- | --- |
| 22 | Cook's | 3 of 5 dishes | 3 feast dishes | Cooking |
| 23 | Dyer's | 4 of 6 dyes | Dye vat | Dyes, tailoring |
| 24 | Host's | 3 of 4: bread, cake, tea, a festival treat | Set of festival hats | Cooking, hats, festivals |
| 25 | Fodder | All: 20 hay, 10 grain, 10 root crops | Coop heater | Animals, coop |
| 26 | Storyteller's | 3 of 5 herbs and old things found in the valley | A keepsake from Old Greencoat | Found items, a lore item |

Storyteller's pool: rare herbs, an old seed packet, a carved bead, a faded
ribbon, a pressed flower.

### 6. The Last Seat (last and hardest)

Room reward: the bridge is mended and the road to ring 2 opens.

| # | Bundle | Asks for | Reward | Needs |
| --- | --- | --- | --- | --- |
| 27 | Harvest Feast | All 4: a cooked meal, a preserve, a cheese, a honey. 3 of each. | Duplicator | Cooking, preserves, animals, bee house |
| 28 | The Catch | All 4: a stream, lake, sea and night fish, each gold quality | Magnet ring | Fishing, fish quality, equipment slot, mines |
| 29 | The Hearth Fire | All 4: 10 bars, 5 lamps, 5 bolts of cloth, 3 dyes | Large chest or storage shed | Smelting, light, cloth, dyes |
| 30 | The Long Road | 100 wood, 100 stone, 20 bars, 10 bolts of cloth and 5,000g | A letter to the elves | A story item only |

- The Long Road is a story reward on purpose: the letter is Old Greencoat's
  introduction to the elves. The Dawn Carrier who guides the player on the way
  (`09_story_and_lore.md`) is a separate help. Neither replaces the other.
- The gold is a money sink sized below the 10000g top tool tier.
- Quantities are placeholders. "100 wood" assumes bulk gathering, which has no
  design yet.

## Rewards by kind

- **Machines and tools:** seed maker, charcoal kiln, bee house, preserving jar,
  cheese press, keg, furnace, loom, dye vat, duplicator.
- **Seeds and consumables:** seeds, fertiliser, bait, torches, dishes, crab
  pots, warp charms.
- **Wearable equipment:** glow ring and magnet ring. Both need an equipment
  slot, which has no design yet.
- **Charm and story:** festival hats, the coop heater, the keepsake and the
  letter to the elves.

## Systems this note depends on

Each is its own design work. Until one exists, its rewards and bundles stay
placeholders.

- Fishing, the lake cove, the ferry and the coast (Water room, bundles 13 to
  18 and 28). Needs its own design note.
- The mines, with gentle combat (Hearth ore, torches, the magnet ring). Needs
  its own design note.
- Processing machines and cooking (Larder, Hearth, Guests' Board).
- Animals and coops (bundles 11, 25 and 27). The neglect rules wait on them
  (#135).
- Autumn and winter: the first playable has two seasons, so bundles 3, 4 and 9
  wait for them.
- Cloth, tailoring and dyes (`10_customisation.md`).
- An equipment slot for rings.
- A minimum-quality rule on a bundle item (bundle 10), and quality on fish.
- The greenhouse as a building.
- Carts, which may also cover the warp charms.

## The mines

Decided 2026-10-28. The mines open early, on a fixed day, and not through the
hall. A rockfall blocks the entrance until then. Old Greencoat comes to the
door and says the way is clear, which fits his part of opening each road in a
small way. In Stardew the mines open on Spring day 5 by a letter, and the
Boiler Room only adds a minecart. The opening day is a placeholder for
`07_tuning_numbers.md`. This lets the Hearth's metal come from the mines
before its carts arrive. Combat is wanted in the mines but must stay gentle
(cartoonish creatures, a soft penalty when beaten). That, and the mines' size,
belong in the mines note.

## Relation to the first playable

The five bundles in `src/content/bundles.json` stay as the first slice. They
map onto this note as follows: Spring Foraging and Summer Foraging are bundles
1 and 2, Spring Crops and Summer Crops are bundles 7 and 8, and the Pantry is
a mixed bundle that does not appear here and would be reshaped or dropped. The
current rewards (seeds and money) stay until the systems above exist.

## Open questions

- Whether a player must finish at least one bundle in every room before the
  last room appears.
- The opening day of the mines.
- The pool of items for bundles 3, 4, 6, 11 to 18, 22 to 24 and 26.
- The Last Seat quantities and the bridge cost, once wood, stone and bars
  have real production rates.
- Whether 30 bundles fit the 1.5 year pacing target. This needs a playtest
  once enough of them exist.
- Stardew's room thresholds and reward lists come from guide sites and a forum
  reply, not the wiki, which blocked fetches.
