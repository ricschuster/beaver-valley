import { describe, expect, it } from "vitest";
import { maps } from "../src/content/maps";
import { START } from "../src/core/maps";
import { FarmMap } from "../src/core/map";
import {
  BUILT_FLOORS,
  LADDER_CAP,
  floorLayout,
  floorMapJson,
  ladderChance,
  mineFloorOf,
  mineMapId,
  minesOpen,
} from "../src/core/mines";
import { drops, mine } from "../src/core/mining";
import { collect, minutesLeft, ready, smelt } from "../src/core/furnace";
import { deliverFurnace, handOverCopper, SMITH_STOCK } from "../src/core/smith";
import { buy } from "../src/core/shop";
import { deserialize, newGame, serialize } from "../src/core/save";
import { sleep } from "../src/core/sleep";
import { heldAt, startGame, TOOLS } from "../src/core/toolbar";
import { useHeld } from "../src/core/tools";
import { itemById } from "../src/core/items";
import { craft } from "../src/core/crafting";

const noSpots = [] as { x: number; y: number }[];

describe("the mine floors", () => {
  it("open on spring day 5", () => {
    expect(minesOpen(4)).toBe(false);
    expect(minesOpen(5)).toBe(true);
  });

  it("names map ids both ways", () => {
    expect(mineFloorOf(mineMapId(7))).toBe(7);
    expect(mineFloorOf("farm")).toBeUndefined();
  });

  it("make the same floor for the same day and floor", () => {
    const a = floorLayout(3, 9);
    const b = floorLayout(3, 9);
    expect(a.rocks).toEqual(b.rocks);
    expect(a.walls).toEqual(b.walls);
    expect(floorLayout(3, 10).rocks).not.toEqual(a.rocks);
  });

  it("are valid maps with every open tile reachable", () => {
    for (let floor = 1; floor <= BUILT_FLOORS; floor++) {
      const layout = floorLayout(floor, 5 + floor);
      const map = FarmMap.fromTiled(floorMapJson(layout));
      expect(map.problems()).toEqual([]);
      const open = layout.walls.filter((w) => !w).length;
      expect(map.reachable(layout.arrive).size).toBe(open);
      for (const r of layout.rocks) expect(map.isBlocked(r.x, r.y)).toBe(false);
    }
  });

  it("show a free ladder on some floors and never on the last", () => {
    const days = Array.from({ length: 40 }, (_, i) => i + 5);
    const some = days.filter((d) => floorLayout(2, d).ladder).length;
    expect(some).toBeGreaterThan(3);
    expect(some).toBeLessThan(20);
    for (const d of days)
      expect(floorLayout(BUILT_FLOORS, d).ladder).toBeUndefined();
  });

  it("has a farm map with rocks and a gated mine door", () => {
    const farm = maps.get(START.map);
    expect(farm.rocks.length).toBeGreaterThan(5);
    expect(farm.exits.find((e) => e.id === "mine")?.requires).toBe(
      "mines-open",
    );
    expect(maps.problems()).toEqual([]);
  });
});

describe("the dry streak", () => {
  it("starts at 1 percent, grows half a percent a miss, and caps at 25", () => {
    expect(ladderChance(0)).toBeCloseTo(0.01);
    expect(ladderChance(2)).toBeCloseTo(0.02);
    expect(ladderChance(1000)).toBe(LADDER_CAP);
  });
});

describe("mining", () => {
  function inMine(day = 5) {
    const g = startGame();
    g.day.clock.day = day;
    g.mines.visit(1, day);
    return g;
  }
  const pickaxe = { kind: "tool", tool: "pickaxe" } as const;

  it("puts the pickaxe in the toolbar", () => {
    const g = startGame();
    expect(heldAt(g, TOOLS.indexOf("pickaxe"))).toEqual(pickaxe);
  });

  it("breaks a farm rock in two swings for stone and a little XP", () => {
    const g = startGame();
    const map = maps.get(START.map);
    const spot = map.rocks[0]!;
    const e = g.day.energy.current;
    expect(useHeld(g, map, pickaxe, spot.x, spot.y).ok).toBe(true);
    expect(g.rocks.at(spot.x, spot.y)).toBeDefined();
    const r = useHeld(g, map, pickaxe, spot.x, spot.y);
    expect(r.ok).toBe(true);
    expect(g.rocks.at(spot.x, spot.y)).toBeUndefined();
    expect(g.inventory.count("stone")).toBeGreaterThan(0);
    expect(g.skills.xpOf("mining")).toBe(2);
    expect(g.day.energy.current).toBeLessThan(e);
  });

  it("refuses with nothing there and when the day is over", () => {
    const g = startGame();
    expect(mine(g, 0, 0, undefined).ok).toBe(false);
    const spot = maps.get(START.map).rocks[0]!;
    g.day.energy.current = 0;
    expect(mine(g, spot.x, spot.y, undefined)).toEqual({
      ok: false,
      reason: "exhausted",
    });
  });

  it("does not break a rock when the drop would not fit", () => {
    const g = startGame();
    const spot = maps.get(START.map).rocks[0]!;
    for (let i = 0; i < g.inventory.size; i++) g.inventory.add(`junk-${i}`, 1);
    mine(g, spot.x, spot.y, undefined);
    expect(mine(g, spot.x, spot.y, undefined)).toEqual({
      ok: false,
      reason: "backpack full",
    });
    expect(g.rocks.at(spot.x, spot.y)).toBeDefined();
  });

  it("gives copper from a node, with more at higher odds and for prospectors", () => {
    expect(drops("copper", 0, false, () => 0.99)).toEqual({
      id: "copper-ore",
      count: 1,
    });
    expect(drops("copper", 0, false, () => 0).count).toBe(2);
    expect(drops("copper", 0, true, () => 0.1).count).toBeGreaterThan(1);
    expect(drops("coal", 0, false, () => 0.9)).toEqual({
      id: "coal",
      count: 1,
    });
  });

  it("reveals a ladder under a rock when the dry streak hits, and resets", () => {
    const g = inMine();
    const floor = g.mines.visit(1, 5);
    floor.ladder = undefined;
    const rock = [...floor.rocks.each()][0]!;
    for (let i = rock.hits; i < 5; i++) {
      const r = mine(g, rock.x, rock.y, 1, () => 0);
      if (floor.rocks.at(rock.x, rock.y) === undefined) {
        expect(r).toMatchObject({ ok: true, ladder: true });
        break;
      }
    }
    expect(floor.ladder).toEqual({ x: rock.x, y: rock.y });
    expect(g.mines.misses).toBe(0);
  });

  it("counts misses, and the last rock always hides the ladder", () => {
    const g = inMine();
    const floor = g.mines.visit(1, 5);
    floor.ladder = undefined;
    let found = false;
    for (let i = 0; i < 40 && !found; i++) {
      const rock = [...floor.rocks.each()][0];
      if (!rock) break;
      rock.hits = 5;
      const r = mine(g, rock.x, rock.y, 1, () => 0.99);
      found = r.ok && r.ladder === true;
      if (!found) expect(g.mines.misses).toBe(i + 1);
    }
    expect(found).toBe(true);
    expect(floor.rocks.count).toBe(0);
  });

  it("never shows a ladder on the last built floor", () => {
    const g = startGame();
    g.day.clock.day = 6;
    const floor = g.mines.visit(BUILT_FLOORS, 6);
    const rock = [...floor.rocks.each()][0]!;
    rock.hits = 5;
    expect(mine(g, rock.x, rock.y, BUILT_FLOORS, () => 0)).toMatchObject({
      ok: true,
      ladder: false,
    });
    expect(floor.ladder).toBeUndefined();
  });

  it("makes the lift stop at every floor reached", () => {
    const g = startGame();
    g.mines.visit(1, 5);
    g.mines.visit(4, 5);
    expect(g.mines.deepest).toBe(4);
  });

  it("renews the floors each day", () => {
    const g = startGame();
    const a = g.mines.visit(1, 5);
    expect(g.mines.visit(1, 5)).toBe(a);
    expect(g.mines.visit(1, 6)).not.toBe(a);
  });
});

describe("the smith and the furnace", () => {
  it("sells ore and coal but never bars", () => {
    expect(SMITH_STOCK).toEqual(["copper-ore", "iron-ore", "gold-ore", "coal"]);
    const g = startGame();
    g.money = 1000;
    expect(buy(g.inventory, g, "copper-ore", 2)).toBe(true);
    expect(g.money).toBe(950);
    expect(buy(g.inventory, g, "copper-bar", 1)).toBe(false);
    expect(itemById("coal")?.buyPrice).toBe(50);
  });

  it("gives the furnace the morning after the first copper is handed over", () => {
    const g = startGame();
    expect(handOverCopper(g)).toBe(false);
    g.inventory.add("copper-ore", 2);
    expect(handOverCopper(g)).toBe(true);
    expect(g.inventory.count("copper-ore")).toBe(1);
    expect(handOverCopper(g)).toBe(false);
    expect(g.furnace.gifted).toBe(false);
    const report = sleep(g, noSpots, () => 0.5);
    expect(report.furnaceGifted).toBe(true);
    expect(g.furnace.gifted).toBe(true);
    expect(sleep(g, noSpots, () => 0.5).furnaceGifted).toBe(false);
    expect(deliverFurnace(g)).toBe(false);
  });

  it("smelts 5 ore and 1 coal into a bar over game time", () => {
    const g = startGame();
    expect(smelt(g, "copper-bar")).toBe("no furnace");
    g.furnace.gifted = true;
    expect(smelt(g, "copper-bar")).toBe("not enough ore");
    g.inventory.add("copper-ore", 5);
    expect(smelt(g, "copper-bar")).toBe("not enough coal");
    g.inventory.add("coal", 1);
    expect(smelt(g, "copper-bar")).toBeUndefined();
    expect(g.inventory.count("copper-ore")).toBe(0);
    expect(g.inventory.count("coal")).toBe(0);
    expect(smelt(g, "copper-bar")).toBe("furnace busy");
    expect(ready(g)).toBe(false);
    expect(minutesLeft(g)).toBe(30);
    expect(collect(g)).toEqual({ ok: false, reason: "not done" });
    g.day.act(0, 30);
    expect(ready(g)).toBe(true);
    expect(collect(g)).toEqual({ ok: true, bar: "copper-bar" });
    expect(g.inventory.count("copper-bar")).toBe(1);
    expect(g.furnace.job).toBeUndefined();
  });

  it("finishes a long batch overnight", () => {
    const g = startGame();
    g.furnace.gifted = true;
    g.inventory.add("gold-ore", 5);
    g.inventory.add("coal", 1);
    g.day.act(0, 18 * 60);
    smelt(g, "gold-bar");
    sleep(g, noSpots, () => 0.5);
    expect(ready(g)).toBe(true);
  });
});

describe("saving the mine", () => {
  it("keeps rocks, floors, the furnace and the streak", () => {
    const g = startGame();
    const farmRock = maps.get(START.map).rocks[0]!;
    g.rocks.remove(farmRock.x, farmRock.y);
    g.day.clock.day = 6;
    const floor = g.mines.visit(2, 6);
    const rock = [...floor.rocks.each()][0]!;
    floor.rocks.remove(rock.x, rock.y);
    floor.ladder = { x: rock.x, y: rock.y };
    g.mines.misses = 4;
    g.mines.copperHandedIn = true;
    g.furnace.gifted = true;
    g.inventory.add("copper-ore", 5);
    g.inventory.add("coal", 1);
    smelt(g, "copper-bar");
    g.skills.gain("mining", 150);
    const back = deserialize(serialize(g))!;
    expect(back.rocks.at(farmRock.x, farmRock.y)).toBeUndefined();
    expect(back.rocks.count).toBe(g.rocks.count);
    const same = back.mines.today(2, 6)!;
    expect(same.rocks.count).toBe(floor.rocks.count);
    expect(same.ladder).toEqual({ x: rock.x, y: rock.y });
    expect(back.mines.deepest).toBe(2);
    expect(back.mines.misses).toBe(4);
    expect(back.mines.copperHandedIn).toBe(true);
    expect(back.furnace.gifted).toBe(true);
    expect(back.furnace.job).toEqual(g.furnace.job);
    expect(back.skills.level("mining")).toBe(1);
  });

  it("loads a save from before the mines with the starting rocks", () => {
    const old = JSON.parse(serialize(newGame()));
    delete old.rocks;
    delete old.mines;
    delete old.furnace;
    delete old.skills.mining;
    const g = deserialize(JSON.stringify(old))!;
    expect(g.rocks.count).toBe(maps.get(START.map).rocks.length);
    expect(g.mines.deepest).toBe(0);
    expect(g.furnace.gifted).toBe(false);
    expect(g.skills.xpOf("mining")).toBe(0);
  });
});

describe("quartz and the quality sprinkler", () => {
  it("lies in the mine as a one swing cluster that drops a crystal", () => {
    const g = newGame();
    g.day.clock.day = 5;
    g.mines.visit(1, 5).rocks.add(2, 2, "quartz");
    const r = mine(g, 2, 2, 1, () => 0.9);
    expect(r.ok).toBe(true);
    expect(g.inventory.count("quartz-crystal")).toBe(1);
    expect(g.mines.visit(1, 5).rocks.at(2, 2)).toBeUndefined();
    expect(itemById("quartz-crystal")?.sellPrice).toBe(25);
  });

  it("shows up on floors 1 to 10 at about 6 percent of rocks", () => {
    let quartz = 0;
    let total = 0;
    for (let day = 5; day < 45; day++)
      for (let floor = 1; floor <= BUILT_FLOORS; floor++)
        for (const r of floorLayout(floor, day).rocks) {
          total++;
          if (r.kind === "quartz") quartz++;
        }
    expect(quartz / total).toBeGreaterThan(0.04);
    expect(quartz / total).toBeLessThan(0.09);
  });

  it("makes the quality sprinkler craftable at farming level 6", () => {
    const g = newGame();
    for (const id of ["iron-bar", "gold-bar", "quartz-crystal"])
      g.inventory.add(id);
    expect(craft(g, "quality-sprinkler")).toBe("recipe not known");
    g.skills.gain("farming", 100000);
    expect(craft(g, "quality-sprinkler")).toBeUndefined();
    expect(g.inventory.count("quality-sprinkler")).toBe(1);
    expect(g.inventory.count("quartz-crystal")).toBe(0);
  });
});
