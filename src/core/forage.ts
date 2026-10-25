import type { Season } from "./calendar";
import forageData from "../content/forage.json";

export interface ForageDef {
  id: string;
  name: string;
  seasons: Season[];
  sellPrice: number;
}

export const FORAGE = forageData as ForageDef[];

export function forageById(id: string): ForageDef | undefined {
  return FORAGE.find((f) => f.id === id);
}

export interface Spot {
  x: number;
  y: number;
}

/** Most spots that hold wild goods on one day, as a share of candidate spots. */
export const MAX_FILL = 0.25;

/** Wild goods lying on the ground. They reset each morning. */
export class ForageField {
  private found = new Map<string, string>();

  itemAt(x: number, y: number): string | undefined {
    return this.found.get(`${x},${y}`);
  }

  /** Every good on the ground with its tile, for drawing. */
  *each(): Generator<{ x: number; y: number; id: string }> {
    for (const [k, id] of this.found) {
      const [x, y] = k.split(",").map(Number) as [number, number];
      yield { x, y, id };
    }
  }

  get count(): number {
    return this.found.size;
  }

  /** Clear yesterday's leftovers and scatter new goods for the season. */
  respawn(season: Season, spots: Spot[], random: () => number): void {
    this.found.clear();
    const options = FORAGE.filter((f) => f.seasons.includes(season));
    if (options.length === 0) return;
    const pool = [...spots];
    const target = Math.floor(random() * (pool.length * MAX_FILL + 1));
    for (let i = 0; i < target && pool.length > 0; i++) {
      const spot = pool.splice(
        Math.floor(random() * pool.length),
        1,
      )[0] as Spot;
      const def = options[Math.floor(random() * options.length)] as ForageDef;
      this.found.set(`${spot.x},${spot.y}`, def.id);
    }
  }

  /** Pick up whatever lies at a spot. Returns the item id, if any. */
  collect(x: number, y: number): string | undefined {
    const id = this.itemAt(x, y);
    this.found.delete(`${x},${y}`);
    return id;
  }
}
