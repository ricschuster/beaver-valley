import { describe, expect, it } from "vitest";
import { MAX_LEVEL, Skills, harvestXp } from "../src/core/skills";

describe("Skills", () => {
  it("starts at level 0", () => {
    expect(new Skills().level("farming")).toBe(0);
  });

  it("reports a level up only when it happens", () => {
    const s = new Skills();
    expect(s.gain("farming", 99)).toBeUndefined();
    expect(s.gain("farming", 1)).toBe(1);
    expect(s.level("foraging")).toBe(0);
  });

  it("can jump several levels and caps at the maximum", () => {
    const s = new Skills();
    expect(s.gain("foraging", 800)).toBe(3);
    s.gain("foraging", 1_000_000);
    expect(s.level("foraging")).toBe(MAX_LEVEL);
  });

  it("ignores negative gains", () => {
    const s = new Skills();
    s.gain("farming", -50);
    expect(s.xpOf("farming")).toBe(0);
  });

  it("gives more harvest XP for dearer crops", () => {
    expect(harvestXp(35)).toBe(7);
    expect(harvestXp(250)).toBeGreaterThan(harvestXp(35));
  });
});
