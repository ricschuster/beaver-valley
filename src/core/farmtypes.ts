import farmTypeData from "../content/farm-types.json";
import { maps } from "../content/maps";
import type { FarmMap } from "./map";

/**
 * A farm type is data: a map plus a few rule fields
 * (`docs/design/32_farm_types.md`). Anything a record leaves out uses the
 * default rule, so a type is added with files, not code paths.
 */
export interface FarmTypeDef {
  id: string;
  name: string;
  theme: string;
  /** One line for the choice screen. */
  perk: string;
  /** The farm's map id (a file in `src/content/maps`). */
  map: string;
  /** The seeds a new game starts with, besides the normal kit. */
  startSeeds: { crop: string; count: number };
  /** Chance a cut weed drops a mixed seed. 0.05 by default (note 29), 1 on Woodland. */
  mixedSeedChance: number;
  /** Days a chopped large stump takes to regrow. 0 means the map has none. */
  stumpRegrowDays: number;
}

export const FARM_TYPES = farmTypeData as FarmTypeDef[];

/** The type an old save, or a save with an unknown id, loads as. */
export const DEFAULT_FARM_TYPE = "standard";

/** The type with this id, or Standard if there is none. */
export function farmTypeById(id: string | undefined): FarmTypeDef {
  return (
    FARM_TYPES.find((t) => t.id === id) ??
    (FARM_TYPES.find((t) => t.id === DEFAULT_FARM_TYPE) as FarmTypeDef)
  );
}

/**
 * Interiors name the farm as "farm". This turns that, or any other map id,
 * into the map the player's farm type really uses.
 */
export function resolveMapId(id: string, farmType: string): string {
  return id === "farm" ? farmTypeById(farmType).map : id;
}

/** True for the map of any farm type. */
export function isFarmMap(id: string): boolean {
  return FARM_TYPES.some((t) => t.map === id);
}

/** The map of the farm a game is played on. */
export function farmMapOf(g: { farmType: string }): FarmMap {
  return maps.get(farmTypeById(g.farmType).map);
}
