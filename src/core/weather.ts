import type { Season } from "./calendar";

export const WEATHERS = ["sunny", "rainy"] as const;
export type Weather = (typeof WEATHERS)[number];

/** Chance that a day is rainy, by season. Tunable. */
export const RAIN_CHANCE: Record<Season, number> = {
  spring: 0.2,
  summer: 0.15,
};

/**
 * Weather for a new day. The first day of a season is always sunny. Rain
 * waters every plot overnight (see `sleep`).
 */
export function rollWeather(
  season: Season,
  dayOfSeason: number,
  random: () => number,
): Weather {
  if (dayOfSeason === 1) return "sunny";
  return random() < RAIN_CHANCE[season] ? "rainy" : "sunny";
}
