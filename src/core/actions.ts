import { dateOf } from "./calendar";
import { cropById } from "./crops";
import { cropOfSeed, itemById } from "./items";
import { MAX_ENERGY } from "./energy";
import { doubleForageChance, forageFloor } from "./professions";
import { cropQuality, forageQuality, withQuality } from "./quality";
import { FORAGE_XP, harvestXp, type Skill } from "./skills";
import type { GameState } from "./save";
import type { FarmMap } from "./map";
import {
  MATURE_STAGE,
  SEED_STAGE,
  TREE_SEED,
  YOUNG_STAGE,
  swingsToFell,
  swingsToUproot,
} from "./trees";
import { swingCost, type Upgradable } from "./upgrades";

/** Energy per tool swing (hoe, watering can), as in Stardew. Seeds, picking and harvesting are free. */
export const TOOL_ENERGY = 2;

export type Outcome =
  | { ok: false; reason: string }
  | { ok: true; levelUp?: { skill: Skill; level: number }; item?: string };

const fail = (reason: string): Outcome => ({ ok: false, reason });

/** Spend tool energy. The clock runs in real time, so actions take no game minutes. */
function swing(g: GameState, tool: Upgradable): void {
  const cost = swingCost(
    TOOL_ENERGY,
    g.toolTiers[tool],
    g.skills.level("farming"),
  );
  g.day.act(cost, 0);
}

function award(g: GameState, skill: Skill, xp: number, item?: string): Outcome {
  const level = g.skills.gain(skill, xp);
  return { ok: true, item, levelUp: level ? { skill, level } : undefined };
}

/** Every action is refused once the day is over, so the scene must sleep first. */
export function till(g: GameState, x: number, y: number): Outcome {
  if (g.day.over) return fail("exhausted");
  if (g.trees.at(x, y)) return fail("a tree is in the way");
  if (!g.farm.till(x, y)) return fail("already tilled");
  if (g.weather === "rainy") g.farm.water(x, y);
  swing(g, "hoe");
  return { ok: true };
}

export function water(g: GameState, x: number, y: number): Outcome {
  if (g.day.over) return fail("exhausted");
  const plot = g.farm.plotAt(x, y);
  if (!plot) return fail("nothing to water");
  if (plot.wateredToday) return fail("already watered");
  g.farm.water(x, y);
  swing(g, "can");
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
    forageFloor(g.skills, forageQuality(g.skills.level("foraging"), random())),
  );
  if (g.inventory.room(item) < 1) return fail("backpack full");
  g.forage.collect(x, y);
  g.inventory.add(item);
  // Gatherers sometimes find a second one, if it fits.
  if (random() < doubleForageChance(g.skills)) g.inventory.add(item);
  return award(g, "foraging", FORAGE_XP, item);
}

/** Eat one of an item from the backpack to restore energy. Takes no game time. */
export function eat(g: GameState, itemId: string): Outcome {
  const gain = itemById(itemId)?.energy;
  if (gain === undefined) return fail("not food");
  if (g.inventory.count(itemId) < 1) return fail("nothing to eat");
  if (g.day.energy.current >= MAX_ENERGY) return fail("not hungry");
  g.inventory.remove(itemId);
  g.day.energy.restore(gain);
  return { ok: true, item: itemId };
}

/** The axe has no tiers yet (#194), so it is always tier 0. */
export const AXE_TIER = 0;

/** Wood from a young tree, as Stardew. */
const YOUNG_WOOD = 4;
/** Chance per foraging level that a seedling drops 1 wood. As Stardew. */
const SEEDLING_WOOD = 0.1;
/** Wood from a mature tree: 12, plus 1 per foraging level up to 4 (ours). */
const TREE_WOOD = 12;
const TREE_WOOD_BONUS_MAX = 4;
const TREE_SAP = 5;
const TREE_XP = 12;
/** A stump gives 4 to 9 wood, 1 sap and 1 XP. As Stardew. */
const STUMP_SAP = 1;
const STUMP_XP = 1;

/** What a finished chop gives: goods for the backpack and foraging XP. */
interface Chop {
  swings: number;
  goods: [string, number][];
  xp: number;
}

function planChop(
  g: GameState,
  x: number,
  y: number,
  random: () => number,
): Chop | undefined {
  const t = g.trees.at(x, y);
  if (!t) return undefined;
  const level = g.skills.level("foraging");
  const goods = (...list: [string, number][]) => list.filter(([, n]) => n > 0);
  if (t.stump)
    return {
      swings: swingsToUproot(AXE_TIER),
      goods: goods(["wood", 4 + Math.floor(random() * 6)], ["sap", STUMP_SAP]),
      xp: STUMP_XP,
    };
  if (t.stage === SEED_STAGE)
    return { swings: 1, goods: goods([TREE_SEED, level >= 1 ? 1 : 0]), xp: 0 };
  if (t.stage < YOUNG_STAGE)
    return {
      swings: 1,
      goods: goods(["wood", random() < SEEDLING_WOOD * level ? 1 : 0]),
      xp: 0,
    };
  if (t.stage === YOUNG_STAGE)
    return { swings: 1, goods: goods(["wood", YOUNG_WOOD]), xp: 0 };
  return {
    swings: swingsToFell(AXE_TIER),
    goods: goods(
      ["wood", TREE_WOOD + Math.min(level, TREE_WOOD_BONUS_MAX)],
      ["sap", TREE_SAP],
      [TREE_SEED, level >= 1 ? Math.floor(random() * 3) : 0],
    ),
    xp: TREE_XP,
  };
}

/**
 * The nearest open tile to a tree for goods that did not fit the backpack:
 * within 3 tiles, not blocked, not a tree. With no map, the tree's own tile.
 */
function dropSpot(
  g: GameState,
  map: FarmMap | undefined,
  x: number,
  y: number,
): { x: number; y: number } {
  if (!map) return { x, y };
  for (let r = 1; r <= 3; r++)
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const [tx, ty] = [x + dx, y + dy];
        if (!map.isBlocked(tx, ty) && !g.trees.blocks(tx, ty))
          return { x: tx, y: ty };
      }
  return { x, y };
}

/**
 * One swing of the axe at a tree, stump, young tree, seedling or seed. A tree
 * takes several swings, each costing energy, and falls on the last. Goods go
 * to the backpack; any that do not fit land on the ground nearby and are
 * pulled in by walking over them (`GroundItems`), so none are lost.
 */
export function chop(
  g: GameState,
  x: number,
  y: number,
  random: () => number = Math.random,
  map?: FarmMap,
): Outcome {
  if (g.day.over) return fail("exhausted");
  const plan = planChop(g, x, y, random);
  const t = g.trees.at(x, y);
  if (!plan || !t) return fail("nothing to chop");
  g.day.act(swingCost(TOOL_ENERGY, AXE_TIER, g.skills.level("foraging")), 0);
  if (t.hits + 1 < plan.swings) {
    t.hits += 1;
    return { ok: true };
  }
  for (const [id, n] of plan.goods) {
    const fits = Math.min(n, g.inventory.room(id));
    if (fits > 0) g.inventory.add(id, fits);
    if (fits < n) {
      const spot = dropSpot(g, map, x, y);
      g.ground.drop(spot.x, spot.y, id, n - fits);
    }
  }
  if (!t.stump && t.stage === MATURE_STAGE) {
    t.stump = true;
    t.hits = 0;
  } else g.trees.remove(x, y);
  return plan.xp > 0
    ? award(g, "foraging", plan.xp, plan.goods[0]?.[0])
    : { ok: true, item: plan.goods[0]?.[0] };
}

/**
 * Lift a seedling or a planted seed with a tool other than the axe, in one
 * swing: any tool takes a seedling, and the hoe also takes a seed back
 * (`docs/design/36_gathering_trees_sap_fiber.md`). The seed returns from
 * foraging level 1. The can does not lift a seed.
 */
export function clearSeedling(
  g: GameState,
  x: number,
  y: number,
  tool: "hoe" | "can",
  map?: FarmMap,
): Outcome {
  if (g.day.over) return fail("exhausted");
  const t = g.trees.at(x, y);
  if (!t || t.stump || t.stage >= YOUNG_STAGE)
    return fail("a tree is in the way");
  if (t.stage === SEED_STAGE && tool === "can") return fail("nothing to water");
  swing(g, tool);
  g.trees.remove(x, y);
  if (t.stage === SEED_STAGE && g.skills.level("foraging") >= 1) {
    if (g.inventory.add(TREE_SEED)) return { ok: true, item: TREE_SEED };
    const spot = dropSpot(g, map, x, y);
    g.ground.drop(spot.x, spot.y, TREE_SEED, 1);
  }
  return { ok: true };
}

/** Shake a mature tree by hand. A loose seed falls, if the tree holds one. */
export function shake(g: GameState, x: number, y: number): Outcome {
  const t = g.trees.at(x, y);
  if (!t || t.stump || t.stage !== MATURE_STAGE || !t.seed)
    return fail("nothing to shake");
  if (g.inventory.room(TREE_SEED) < 1) return fail("backpack full");
  t.seed = false;
  g.inventory.add(TREE_SEED);
  return { ok: true, item: TREE_SEED };
}

/** Plant a tree seed on open ground the player faces. */
export function plantTree(
  g: GameState,
  map: FarmMap,
  x: number,
  y: number,
): Outcome {
  if (g.inventory.count(TREE_SEED) < 1) return fail("no seeds");
  if (
    !map.canPlantTree(x, y) ||
    g.trees.at(x, y) ||
    g.ground.at(x, y).length > 0 ||
    g.farm.plotAt(x, y) ||
    g.forage.itemAt(x, y)
  )
    return fail("cannot plant tree here");
  g.inventory.remove(TREE_SEED);
  g.trees.add(x, y, SEED_STAGE);
  return { ok: true };
}
