import { describe, expect, it } from "vitest";
import { Farm } from "../src/core/farm";
import { CROPS } from "../src/core/crops";

function grow(
  farm: Farm,
  days: number,
  season: "spring" | "summer" = "spring",
) {
  for (let i = 0; i < days; i++) {
    farm.water(0, 0);
    farm.endDay(season);
  }
}

describe("crop data", () => {
  it("has unique ids and sane numbers", () => {
    expect(new Set(CROPS.map((c) => c.id)).size).toBe(CROPS.length);
    for (const c of CROPS) {
      expect(c.growDays).toBeGreaterThan(0);
      expect(c.sellPrice).toBeGreaterThan(0);
      expect(c.seasons.length).toBeGreaterThan(0);
    }
  });
});

describe("Farm", () => {
  it("tills once", () => {
    const f = new Farm();
    expect(f.till(0, 0)).toBe(true);
    expect(f.till(0, 0)).toBe(false);
  });

  it("plants only in tilled, empty soil and in season", () => {
    const f = new Farm();
    expect(f.plant(0, 0, "parsnip", "spring")).toBe(false);
    f.till(0, 0);
    expect(f.plant(0, 0, "melon", "spring")).toBe(false);
    expect(f.plant(0, 0, "parsnip", "spring")).toBe(true);
    expect(f.plant(0, 0, "parsnip", "spring")).toBe(false);
  });

  it("grows only on watered days and harvests when ripe", () => {
    const f = new Farm();
    f.till(0, 0);
    f.plant(0, 0, "parsnip", "spring");
    f.endDay("spring");
    expect(f.plotAt(0, 0)?.crop?.daysGrown).toBe(0);
    grow(f, 3);
    expect(f.harvest(0, 0)).toBeUndefined();
    grow(f, 1);
    expect(f.harvest(0, 0)).toBe("parsnip");
    expect(f.plotAt(0, 0)?.crop).toBeUndefined();
    expect(f.plotAt(0, 0)?.tilled).toBe(true);
  });

  it("dries plots overnight", () => {
    const f = new Farm();
    f.till(0, 0);
    f.water(0, 0);
    expect(f.plotAt(0, 0)?.wateredToday).toBe(true);
    f.endDay("spring");
    expect(f.plotAt(0, 0)?.wateredToday).toBe(false);
  });

  it("regrowing crops keep producing", () => {
    const f = new Farm();
    f.till(0, 0);
    f.plant(0, 0, "tomato", "summer");
    grow(f, 11, "summer");
    expect(f.harvest(0, 0)).toBe("tomato");
    expect(f.harvest(0, 0)).toBeUndefined();
    grow(f, 4, "summer");
    expect(f.harvest(0, 0)).toBe("tomato");
  });

  it("withers crops when the season changes", () => {
    const f = new Farm();
    f.till(0, 0);
    f.plant(0, 0, "parsnip", "spring");
    f.endDay("summer");
    expect(f.plotAt(0, 0)?.crop).toBeUndefined();
  });
});
