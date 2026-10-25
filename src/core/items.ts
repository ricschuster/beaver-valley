import { CROPS, cropById } from "./crops";

/** Item ids: a crop's produce uses the crop id, its seed uses `<id>-seed`. */
export const seedId = (cropId: string) => `${cropId}-seed`;

export interface ItemDef {
  id: string;
  name: string;
  sellPrice: number;
  buyPrice?: number;
}

const items = new Map<string, ItemDef>();
for (const c of CROPS) {
  items.set(c.id, { id: c.id, name: c.name, sellPrice: c.sellPrice });
  items.set(seedId(c.id), {
    id: seedId(c.id),
    name: `${c.name} seeds`,
    sellPrice: Math.floor(c.seedPrice / 2),
    buyPrice: c.seedPrice,
  });
}

export function itemById(id: string): ItemDef | undefined {
  return items.get(id);
}

/** The crop a seed item plants, if any. */
export function cropOfSeed(id: string): string | undefined {
  const cropId = id.endsWith("-seed") ? id.slice(0, -5) : undefined;
  return cropId && cropById(cropId) ? cropId : undefined;
}
