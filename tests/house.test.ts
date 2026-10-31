import { describe, expect, it } from "vitest";
import {
  isAreaOpen,
  MAX_HOUSE_TIER,
  openAreas,
  sealedAreas,
} from "../src/core/house";
import { maps } from "../src/content/maps";
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

describe("house map", () => {
  const house = () => maps.get("house");
  const kitchen = { x: 2, y: 3 };
  const bedroom = { x: 14, y: 3 };
  const start = house().entry("door")!;

  it("blocks the sealed rooms at tier 0 and opens them at tier 1", () => {
    house().seal(sealedAreas(0));
    expect(house().isBlocked(kitchen.x, kitchen.y)).toBe(true);
    expect(house().isBlocked(bedroom.x, bedroom.y)).toBe(true);
    house().seal(sealedAreas(1));
    expect(house().isBlocked(kitchen.x, kitchen.y)).toBe(false);
    expect(house().isBlocked(bedroom.x, bedroom.y)).toBe(false);
  });

  it("lets the player walk from the door to both new rooms at tier 1", () => {
    house().seal(sealedAreas(1));
    const walkable = house().reachable(start);
    expect(walkable.has(`${kitchen.x},${kitchen.y}`)).toBe(true);
    expect(walkable.has(`${bedroom.x},${bedroom.y}`)).toBe(true);
  });

  it("keeps the start room and the bed reachable at tier 0", () => {
    house().seal(sealedAreas(0));
    const bed = house().services.find((s) => s.kind === "bed")!;
    expect(
      house()
        .reachable(start)
        .has(`${bed.x},${bed.y + 1}`),
    ).toBe(true);
    expect(house().problems()).toEqual([]);
  });
});
