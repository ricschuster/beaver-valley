import bundleData from "../content/bundles.json";
import type { Inventory } from "./inventory";
import type { Wallet } from "./shop";

export interface BundleDef {
  id: string;
  name: string;
  /** Goods the bundle accepts. */
  items: string[];
  /** How many different goods from `items` must be handed in. */
  required: number;
  reward: { money?: number; item?: { id: string; count: number } };
}

export const BUNDLES = bundleData as BundleDef[];

export type HandIn = "accepted" | "completed" | "rejected";

/** Saved progress: bundle id to the goods handed in so far. */
export type HallProgress = Record<string, string[]>;

/** The village hall: five bundles, handed in one item at a time. */
export class Hall {
  private given = new Map<string, Set<string>>();

  constructor(
    readonly bundles: BundleDef[] = BUNDLES,
    progress: HallProgress = {},
  ) {
    for (const [id, items] of Object.entries(progress)) {
      this.given.set(id, new Set(items));
    }
  }

  handedIn(bundleId: string): string[] {
    return [...(this.given.get(bundleId) ?? [])];
  }

  complete(bundleId: string): boolean {
    const def = this.bundles.find((b) => b.id === bundleId);
    return !!def && this.handedIn(bundleId).length >= def.required;
  }

  get allComplete(): boolean {
    return this.bundles.every((b) => this.complete(b.id));
  }

  /**
   * Hand one item in. Rejected if the bundle is full or unknown, does not
   * take the item, already has it, or the player does not hold it. Finishing
   * a bundle gives its reward.
   */
  handIn(
    inv: Inventory,
    wallet: Wallet,
    bundleId: string,
    itemId: string,
  ): HandIn {
    const def = this.bundles.find((b) => b.id === bundleId);
    if (!def || this.complete(bundleId) || !def.items.includes(itemId))
      return "rejected";
    const set = this.given.get(bundleId) ?? new Set<string>();
    if (set.has(itemId) || !inv.remove(itemId)) return "rejected";
    set.add(itemId);
    this.given.set(bundleId, set);
    if (set.size < def.required) return "accepted";
    wallet.money += def.reward.money ?? 0;
    const prize = def.reward.item;
    if (prize) inv.add(prize.id, prize.count);
    return "completed";
  }

  save(): HallProgress {
    return Object.fromEntries(
      [...this.given].map(([id, set]) => [id, [...set]]),
    );
  }
}
