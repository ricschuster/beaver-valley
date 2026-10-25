import { describe, expect, it } from "vitest";
import { FarmMap, type TiledMapJson, type TiledObject } from "../src/core/map";
import placeholder from "../public/maps/farm-placeholder.json";

// A 5 by 4 map: a wall column at x=2 with a gap at y=3, soil on the left.
//   . . # . .
//   . . # . .
//   . . # . .
//   . . . . .
const W = 5;
const H = 4;
const blocked = new Array(W * H).fill(0);
for (let y = 0; y < 3; y++) blocked[y * W + 2] = 1;
const soil = new Array(W * H).fill(0);
for (let y = 0; y < H; y++) soil[y * W] = 1;

const object = (cls: string, name: string, x: number, y: number) =>
  ({ name, class: cls, x: x * 16 + 8, y: y * 16 + 8 }) as TiledObject;

function fixture(objects: TiledObject[], overrides = {}): TiledMapJson {
  return {
    width: W,
    height: H,
    tilewidth: 16,
    tileheight: 16,
    layers: [
      { name: "ground", type: "tilelayer", data: new Array(W * H).fill(1) },
      { name: "collision", type: "tilelayer", data: blocked },
      { name: "soil", type: "tilelayer", data: soil },
      { name: "markers", type: "objectgroup", objects },
    ],
    ...overrides,
  };
}

const good = [
  object("spawn", "spawn", 0, 0),
  { ...object("door", "shop", 4, 0), width: 16, height: 16 },
  object("forage", "forage", 4, 2),
];

describe("FarmMap.fromTiled", () => {
  const map = FarmMap.fromTiled(fixture(good));

  it("reads size, collision and soil", () => {
    expect([map.width, map.height, map.tileSize]).toEqual([5, 4, 16]);
    expect(map.isBlocked(2, 0)).toBe(true);
    expect(map.isBlocked(2, 3)).toBe(false);
    expect(map.isTillable(0, 2)).toBe(true);
    expect(map.isTillable(1, 2)).toBe(false);
  });

  it("treats outside the map as blocked and not tillable", () => {
    expect(map.isBlocked(-1, 0)).toBe(true);
    expect(map.isBlocked(0, H)).toBe(true);
    expect(map.isTillable(-1, 0)).toBe(false);
  });

  it("reads the spawn, doors and forage spots in tiles", () => {
    expect(map.spawn).toEqual({ x: 0, y: 0 });
    expect(map.doors).toEqual([{ id: "shop", x: 4, y: 0, w: 1, h: 1 }]);
    expect(map.forageSpots).toEqual([{ x: 4, y: 2 }]);
    expect(map.doorAt(4, 0)).toBe("shop");
    expect(map.doorAt(3, 0)).toBeUndefined();
  });

  it("accepts the older Tiled `type` in place of `class`", () => {
    const old = { name: "spawn", type: "spawn", x: 8, y: 8 };
    expect(FarmMap.fromTiled(fixture([old])).spawn).toEqual({ x: 0, y: 0 });
  });

  it("walks around the wall through the gap", () => {
    const seen = map.reachable(map.spawn);
    expect(seen.has("4,0")).toBe(true);
    expect(seen.has("2,0")).toBe(false);
  });

  it("is usable", () => {
    expect(map.problems()).toEqual([]);
  });
});

describe("FarmMap errors", () => {
  it("rejects a missing required layer", () => {
    const json = fixture(good);
    json.layers = json.layers.filter((l) => l.name !== "soil");
    expect(() => FarmMap.fromTiled(json)).toThrow(/"soil"/);
  });

  it("rejects a layer of the wrong size", () => {
    const json = fixture(good);
    json.layers[1] = { name: "collision", type: "tilelayer", data: [0, 1] };
    expect(() => FarmMap.fromTiled(json)).toThrow(/size of the map/);
  });

  it("rejects tiles that are not square", () => {
    expect(() => FarmMap.fromTiled(fixture(good, { tileheight: 8 }))).toThrow(
      /square/,
    );
  });
});

describe("FarmMap.problems", () => {
  const problems = (objects: TiledObject[]) =>
    FarmMap.fromTiled(fixture(objects)).problems();

  it("wants exactly one spawn", () => {
    expect(problems([])).toEqual(["needs exactly one spawn, found 0"]);
    expect(
      problems([object("spawn", "a", 0, 0), object("spawn", "b", 1, 0)]),
    ).toContain("needs exactly one spawn, found 2");
  });

  it("flags a blocked spawn", () => {
    expect(problems([object("spawn", "spawn", 2, 0)])).toContain(
      "the spawn is blocked",
    );
  });

  it("flags duplicate door names", () => {
    expect(
      problems([
        object("spawn", "spawn", 0, 0),
        object("door", "shop", 0, 1),
        object("door", "shop", 0, 2),
      ]),
    ).toContain("door names must be unique");
  });

  it("flags a door or forage spot walled off from the spawn", () => {
    const sealed = fixture(good);
    sealed.layers[1] = {
      name: "collision",
      type: "tilelayer",
      data: blocked.map((b, i) => (i % W === 2 ? 1 : b)),
    };
    const out = FarmMap.fromTiled(sealed).problems();
    expect(out).toContain('door "shop" cannot be reached from the spawn');
    expect(out).toContain("forage spot 4,2 cannot be reached from the spawn");
  });

  it("flags a map with no soil", () => {
    const json = fixture(good);
    json.layers[2] = {
      name: "soil",
      type: "tilelayer",
      data: new Array(W * H).fill(0),
    };
    expect(FarmMap.fromTiled(json).problems()).toContain(
      "the map has no tillable soil",
    );
  });
});

// The contract check for whichever map the scene loads. It asserts the map
// contract only, never the layout, so a real map can replace the placeholder.
describe("the farm map in use", () => {
  it("meets the map contract", () => {
    const map = FarmMap.fromTiled(placeholder as unknown as TiledMapJson);
    expect(map.problems()).toEqual([]);
    expect(map.doors.length).toBeGreaterThan(0);
    expect(map.forageSpots.length).toBeGreaterThan(0);
  });
});
