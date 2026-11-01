import type { Spot } from "./forage";

/**
 * The part of a Tiled JSON map the game reads. The contract is documented in
 * docs/design/05_farm_map_placeholder.md. Nothing here knows any layout.
 */
export interface TiledObject {
  name: string;
  class?: string;
  /** Older Tiled versions call the class "type". */
  type?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  /** Tiled custom properties. */
  properties?: { name: string; value: unknown }[];
}

export interface TiledLayer {
  name: string;
  type: string;
  visible?: boolean;
  data?: number[];
  objects?: TiledObject[];
}

export interface TiledMapJson {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: TiledLayer[];
}

/** A named place where the player can arrive, in tiles. */
export interface Entry extends Spot {
  name: string;
}

/**
 * A way out of the map, in tiles: a rectangle that leads to entry `entry` of
 * map `map`. `requires` names a condition that must hold before it opens.
 */
export interface Exit {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  map: string;
  entry: string;
  requires?: string;
}

/**
 * A tile the player faces and uses to open a screen, such as a shop counter or
 * the village hall. `kind` names the screen; the map does not know the kinds.
 */
export interface Service extends Spot {
  id: string;
  kind: string;
}

/** A tree placed on the map at the start of a new game. `stage` is 1 to 5 (`core/trees.ts`). */
export interface TreeSpot extends Spot {
  stage: number;
}

/** A named rectangle of tiles, such as one room of the hall. */
export interface Region {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Whether the player may use an exit, given the conditions that hold. */
export function exitOpen(exit: Exit, holds: ReadonlySet<string>): boolean {
  return exit.requires === undefined || holds.has(exit.requires);
}

/** Layers the game reads for rules; they are never drawn. */
export const COLLISION_LAYER = "collision";
/** Optional: a map without it has no tillable soil. */
export const SOIL_LAYER = "soil";
/** Optional: path tiles, where a tree seed cannot be planted or spread. Never drawn. */
export const PATHS_LAYER = "paths";

const objectClass = (o: TiledObject) => o.class ?? o.type ?? "";

const num = (o: TiledObject, key: string): number | undefined => {
  const value = o.properties?.find((p) => p.name === key)?.value;
  return typeof value === "number" ? value : undefined;
};

const text = (o: TiledObject, key: string): string | undefined => {
  const value = o.properties?.find((p) => p.name === key)?.value;
  return typeof value === "string" && value !== "" ? value : undefined;
};

/** What the rules need to know about a map, in tile units. */
export class FarmMap {
  private constructor(
    readonly width: number,
    readonly height: number,
    readonly tileSize: number,
    private readonly blocked: boolean[],
    private readonly soil: boolean[],
    readonly entries: Entry[],
    readonly exits: Exit[],
    readonly forageSpots: Spot[],
    readonly services: Service[] = [],
    readonly regions: Region[] = [],
    readonly trees: TreeSpot[] = [],
    private readonly paths: boolean[] = [],
  ) {}

  /** Read a Tiled map. Throws with a clear message if it breaks the contract. */
  static fromTiled(json: TiledMapJson): FarmMap {
    const { width, height } = json;
    if (json.tilewidth !== json.tileheight)
      throw new Error("map tiles must be square");
    const size = json.tilewidth;
    const grid = (name: string, optional = false): boolean[] => {
      const layer = json.layers.find(
        (l) => l.name === name && l.type === "tilelayer",
      );
      if (!layer?.data && optional)
        return new Array(width * height).fill(false);
      if (!layer?.data) throw new Error(`map needs a tile layer "${name}"`);
      if (layer.data.length !== width * height)
        throw new Error(`layer "${name}" is not the size of the map`);
      return layer.data.map((id) => id !== 0);
    };
    const tile = (px: number) => Math.floor(px / size);

    const entries: Entry[] = [];
    const exits: Exit[] = [];
    const forageSpots: Spot[] = [];
    const services: Service[] = [];
    const regions: Region[] = [];
    const trees: TreeSpot[] = [];
    for (const layer of json.layers) {
      if (layer.type !== "objectgroup") continue;
      for (const o of layer.objects ?? []) {
        const cls = objectClass(o);
        const spot = { x: tile(o.x), y: tile(o.y) };
        if (cls === "entry") entries.push({ name: o.name, ...spot });
        else if (cls === "forage") forageSpots.push(spot);
        else if (cls === "tree")
          trees.push({ ...spot, stage: num(o, "stage") ?? 5 });
        else if (cls === "service")
          services.push({ id: o.name, kind: text(o, "kind") ?? "", ...spot });
        else if (cls === "region")
          regions.push({
            id: o.name,
            ...spot,
            w: Math.max(1, Math.round((o.width ?? size) / size)),
            h: Math.max(1, Math.round((o.height ?? size) / size)),
          });
        else if (cls === "exit") {
          const w = Math.max(1, Math.round((o.width ?? size) / size));
          const h = Math.max(1, Math.round((o.height ?? size) / size));
          const requires = text(o, "requires");
          exits.push({
            id: o.name,
            ...spot,
            w,
            h,
            map: text(o, "map") ?? "",
            entry: text(o, "entry") ?? "",
            ...(requires === undefined ? {} : { requires }),
          });
        }
      }
    }
    return new FarmMap(
      width,
      height,
      size,
      grid(COLLISION_LAYER),
      grid(SOIL_LAYER, true),
      entries,
      exits,
      forageSpots,
      services,
      regions,
      trees,
      grid(PATHS_LAYER, true),
    );
  }

  /** Regions that are solid for now, such as house rooms not yet dug out. */
  private sealed: Region[] = [];

  /** Seal the regions with these ids; any others are open. Replaces earlier seals. */
  seal(ids: readonly string[]): void {
    this.sealed = this.regions.filter((r) => ids.includes(r.id));
  }

  /** The regions sealed now. */
  get sealedRegions(): readonly Region[] {
    return this.sealed;
  }

  /** Outside the map and sealed regions count as blocked. */
  isBlocked(x: number, y: number): boolean {
    return (
      !this.inside(x, y) ||
      this.blocked[y * this.width + x] === true ||
      this.sealed.some(
        (r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h,
      )
    );
  }

  isTillable(x: number, y: number): boolean {
    return this.inside(x, y) && this.soil[y * this.width + x] === true;
  }

  /** True on a path tile. */
  isPath(x: number, y: number): boolean {
    return this.inside(x, y) && this.paths[y * this.width + x] === true;
  }

  /**
   * Whether a tree seed may be planted here: open ground that is not a path, an
   * exit, an entry or a service tile. Trees never destroy paths
   * (`docs/design/36_gathering_trees_sap_fiber.md`).
   */
  canPlantTree(x: number, y: number): boolean {
    return (
      this.inside(x, y) &&
      this.blocked[y * this.width + x] !== true &&
      !this.isPath(x, y) &&
      !this.exitAt(x, y) &&
      !this.entries.some((e) => e.x === x && e.y === y) &&
      !this.serviceAt(x, y)
    );
  }

  /** Tiles that the starting trees block, so the layout is checked with them. */
  private treeTiles(): Set<string> {
    return new Set(
      this.trees.filter((t) => t.stage > 1).map((t) => `${t.x},${t.y}`),
    );
  }

  /** The entry with this name, if the map has one. */
  entry(name: string): Entry | undefined {
    return this.entries.find((e) => e.name === name);
  }

  /** The exit covering this tile, if any. */
  exitAt(x: number, y: number): Exit | undefined {
    return this.exits.find(
      (e) => x >= e.x && x < e.x + e.w && y >= e.y && y < e.y + e.h,
    );
  }

  /** The service on this tile, if any. */
  serviceAt(x: number, y: number): Service | undefined {
    return this.services.find((s) => s.x === x && s.y === y);
  }

  /** Tiles that can be walked to from `from`, four ways. */
  reachable(from: Spot): Set<string> {
    const seen = new Set<string>();
    const solid = this.treeTiles();
    if (this.isBlocked(from.x, from.y)) return seen;
    const queue = [from];
    seen.add(`${from.x},${from.y}`);
    for (let i = 0; i < queue.length; i++) {
      const { x, y } = queue[i] as Spot;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const next = { x: x + dx, y: y + dy };
        const k = `${next.x},${next.y}`;
        if (seen.has(k) || solid.has(k) || this.isBlocked(next.x, next.y))
          continue;
        seen.add(k);
        queue.push(next);
      }
    }
    return seen;
  }

  /**
   * Everything wrong with this map on its own, in words. Empty when it is
   * usable. Whether exit targets exist is checked across maps (`MapRegistry`).
   */
  problems(): string[] {
    const out: string[] = [];
    if (this.entries.length === 0) out.push("needs at least one entry");
    const names = this.entries.map((e) => e.name);
    if (names.includes("")) out.push("every entry needs a name");
    if (new Set(names).size !== names.length)
      out.push("entry names must be unique");
    const ids = this.exits.map((e) => e.id);
    if (ids.includes("")) out.push("every exit needs a name");
    if (new Set(ids).size !== ids.length) out.push("exit names must be unique");
    for (const exit of this.exits)
      if (exit.map === "" || exit.entry === "")
        out.push(`exit "${exit.id}" needs a map and an entry`);
    const serviceIds = this.services.map((s) => s.id);
    if (serviceIds.includes("")) out.push("every service needs a name");
    if (new Set(serviceIds).size !== serviceIds.length)
      out.push("service names must be unique");
    for (const service of this.services)
      if (service.kind === "") out.push(`service "${service.id}" needs a kind`);
    const treeIds = new Set<string>();
    for (const t of this.trees) {
      const at = `tree at ${t.x},${t.y}`;
      if (treeIds.has(`${t.x},${t.y}`)) out.push(`${at} is placed twice`);
      treeIds.add(`${t.x},${t.y}`);
      if (t.stage < 1 || t.stage > 5)
        out.push(`${at} has a stage outside 1 to 5`);
      if (!this.canPlantTree(t.x, t.y))
        out.push(`${at} is on a blocked, path, exit, entry or service tile`);
    }
    for (const entry of this.entries) {
      if (this.exitAt(entry.x, entry.y))
        out.push(`entry "${entry.name}" is inside an exit`);
      if (this.isBlocked(entry.x, entry.y))
        out.push(`entry "${entry.name}" is blocked`);
    }

    for (const entry of this.entries) {
      const walkable = this.reachable(entry);
      for (const exit of this.exits) {
        let ok = false;
        for (let y = exit.y; y < exit.y + exit.h; y++)
          for (let x = exit.x; x < exit.x + exit.w; x++)
            if (walkable.has(`${x},${y}`)) ok = true;
        if (!ok)
          out.push(
            `exit "${exit.id}" cannot be reached from entry "${entry.name}"`,
          );
      }
      for (const service of this.services) {
        const beside = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ].some(([dx, dy]) =>
          walkable.has(`${service.x + dx!},${service.y + dy!}`),
        );
        if (!beside)
          out.push(
            `service "${service.id}" cannot be reached from entry "${entry.name}"`,
          );
      }
      for (const s of this.forageSpots)
        if (this.treeTiles().has(`${s.x},${s.y}`))
          out.push(`forage spot ${s.x},${s.y} is under a tree`);
        else if (!walkable.has(`${s.x},${s.y}`))
          out.push(
            `forage spot ${s.x},${s.y} cannot be reached from entry "${entry.name}"`,
          );
    }
    return out;
  }

  /** Whether any tile can be tilled. */
  get hasSoil(): boolean {
    return this.soil.some(Boolean);
  }

  private inside(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }
}
