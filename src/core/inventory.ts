export const SLOT_COUNT = 12;
/** Slots after each backpack upgrade, as in Stardew (12, 24, 36). */
export const BACKPACK_SIZES = [12, 24, 36];
export const MAX_SLOTS = 36;
export const STACK_SIZE = 999;

/** The player's backpack: a fixed number of slots, each a stack of one item. */
export class Inventory {
  private slots: ({ id: string; count: number } | undefined)[];

  constructor(size = SLOT_COUNT) {
    this.slots = Array.from({ length: size }, () => undefined);
  }

  get size(): number {
    return this.slots.length;
  }

  /** Make the backpack bigger. Never shrinks it. Returns false if it did not grow. */
  grow(size: number): boolean {
    if (size <= this.size || size > MAX_SLOTS) return false;
    while (this.slots.length < size) this.slots.push(undefined);
    return true;
  }

  /** The slots as plain data. */
  save(): ({ id: string; count: number } | null)[] {
    return this.slots.map((s) => (s ? { ...s } : null));
  }

  load(saved: ({ id: string; count: number } | null)[]): void {
    const size = Math.min(Math.max(saved.length, SLOT_COUNT), MAX_SLOTS);
    this.slots = Array.from({ length: size }, (_, i) => {
      const s = saved[i];
      return s ? { ...s } : undefined;
    });
  }

  /** The stack in a slot, if any. */
  slot(i: number): { id: string; count: number } | undefined {
    const s = this.slots[i];
    return s ? { ...s } : undefined;
  }

  count(id: string): number {
    return this.slots.reduce((n, s) => (s?.id === id ? n + s.count : n), 0);
  }

  /** How many of an item would fit right now. */
  room(id: string): number {
    return this.slots.reduce(
      (n, s) =>
        n +
        (s === undefined ? STACK_SIZE : s.id === id ? STACK_SIZE - s.count : 0),
      0,
    );
  }

  /** Add items. All or nothing: returns false if they do not all fit. */
  add(id: string, n = 1): boolean {
    if (n <= 0 || this.room(id) < n) return false;
    let left = n;
    for (let i = 0; i < this.slots.length && left > 0; i++) {
      const s = this.slots[i];
      if (s?.id !== id) continue;
      const put = Math.min(left, STACK_SIZE - s.count);
      s.count += put;
      left -= put;
    }
    for (let i = 0; i < this.slots.length && left > 0; i++) {
      if (this.slots[i] !== undefined) continue;
      const put = Math.min(left, STACK_SIZE);
      this.slots[i] = { id, count: put };
      left -= put;
    }
    return true;
  }

  /** Remove items. All or nothing: returns false if there are not enough. */
  remove(id: string, n = 1): boolean {
    if (n <= 0 || this.count(id) < n) return false;
    let left = n;
    for (let i = this.slots.length - 1; i >= 0 && left > 0; i--) {
      const s = this.slots[i];
      if (s?.id !== id) continue;
      const take = Math.min(left, s.count);
      s.count -= take;
      left -= take;
      if (s.count === 0) this.slots[i] = undefined;
    }
    return true;
  }
}
