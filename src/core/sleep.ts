import { dateOf, type Season } from "./calendar";
import { growthRate } from "./professions";
import { rollWeather, type Weather } from "./weather";
import type { Spot } from "./forage";
import type { GameState } from "./save";
import type { FarmMap } from "./map";
import { advanceBuild } from "./house";

export interface SleepReport {
  passedOut: boolean;
  /** Why the player passed out, if they did. */
  reason?: "energy" | "time";
  moneyLost: number;
  /** Set when the new day starts a different season. */
  newSeason?: Season;
  /** Weather for the new day. */
  weather: Weather;
  /** Crops that died overnight because their season ended. */
  withered: number;
  /** True when the carpenter finished the house upgrade this morning. */
  houseFinished: boolean;
}

/**
 * End the day and start the next: pass-out cost, crop growth, season change,
 * tree growth and spread on `map` (none spread without it), and fresh forage
 * on `spots`. Call it from the sleep action or when the day
 * is over. Saving is the caller's job, after this returns.
 */
export function sleep(
  g: GameState,
  spots: Spot[],
  random: () => number,
  map?: FarmMap,
): SleepReport {
  const before = dateOf(g.day.clock.day).season;
  const cropsBefore = g.farm.cropCount;
  const end = g.day.end(g.money);
  const moneyLost = end.passedOut ? end.moneyLost : 0;
  g.money -= moneyLost;

  const { season } = dateOf(g.day.clock.day);
  g.farm.endDay(season, growthRate(g.skills));
  g.weather = g.tomorrow;
  const next = dateOf(g.day.clock.day + 1);
  g.tomorrow = rollWeather(next.season, next.dayOfSeason, random);
  if (g.weather === "rainy") g.farm.waterAll();
  g.trees.endDay(
    season,
    random,
    (x, y) =>
      !!map &&
      map.canPlantTree(x, y) &&
      !g.farm.plotAt(x, y) &&
      !g.forage.itemAt(x, y) &&
      g.ground.at(x, y).length === 0,
  );
  g.forage.respawn(
    season,
    spots.filter((s) => !g.trees.at(s.x, s.y)),
    random,
  );
  const houseFinished = advanceBuild(g);

  return {
    passedOut: end.passedOut,
    reason: end.passedOut ? end.reason : undefined,
    moneyLost,
    weather: g.weather,
    newSeason: season !== before ? season : undefined,
    withered: cropsBefore - g.farm.cropCount,
    houseFinished,
  };
}

/** True once all bundles are done: show the end screen. */
export function finished(g: GameState): boolean {
  return g.hall.allComplete;
}

/** True when the end screen is due: all bundles done and not shown yet. */
export function endDue(g: GameState): boolean {
  return finished(g) && !g.endSeen;
}
