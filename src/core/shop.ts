import { SEASONS, type Season } from "./calendar";
import { CROPS } from "./crops";
import { FRUIT_TREES, saplingId } from "./fruittrees";
import { itemById, seedId } from "./items";
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
  multiplier = 1,
): number {
  const def = itemById(id);
  if (!def || def.keep || !inv.remove(id, n)) return 0;
  const earned = Math.floor(def.sellPrice * multiplier) * n;
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

/** Sell every unit of an item. Returns the money earned. */
export function sellAll(
  inv: Inventory,
  wallet: Wallet,
  id: string,
  multiplier = 1,
): number {
  return sell(inv, wallet, id, inv.count(id), multiplier);
}

/** Seeds on sale in a season: those of crops that grow in it. */
export function seedStock(season: Season): string[] {
  return CROPS.filter((c) => c.seasons.includes(season)).map((c) =>
    seedId(c.id),
  );
}

/**
 * Saplings on sale. Pierre's sells every tree all year, but ours list only the
 * trees whose season is in the calendar, so a tree that could never bear
 * (fall, until build 4) is not sold yet.
 */
export function saplingStock(): string[] {
  return FRUIT_TREES.filter((t) =>
    (SEASONS as readonly string[]).includes(t.season),
  ).map((t) => saplingId(t.id));
}

export { fertilizerStock } from "./fertilizer";
