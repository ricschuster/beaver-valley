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
| SC-02 | 51 | Does one use of the mailbox open one letter or the whole pile? Does the flag stay up while letters wait? | no | asked | Half answered: the flag stays up while letters wait (yes). Still open: one letter or the whole pile per use. |
| SC-03 | 28 | Where does the shipping bin stand on the farm, relative to the door and bed? | no | done | Owner: a few cells to the right of the farmhouse. A screenshot would pin down the exact offset. |
| SC-04 | 28 | What does the end-of-day shipping screen list, and in what order? | no | done | Owner: rows for Farming, Foraging, Fishing, Mining, Other, then Total. Each row expands to the items sold, the count of each and the money earned. |
| SC-05 | 26, 33 | Does winter 28 of year 1 roll into spring of year 2 with no year-end screen? | no | done | Owner: straight into spring of year 2, no year-end screen. |
| SC-06 | 49 | What tabs does the menu show, in what order? | no | done | Owner screenshot, 2026-11-03: eight tabs in this order: Inventory, Skills, Social, Map, Crafting, Collections, Options, Exit. The equipment slots and paper doll sit on the Inventory tab, not their own tab. Note 49 differs in order and has a separate Wear tab. |
| SC-07 | 49 | Does the clock pause while the journal is open? What does the mouse wheel do in a menu? | no | asked | Clock pause: owner not sure, and we do not need it because our menu pauses. Mouse wheel in a menu still open. |
| SC-08 | 41 | Does the farmhouse outside change by upgrade tier? Can the player enter or sleep in it during an upgrade? | no | done | Owner, 2026-11-03, corrected from their first answer: the exterior changes by tier but the building footprint does not (wiki Farmhouse page, three outdoor images, all within the 9 by 5 footprint). The player can enter and sleep during an upgrade. |
| SC-09 | 43 | How many trees does a new farm start with, and where? On what ground may a tree seed be planted? | no | asked | Owner screenshot of the day 1 Standard Farm: a dense scatter of trees (oak, pine, a few cherry at the edges) over the whole field, with bushes, stumps, boulders and branches among them. Our rough count from that screenshot, 2026-11-06 (not exact, give or take a quarter): about 110 trees in the field (about 65 broadleaf, about 45 pine), plus about 22 stumps, about 4 hollow logs, about 13 large boulders, about 220 small stones and about 105 branches (twigs). Stones are densest in the south east. The large green clumps are grass patches, not bushes. Not counting the border and the cherry trees at the edges. The stone and branch counts are rougher, give or take a third. Still open: what ground a seed may be planted on. |
| SC-10 | 50 | Can the board hold more than one request at once? In multiplayer, does everyone get the reward for a finished request? | no | done | Owner: the board can hold more than one request at once, and in multiplayer everyone gets the reward. Fits note 50 (one a day, 2 days to finish). |
| SC-11 | 16 | Is a finished Community Center room's reward granted when the room completes? | no | open | |
| SC-12 | 36 | How many weeds does a fresh farm start with on day 1, and how fast do they spread? | no | asked | Owner screenshot of day 1: weeds cover the field densely and evenly. Our rough count from that screenshot, 2026-11-06 (not exact): several hundred small weed tufts, about 300 give or take a third, spaced fairly evenly. Still open: how fast they spread. |

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
| SC-24 | 55 | Are the house, bin, greenhouse and cave positions fixed on the Standard farm, as the screenshot suggests, or do they vary? | no | open | |
| SC-25 | 55 | How many tiles across and down is the Standard farm, and how many are tillable? | no | open | |
| SC-26 | 07 | Can the host change the profit margin after the game has started, and when does it take effect? | no | open | |
| SC-27 | 50 | What chance does a day have a request on the board, and on what day does the board start posting? | no | open | |
| SC-28 | 38 | What rare item does Stardew mail for completing the full villager roster, and from which crop? | no | open | |
| SC-29 | 55 | After the player clears the starting clutter, do rocks, branches and stumps return on the farm, and when? | no | open | |
| SC-30 | 36, 43 | What are Stardew's tree types on the main map, where do they stand outside the farm, and which can be chopped? | no | half answered | Owner, 2026-11-06, from play (for M3, not M2): three tree types on the main map, in fixed places outside the farm. Chopped trees there regrow. Some are cosmetic and cannot be chopped. Still open: the three names, per-type seeds and yields, and the regrow time. |
| SC-31 | 43, 55 | Which axe tier does each starting-field stump and hollow log need, what does each give, and do they come back after clearing? | no | half answered | Owner, 2026-11-06, from play: the starting stumps are hardwood obstacles that need a better axe than the starting one, and hollow logs are a bigger, tougher version. They are not the stump a chopped tree leaves. Axe tiers set in note 44: copper for stumps, steel for logs (Stardew rule from memory, unchecked). The Standard farm starts with both (owner). Still open: the yields and whether they return (see SC-29). |
| SC-32 | 57 | What triggers the Special Orders board (second board) to appear, where does it stand, and how do special orders work (count, timers, rewards, whether they repeat)? | no | open | Owner, 2026-11-06: it is a second board that shows up after some time or stage. Note 57 reserves the spot and uses a placeholder unlock. |
| SC-33 | 57 | Does Stardew's farmhouse TV show tomorrow's weather, and is there a festival heads-up? | no | open | From memory only. The owner chose to follow it (2026-11-06). |
| SC-34 | 19 | Does Stardew put any of its areas (Town, Mountain, Forest, Beach) on the same playable map, or is each one a separate map? | no | open | From memory: separate maps joined by exits. Owner, 2026-11-06, recalled the Town and Mountain as combined. Unchecked. We chose the Beach into the River delta for our own reasons. |
| SC-35 | 19 | Does every Stardew household have a home the player can enter, and do the houses stand apart around the town? | no | open | From memory only. The owner chose to follow it for the three Hearthwell burrows (2026-11-06). |
| SC-36 | 58 | Are Stardew's coop and barn walk-in interiors, with the big and deluxe tiers adding to the base layout or replacing it? Is the greenhouse a walk-in map? | no | open | Owner, 2026-11-06: yes, walk in, and the tiers add parts to one layout per building type. Not checked on the wiki. |
| SC-37 | 58 | Does any Stardew shop keep its owner's home as a separate map from the shop, or is each one map? | no | open | From memory only. We chose two maps for the Outpost regardless (2026-11-06). |
| SC-38 | 58 | What are the interior sizes in tiles of the coop, barn, big and deluxe versions, and does each tier keep the same entrance spot? | no | done | Measured from the owner's full size screenshots, 2026-11-06, using the feeding bench hay slots (one tile each) and window spacing as the scale. Coop 11 by 8, 15 by 8, 22 by 8. Barn 17 by 13, 21 by 13, 24 by 13, give or take half a tile. Coop door stays bottom left. Barn door moves by tier. Owner can still confirm in game. |

## Not Stardew questions

These are flagged "unchecked" but only our own playtests or a real tablet can
settle them: notes 45 to 48 (controls, mouse, action order on one tile), the
touch quantity prompt in note 28 (#59, #63), and the wheel and Page Up rules in
note 49 that are marked "ours".
