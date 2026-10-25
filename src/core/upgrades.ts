import { BACKPACK_SIZES, type Inventory } from "./inventory";
import type { Wallet } from "./shop";

/** The tools that can be upgraded, and what each tier is called. */
export const UPGRADABLE = ["hoe", "can"] as const;
export type Upgradable = (typeof UPGRADABLE)[number];
export const TIER_NAMES = ["Basic", "Copper", "Steel", "Gold"] as const;
export const MAX_TIER = TIER_NAMES.length - 1;

/** Price to upgrade a tool to tier 1, 2 and 3. From memory. */
export const UPGRADE_COST = [2000, 5000, 10000];

/** Energy saved per swing for each tier above basic. Ours. */
export const TIER_SAVING = 0.25;
/** Energy saved per swing for each farming level. From memory. */
export const LEVEL_SAVING = 0.1;
/** A swing never costs less than this. */
export const MIN_SWING = 0.5;

export type ToolTiers = Record<Upgradable, number>;

/** Energy for one swing of the hoe or can, given the tool tier and farming level. */
export function swingCost(base: number, tier: number, farmingLevel: number) {
  return Math.max(
    base - TIER_SAVING * tier - LEVEL_SAVING * farmingLevel,
    MIN_SWING,
  );
}

/** The next tier's price, or undefined if the tool is fully upgraded. */
export function upgradeCost(tier: number): number | undefined {
  return UPGRADE_COST[tier];
}

/** Upgrade a tool one tier. Returns false if maxed or too dear. */
export function upgrade(
  tiers: ToolTiers,
  wallet: Wallet,
  tool: Upgradable,
): boolean {
  const cost = upgradeCost(tiers[tool]);
  if (cost === undefined || wallet.money < cost) return false;
  wallet.money -= cost;
  tiers[tool] += 1;
  return true;
}

/** Price to grow the backpack to 24 and then 36 slots. From memory. */
export const BACKPACK_COST = [2000, 10000];

/** The next size and its price, or undefined at the biggest backpack. */
export function nextBackpack(
  inv: Inventory,
): { size: number; cost: number } | undefined {
  const step = BACKPACK_SIZES.findIndex((n) => n > inv.size);
  const cost = BACKPACK_COST[step - 1];
  const size = BACKPACK_SIZES[step];
  return step < 1 || size === undefined || cost === undefined
    ? undefined
    : { size, cost };
}

/** Buy the next backpack size. Returns false if maxed or too dear. */
export function upgradeBackpack(inv: Inventory, wallet: Wallet): boolean {
  const next = nextBackpack(inv);
  if (!next || wallet.money < next.cost) return false;
  wallet.money -= next.cost;
  return inv.grow(next.size);
}
