export const SLOT_COUNT = 12;
export const STACK_SIZE = 999;

/** The player's backpack: a fixed number of slots, each a stack of one item. */
export class Inventory {
  private slots: ({ id: string; count: number } | undefined)[];

  constructor(readonly size = SLOT_COUNT) {
    this.slots = Array.from({ length: size }, () => undefined);
  }

  /** The slots as plain data. */
  save(): ({ id: string; count: number } | null)[] {
    return this.slots.map((s) => (s ? { ...s } : null));
  }

  load(saved: ({ id: string; count: number } | null)[]): void {
    this.slots = Array.from({ length: this.size }, (_, i) => {
      const s = saved[i];
      return s ? { ...s } : undefined;
    });
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
