# 27 Touch controls (draft)

Status: draft. Decided with the owner on 2026-10-31. Nothing here is built
except the floating stick (`src/scenes/controls.ts`). Reference: the Stardew
Valley Wiki Mobile Controls and Controls pages, read only (ADR 0002).

## Decisions

- Default on a tablet is tap-to-move, as in Stardew. Tap a spot and the farmer
  walks there. Holding a finger down makes the farmer follow it.
- Tapping an object walks to it and acts on it, picking the right tool for the
  job (pickaxe for a rock, axe for a tree). The scythe, seeds and food stay
  manual picks from the toolbar, as in Stardew.
- A second scheme is a floating stick on the left half with a use-tool button
  (hold to repeat) and an action button on the right. The stick we have now is
  the base for it.
- The player switches scheme in options. Two schemes only.
- Keyboard and mouse on desktop are unchanged.

## Why two schemes

Stardew's own page says tap-to-move is too imprecise for careful placement, so
it points players to a stick scheme for those jobs. Tilling a tight plot and
placing objects are our careful jobs, so the stick scheme must stay one tap
away in options.

## Open questions

- Does tap-to-move need pathfinding around rocks and water, or does it stop at
  an obstacle? Stardew highlights a blocked target in red.
- How a tap near the screen edge avoids changing the tool by accident (a known
  complaint on Stardew's page).
- Where the Eat button and toolbar row sit in each scheme.
- Checked on a real tablet (#59, #63) before either scheme is called done.
