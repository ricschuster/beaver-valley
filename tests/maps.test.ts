import { describe, expect, it } from "vitest";
import type { TiledMapJson, TiledObject } from "../src/core/map";
import { MapRegistry, START } from "../src/core/maps";

// A 3 by 3 open map with the given objects, one tile per 16 px.
const object = (
  cls: string,
  name: string,
  x: number,
  y: number,
  props: Record<string, string> = {},
) =>
  ({
    name,
    class: cls,
    x: x * 16,
    y: y * 16,
    width: 16,
    height: 16,
    properties: Object.entries(props).map(([k, value]) => ({ name: k, value })),
  }) as TiledObject;

const map = (objects: TiledObject[]): TiledMapJson => ({
  width: 3,
  height: 3,
  tilewidth: 16,
  tileheight: 16,
  layers: [
    { name: "collision", type: "tilelayer", data: new Array(9).fill(0) },
    { name: "markers", type: "objectgroup", objects },
  ],
});

const start = object("entry", START.entry, 0, 0);
const farm = map([
  start,
  object("entry", "back", 1, 0),
  object("exit", "in", 2, 2, { map: "inn", entry: "door" }),
]);
const inn = map([
  object("entry", "door", 0, 0),
  object("exit", "out", 2, 2, { map: START.map, entry: "back" }),
]);

describe("MapRegistry", () => {
  const files = { [START.map]: farm, inn };

  it("loads maps by id", () => {
    const maps = MapRegistry.fromTiled(files);
    expect(maps.ids.sort()).toEqual([START.map, "inn"].sort());
    expect(maps.get("inn").entry("door")).toBeDefined();
    expect(() => maps.get("nope")).toThrow(/no map "nope"/);
    expect(maps.problems()).toEqual([]);
  });

  it("names the map when a file breaks the format", () => {
    const bad = { ...inn, layers: [] };
    expect(() => MapRegistry.fromTiled({ ...files, inn: bad })).toThrow(
      /map "inn"/,
    );
  });

  it("flags an exit to a missing map", () => {
    const maps = MapRegistry.fromTiled({ [START.map]: farm });
    expect(maps.problems()).toEqual([
      `${START.map}: exit "in" leads to missing map "inn"`,
    ]);
  });

  it("flags an exit to a missing entry", () => {
    const lost = map([
      object("entry", "elsewhere", 0, 0),
      object("exit", "out", 2, 2, { map: START.map, entry: "back" }),
    ]);
    const maps = MapRegistry.fromTiled({ ...files, inn: lost });
    expect(maps.problems()).toContain(
      `${START.map}: exit "in" leads to missing entry "door" on "inn"`,
    );
  });

  it("prefixes a map's own problems with its id", () => {
    const maps = MapRegistry.fromTiled({ ...files, inn: map([]) });
    expect(maps.problems()).toContain("inn: needs at least one entry");
  });

  it("needs the start map and entry", () => {
    expect(MapRegistry.fromTiled({ inn }).problems()).toContain(
      `the start map "${START.map}" does not exist`,
    );
    const noStart = map([object("entry", "other", 0, 0)]);
    expect(
      MapRegistry.fromTiled({ [START.map]: noStart }).problems(),
    ).toContain(`the start map has no entry "${START.entry}"`);
  });
});
