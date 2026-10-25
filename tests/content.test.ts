import { describe, expect, it } from "vitest";
import { BUNDLES } from "../src/core/bundles";
import { SEASONS } from "../src/core/calendar";
import { CROPS } from "../src/core/crops";
import { FORAGE } from "../src/core/forage";
import { itemById, seedId } from "../src/core/items";

describe("content data", () => {
  it("has unique ids across crops, seeds and forage", () => {
    const ids = [
      ...CROPS.flatMap((c) => [c.id, seedId(c.id)]),
      ...FORAGE.map((f) => f.id),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every crop sane numbers", () => {
    for (const c of CROPS) {
      expect(c.growDays, c.id).toBeGreaterThan(0);
      expect(c.seasons.length, c.id).toBeGreaterThan(0);
      expect(c.sellPrice, c.id).toBeGreaterThan(0);
      expect(c.seedPrice, c.id).toBeGreaterThan(0);
      expect(itemById(seedId(c.id)), c.id).toBeDefined();
    }
  });

  it("offers crops and forage in every season", () => {
    for (const s of SEASONS) {
      expect(
        CROPS.some((c) => c.seasons.includes(s)),
        s,
      ).toBe(true);
      expect(
        FORAGE.some((f) => f.seasons.includes(s)),
        s,
      ).toBe(true);
    }
  });

  it("keeps every bundle completable from known goods", () => {
    for (const b of BUNDLES) {
      expect(
        b.items.filter((id) => itemById(id)).length,
        b.id,
      ).toBeGreaterThanOrEqual(b.required);
    }
  });
});
