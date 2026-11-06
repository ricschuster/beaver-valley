# 54 Stardew checks register

Status: live. One place for every Stardew claim in the design notes that is
"from memory" or "not checked", so none gets lost and the owner can answer them
in batches.

## What this is for

Many notes say "Stardew does X (from memory, unchecked)". Left in prose, those
claims are hard to find and never get checked. This register lists each one as a
row with the exact question and how to answer it. It is reference material about
Stardew's behaviour. It never holds copied text, art or code (ADR 0002).

It does not track build work (GitHub issues do that) and it does not track
questions only our own playtests can answer.

## How to check a claim

- **Play.** The owner plays Stardew and answers, or sends a screenshot or short
  clip. Black box only: observe what the game does, never inspect its code or
  data files. Reverse engineering tools are out (ADR 0002 and the Stardew EULA).
- **Wiki.** The owner saves the page by hand, per `CLAUDE.md`. The URL list goes
  in `docs/reference/stardew/urls_<topic>.txt` and is deleted after reading.
- **Guidebook.** Read the page on demand, cite by printed page, never quote.
- **Ours.** Stardew cannot answer it. Decide it by playtest. Not tracked here.

## Rules

1. Add a row when a note makes a Stardew claim without a checked source. Link the
   row ID from the note, for example "(Stardew, unchecked, SC-03)".
2. A row needs the exact question, the note it comes from, and the method.
3. When answered, fill the Answer column, set the status to `done`, and update
   the note. Keep the row as the record.
4. A row marked `blocks` stops a design decision. Ask those first.
5. Offer a question batch at the start of a session when five or more rows are
   open (rows grouped by area, one message). `CLAUDE.md` says to start sessions
   by asking what to design, so offer the batch as one of the choices.
6. Add new rows in the session handoff step (see `HANDOFF_TEMPLATE.md`).
7. Numbers in `07_tuning_numbers.md` marked "from memory" are not rows. They are
   placeholders that playtests will tune. Add a row only if a number needs to be
   right, not just close.
8. An answer records what Stardew does. It is never a decision about what we
   do. Whether to copy, change or drop the behaviour is settled separately in
   the design note.

Status values: `open`, `asked` (question sent to the owner), `done`.

## Register: play

| ID | Note | Question | Blocks | Status | Answer |
| --- | --- | --- | --- | --- | --- |
| SC-01 | 52 | Does Stardew save only on sleeping? Does leaving to the title screen discard the day? | no | done | Owner, 2026-11-03: yes, desktop saves only on sleeping (tablet and phone have an option to save the current state). Leaving to the title screen discards the day. |
| SC-02 | 51 | Does one use of the mailbox open one letter or the whole pile? Does the flag stay up while letters wait? | no | half answered | Owner, 2026-11-06: the flag stays up while letters wait (yes), and from memory one use opens one letter. The saved Letters page, read 2026-11-06, says letters appear in the mailbox at the start of the day, closing a letter with an unclaimed item tries to put the item in the pack (a chest style menu opens if the pack is full, and dismissing it forfeits the item), and read letters can be reread from the collections tab. It does not say one letter or the whole pile per use, so that part stays from memory. |
| SC-03 | 28 | Where does the shipping bin stand on the farm, relative to the door and bed? | no | done | Owner: a few cells to the right of the farmhouse. A screenshot would pin down the exact offset. |
| SC-04 | 28 | What does the end-of-day shipping screen list, and in what order? | no | done | Owner: rows for Farming, Foraging, Fishing, Mining, Other, then Total. Each row expands to the items sold, the count of each and the money earned. |
| SC-05 | 26, 33 | Does winter 28 of year 1 roll into spring of year 2 with no year-end screen? | no | done | Owner: straight into spring of year 2, no year-end screen. |
| SC-06 | 49 | What tabs does the menu show, in what order? | no | done | Owner screenshot, 2026-11-03: eight tabs in this order: Inventory, Skills, Social, Map, Crafting, Collections, Options, Exit. The equipment slots and paper doll sit on the Inventory tab, not their own tab. Note 49 differs in order and has a separate Wear tab. |
| SC-07 | 49 | Does the clock pause while the journal is open? What does the mouse wheel do in a menu? | no | half answered | Saved Day Cycle and Player Menu pages, read 2026-11-06: in single player the clock pauses in a cutscene, a dialog or a menu (game menu, billboard, quest journal); in multiplayer it does not pause. Mouse wheel in a menu: not on those pages, still open. |
| SC-08 | 41 | Does the farmhouse outside change by upgrade tier? Can the player enter or sleep in it during an upgrade? | no | done | Owner, 2026-11-03, corrected from their first answer: the exterior changes by tier but the building footprint does not (wiki Farmhouse page, three outdoor images, all within the 9 by 5 footprint). The player can enter and sleep during an upgrade. |
| SC-09 | 43 | How many trees does a new farm start with, and where? On what ground may a tree seed be planted? | no | half answered | Owner screenshot of the day 1 Standard Farm: a dense scatter of trees (oak, pine, a few cherry at the edges) over the whole field, with bushes, stumps, boulders and branches among them. Our rough count from that screenshot, 2026-11-06 (not exact, give or take a quarter): about 110 trees in the field (about 65 broadleaf, about 45 pine), plus about 22 stumps, about 4 hollow logs, about 13 large boulders, about 220 small stones and about 105 branches (twigs). Stones are densest in the south east. The large green clumps are grass patches, not bushes. Not counting the border and the cherry trees at the edges. The stone and branch counts are rougher, give or take a third. Still open: what ground a seed may be planted on. Saved Trees page, read 2026-11-06, adds: on the farm a mature tree (not a stump) has a 15 percent chance each night of planting one seed on a random tile up to 3 tiles away, only if the tile is empty (trees never destroy paths or crops). Tree seeds need no watering and the land around need not be empty. Outside the farm trees never spread by themselves, but the player can plant a seed on any tillable ground that is not tilled. Chopped trees outside the farm, once the stump is removed, have a 20 percent chance a night of returning as a stage 3 seedling (even in winter); a stump left in place stops it. Still open: the starting tree count (owner screenshot estimate above). |
| SC-10 | 50 | Can the board hold more than one request at once? In multiplayer, does everyone get the reward for a finished request? | no | done | Owner: the board can hold more than one request at once, and in multiplayer everyone gets the reward. Fits note 50 (one a day, 2 days to finish). |
| SC-11 | 16 | Is a finished Community Center room's reward granted when the room completes? | no | done | Owner, 2026-11-06, from play and memory: yes, the reward is granted at once when the room completes. |
| SC-12 | 36 | How many weeds does a fresh farm start with on day 1, and how fast do they spread? | no | done | Owner, 2026-11-06, from play: weeds spread very slowly after the start is cleared. Day 1 count: see the owner screenshot estimate (about 300, rough). Saved Weeds wiki page, read 2026-11-06: no counts or spread rate are given. It confirms new lone weeds spawn on the farm only on day 1 of spring, summer and fall (none in winter, and all weeds above ground vanish in winter), and that spread to an adjacent tillable tile can happen any day, most on day 1 of a season, when raining and in summer. So the rate stays a placeholder. |

## Register: wiki or Guidebook

| ID | Note | Question | Blocks | Status | Answer |
| --- | --- | --- | --- | --- | --- |
| SC-20 | 24 | Seed maker recipe source and fish smoker craft costs. | no | done | Seed maker: farming level 9; 25 wood, 1 gold bar, 10 coal. Fish smoker: fish shop recipe 10,000g; 10 hardwood and 3 jellies. |
| SC-21 | 24 | How many cooking recipes come from TV or Ginger Island, so we know how many slots need dishes of our own? | no | done | 32 TV, 3 island sources, 2 from the island villager's mail: about 37 of 81. |
| SC-22 | 15 | Character frame and portrait sizes. | no | done | Sprite frames 16 by 32; portraits 64 by 64. Note 15 already matches. |
| SC-23a | 22 | Does the lift stop every 5 floors? | no | done | Yes, at multiples of 5 floors. |
| SC-23b | 22 | Does Stardew keep a per-floor counter for ladders? | no | done | No. Chance based: 95% at load, 15% per kill, rising per rock. |
| SC-23c | 22 | Is the dangerous mode toggle a quest? | no | done | Danger in the Deep: reach the bottom within 7 days; resets the elevator. Shrine of Challenge on floor 120 then toggles. |
| SC-23d | 22 | Does a better pickaxe gate deeper ore? | no | done | No hard gate; hits per node by tier (basic 3 on copper, steel 6 on iridium). |
| SC-23e | 22 | Coal sources and furnace time? | no | done | Rocks, dust sprites, blacksmith, kiln. Furnace 30 min copper, 2 h iron, about 5 h gold. Not a day. Note 22 corrected. |
| SC-23f | 22 | Does the blacksmith sell ore and coal? | no | done | Yes: copper, iron, gold ore and coal. |
| SC-23g | 22 | Bar sale values 60g, 120g, 250g? | no | done | Yes: copper bar 60g, iron 120g, gold 250g. Smelt times 30 min, 2 h, 5 h. |
| SC-23h | 22 | Furnace given after first copper? | no | done | Recipe from the blacksmith after collecting copper; craft 20 copper ore, 25 stone. |
| SC-23i | 22 | Charcoal kiln recipe source? | no | done | Foraging level 2 (20 wood, 2 copper bars); also the reward of the Construction bundle (Crafts Room). |
| SC-23j | 22 | Defeat: one lost item returned by mail? | no | done | Tools mailed back next day; one lost item bought back from the guild owner. Gold loss 5 to 25%, max 15,000g. |
| SC-23k | 22 | Top tool tier price? | no | done | 25,000g and 5 iridium bars. |
| SC-24 | 55 | Are the house, bin, greenhouse and cave positions fixed on the Standard farm, as the screenshot suggests, or do they vary? | no | done | Owner, 2026-11-06, from memory: fixed. The house, bin, greenhouse and cave stand in the same places every new Standard game. Other farm types not asked. |
| SC-25 | 55 | How many tiles across and down is the Standard farm, and how many are tillable? | no | half answered | Saved Farm Maps page, read 2026-11-06: the Standard farm has 3427 tillable tiles and 235 non-tillable but buildable tiles, and its biggest contiguous tillable rectangle is 63 by 31 (1953 tiles). The page gives no overall width and height, so note 55's 80 by 65 is still unchecked. |
| SC-26 | 07 | Can the host change the profit margin after the game has started, and when does it take effect? | no | done | Saved Multiplayer page, read 2026-11-06: NO. The profit margin (25%, 50%, 75% or default 100%) is chosen when the multiplayer farm is created and "can't be changed after farm creation without save editing". Wallet sharing can be changed later, and cabins can be built or demolished in game. This contradicts the owner's memory (2026-11-06, "yes, next day"), so the page wins. Note 07 had decided "as Stardew does" on the wrong premise. |
| SC-27 | 50 | What chance does a day have a request on the board, and on what day does the board start posting? | no | half answered | Saved Quests page, read 2026-11-06: every day except the first day of the game the board "may have" a randomly generated request (a yellow exclamation point shows when there is one). The chance is not given. An accepted request lasts 2 days (that day and the next). Types: gathering, slay monsters, fishing, saying hello, item delivery (the most common; pays 3 times the normal quality sell price). A 3 star counter gives a Prize Ticket. Owner, from memory: most days have one. |
| SC-28 | 38 | What rare item does Stardew mail for completing the full villager roster, and from which crop? | no | open | Saved Achievements page, read 2026-11-06: it lists the friendship achievements (A New Friend, Best Friends, The Beloved Farmer, Cliques, Networking, Popular) with hats as rewards, and no mailed rare item. The Perfection Tracker lists "Great Friends" (max hearts with every villager). Not found on a saved page, so still open. |
| SC-29 | 55 | After the player clears the starting clutter, do rocks, branches and stumps return on the farm, and when? | no | done | Owner, 2026-11-06, from play: rocks and debris return to some extent the next season. Trees grow from seeds and grass grows as well, but not in winter. How much and where is not known. |
| SC-30 | 36, 43 | What are Stardew's tree types on the main map, where do they stand outside the farm, and which can be chopped? | no | half answered | Saved Trees page, read 2026-11-06: the common trees are Maple, Oak, Pine and Mahogany (Mahogany gives Hardwood and is not on the main map). Trees in Cindersap Forest, the Mountain, the Railroad, the Quarry, the Bus Stop, the Backwoods and Town east of the river can be chopped, tapped or shaken. Trees in Town west of the river can only be shaken. A mature tree gives 12 to 16 wood, 5 sap, 0 to 2 seeds, and 12 foraging XP; a stump gives 4 to 9 wood and 1 sap. Regrow outside the farm is 20 percent a night once the stump is removed (see SC-09). Owner, from play: three types on the main map in fixed places, some cosmetic. Seeds per type are Maple Seed, Acorn, Pine Cone and Mahogany Seed. Still open: the owner's three types against the page's four, and the fixed places. |
| SC-31 | 43, 55 | Which axe tier does each starting-field stump and hollow log need, what does each give, and do they come back after clearing? | no | half answered | Saved Axe and Hardwood pages, read 2026-11-06: a Large Stump needs a Copper Axe or better and a Large Log needs a Steel Axe or better, and both give Hardwood. Hardwood page: six Large Stumps respawn daily in the Secret Woods for 12 Hardwood a day (2 each), eight on the Forest farm (16 a day) and one on the Four Corners farm (2 a day). The page lists no daily respawn on the Standard farm, so cleared stumps and logs there do not come back by that rule. The Large Log yield is not on the pages read. Owner, from play: the Standard farm starts with both. |
| SC-32 | 57 | What triggers the Special Orders board (second board) to appear, where does it stand, and how do special orders work (count, timers, rewards, whether they repeat)? | no | half answered | Saved Quests page, read 2026-11-06: a cutscene from Fall 2, Year 1 (any weather) installs the board in front of the Mayor's Manor. Orders are larger than Help Wanted ones and are filled automatically (no talking to the requestor). New orders appear each Monday. Time limits run from 7 to 28 days by order and the clock runs from posting, whether accepted or not, so accepting late gives less time. One new order can be accepted per week and several can be active. A table lists which orders repeat once done; a failed one can be offered again. A second board with two new orders every Monday exists on Ginger Island (Mr. Qi). Still open: how many orders show at once on the town board, and per-order rewards for our own version. Owner: it shows up after some time or stage. |
| SC-33 | 57 | Does Stardew's farmhouse TV show tomorrow's weather, and is there a festival heads-up? | no | done | Owner, 2026-11-06, from play, and the saved Television page, read 2026-11-06: the weather report predicts tomorrow's weather and updates after a Rain Totem. The fortune teller gives the day's luck. Livin' Off The Land plays Monday and Thursday, with tips. The Queen of Sauce airs a new recipe each Sunday from Spring 7 (re-runs on Wednesday). F.I.B.S. (fishing) unlocks after a special order, and a secret channel plays on Fall 26. The page lists no festival heads-up. All TVs show all channels. Our rule keeps the TV to the forecast; the other channels are not designed. |
| SC-34 | 19 | Does Stardew put any of its areas (Town, Mountain, Forest, Beach) on the same playable map, or is each one a separate map? | no | done | Owner, 2026-11-06, from memory (saved Pelican Town and Mountain pages do not say): Town, Mountain, Forest and Beach are separate maps joined by exits. This replaces the owner's earlier recollection that the Town and Mountain were combined. |
| SC-35 | 19 | Does every Stardew household have a home the player can enter, and do the houses stand apart around the town? | no | done | Owner, 2026-11-06, from memory (not on the saved Pelican Town page): every villager's home can be entered and the houses are spread around the town. |
| SC-36 | 58 | Are Stardew's coop and barn walk-in interiors, with the big and deluxe tiers adding to the base layout or replacing it? Is the greenhouse a walk-in map? | no | open | Saved Barn page, read 2026-11-06: the Barn, Big Barn and Deluxe Barn all have a 7 by 4 footprint (same across tiers), with capacity 4, 8 and 12 and new features per tier. The page does not say whether the interior is one layout that grows or a new map per tier. Owner, 2026-11-06: yes, walk in; chose one full map per tier. |
| SC-37 | 58 | Does any Stardew shop keep its owner's home as a separate map from the shop, or is each one map? | no | done | Owner, 2026-11-06, from memory (saved Pierre's and Marnie's pages do not say): a shop and its owner's home are one map each, not two. We still chose two maps for the Outpost for our own reasons. |
| SC-38 | 58 | What are the interior sizes in tiles of the coop, barn, big and deluxe versions, and does each tier keep the same entrance spot? | no | done | Measured from the owner's full size screenshots, 2026-11-06, using the feeding bench hay slots (one tile each) and window spacing as the scale. Coop 11 by 8, 15 by 8, 22 by 8. Barn 17 by 13, 21 by 13, 24 by 13, give or take half a tile. Coop door stays bottom left. Barn door moves by tier. Owner can still confirm in game. |
| SC-39 | 41 | What are the farmhouse map sizes by tier, the cellar size, and when do renovations unlock? | no | part | Owner's screenshots, 2026-11-06: start about 11 by 10, tier 1 about 31 by 12, tier 2 about 34 by 22, cellar about 19 by 16, rough because each image has its own scale. Renovation prices and requirements not checked. |
| SC-40 | 19 | How big, in total tiles, are Stardew's maps, as a reference for our area sizes? | no | part | Saved forage footnotes ("Of the N total tiles in X"), read 2026-11-06. Total tiles per map: Bus Stop 1050, Secret Woods 1920, Railroad 4340, Mountain 5535, Pelican Town 13200, Cindersap Forest 14400. These look like whole map rectangles, so they include water, cliffs and unwalkable tiles. Widths and heights are not given. The farm total is open (SC-25). Not on the saved pages: Beach, Mines levels, Quarry, Desert. Mines have no forage footnote, so the page route cannot give them. Reference only: our areas get their own sizes in note 19. |
| SC-41 | 19 | How fast does the Stardew farmer walk, how long does a map crossing take, and what does the horse change? | no | part | Owner, 2026-11-06, from memory: our 5 tiles a second (80 px a second in `FarmScene.ts`) feels too fast against Stardew. Stardew has a horse later in the game that speeds travel up, so its long maps are walked fast only after that. No Stardew walk speed or crossing time is on the saved pages (searched 2026-11-06). Still open: the walk speed in tiles a second, crossing times for Cindersap Forest and Pelican Town (owner can time a walk), and when and how the horse is gained. Note 25 lists the horse as absent in our valley, so slower walking and long maps may need another answer (carts, a later speed item). Feeds the walk speed and the crossing column in note 19. |

## Not Stardew questions

These are flagged "unchecked" but only our own playtests or a real tablet can
settle them: notes 45 to 48 (controls, mouse, action order on one tile), the
touch quantity prompt in note 28 (#59, #63), and the wheel and Page Up rules in
note 49 that are marked "ours".
