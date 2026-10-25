import type { Season } from "./calendar";
import cropData from "../content/crops.json";

export interface CropDef {
  id: string;
  name: string;
  seasons: Season[];
  /** Watered days from planting to first harvest. */
  growDays: number;
  /** If set, the crop keeps producing every this many watered days. */
  regrowDays?: number;
  seedPrice: number;
  sellPrice: number;
  /** Energy restored when eaten. */
  energy?: number;
}

export const CROPS = cropData as CropDef[];

export function cropById(id: string): CropDef | undefined {
  return CROPS.find((c) => c.id === id);
}
