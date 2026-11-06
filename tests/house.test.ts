import { describe, expect, it } from "vitest";
import {
  BUILD_DAYS,
  houseMapId,
  isHouseMap,
  MAX_HOUSE_TIER,
  orderProblem,
  orderUpgrade,
  WOOD,
} from "../src/core/house";
import { maps } from "../src/content/maps";
import { festivalToday } from "../src/core/festivals";
import { deserialize, newGame, serialize } from "../src/core/save";
import { sleep } from "../src/core/sleep";

describe("house map per tier", () => {
  it("uses the start map at tier 0 and the tier 1 map after", () => {
    expect(houseMapId(0)).toBe("house");
    expect(houseMapId(1)).toBe("house-1");
  });

  it("uses the tier 1 map for later tiers until their maps exist", () => {
    expect(houseMapId(MAX_HOUSE_TIER)).toBe("house-1");
  });

  it("clamps tiers out of range", () => {
    expect(houseMapId(-1)).toBe("house");
  });

  it("knows which maps are house interiors", () => {
    expect(isHouseMap("house")).toBe(true);
    expect(isHouseMap("house-1")).toBe(true);
    expect(isHouseMap("farm")).toBe(false);
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

describe("house maps", () => {
  const start = () => maps.get(houseMapId(0));
  const tier1 = () => maps.get(houseMapId(1));
  const bed = (m: ReturnType<typeof start>) =>
    m.services.find((s) => s.kind === "bed")!;

  it("has the planned sizes", () => {
    expect([start().width, start().height]).toEqual([11, 10]);
    expect([tier1().width, tier1().height]).toEqual([31, 12]);
  });

  it("has no problems on either map", () => {
    expect(start().problems()).toEqual([]);
    expect(tier1().problems()).toEqual([]);
  });

  it("leads each door back to the farm's house entry", () => {
    for (const m of [start(), tier1()]) {
      const door = m.exits.find((e) => e.map === "farm")!;
      expect(door.entry).toBe("from_house");
      expect(m.entry("door")).toBeDefined();
    }
  });

  it("keeps the bed reachable from the door on both maps", () => {
    for (const m of [start(), tier1()]) {
      const b = bed(m);
      const walkable = m.reachable(m.entry("door")!);
      const sides = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ].some(([dx, dy]) => walkable.has(`${b.x + dx!},${b.y + dy!}`));
      expect(sides).toBe(true);
    }
  });

  it("lets the player walk from the door into the kitchen and bedroom at tier 1", () => {
    const walkable = tier1().reachable(tier1().entry("door")!);
    expect(walkable.has("4,5")).toBe(true); // kitchen
    expect(walkable.has("25,5")).toBe(true); // bedroom
  });
});

describe("house upgrade order", () => {
  const rich = () => {
    const g = newGame();
    g.money = 12000;
    g.inventory.add(WOOD, 450);
    return g;
  };
  const noSpots: never[] = [];
  const sleepOnce = (g: ReturnType<typeof newGame>) =>
    sleep(g, noSpots, () => 0.5);
  /** Move the clock so the next sleep wakes on a day with no festival. */
  const toPlainDay = (g: ReturnType<typeof newGame>) => {
    while (festivalToday(g.day.clock.day + 1)) g.day.clock.day += 1;
  };

  it("needs both the coin and the wood", () => {
    const g = newGame();
    expect(orderProblem(g)).toMatch(/9500g more and 450 more wood/);
    g.money = 10000;
    expect(orderProblem(g)).toMatch(/450 more wood/);
    expect(orderProblem(g)).not.toMatch(/g more/);
    g.inventory.add(WOOD, 449);
    expect(orderProblem(g)).toMatch(/1 more wood/);
    g.inventory.add(WOOD);
    expect(orderProblem(g)).toBeUndefined();
  });

  it("takes the payment and starts a three day build", () => {
    const g = rich();
    expect(orderUpgrade(g)).toBe(true);
    expect(g.money).toBe(2000);
    expect(g.inventory.count(WOOD)).toBe(0);
    expect(g.houseBuild).toEqual({ tier: 1, daysLeft: BUILD_DAYS });
    expect(g.houseTier).toBe(0);
  });

  it("refuses a second order while one is building", () => {
    const g = rich();
    orderUpgrade(g);
    g.money = 99999;
    g.inventory.add(WOOD, 450);
    expect(orderUpgrade(g)).toBe(false);
    expect(orderProblem(g)).toMatch(/already at work/);
  });

  it("refuses an upgrade past the last one for sale", () => {
    const g = rich();
    g.houseTier = 1;
    expect(orderProblem(g)).toMatch(/no further upgrade/);
    expect(orderUpgrade(g)).toBe(false);
  });

  it("opens the new rooms on the third morning, not before", () => {
    const g = rich();
    toPlainDay(g);
    orderUpgrade(g);
    for (let i = 1; i <= 2; i++) {
      toPlainDay(g);
      const r = sleepOnce(g);
      expect(r.houseFinished).toBe(false);
      expect(g.houseTier).toBe(0);
    }
    toPlainDay(g);
    const r = sleepOnce(g);
    expect(r.houseFinished).toBe(true);
    expect(g.houseTier).toBe(1);
    expect(g.houseBuild).toBeUndefined();
  });

  it("does not count a festival morning", () => {
    const g = rich();
    orderUpgrade(g);
    g.houseBuild!.daysLeft = 1;
    const fest = [...Array(120).keys()].find((d) => festivalToday(d + 1))! + 1;
    g.day.clock.day = fest - 1;
    expect(sleepOnce(g).houseFinished).toBe(false);
    expect(g.houseBuild!.daysLeft).toBe(1);
    toPlainDay(g);
    expect(sleepOnce(g).houseFinished).toBe(true);
  });

  it("saves and resumes a build in progress", () => {
    const g = rich();
    orderUpgrade(g);
    g.houseBuild!.daysLeft = 2;
    const back = deserialize(serialize(g))!;
    expect(back.houseBuild).toEqual({ tier: 1, daysLeft: 2 });
  });

  it("ignores a saved build that makes no sense", () => {
    for (const bad of [
      { tier: 3, daysLeft: 2 },
      { tier: 1, daysLeft: 0 },
      { tier: 1, daysLeft: 9 },
      { tier: 1, daysLeft: "x" },
    ]) {
      const raw = JSON.parse(serialize(newGame()));
      raw.houseBuild = bad;
      expect(deserialize(JSON.stringify(raw))!.houseBuild).toBeUndefined();
    }
  });
});

describe("sawmill map", () => {
  it("joins the farm's sawmill door both ways", () => {
    expect(
      maps.get("farm").exits.find((e) => e.id === "sawmill"),
    ).toMatchObject({ map: "sawmill", entry: "door" });
    expect(maps.get("sawmill").exits[0]).toMatchObject({
      map: "farm",
      entry: "from_sawmill",
    });
  });

  it("has a carpenter's counter the player can reach", () => {
    const sawmill = maps.get("sawmill");
    const counter = sawmill.services.find((s) => s.kind === "carpenter")!;
    const walkable = sawmill.reachable(sawmill.entry("door")!);
    expect(walkable.has(`${counter.x},${counter.y + 1}`)).toBe(true);
  });
});
