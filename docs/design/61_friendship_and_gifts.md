# 61 Friendship and gift tastes

Status: **core rules decided with the owner on 2026-11-06.** The points, caps,
gift limits, decay, bad gifts, taste tiers, how tastes are learned, birthdays
and the quality bonus are set. Rows marked "proposed" were not asked and stand
unless the owner objects. Nothing here is built. It feeds slice 4
(`33_build_order.md`), house tiers 2 and 3 (#286) and the recipe mail
(`24_processing_and_cooking.md`).

Source: the saved Stardew Friendship page, read 2026-11-06. The numbers are
facts about Stardew, used as a starting point for our own rules (ADR 0002). No
text or villager list is copied.

## Why

Friendship was decided to exist (`09_story_and_lore.md`) and marriage was
designed on top of it (`12_marriage.md`), but the mechanics had no note. This
note sets the points, the gifts and the tastes, so that the dialogue, the
recipe mail, the hat standing and the achievements all read one system.

## Decided (2026-11-06)

1. **Scale: Stardew's.** One heart is 250 points. Friends run to 10 hearts
   (2,500 points). A courtable person stops at 8 hearts (2,000) until the player
   gives them a bouquet, then runs to 10. A spouse runs to 14 (`12_marriage.md`).
   Notes 38 and 39 are built on these caps.
2. **Talking is +20 a day,** once per villager per day.
3. **Gifts: one a day, two a week (Stardew).** The week starts on Sunday. Two
   gifts in one week add +10 points the next Sunday morning. A birthday gift
   is always allowed and does not count against the two. A spouse can be given
   a gift every day, with gains and losses halved.
4. **No decay.** Not talking to someone never costs hearts. This keeps the
   rule in `09_story_and_lore.md` and `12_marriage.md`.
5. **Bad gifts do cost points (Stardew).** Dislike is -20 and hate is -40. This
   narrows two earlier lines. "Hearts never fall" in `18_dialogue.md` now means
   no loss from neglect or from dialogue choices. A single bad gift can still
   cost points, and the spouse takes half. No anger, no lasting grudge: the
   villager answers with a wry line, and a later good gift earns the points
   back.
6. **Five taste tiers with universal categories (Stardew).** Love, like,
   neutral, dislike, hate. Points for a gift on an ordinary day:

   | Taste | Points |
   | --- | --- |
   | Love | +80 |
   | Like | +45 |
   | Neutral | +20 |
   | Dislike | -20 |
   | Hate | -40 |

   A villager's own list overrides the universal taste. An item on no list falls
   to its category's universal taste, then to neutral.
7. **How the player learns tastes.** Three ways:
   - **A gift log** on the Social tab (`49_menu_and_journal.md`) records each
     gift given and the reaction, kept per villager.
   - **Family and friends hint** (Stardew). From 1 heart a villager may say what
     a relative or friend loves or hates. The links are cast data
     (`20_ring1_cast.md`, households).
   - **The inn hint (ours).** The inn keeper's family give one hint a day to
     anyone who asks, about a villager the player has met. No secret notes in
     the first build.
8. **Birthdays: one each (Stardew).** A gift on the birthday counts x8 and
   ignores the weekly cap. The calendar shows birthdays. None falls on a
   festival day. A birthday in Hearthwell is a small hat day in the Brimmers'
   custom (flavour only, no extra mechanic).
9. **Quality counts for liked and loved gifts (Stardew).** Silver x1.1, gold
   x1.25, iridium x1.5. A normal quality loved gift still beats an iridium
   liked one (80 against 67). Our quality tiers are assumed to match the
   crops' tiers in `07_tuning_numbers.md`. Check at build.

## Points table (derived)

| Gift | Ordinary day | Birthday (x8) | Midwinter Feast (x5, proposed) |
| --- | --- | --- | --- |
| Love | 80 | 640 | 400 |
| Like | 45 | 360 | 225 |
| Neutral | 20 | 160 | 100 |
| Dislike | -20 | -160 | -100 |
| Hate | -40 | -320 | -200 |

Quality multiplies only the Love and Like rows. A normal loved gift on a day
that is not special is a little under a third of a heart.

## Proposed (not asked)

These follow the saved page and our earlier notes. They stand unless the owner
objects.

1. **A request delivery is +150 points** to the poster (`50_request_board_and_quests.md`).
   It is not a gift and does not use the daily gift.
2. **Midwinter Feast** (`14_festival_calendar.md`): the player gives a gift to
   one assigned villager, worth x5. A villager gives the player one back.
   Speaking at any festival is still +20, the same as any day.
3. **The Guests' Board bundles** (22 to 26, `16_bundles.md`): when the last of
   the five is finished, every villager who is not a candidate and whom the
   player has met gains +500 (two hearts). Stardew gives this for its bulletin
   board. A letter from the hall steward arrives the next morning.
4. **First meeting.** The first talk with each person is when they join the
   Social tab. People not yet met show as "???" and gain no points from the
   bundle bonus.
5. **Flower Dance equivalent:** the dance partner at the spring festival gains
   one heart (250). Whether we have such a dance is for the festival design.
6. **A person's door.** The player may enter a villager's home room at 2
   hearts, as in Stardew. Before that the door is shut and the person is met
   outside, at the shop or on the street. It stays open once unlocked
   (`58_interiors.md`).
7. **Heart events** at 2, 4, 6, 8 and 10 hearts for the 14 candidates and the
   deep tier, fewer for the rest. They are released in layers: layer 1 for
   everyone before layer 3 for anyone (`18_dialogue.md`). Courtship events
   unlock after the bouquet. Missed events can be seen later, in any order,
   except where the story needs one first. An event never takes hearts away
   through a choice. A choice may change how fast hearts rise.
8. **Recipe mail** at 5 and 10 hearts, for people who cook or keep a shop
   (`24_processing_and_cooking.md`). Keepsake mail from other people at the same
   steps (`10_customisation.md`, `51_mail_and_letters.md`).
9. **Spouse perk:** at 12.5 hearts (3,125 points) the spouse gives a rare
   permanent boost, our own item (`12_marriage.md`).
10. **Hat standing stays cosmetic.** The player's hat is only a look. Brimmers'
    dialogue and the Hat Parade react to hearts, not to which hat is worn.
    This settles the open question in `10_customisation.md`.
11. **Per-villager gift record.** The save keeps the last hat given to each
    villager, so the Valley Day scene can show it (`39_completion_total.md`).
12. **Courtship and proposal items** are the bouquet and the unworn token from
    `12_marriage.md`. Flower types and the token's name stay open.
13. **Children have a lower weight.** They use the 10 heart cap and the standard
    dialogue tier. They do not count toward the Friends category in note 39 or
    the heart achievements in note 38, as already set.

## Universal tastes (proposed categories)

Categories use our own item groups. The lists are data, one per taste, in a
file under `src/content/`. The first pass sets the shape, not every item.

| Taste | Category or item (first pass) |
| --- | --- |
| Love | A few rare goods only: the elderfruit, the golden-crop prize, a pearl. At most six items. Exceptions are per villager |
| Like | Cooked dishes, artisan goods, flowers, farm vegetables, fruit from trees, gems and foraged minerals |
| Neutral | Eggs, milk, wheat and grain, most forage, most fish, plain bread and fried egg |
| Dislike | Raw oil, junk and trash, weeds and raw stone |
| Hate | Spoiled and burnt dishes, and a very few items the writing chooses |

Stardew's own lists are a reference for shape only. Our list is built from our
items (`src/content/`), never a copy of Stardew's. Each of the 30 people gets
at most a handful of own loves, likes, dislikes and hates that override these.
Candidates get a few more. The first villager data in slice 4 needs these lists
for about eight people, with the rest added by layer.

## Data and build

- **Villager row:** id, birthday (season and day), tier, candidate flag, heart
  cap (8 or 10), loves, likes, dislikes, hates, family and friends for hints.
  Lists can name an item or a category. Adding a villager never means a code
  change (`09_story_and_lore.md`).
- **Save fields:** points per villager, gifts given this week, whether the
  daily talk and gift were done, the gift log, whether the bouquet was given,
  the last hat given, and the spouse state. It goes in a save version bump
  (`src/scenes/storage.ts`).
- **Core module:** `src/core/friendship.ts`, free of Phaser, covers points,
  caps, the weekly rule, taste lookup and the quality multiplier. It is unit
  tested.
- **Interface:** the Social tab (`49_menu_and_journal.md`) shows hearts, the
  weekly gift boxes and the gift log. The talk and gift prompts live on the
  villager.
- **Build order:** slice 4 (`33_build_order.md`). Layer 1 of the dialogue and
  the first eight villagers' tastes go first.

## Not decided (open)

- The exact universal love list and each person's own tastes. They are written
  with the cast and the item list.
- Whether the week in our calendar has seven named days (the Sunday rule needs
  one). Check `26_seasons.md` at build.
- Birthday dates for the 30 people.
- Heart event content and which events gate which rewards.
- The Midwinter assignment rule (who gets whom).
- The courtship bouquet's flowers and the proposal token's name.
- Whether telephone-like contact exists. It does not now.

## Stardew checks

All numbers above come from the saved Friendship page, read 2026-11-06, so no
new register row is needed. Not checked: the gift log's exact reactions, and
the Friendship 101 book (+10 percent gains), which we do not have.
