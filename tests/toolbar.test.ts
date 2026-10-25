import { describe, expect, it } from "vitest";
import {
  cycle,
  heldAt,
  startGame,
  TOOLBAR_SIZE,
  TOOLS,
} from "../src/core/toolbar";

describe("toolbar", () => {
  it("starts with the tools, then the backpack", () => {
    const g = startGame();
    expect(heldAt(g, 0)).toEqual({ kind: "tool", tool: "hoe" });
    expect(heldAt(g, TOOLS.length - 1)).toEqual({ kind: "tool", tool: "hand" });
    expect(heldAt(g, TOOLS.length)).toMatchObject({
      kind: "item",
      id: "parsnip-seed",
      count: 15,
    });
    expect(heldAt(g, TOOLS.length + 1)).toEqual({ kind: "empty" });
  });

  it("reads out of range as empty", () => {
    const g = startGame();
    expect(heldAt(g, -1)).toEqual({ kind: "empty" });
    expect(heldAt(g, TOOLBAR_SIZE)).toEqual({ kind: "empty" });
  });

  it("wraps when cycling", () => {
    expect(cycle(0, -1)).toBe(TOOLBAR_SIZE - 1);
    expect(cycle(TOOLBAR_SIZE - 1, 1)).toBe(0);
    expect(cycle(3, 1)).toBe(4);
  });
});
