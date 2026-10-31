/** The house grows in tiers: 0 is the start room, 1 adds a kitchen and a bedroom. */
export const MAX_HOUSE_TIER = 3;

/** The id of the interior map, whose rooms open by tier. */
export const HOUSE_MAP = "house";

/** The parts of the house interior map. Closed ones are sealed earth. */
export type HouseArea = "start" | "kitchen" | "bedroom";

/** The tier at which each area opens. Tiers 2 and 3 add areas in M3. */
const OPENS_AT: Record<HouseArea, number> = {
  start: 0,
  kitchen: 1,
  bedroom: 1,
};

/** The areas open at a house tier. Tiers out of range are clamped. */
export function openAreas(tier: number): HouseArea[] {
  const t = Math.min(Math.max(Math.floor(tier), 0), MAX_HOUSE_TIER);
  return (Object.keys(OPENS_AT) as HouseArea[]).filter((a) => OPENS_AT[a] <= t);
}

export function isAreaOpen(tier: number, area: HouseArea): boolean {
  return openAreas(tier).includes(area);
}

/** The areas still sealed with earth at a house tier. */
export function sealedAreas(tier: number): HouseArea[] {
  const open = openAreas(tier);
  return (Object.keys(OPENS_AT) as HouseArea[]).filter(
    (a) => !open.includes(a),
  );
}
