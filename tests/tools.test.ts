import { describe, expect, it } from "vitest";
import { FarmMap, type TiledMapJson } from "../src/core/map";
import { startGame, heldAt } from "../src/core/toolbar";
import { reasonText, useHeld } from "../src/core/tools";
import type { Held } from "../src/core/toolbar";

const layer = (name: string, data: number[]) => ({
  name,
  type: "tilelayer",
  data,
});

/** A 3x1 map: tillable, tillable, hard ground. */
function mapWith(soil: boolean): FarmMap {
  const json: TiledMapJson = {
    width: 3,
    height: 1,
    tilewidth: 16,
    tileheight: 16,
    layers: [
      layer("collision", [0, 0, 0]),
      ...(soil ? [layer("soil", [1, 1, 0])] : []),
      {
        name: "objects",
        type: "objectgroup",
        objects: [{ name: "start", class: "entry", x: 0, y: 0 }],
      },
    ],
  };
  return FarmMap.fromTiled(json);
}

const hoe: Held = { kind: "tool", tool: "hoe" };
const can: Held = { kind: "tool", tool: "can" };
const hand: Held = { kind: "tool", tool: "hand" };

describe("useHeld", () => {
  it("runs the plant, water, harvest loop", () => {
    const g = startGame();
    const map = mapWith(true);
    const seeds = heldAt(g, 3);
    expect(useHeld(g, map, hoe, 0, 0).ok).toBe(true);
    expect(useHeld(g, map, seeds, 0, 0).ok).toBe(true);
    expect(g.inventory.count("parsnip-seed")).toBe(14);
    for (let i = 0; i < 4; i++) {
      expect(useHeld(g, map, can, 0, 0).ok).toBe(true);
      g.farm.endDay("spring");
    }
    const got = useHeld(g, map, hand, 0, 0);
    expect(got).toMatchObject({ ok: true, item: "parsnip" });
    expect(g.inventory.count("parsnip")).toBe(1);
  });

  it("spends energy on the hoe and the can only", () => {
    const g = startGame();
    const map = mapWith(true);
    useHeld(g, map, hoe, 0, 0);
    expect(g.day.energy.current).toBe(268);
    useHeld(g, map, heldAt(g, 3), 0, 0);
    expect(g.day.energy.current).toBe(268);
  });

  it("refuses hard ground and maps without soil", () => {
    const g = startGame();
    expect(useHeld(g, mapWith(true), hoe, 2, 0)).toEqual({
      ok: false,
      reason: "cannot dig here",
    });
    expect(useHeld(g, mapWith(false), hoe, 0, 0)).toEqual({
      ok: false,
      reason: "nothing to do here",
    });
  });

  it("picks forage with the hand", () => {
    const g = startGame();
    g.forage.respawn("spring", [{ x: 1, y: 0 }], () => 0.99);
    expect(g.forage.count).toBe(1);
    const got = useHeld(g, mapWith(true), hand, 1, 0);
    expect(got.ok).toBe(true);
    expect(g.forage.count).toBe(0);
  });

  it("explains every refusal in words", () => {
    expect(reasonText("exhausted")).toBe("You are too tired.");
    expect(reasonText("odd")).toBe("odd");
  });
});
