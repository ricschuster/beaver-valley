import festivalData from "../content/festivals.json";
import { DAYS_PER_SEASON, SEASONS, dateOf, type Season } from "./calendar";
import type { GameState } from "./save";

/** A dated village event. Content lives in `src/content/festivals.json`. */
export interface Festival {
  id: string;
  name: string;
  season: Season;
  /** Day of the season, 1 to DAYS_PER_SEASON. */
  day: number;
  /** Minutes since midnight when the festival opens and closes. */
  opens: number;
  closes: number;
  blurb: string;
  /** Game minutes the player spends joining in. */
  joinMinutes: number;
  /** Prize counter stock (item ids). Empty until a festival has prizes. */
  prizes: string[];
  /** Id of the festival game, or null for none (see `11_minigames.md`). */
  minigame: string | null;
}

export const FESTIVALS = festivalData as Festival[];

/** The festival on a calendar day, if there is one. */
export function festivalOn(
  season: Season,
  dayOfSeason: number,
): Festival | undefined {
  return FESTIVALS.find((f) => f.season === season && f.day === dayOfSeason);
}

/** The festival on a game day (1 based, as in `Clock.day`), if any. */
export function festivalToday(day: number): Festival | undefined {
  const { season, dayOfSeason } = dateOf(day);
  return festivalOn(season, dayOfSeason);
}

/** True while the festival is open at this time on its day. */
export function festivalOpen(f: Festival, minutes: number): boolean {
  return minutes >= f.opens && minutes < f.closes;
}

/** The next festival after `day`, searching a full year ahead. */
export function nextFestival(
  day: number,
): { festival: Festival; day: number } | undefined {
  const year = DAYS_PER_SEASON * SEASONS.length;
  for (let d = day + 1; d <= day + year; d++) {
    const festival = festivalToday(d);
    if (festival) return { festival, day: d };
  }
  return undefined;
}

/** Key for "joined this festival this year", stored in the save. */
export function joinKey(f: Festival, day: number): string {
  return `${f.id}:${dateOf(day).year}`;
}

/** Why the player cannot join a festival now, or undefined if they can. */
export function joinProblem(g: GameState): string | undefined {
  const day = g.day.clock.day;
  const f = festivalToday(day);
  if (!f) return "There is no festival today.";
  if (g.day.clock.minutes < f.opens) return `${f.name} has not started yet.`;
  if (g.day.clock.minutes >= f.closes) return `${f.name} is over for today.`;
  if (g.festivalsJoined.includes(joinKey(f, day)))
    return "You have already joined in today.";
  return undefined;
}

/**
 * Join today's festival: it takes the festival's time and is remembered for
 * the year. Costs no energy and gives nothing to lose. Returns the festival,
 * or undefined (with nothing changed) if the player cannot join.
 */
export function joinFestival(g: GameState): Festival | undefined {
  if (joinProblem(g)) return undefined;
  const day = g.day.clock.day;
  const f = festivalToday(day)!;
  g.festivalsJoined.push(joinKey(f, day));
  g.day.clock.advance(f.joinMinutes);
  return f;
}
