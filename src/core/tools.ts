import {
  chop,
  clearSeedling,
  forage,
  harvest,
  plant,
  plantTree,
  shake,
  till,
  water,
  type Outcome,
} from "./actions";
import { TREE_SEED } from "./trees";
import type { FarmMap } from "./map";
import type { GameState } from "./save";
import { cropOfSeed } from "./items";
import type { Held } from "./toolbar";

const fail = (reason: string): Outcome => ({ ok: false, reason });

/**
 * Use what the player holds on one tile. The hoe digs soil, the can waters,
 * seeds plant, and the hand tool picks forage or harvests. Any other item does
 * nothing here: picking, shaking and harvesting belong to `act`.
 *
 * The axe fells trees, a tree seed plants one, and the hand tool shakes a loose
 * seed from a mature tree.
 *
 * Plots, forage and trees are not stored per map yet, so they only work on a map
 * with soil. Anywhere else the tools do nothing.
 */
export function useHeld(
  g: GameState,
  map: FarmMap,
  held: Held,
  x: number,
  y: number,
): Outcome {
  if (held.kind === "empty") return fail("nothing held");
  if (!map.hasSoil) return fail("nothing to do here");
  if (held.kind === "tool" && held.tool === "axe")
    return chop(g, x, y, Math.random, map);
  if (held.kind === "tool" && held.tool === "hoe") {
    if (g.trees.at(x, y)) return clearSeedling(g, x, y, "hoe", map);
    return map.isTillable(x, y) ? till(g, x, y) : fail("cannot dig here");
  }
  if (held.kind === "tool" && held.tool === "can")
    return g.trees.at(x, y)
      ? clearSeedling(g, x, y, "can", map)
      : water(g, x, y);
  if (held.kind === "item" && cropOfSeed(held.id)) {
    return plant(g, x, y, held.id);
  }
  if (held.kind === "item" && held.id === TREE_SEED)
    return plantTree(g, map, x, y);
  // The hand tool keeps its pick-up job; every other item only has the Action
  // button for that (note 47).
  if (held.kind === "tool" && held.tool === "hand") return pick(g, x, y);
  return fail("nothing to do here");
}

/** The reason `act` gives when the tile holds nothing to act on. It shows no message. */
export const NOTHING_TO_ACT_ON = "nothing to act on";

/** Shake a tree, pick forage or harvest a crop: what the hand does on one tile. */
function pick(g: GameState, x: number, y: number): Outcome {
  if (g.trees.at(x, y)) return shake(g, x, y);
  return g.forage.itemAt(x, y) ? forage(g, x, y) : harvest(g, x, y);
}

/**
 * The Action button on one tile (note 47): shake a tree, pick forage or harvest
 * a ripe crop. It never reads the held slot. A tile with nothing to act on gives
 * `NOTHING_TO_ACT_ON`, which shows no message and costs no energy. Other refusals,
 * such as a full backpack, still explain themselves.
 *
 * Services and eating are the scene's to do; this covers the farm tiles only.
 */
export function act(g: GameState, map: FarmMap, x: number, y: number): Outcome {
  if (!map.hasSoil) return fail(NOTHING_TO_ACT_ON);
  const result = pick(g, x, y);
  if (result.ok) return result;
  return QUIET.has(result.reason) ? fail(NOTHING_TO_ACT_ON) : result;
}

/** Misses that mean "nothing here" rather than "you could not". */
const QUIET = new Set(["nothing ripe", "nothing to shake", "nothing here"]);

const REASONS: Record<string, string> = {
  exhausted: "You are too tired.",
  "already tilled": "Already dug.",
  "nothing to water": "Dig the soil first.",
  "already watered": "Already watered.",
  "not a seed": "That cannot be planted.",
  "no seeds": "Out of seeds.",
  "cannot plant here": "Cannot plant here. Dig first, or wrong season.",
  "nothing ripe": "Nothing to pick here.",
  "backpack full": "Your backpack is full.",
  "cannot dig here": "The ground is too hard here.",
  "nothing to do here": "Nothing to do here.",
  "nothing held": "Select a tool or item.",
  "nothing to chop": "Nothing to chop here.",
  "a tree is in the way": "A tree is in the way.",
  "nothing to shake": "Nothing falls from there.",
  "cannot plant tree here": "A tree cannot grow there.",
  "not food": "That cannot be eaten.",
  "nothing to eat": "Select food to eat.",
  "not hungry": "You are not tired.",
  [NOTHING_TO_ACT_ON]: "",
};

/** Words for a refused action, for the player. */
export function reasonText(reason: string): string {
  return REASONS[reason] ?? reason;
}
