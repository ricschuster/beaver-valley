import type { Season } from "./calendar";
import { festivalOn } from "./festivals";

export const WEATHERS = ["sunny", "rainy", "snowy"] as const;
export type Weather = (typeof WEATHERS)[number];

/** Chance that a day is rainy, by season. Tunable. */
export const RAIN_CHANCE: Record<Season, number> = {
  spring: 0.2,
  summer: 0.15,
  fall: 0.2,
  winter: 0,
};

/** Chance that a winter day is snowy. Ours, a look and a forecast only (note 07). */
export const SNOW_CHANCE = 0.3;

/**
 * Weather for a new day. The first day of a season and festival days are
 * always sunny. Rain
 * waters every plot overnight (see `sleep`).
 */
export function rollWeather(
  season: Season,
  dayOfSeason: number,
  random: () => number,
): Weather {
  if (dayOfSeason === 1 || festivalOn(season, dayOfSeason)) return "sunny";
  if (season === "winter") return random() < SNOW_CHANCE ? "snowy" : "sunny";
  return random() < RAIN_CHANCE[season] ? "rainy" : "sunny";
}
