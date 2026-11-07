/** Chest data, apart from the rules so `items.ts` can read it without a cycle (`chests.ts`). */
export interface ChestDef {
  id: string;
  name: string;
  slots: number;
}

export const CHESTS: readonly ChestDef[] = [
  { id: "chest", name: "Chest", slots: 36 },
  { id: "stone-chest", name: "Stone chest", slots: 36 },
  { id: "big-chest", name: "Big chest", slots: 70 },
  { id: "big-stone-chest", name: "Big stone chest", slots: 70 },
];

export function chestById(id: string | undefined): ChestDef | undefined {
  return CHESTS.find((c) => c.id === id);
}
