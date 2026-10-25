import { describe, expect, it } from "vitest";
import { FORAGE, ForageField, MAX_FILL } from "../src/core/forage";
import { itemById } from "../src/core/items";

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const spots = Array.from({ length: 40 }, (_, i) => ({ x: i, y: 0 }));

describe("ForageField", () => {
  it("scatters in-season goods, within the cap", () => {
    for (let seed = 1; seed <= 20; seed++) {
      const f = new ForageField();
      f.respawn("spring", spots, seeded(seed));
      expect(f.count).toBeLessThanOrEqual(spots.length * MAX_FILL);
      for (const s of spots) {
        const id = f.itemAt(s.x, s.y);
        if (id)
          expect(FORAGE.find((d) => d.id === id)?.seasons).toContain("spring");
      }
    }
  });

  it("clears leftovers on respawn", () => {
    const f = new ForageField();
    f.respawn("spring", spots, () => 0.99);
    expect(f.count).toBeGreaterThan(0);
    f.respawn("spring", spots, () => 0);
    expect(f.count).toBe(0);
  });

  it("collects once", () => {
    const f = new ForageField();
    f.respawn("summer", spots, () => 0.99);
    const at = spots.find((s) => f.itemAt(s.x, s.y));
    expect(at).toBeDefined();
    const id = f.collect(at!.x, at!.y);
    expect(id && itemById(id)).toBeTruthy();
    expect(f.collect(at!.x, at!.y)).toBeUndefined();
  });
});
