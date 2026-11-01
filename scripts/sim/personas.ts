// The three players of note 08, as numbers. Each is a plan over the same core
// actions, so the results stay comparable with the browser runs.
export interface Persona {
  name: string;
  /** Chance of playing on a given day; a skipped day is just slept through. */
  playChance: number;
  /** Chance of walking the forage spots on a played day. */
  forageChance: number;
  /** Most spots picked in one sweep; 0 for all of them. */
  forageMax: number;
  /** Visit the hall every this many played days, if there is something to hand in. */
  hallEvery: number;
  /** Chance of skipping the watering on a played day. */
  forgetWater: number;
  /** How many of each crop a bundle wants to have growing or in hand. */
  cropsPerBundleCrop: number;
  /** A crop planted for money on spare soil, and how many plots of it. */
  cashCrop?: string;
  cashPlots: number;
}

export const PERSONAS: Record<string, Persona> = {
  expert: {
    name: "expert",
    playChance: 1,
    forageChance: 1,
    forageMax: 0,
    hallEvery: 1,
    forgetWater: 0,
    cropsPerBundleCrop: 2,
    cashCrop: "parsnip",
    cashPlots: 0,
  },
  intermediate: {
    name: "intermediate",
    playChance: 1,
    forageChance: 0.6,
    forageMax: 0,
    hallEvery: 3,
    forgetWater: 0.1,
    cropsPerBundleCrop: 2,
    cashCrop: "parsnip",
    cashPlots: 12,
  },
  casual: {
    name: "casual",
    playChance: 0.75,
    forageChance: 0.33,
    forageMax: 3,
    hallEvery: 6,
    forgetWater: 0.3,
    cropsPerBundleCrop: 1,
    cashCrop: "parsnip",
    cashPlots: 6,
  },
};
