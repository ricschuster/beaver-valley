import { FarmMap, type TiledMapJson } from "./map";

/** Where a new game starts: a map id and the name of an entry on it. */
export const START = { map: "farm", entry: "start" } as const;

/**
 * Every map in the game, by id. A map id is its file name without extension,
 * and code never assumes where one map sits relative to another.
 */
export class MapRegistry {
  private constructor(private readonly maps: Map<string, FarmMap>) {}

  /** Read each map. Throws, naming the map, if one breaks the file format. */
  static fromTiled(files: Record<string, TiledMapJson>): MapRegistry {
    const maps = new Map<string, FarmMap>();
    for (const [id, json] of Object.entries(files)) {
      try {
        maps.set(id, FarmMap.fromTiled(json));
      } catch (e) {
        throw new Error(`map "${id}": ${(e as Error).message}`, { cause: e });
      }
    }
    return new MapRegistry(maps);
  }

  get ids(): string[] {
    return [...this.maps.keys()];
  }

  /** The map with this id. Throws if there is none. */
  get(id: string): FarmMap {
    const map = this.maps.get(id);
    if (!map) throw new Error(`no map "${id}"`);
    return map;
  }

  /** Everything wrong across all maps, in words. Empty when all is well. */
  problems(): string[] {
    const out: string[] = [];
    const start = this.maps.get(START.map);
    if (!start) out.push(`the start map "${START.map}" does not exist`);
    else if (!start.entry(START.entry))
      out.push(`the start map has no entry "${START.entry}"`);
    for (const [id, map] of this.maps) {
      for (const p of map.problems()) out.push(`${id}: ${p}`);
      for (const exit of map.exits) {
        if (exit.map === "" || exit.entry === "") continue;
        const target = this.maps.get(exit.map);
        if (!target)
          out.push(
            `${id}: exit "${exit.id}" leads to missing map "${exit.map}"`,
          );
        else if (!target.entry(exit.entry))
          out.push(
            `${id}: exit "${exit.id}" leads to missing entry "${exit.entry}" on "${exit.map}"`,
          );
      }
    }
    return out;
  }
}
