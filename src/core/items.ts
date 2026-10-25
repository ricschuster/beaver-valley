import { CROPS, cropById } from "./crops";
import { FORAGE } from "./forage";
import { ENERGY_MULTIPLIER, QUALITY_MULTIPLIER, splitQuality } from "./quality";

/** Item ids: a crop's produce uses the crop id, its seed uses `<id>-seed`. */
export const seedId = (cropId: string) => `${cropId}-seed`;

export interface ItemDef {
  id: string;
  name: string;
  sellPrice: number;
  buyPrice?: number;
  /** Energy restored when eaten, at normal quality. Absent if not food. */
  energy?: number;
}

const items = new Map<string, ItemDef>();
for (const c of CROPS) {
  items.set(c.id, {
    id: c.id,
    name: c.name,
    sellPrice: c.sellPrice,
    energy: c.energy,
  });
  items.set(seedId(c.id), {
    id: seedId(c.id),
    name: `${c.name} seeds`,
    sellPrice: Math.floor(c.seedPrice / 2),
    buyPrice: c.seedPrice,
  });
}

for (const f of FORAGE) {
  items.set(f.id, {
    id: f.id,
    name: f.name,
    sellPrice: f.sellPrice,
    energy: f.energy,
  });
}

const QUALITY_NAME = { silver: "Silver", gold: "Gold" } as const;

/** An item by id. A good with a quality suffix sells for more, per tier. */
export function itemById(id: string): ItemDef | undefined {
  const { base, quality } = splitQuality(id);
  const def = items.get(base);
  if (!def || quality === "normal") return def;
  return {
    id,
    name: `${QUALITY_NAME[quality]} ${def.name.toLowerCase()}`,
    sellPrice: Math.floor(def.sellPrice * QUALITY_MULTIPLIER[quality]),
    energy:
      def.energy === undefined
        ? undefined
        : Math.floor(def.energy * ENERGY_MULTIPLIER[quality]),
  };
}

/** The crop a seed item plants, if any. */
export function cropOfSeed(id: string): string | undefined {
  const cropId = id.endsWith("-seed") ? id.slice(0, -5) : undefined;
  return cropId && cropById(cropId) ? cropId : undefined;
}
