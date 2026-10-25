import { SLOT_COUNT } from "./inventory";
import { seedId } from "./items";
import { newGame, type GameState } from "./save";

/** Tools that are always carried and never run out. */
export const TOOLS = ["hoe", "can", "hand"] as const;
export type Tool = (typeof TOOLS)[number];

/** The toolbar is the three tools, then the backpack slots in order. */
export const TOOLBAR_SIZE = TOOLS.length + SLOT_COUNT;

/** What the player is holding. An item is a backpack stack: seeds, produce or forage. */
export type Held =
  | { kind: "tool"; tool: Tool }
  | { kind: "item"; id: string; count: number }
  | { kind: "empty" };

/** What sits at a toolbar index. Out of range reads as empty. */
export function heldAt(g: GameState, index: number): Held {
  const tool = TOOLS[index];
  if (tool) return { kind: "tool", tool };
  const stack = g.inventory.slot(index - TOOLS.length);
  return stack ? { kind: "item", ...stack } : { kind: "empty" };
}

/** Step the selection by one, wrapping at both ends. */
export function cycle(index: number, step: 1 | -1): number {
  return (index + step + TOOLBAR_SIZE) % TOOLBAR_SIZE;
}

/** Seeds a new game starts with, so the first day can be played at once. */
export const START_SEEDS = { crop: "parsnip", count: 15 } as const;

/** A new game with the starting seeds in the backpack. */
export function startGame(): GameState {
  const g = newGame();
  g.inventory.add(seedId(START_SEEDS.crop), START_SEEDS.count);
  return g;
}
