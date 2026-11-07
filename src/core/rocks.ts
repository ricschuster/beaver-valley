import type { Spot } from "./forage";

/**
 * Rocks you break with the pickaxe (`docs/design/22_mines.md`). Pure rules:
 * this file knows nothing of Phaser. A rock is one tile that blocks walking
 * until it is broken. Plain rocks give stone, copper nodes give ore and coal
 * rocks give coal. The farm has one field of rocks, and each mine floor has
 * its own.
 */

export type RockKind = "stone" | "copper" | "coal" | "quartz";

export interface Rock {
  x: number;
  y: number;
  kind: RockKind;
  /** Swings already landed on it. */
  hits: number;
}

/**
 * Swings to break each kind with the basic pickaxe. Ours, placeholders: the
 * pickaxe has no tiers yet, and a deeper rock will take more (note 22, "no
 * gate").
 */
export const SWINGS_TO_BREAK: Record<RockKind, number> = {
  stone: 2,
  copper: 3,
  coal: 3,
  /** A crystal cluster: one swing. A placeholder for quartz "lying on the floor" (note 34). */
  quartz: 1,
};

export const ROCK_KINDS: RockKind[] = ["stone", "copper", "coal", "quartz"];

const key = (x: number, y: number) => `${x},${y}`;

/** A field of rocks. */
export class Rocks {
  private rocks = new Map<string, Rock>();

  /** Plain stone on each given tile, for a map's starting rocks. */
  constructor(spots: Spot[] = []) {
    for (const s of spots) this.add(s.x, s.y, "stone");
  }

  save(): Rock[] {
    return [...this.rocks.values()].map((r) => ({ ...r }));
  }

  load(saved: Rock[]): void {
    this.rocks = new Map(saved.map((r) => [key(r.x, r.y), { ...r }]));
  }

  *each(): Generator<Rock> {
    yield* this.rocks.values();
  }

  at(x: number, y: number): Rock | undefined {
    return this.rocks.get(key(x, y));
  }

  get count(): number {
    return this.rocks.size;
  }

  /** Put a rock on a tile. Returns false if one is already there. */
  add(x: number, y: number, kind: RockKind, hits = 0): boolean {
    if (this.at(x, y)) return false;
    this.rocks.set(key(x, y), { x, y, kind, hits });
    return true;
  }

  remove(x: number, y: number): boolean {
    return this.rocks.delete(key(x, y));
  }
}
