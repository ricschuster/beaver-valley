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

/** A door, in tiles. `id` says where it leads (for example "shop"). */
export interface Door {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Layers the game reads for rules; they are never drawn. */
export const COLLISION_LAYER = "collision";
export const SOIL_LAYER = "soil";

const objectClass = (o: TiledObject) => o.class ?? o.type ?? "";

/** What the rules need to know about a map, in tile units. */
export class FarmMap {
  private constructor(
    readonly width: number,
    readonly height: number,
    readonly tileSize: number,
    private readonly blocked: boolean[],
    private readonly soil: boolean[],
    readonly spawns: Spot[],
    readonly doors: Door[],
    readonly forageSpots: Spot[],
  ) {}

  /** Read a Tiled map. Throws with a clear message if it breaks the contract. */
  static fromTiled(json: TiledMapJson): FarmMap {
    const { width, height } = json;
    if (json.tilewidth !== json.tileheight)
      throw new Error("map tiles must be square");
    const size = json.tilewidth;
    const grid = (name: string): boolean[] => {
      const layer = json.layers.find(
        (l) => l.name === name && l.type === "tilelayer",
      );
      if (!layer?.data) throw new Error(`map needs a tile layer "${name}"`);
      if (layer.data.length !== width * height)
        throw new Error(`layer "${name}" is not the size of the map`);
      return layer.data.map((id) => id !== 0);
    };
    const tile = (px: number) => Math.floor(px / size);

    const spawns: Spot[] = [];
    const doors: Door[] = [];
    const forageSpots: Spot[] = [];
    for (const layer of json.layers) {
      if (layer.type !== "objectgroup") continue;
      for (const o of layer.objects ?? []) {
        const cls = objectClass(o);
        const spot = { x: tile(o.x), y: tile(o.y) };
        if (cls === "spawn") spawns.push(spot);
        else if (cls === "forage") forageSpots.push(spot);
        else if (cls === "door") {
          const w = Math.max(1, Math.round((o.width ?? size) / size));
          const h = Math.max(1, Math.round((o.height ?? size) / size));
          doors.push({ id: o.name, ...spot, w, h });
        }
      }
    }
    return new FarmMap(
      width,
      height,
      size,
      grid(COLLISION_LAYER),
      grid(SOIL_LAYER),
      spawns,
      doors,
      forageSpots,
    );
  }

  /** Outside the map counts as blocked, so nothing can walk off the edge. */
  isBlocked(x: number, y: number): boolean {
    return !this.inside(x, y) || this.blocked[y * this.width + x] === true;
  }

  isTillable(x: number, y: number): boolean {
    return this.inside(x, y) && this.soil[y * this.width + x] === true;
  }

  /** The tile where a new game starts. Valid maps have exactly one. */
  get spawn(): Spot {
    return this.spawns[0] as Spot;
  }

  /** The id of the door covering this tile, if any. */
  doorAt(x: number, y: number): string | undefined {
    return this.doors.find(
      (d) => x >= d.x && x < d.x + d.w && y >= d.y && y < d.y + d.h,
    )?.id;
  }

  /** Tiles that can be walked to from `from`, four ways. */
  reachable(from: Spot): Set<string> {
    const seen = new Set<string>();
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
        if (seen.has(k) || this.isBlocked(next.x, next.y)) continue;
        seen.add(k);
        queue.push(next);
      }
    }
    return seen;
  }

  /** Everything wrong with the map, in words. Empty when it is usable. */
  problems(): string[] {
    const out: string[] = [];
    if (this.spawns.length !== 1)
      out.push(`needs exactly one spawn, found ${this.spawns.length}`);
    const ids = this.doors.map((d) => d.id);
    if (new Set(ids).size !== ids.length) out.push("door names must be unique");
    if (this.spawns.length === 0) return out;

    const walkable = this.reachable(this.spawn);
    if (walkable.size === 0) out.push("the spawn is blocked");
    for (const door of this.doors) {
      let ok = false;
      for (let y = door.y; y < door.y + door.h; y++)
        for (let x = door.x; x < door.x + door.w; x++)
          if (walkable.has(`${x},${y}`)) ok = true;
      if (!ok) out.push(`door "${door.id}" cannot be reached from the spawn`);
    }
    for (const s of this.forageSpots)
      if (!walkable.has(`${s.x},${s.y}`))
        out.push(`forage spot ${s.x},${s.y} cannot be reached from the spawn`);
    if (!this.soil.some(Boolean)) out.push("the map has no tillable soil");
    return out;
  }

  private inside(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }
}
