import { describe, expect, it } from "vitest";
import { clearWeed, plant, plantTree, till } from "../src/core/actions";
import { DAYS_PER_SEASON } from "../src/core/calendar";
import { seedId } from "../src/core/items";
import { FarmMap, type TiledMapJson } from "../src/core/map";
import { deserialize, newGame, serialize } from "../src/core/save";
import { sleep } from "../src/core/sleep";
import { TREE_SEED } from "../src/core/trees";
import { useHeld } from "../src/core/tools";
import { heldAt, startGame } from "../src/core/toolbar";
import { DAY_ONE_WEEDS, FIBER, Weeds } from "../src/core/weeds";

/** A random source whose first draw (the mixed seed roll) misses, then `fiber`. */
const noMixed = (fiber: number) => {
  const draws = [0.99, fiber];
  return () => draws.shift() ?? fiber;
};

const WIDTH = 10;
const ROWS = 6;

/** An open 10x6 map where every tile is soil. */
function soilMap(): FarmMap {
  const layer = (name: string, data: number[]) => ({
    name,
    type: "tilelayer",
    data,
  });
  const json: TiledMapJson = {
    width: WIDTH,
    height: ROWS,
    tilewidth: 16,
    tileheight: 16,
    layers: [
      layer("collision", new Array(WIDTH * ROWS).fill(0)),
      layer("soil", new Array(WIDTH * ROWS).fill(1)),
      {
        name: "markers",
        type: "objectgroup",
        objects: [{ name: "start", class: "entry", x: 0, y: 0 }],
      },
    ],
  };
  return FarmMap.fromTiled(json);
}

const noSpots = [] as { x: number; y: number }[];

/** Sleep until the morning of this day number (the first night is day 1 to 2). */
function sleepTo(g: ReturnType<typeof newGame>, day: number, map: FarmMap) {
  while (g.day.clock.day < day) sleep(g, noSpots, () => 0.99, map);
}

describe("weeds", () => {
  it("scatter 20 on day 1 of a new season, and not on other days", () => {
    const map = soilMap();
    const g = newGame();
    sleepTo(g, 2, map);
    expect(g.weeds.count).toBe(0);
    // Day 1 of summer comes after one season of nights.
    sleepTo(g, DAYS_PER_SEASON + 1, map);
    expect(g.weeds.count).toBe(DAY_ONE_WEEDS);
    sleep(g, noSpots, () => 0.99, map);
    expect(g.weeds.count).toBe(DAY_ONE_WEEDS);
  });

  it("are all cleared on day 1 of winter", () => {
    const w = new Weeds();
    w.add(1, 1);
    w.add(2, 2);
    w.endDay(
      "winter",
      1,
      "sunny",
      () => 0,
      () => true,
      () => [{ x: 0, y: 0 }],
    );
    expect(w.count).toBe(0);
  });

  it("do not spread or appear on an ordinary day when the roll is high", () => {
    const map = soilMap();
    const g = newGame();
    g.weeds.add(3, 3);
    sleep(g, noSpots, () => 0.99, map);
    expect(g.weeds.count).toBe(1);
  });

  it("spread to a free adjacent tile and never onto a crop", () => {
    const w = new Weeds();
    w.add(1, 0);
    // Only the tile to the right is free; the roll always spreads.
    w.endDay(
      "spring",
      5,
      "sunny",
      () => 0,
      (x, y) => x === 2 && y === 0,
      () => [],
    );
    expect(w.at(2, 0)).toBe(true);
    expect(w.count).toBe(2);
  });

  it("take no more than the free tiles on day 1", () => {
    const w = new Weeds();
    w.endDay(
      "spring",
      1,
      "sunny",
      () => 0.5,
      (x) => x < 3,
      () => [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
      ],
    );
    expect(w.count).toBe(3);
    expect(w.at(3, 0)).toBe(false);
  });

  it("never grow onto a planted crop", () => {
    const map = soilMap();
    const g = newGame();
    g.inventory.add(seedId("parsnip"), 1);
    till(g, 2, 0);
    plant(g, 2, 0, seedId("parsnip"));
    g.weeds.add(1, 0);
    // The roll always spreads and always picks the first free neighbour.
    sleep(g, noSpots, () => 0, map);
    expect(g.weeds.at(2, 0)).toBe(false);
    expect(g.weeds.count).toBe(2);
    expect(g.farm.plotAt(2, 0)?.crop).toBeDefined();
  });

  it("block digging, planting and tree seeds until cleared", () => {
    const map = soilMap();
    const g = startGame();
    g.weeds.add(1, 1);
    expect(till(g, 1, 1)).toEqual({
      ok: false,
      reason: "a weed is in the way",
    });
    g.farm.till(1, 1);
    g.inventory.add(seedId("parsnip"), 1);
    expect(plant(g, 1, 1, seedId("parsnip"))).toEqual({
      ok: false,
      reason: "a weed is in the way",
    });
    g.weeds.add(2, 2);
    g.inventory.add(TREE_SEED, 1);
    expect(plantTree(g, map, 2, 2).ok).toBe(false);
  });
});

describe("clearing a weed", () => {
  it("any tool takes it in one swing and may drop fiber", () => {
    for (const tool of ["hoe", "can", "axe"] as const) {
      const g = newGame();
      g.weeds.add(1, 1);
      const before = g.day.energy.current;
      expect(clearWeed(g, 1, 1, tool, noMixed(0)).ok).toBe(true);
      expect(g.weeds.at(1, 1)).toBe(false);
      expect(g.inventory.count(FIBER)).toBe(1);
      expect(g.day.energy.current).toBeLessThan(before);
    }
  });

  it("drops fiber half the time", () => {
    const g = newGame();
    g.weeds.add(1, 1);
    clearWeed(g, 1, 1, "hoe", noMixed(0.5));
    expect(g.inventory.count(FIBER)).toBe(0);
  });

  it("puts fiber on the ground when the backpack is full", () => {
    const g = newGame();
    g.weeds.add(1, 1);
    while (g.inventory.add(FIBER)) {
      /* fill every stack */
    }
    const held = g.inventory.count(FIBER);
    clearWeed(g, 1, 1, "hoe", noMixed(0), soilMap());
    expect(g.inventory.count(FIBER)).toBe(held);
    expect(g.ground.count).toBe(1);
  });

  it("refuses when there is no weed", () => {
    const g = newGame();
    expect(clearWeed(g, 1, 1, "hoe")).toEqual({ ok: false, reason: "no weed" });
  });

  it("is what the held hoe does on a weed, before digging", () => {
    const map = soilMap();
    const g = startGame();
    g.weeds.add(1, 1);
    const held = heldAt(g, 0);
    expect(held.kind).toBe("tool");
    const out = useHeld(g, map, { kind: "tool", tool: "hoe" }, 1, 1);
    expect(out.ok).toBe(true);
    expect(g.weeds.at(1, 1)).toBe(false);
    expect(g.farm.plotAt(1, 1)).toBeUndefined();
  });
});

describe("saving weeds", () => {
  it("round trips and loads old saves without weeds", () => {
    const g = newGame();
    g.weeds.add(4, 2);
    const back = deserialize(serialize(g));
    expect(back?.weeds.at(4, 2)).toBe(true);
    const old = JSON.parse(serialize(g));
    delete old.weeds;
    expect(deserialize(JSON.stringify(old))?.weeds.count).toBe(0);
  });
});
