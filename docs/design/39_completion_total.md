# 39 The completion total

Status: decided 2026-10-31 for the categories, the weights, where it is seen and
the reward. Counts that depend on undesigned systems are marked open.

Part of #196, with `38_achievements.md`. It is the Perfection-style total the
owner asked for on 2026-10-29, and it is the counterpart of Stardew's
perfection tracker.

## What Stardew does

From the saved Perfection Tracker page, read 2026-10-31.

- Eleven categories with fixed weights that add to 100 percent: produce and
  forage shipped 15, obelisks on the farm 4, the gold clock on the farm 10,
  monster slayer goals 10, friends at maximum hearts 11, every skill at level 10
  5, every stardrop 10, every recipe cooked 10, every item crafted 10, every
  fish caught 10, and golden walnuts 5.
- The score is rounded down, so 100 percent shows only when the game is truly
  complete.
- The board sits in a late-game room on Ginger Island, opened with golden
  walnuts. Reaching 100 percent unlocks new content and puts a golden egg in the
  room's shop. The saved page does not say what the new content is.
- Children's friendship does not count toward the friends category, and the
  maximum hearts are 8 for people you can court and 10 for the rest.

## Decisions

Each had a Stardew option.

1. **Stardew's categories minus two, with the hall and gallery added.** The
   obelisks (fast travel) and the gold clock (stops fence decay) have no use
   here, since we have neither fast travel nor fence decay. Their 14 percent goes mostly to hall
   bundles and gallery donations. The owner asked that bundles and collections
   count (`21_fishing.md`, item 13b). The table below gives the exact weights.
2. **On the collections page, always visible.** The total is a percentage with
   each category's progress, next to the achievements. It is rounded down, so
   100 shows only at true completion. This replaces Stardew's late-game board.
3. **The reward is a final hat, a hall scene and a keepsake.** The summit
   achievement's hat (`38_achievements.md`), a short scene at the hall, and a
   keepsake as furniture. No gameplay power. This is ring 1's reward.
4. **Each ring has its own total, plus a valley total.** Ring 1's total is a
   full 100 on its own. Ring 2 (M4) and ring 3 (M5, optional and late) each get
   their own 100 and their own reward when they exist. A player who never leaves
   ring 1 can still finish something. Stardew's single total needs its late
   region for the last 5 percent, which would make our optional ring 3 a
   requirement for 100.

## Ring 1 categories

| Category | Weight | Counts | Slice |
| --- | --- | --- | --- |
| Shipped items | 16 | One of every item in the shipped collection (`28_shipping_bin.md`) | 1 |
| Hall bundles | 12 | Bundles completed, of the 30 (`16_bundles.md`) | 1 to 5 |
| Gallery donations | 5 | Finds donated, of the gallery's list (`38_achievements.md`) | Later |
| Slayer goals | 10 | Every goal on the mines' slayer list (`22_mines.md`) | 3 |
| Friends | 12 | Every person at maximum hearts, children excluded | 4 |
| Skills | 5 | Every skill at level 10 | 1 to 3 |
| Rare boost items | 10 | Every item that raises maximum energy for good | Open |
| Cooking | 10 | Every recipe cooked | 4 |
| Crafting | 10 | Every item crafted | 1 |
| Fish | 10 | Every fish caught, the five legends included (`21_fishing.md`) | 2 |

Total 100. The 5 percent Stardew gives its late region's collectible was given
back to ring 1's own categories, since ring 1 must be completable alone (shipped
+1, hall +2, gallery +1, friends +1). Each category adds its weight times its
progress, so half the recipes cooked is 5 of cooking's 10. Stardew's page shows
a decimal example (80.6 shown as 80), which suggests progress counts in part,
but it does not spell the rule out. Confirm in play.

## Rings 2 and 3

- **Own totals.** Each later ring gets its own 100, built from what that ring
  adds: its own collectible, its own fish or finds, its own bundles if it has a
  centre (`03_milestones.md`, centre 2 and centre 3). Categories and weights are
  set in each ring's design, not here.
- **Own reward.** Each ring's 100 gives its own hat and keepsake, in that
  ring's style. Not designed.
- **Stardew's late region.** Our system review maps Ginger Island to ring 3
  (`25_stardew_system_review.md`), so the nearest counterpart to its golden
  walnut category belongs in ring 3, and ring 2 needs a collectible of its own.
- **Shared categories.** Skills, cooking, crafting and friends are ring 1's.
  A ring that adds recipes or items adds them to its own total, not to ring 1's,
  so finishing ring 1 stays finished.

## How it works

- **Where.** The collections page, beside the achievements tab. A total at the
  top, a bar per category, and a tap on a bar lists what is still missing.
- **When it updates.** At day end with the achievement checks
  (`38_achievements.md`).
- **The reward.** At a true 100 percent the summit achievement fires. The next
  morning the hall steward calls the player in for the scene, and the hatter
  sends the hat. The keepsake is placed as furniture by mail.
- **Not counted.** Money, the house, the festivals and the arcade game give
  achievements but are not in the total, as in Stardew.

## Proposed, not asked

- **The valley total.** It is the plain mean of the totals of the rings that
  exist, shown beside each ring's own figure, and a valley summit fires when
  every ring that exists is at 100. It drops when a new ring ships, which is
  honest but may surprise a finished player, so the page says so. This stands
  unless the owner objects.
- **Friends' maximum hearts.** Follow Stardew's split: a lower cap for people
  who can be courted and a higher cap for the rest. The numbers wait for the
  friendship design.
- **Rare boost items.** Stardew has seven stardrops from seven sources, among
  them the full museum donation set, the Master Angler mail, a floor 100 chest,
  a spouse at 12.5 hearts and two shop sales (checked on the saved Stardrop
  page). Ours are permanent energy items. Two sources are already set by
  `38_achievements.md`: the mail gift for catching every fish, and (to settle
  with the gallery's rewards) the full gallery set. The count and the other
  sources are open.

## Build notes

- Data: a list of categories in a file under `src/content/`, each with an id,
  weight and a way to read progress from a counter. Core code in `src/core/`
  sums them, free of Phaser and unit tested.
- Reuses the counters the achievements already keep (`38_achievements.md`).
  New counters (recipes cooked, items crafted) need save fields.
- Rounding down is a test: a total of 99.9 shows 99.

## Open

- The count and sources of the rare boost items.
- The slayer list's length, from the mines' design.
- Ring 2's and ring 3's categories, weights, collectibles and rewards, in their
  own designs.
- Whether partial progress counts, as proposed, or only whole items.
- The scene's script and the keepsake's design.

Stardew details above come from the saved Perfection Tracker, Stardrop and
Movie Theater pages, read on 2026-10-31.
