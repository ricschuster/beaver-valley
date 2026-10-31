import { describe, expect, it } from "vitest";
import { isAreaOpen, MAX_HOUSE_TIER, openAreas } from "../src/core/house";
import { deserialize, newGame, serialize } from "../src/core/save";

describe("house tiers", () => {
  it("opens only the start room at tier 0", () => {
    expect(openAreas(0)).toEqual(["start"]);
    expect(isAreaOpen(0, "kitchen")).toBe(false);
  });

  it("opens the kitchen and bedroom at tier 1", () => {
    expect(openAreas(1)).toEqual(["start", "kitchen", "bedroom"]);
    expect(isAreaOpen(1, "bedroom")).toBe(true);
  });

  it("never closes an area at a higher tier", () => {
    for (let t = 0; t < MAX_HOUSE_TIER; t++) {
      for (const a of openAreas(t)) expect(isAreaOpen(t + 1, a)).toBe(true);
    }
  });

  it("clamps tiers out of range", () => {
    expect(openAreas(-1)).toEqual(openAreas(0));
    expect(openAreas(99)).toEqual(openAreas(MAX_HOUSE_TIER));
  });
});

describe("house tier in the save", () => {
  it("starts at tier 0", () => {
    expect(newGame().houseTier).toBe(0);
  });

  it("round-trips the tier", () => {
    const g = newGame();
    g.houseTier = 1;
    expect(deserialize(serialize(g))!.houseTier).toBe(1);
  });

  it("loads a save without a tier as tier 0", () => {
    const raw = JSON.parse(serialize(newGame()));
    delete raw.houseTier;
    expect(deserialize(JSON.stringify(raw))!.houseTier).toBe(0);
  });

  it("clamps a tier that is too high", () => {
    const raw = JSON.parse(serialize(newGame()));
    raw.houseTier = 50;
    expect(deserialize(JSON.stringify(raw))!.houseTier).toBe(MAX_HOUSE_TIER);
  });
});
