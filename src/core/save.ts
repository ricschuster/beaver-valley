import { Day } from "./day";
import { Farm } from "./farm";
import { ForageField } from "./forage";
import { type Weather, WEATHERS } from "./weather";
import { Hall, type HallProgress } from "./bundles";
import { Inventory } from "./inventory";
import { Skills, SKILLS } from "./skills";
import { UPGRADABLE, MAX_TIER, type ToolTiers } from "./upgrades";

/** Everything the player owns and has done. The scene holds one of these. */
export interface GameState {
  day: Day;
  money: number;
  inventory: Inventory;
  farm: Farm;
  skills: Skills;
  /** Tier of the hoe and can, 0 for basic. */
  toolTiers: ToolTiers;
  hall: Hall;
  /** Today's weather. */
  weather: Weather;
  /** Tomorrow's weather, known a day ahead (the forecast). */
  tomorrow: Weather;
  /** True once the end screen has been shown, so it shows only once. */
  endSeen: boolean;
  /** Wild goods on the ground today. Not saved: it respawns each morning. */
  forage: ForageField;
}

/** Starting cash for a new game. */
export const START_MONEY = 500;

export function newGame(): GameState {
  return {
    day: new Day(),
    money: START_MONEY,
    inventory: new Inventory(),
    farm: new Farm(),
    skills: new Skills(),
    toolTiers: { hoe: 0, can: 0 },
    hall: new Hall(),
    weather: "sunny",
    tomorrow: "sunny",
    endSeen: false,
    forage: new ForageField(),
  };
}

export const SAVE_VERSION = 2;

interface SaveData {
  version: number;
  day: number;
  energy: number;
  money: number;
  inventory: ReturnType<Inventory["save"]>;
  farm: ReturnType<Farm["save"]>;
  skills: ReturnType<Skills["save"]>;
  hall: HallProgress;
  /** Absent in saves made before tool upgrades existed. */
  toolTiers?: ToolTiers;
  weather: Weather;
  /** Absent in saves made before the forecast existed. */
  tomorrow?: Weather;
  /** Absent in saves made before the end screen existed. */
  endSeen?: boolean;
}

/** Where saves live. The scene supplies one backed by the browser. */
export interface SaveStore {
  read(): string | null;
  write(text: string): void;
}

/** Save as text. Saving happens between days, so the clock is not stored. */
export function serialize(g: GameState): string {
  const data: SaveData = {
    version: SAVE_VERSION,
    day: g.day.clock.day,
    energy: g.day.energy.current,
    money: g.money,
    inventory: g.inventory.save(),
    farm: g.farm.save(),
    skills: g.skills.save(),
    hall: g.hall.save(),
    toolTiers: { ...g.toolTiers },
    weather: g.weather,
    tomorrow: g.tomorrow,
    endSeen: g.endSeen,
  };
  return JSON.stringify(data);
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isCount = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;

/**
 * Load a save. Returns undefined for anything that is not a valid save of
 * this version, so a corrupt or old file never crashes the game.
 */
export function deserialize(text: string): GameState | undefined {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return undefined;
  }
  if (!isObject(raw) || raw.version !== SAVE_VERSION) return undefined;
  const { day, energy, money, inventory, farm, skills, hall, weather } = raw;
  if (!isCount(day) || day < 1 || !isCount(energy) || !isCount(money))
    return undefined;
  if (!WEATHERS.includes(weather as Weather)) return undefined;
  if (
    !Array.isArray(inventory) ||
    !isObject(farm) ||
    !isObject(skills) ||
    !isObject(hall)
  ) {
    return undefined;
  }
  for (const s of inventory) {
    if (
      s !== null &&
      !(isObject(s) && typeof s.id === "string" && isCount(s.count))
    ) {
      return undefined;
    }
  }
  if (!SKILLS.every((k) => isCount(skills[k]))) return undefined;
  if (!Object.values(hall).every((v) => Array.isArray(v))) return undefined;

  const g = newGame();
  g.day.restore(day, energy);
  g.money = money;
  g.weather = weather as Weather;
  g.inventory.load(inventory as ReturnType<Inventory["save"]>);
  g.farm.load(farm as ReturnType<Farm["save"]>);
  g.skills.load(skills as ReturnType<Skills["save"]>);
  g.hall = new Hall(undefined, hall as HallProgress);
  const tiers = raw.toolTiers;
  if (isObject(tiers)) {
    for (const t of UPGRADABLE) {
      const v = tiers[t];
      if (isCount(v)) g.toolTiers[t] = Math.min(Math.floor(v), MAX_TIER);
    }
  }
  if (WEATHERS.includes(raw.tomorrow as Weather))
    g.tomorrow = raw.tomorrow as Weather;
  g.endSeen = raw.endSeen === true;
  return g;
}

export function saveGame(store: SaveStore, g: GameState): void {
  store.write(serialize(g));
}

export function loadGame(store: SaveStore): GameState | undefined {
  const text = store.read();
  return text === null ? undefined : deserialize(text);
}
