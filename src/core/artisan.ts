import { CROPS, cropById } from "./crops";
import { FORAGE, forageById } from "./forage";
import { FRUIT_TREES, fruitTreeById } from "./fruittrees";
import { splitQuality } from "./quality";

/**
 * Artisan goods (`docs/design/24_processing_and_cooking.md`): jam, pickles,
 * wine, juice, honey and mead. A good is made from one input, so each input has
 * its own item, such as `melon-jam`, and the bundles take any of a category.
 * Prices follow note 07: jam and pickles 2 x base + 50, wine 3 x base, juice
 * 2.25 x base, wild honey 100g, mead 300g. Input quality is ignored. Pure data.
 */
export type ArtisanKind = "jam" | "pickles" | "wine" | "juice";
export type ArtisanCategory = ArtisanKind | "honey" | "mead";

export interface ArtisanDef {
  id: string;
  name: string;
  category: ArtisanCategory;
  sellPrice: number;
}

export const HONEY = "honey";
export const MEAD = "mead";

/** Words for each category, for bundle lists. */
export const CATEGORY_NAMES: Record<ArtisanCategory, string> = {
  jam: "Any jam",
  pickles: "Any pickles",
  wine: "Any wine",
  juice: "Any juice",
  honey: "Honey",
  mead: "Mead",
};

/** Price rule per kind, from the base price of the input. */
const PRICE: Record<ArtisanKind, (base: number) => number> = {
  jam: (b) => 2 * b + 50,
  pickles: (b) => 2 * b + 50,
  wine: (b) => 3 * b,
  juice: (b) => Math.floor(2.25 * b),
};

const KIND_WORD: Record<ArtisanKind, string> = {
  jam: "jam",
  pickles: "pickles",
  wine: "wine",
  juice: "juice",
};

export const artisanId = (input: string, kind: ArtisanKind) =>
  `${input}-${kind}`;

/** Whether an input is a fruit or a vegetable. Undefined for goods that cannot be processed. */
export function produceOf(id: string): "fruit" | "vegetable" | undefined {
  const base = splitQuality(id).base;
  const crop = cropById(base);
  if (crop) return crop.produce ?? "vegetable";
  if (fruitTreeById(base)) return "fruit";
  return forageById(base)?.produce;
}

/** The sell price of a raw input at normal quality. */
function basePrice(id: string): number {
  return (
    cropById(id)?.sellPrice ??
    fruitTreeById(id)?.sellPrice ??
    forageById(id)?.sellPrice ??
    0
  );
}

function nameOf(id: string): string {
  return (
    cropById(id)?.name ?? fruitTreeById(id)?.name ?? forageById(id)?.name ?? id
  );
}

const defs = new Map<string, ArtisanDef>();
const inputs = [
  ...CROPS.map((c) => c.id),
  ...FRUIT_TREES.map((t) => t.id),
  ...FORAGE.filter((f) => f.produce).map((f) => f.id),
];
for (const input of inputs) {
  const fruit = produceOf(input) === "fruit";
  const kinds: ArtisanKind[] = fruit ? ["jam", "wine"] : ["pickles", "juice"];
  for (const kind of kinds) {
    const id = artisanId(input, kind);
    defs.set(id, {
      id,
      name: `${nameOf(input)} ${KIND_WORD[kind]}`,
      category: kind,
      sellPrice: PRICE[kind](basePrice(input)),
    });
  }
}
defs.set(HONEY, {
  id: HONEY,
  name: "Honey",
  category: "honey",
  sellPrice: 100,
});
defs.set(MEAD, { id: MEAD, name: "Mead", category: "mead", sellPrice: 300 });

/** Every artisan good the game can make. */
export const ARTISAN_GOODS: readonly ArtisanDef[] = [...defs.values()];

export const artisanById = (id: string): ArtisanDef | undefined =>
  defs.get(splitQuality(id).base);

/** The category of an artisan good, if it is one. */
export const categoryOf = (id: string): ArtisanCategory | undefined =>
  artisanById(id)?.category;
