import { describe, expect, it } from "vitest";
import { till, TOOL_ENERGY } from "../src/core/actions";
import { MAX_ENERGY } from "../src/core/energy";
import { deserialize, newGame, serialize } from "../src/core/save";
import {
  MAX_TIER,
  MIN_SWING,
  swingCost,
  upgrade,
  upgradeCost,
} from "../src/core/upgrades";

describe("tool upgrades", () => {
  it("costs rise by tier and stop at the top", () => {
    expect(upgradeCost(0)).toBe(2000);
    expect(upgradeCost(2)).toBe(10000);
    expect(upgradeCost(MAX_TIER)).toBeUndefined();
  });

  it("takes the money once and refuses when short or maxed", () => {
    const tiers = { hoe: 0, can: 0 };
    const wallet = { money: 2500 };
    expect(upgrade(tiers, wallet, "hoe")).toBe(true);
    expect(tiers.hoe).toBe(1);
    expect(wallet.money).toBe(500);
    expect(upgrade(tiers, wallet, "hoe")).toBe(false);
    const rich = { money: 99999 };
    for (let i = 0; i < 5; i++) upgrade(tiers, rich, "can");
    expect(tiers.can).toBe(MAX_TIER);
  });

  it("swings cost less with tier and farming level, never under the floor", () => {
    expect(swingCost(2, 0, 0)).toBe(2);
    expect(swingCost(2, 2, 0)).toBe(1.5);
    expect(swingCost(2, 0, 5)).toBe(1.5);
    expect(swingCost(2, 3, 10)).toBe(MIN_SWING);
  });

  it("an upgraded hoe spends less energy", () => {
    const g = newGame();
    g.toolTiers.hoe = 2;
    till(g, 0, 0);
    expect(g.day.energy.current).toBe(MAX_ENERGY - (TOOL_ENERGY - 0.5));
  });

  it("tiers survive a save, and old saves load as basic", () => {
    const g = newGame();
    g.toolTiers.can = 3;
    expect(deserialize(serialize(g))!.toolTiers).toEqual({ hoe: 0, can: 3 });
    const raw = JSON.parse(serialize(g));
    delete raw.toolTiers;
    expect(deserialize(JSON.stringify(raw))!.toolTiers).toEqual({
      hoe: 0,
      can: 0,
    });
  });
});
