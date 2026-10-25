/**
 * Seasons, in order. The first playable has two; more slot in here later.
 * Day numbers start at 1 (see Clock.day).
 */
export const SEASONS = ["spring", "summer"] as const;
export type Season = (typeof SEASONS)[number];

export const DAYS_PER_SEASON = 28;

export interface CalendarDate {
  season: Season;
  /** 1 to DAYS_PER_SEASON. */
  dayOfSeason: number;
  /** 1 based; a year is one pass through SEASONS. */
  year: number;
}

export function dateOf(day: number): CalendarDate {
  const index = day - 1;
  const seasonIndex = Math.floor(index / DAYS_PER_SEASON) % SEASONS.length;
  return {
    season: SEASONS[seasonIndex] as Season,
    dayOfSeason: (index % DAYS_PER_SEASON) + 1,
    year: Math.floor(index / (DAYS_PER_SEASON * SEASONS.length)) + 1,
  };
}
