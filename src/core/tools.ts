import { forage, harvest, plant, till, water, type Outcome } from "./actions";
import type { FarmMap } from "./map";
import type { GameState } from "./save";
import { cropOfSeed } from "./items";
import type { Held } from "./toolbar";

const fail = (reason: string): Outcome => ({ ok: false, reason });

/**
 * Use what the player holds on one tile. The hoe digs soil, the can waters,
 * seeds plant, and the hand (or any other item) picks forage or harvests.
 *
 * Plots and forage are not stored per map yet, so they only work on a map
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
  if (held.kind === "tool" && held.tool === "hoe") {
    return map.isTillable(x, y) ? till(g, x, y) : fail("cannot dig here");
  }
  if (held.kind === "tool" && held.tool === "can") return water(g, x, y);
  if (held.kind === "item" && cropOfSeed(held.id)) {
    return plant(g, x, y, held.id);
  }
  return g.forage.itemAt(x, y) ? forage(g, x, y) : harvest(g, x, y);
}

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
};

/** Words for a refused action, for the player. */
export function reasonText(reason: string): string {
  return REASONS[reason] ?? reason;
}
