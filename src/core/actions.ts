import { dateOf } from "./calendar";
import { cropById } from "./crops";
import { cropOfSeed } from "./items";
import { cropQuality, forageQuality, withQuality } from "./quality";
import { FORAGE_XP, harvestXp, type Skill } from "./skills";
import type { GameState } from "./save";

/** Energy per tool swing (hoe, watering can), as in Stardew. Seeds, picking and harvesting are free. */
export const TOOL_ENERGY = 2;

export type Outcome =
  | { ok: false; reason: string }
  | { ok: true; levelUp?: { skill: Skill; level: number }; item?: string };

const fail = (reason: string): Outcome => ({ ok: false, reason });

/** Spend tool energy. The clock runs in real time, so actions take no game minutes. */
function swing(g: GameState): void {
  g.day.act(TOOL_ENERGY, 0);
}

function award(g: GameState, skill: Skill, xp: number, item?: string): Outcome {
  const level = g.skills.gain(skill, xp);
  return { ok: true, item, levelUp: level ? { skill, level } : undefined };
}

/** Every action is refused once the day is over, so the scene must sleep first. */
export function till(g: GameState, x: number, y: number): Outcome {
  if (g.day.over) return fail("exhausted");
  if (!g.farm.till(x, y)) return fail("already tilled");
  if (g.weather === "rainy") g.farm.water(x, y);
  swing(g);
  return { ok: true };
}

export function water(g: GameState, x: number, y: number): Outcome {
  if (g.day.over) return fail("exhausted");
  const plot = g.farm.plotAt(x, y);
  if (!plot) return fail("nothing to water");
  if (plot.wateredToday) return fail("already watered");
  g.farm.water(x, y);
  swing(g);
  return { ok: true };
}

/** Plant a seed item from the backpack in the current season. */
export function plant(
  g: GameState,
  x: number,
  y: number,
  seed: string,
): Outcome {
  if (g.day.over) return fail("exhausted");
  const cropId = cropOfSeed(seed);
  if (!cropId) return fail("not a seed");
  if (g.inventory.count(seed) < 1) return fail("no seeds");
  const season = dateOf(g.day.clock.day).season;
  if (!g.farm.plant(x, y, cropId, season)) return fail("cannot plant here");
  g.inventory.remove(seed);
  return { ok: true };
}

export function harvest(
  g: GameState,
  x: number,
  y: number,
  random: () => number = Math.random,
): Outcome {
  if (g.day.over) return fail("exhausted");
  const cropId = g.farm.plotAt(x, y)?.crop?.id;
  if (!cropId || !g.farm.isRipe(x, y)) return fail("nothing ripe");
  const item = withQuality(
    cropId,
    cropQuality(g.skills.level("farming"), random()),
  );
  if (g.inventory.room(item) < 1) return fail("backpack full");
  g.farm.harvest(x, y);
  g.inventory.add(item);
  const price = cropById(cropId)?.sellPrice ?? 0;
  return award(g, "farming", harvestXp(price), item);
}

export function forage(
  g: GameState,
  x: number,
  y: number,
  random: () => number = Math.random,
): Outcome {
  if (g.day.over) return fail("exhausted");
  const id = g.forage.itemAt(x, y);
  if (!id) return fail("nothing here");
  const item = withQuality(
    id,
    forageQuality(g.skills.level("foraging"), random()),
  );
  if (g.inventory.room(item) < 1) return fail("backpack full");
  g.forage.collect(x, y);
  g.inventory.add(item);
  return award(g, "foraging", FORAGE_XP, item);
}
