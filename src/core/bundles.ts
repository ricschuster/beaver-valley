import bundleData from "../content/bundles.json";
import type { Inventory } from "./inventory";
import { itemById } from "./items";
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

  /**
   * Why `handIn` would refuse this item, in words for the player, or
   * undefined if it would take it.
   */
  problem(
    inv: Inventory,
    bundleId: string,
    itemId: string,
  ): string | undefined {
    const def = this.bundles.find((b) => b.id === bundleId);
    if (!def) return "There is no such bundle.";
    if (this.complete(bundleId)) return "That bundle is already done.";
    if (!def.items.includes(itemId)) return "This bundle does not take that.";
    if (this.handedIn(bundleId).includes(itemId)) return "Already handed in.";
    if (inv.count(itemId) < 1) return "You do not have one.";
    return undefined;
  }

  save(): HallProgress {
    return Object.fromEntries(
      [...this.given].map(([id, set]) => [id, [...set]]),
    );
  }
}

/** A bundle's reward in words, such as "500g" or "15 Parsnip seeds". */
export function rewardText(def: BundleDef): string {
  const parts: string[] = [];
  if (def.reward.money) parts.push(`${def.reward.money}g`);
  const prize = def.reward.item;
  if (prize)
    parts.push(`${prize.count} ${itemById(prize.id)?.name ?? prize.id}`);
  return parts.join(" and ") || "nothing";
}
