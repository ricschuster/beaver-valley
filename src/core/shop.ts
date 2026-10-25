import { itemById } from "./items";
import type { Inventory } from "./inventory";

export interface Wallet {
  money: number;
}

/** Sell n of an item. Returns the money earned, or 0 if it cannot be sold. */
export function sell(
  inv: Inventory,
  wallet: Wallet,
  id: string,
  n = 1,
): number {
  const def = itemById(id);
  if (!def || !inv.remove(id, n)) return 0;
  const earned = def.sellPrice * n;
  wallet.money += earned;
  return earned;
}

/** Buy n of an item. Returns false if unbuyable, too dear, or no room. */
export function buy(
  inv: Inventory,
  wallet: Wallet,
  id: string,
  n = 1,
): boolean {
  const def = itemById(id);
  if (!def || def.buyPrice === undefined || n <= 0) return false;
  const cost = def.buyPrice * n;
  if (wallet.money < cost || !inv.add(id, n)) return false;
  wallet.money -= cost;
  return true;
}
