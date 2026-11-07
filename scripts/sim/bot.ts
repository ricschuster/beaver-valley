// A persona playing the core rules for a whole game (note 46). It makes the
// same calls as the scene (actions, shop, hall, bin, sleep), and `Walker`
// charges the game minutes for walking and key presses.
import { maps } from "../../src/content/maps";
import { dateOf, DAYS_PER_SEASON } from "../../src/core/calendar";
import { harvest, plant, till, water, forage } from "../../src/core/actions";
import { cropById, CROPS } from "../../src/core/crops";
import { eat } from "../../src/core/actions";
import { itemById, seedId } from "../../src/core/items";
import { QUALITIES, splitQuality, type Quality } from "../../src/core/quality";
import {
  choose,
  optionsFor,
  pendingChoice,
  sellMultiplier,
} from "../../src/core/professions";
import { buy, seedStock } from "../../src/core/shop";
import { sleep } from "../../src/core/sleep";
import { startGame } from "../../src/core/toolbar";
import type { GameState } from "../../src/core/save";
import { START } from "../../src/core/maps";
import { TIME, Walker, type Spot } from "./world";
import type { Persona } from "./personas";

/** Past this time of night a careful player heads for bed (midnight). */
const BED_TIME = 24 * 60;

/**
 * Bundles the bot does not play for. Woodland (bulk wood, stone and fiber),
 * Artisan Goods (machines, orchard fruit) and the Smith's (mining and the
 * furnace) need walks the bot has no model for yet. The sim finishes when
 * every other bundle is done, so `allDay` means "the played bundles", not the
 * whole hall. Real play of the whole hall is covered by `tests/bundles.test.ts`.
 */
export const UNPLAYED_BUNDLES: readonly string[] = [
  "woodland",
  "artisan-goods",
  "smiths",
];

/** Share of a harvest that is silver or better at a farming level, with plain soil (`cropQuality`). Floored so early planning stays sane. */
const silverShare = (level: number) =>
  Math.max(0.1, 2 * ((0.2 * level) / 10 + 0.01));

export interface RunResult {
  /** Day each bundle was finished, by bundle id. */
  bundleDays: Record<string, number>;
  /** Day the last bundle was finished, if it was. */
  allDay?: number;
  passOuts: number;
  /** Clock minutes when each played day ended, before the bed. */
  dayEnds: number[];
  withered: number;
  /** Money at the end of each season's last day. */
  moneyAtSeasonEnd: number[];
  lastDay: number;
}

export function playGame(
  persona: Persona,
  random: () => number,
  maxDay: number,
): RunResult {
  const g = startGame();
  g.forage.respawn(dateOf(1).season, maps.get(START.map).forageSpots, random);
  const bot = new Bot(g, persona, random);
  const result: RunResult = {
    bundleDays: {},
    passOuts: 0,
    dayEnds: [],
    withered: 0,
    moneyAtSeasonEnd: [],
    lastDay: 1,
  };
  while (g.day.clock.day <= maxDay && !playedDone(g)) {
    const day = g.day.clock.day;
    bot.playDay();
    for (const b of g.hall.bundles)
      if (g.hall.complete(b.id) && !(b.id in result.bundleDays))
        result.bundleDays[b.id] = day;
    if (playedDone(g)) {
      result.allDay = day;
      break;
    }
    result.dayEnds.push(g.day.clock.minutes);
    const report = bot.endDay();
    if (report.passedOut) result.passOuts++;
    result.withered += report.withered;
    if (dateOf(day).dayOfSeason === DAYS_PER_SEASON)
      result.moneyAtSeasonEnd.push(g.money);
    result.lastDay = day;
  }
  return result;
}

/** True when every bundle the bot plays for is done. */
function playedDone(g: GameState): boolean {
  return g.hall.bundles.every(
    (b) => UNPLAYED_BUNDLES.includes(b.id) || g.hall.complete(b.id),
  );
}

interface Want {
  bundle: string;
  item: string;
  room: string;
  min: Quality;
}

class Bot {
  private readonly walker: Walker;
  private playing = true;
  private daysPlayed = 0;

  constructor(
    private readonly g: GameState,
    private readonly p: Persona,
    private readonly random: () => number,
  ) {
    this.walker = new Walker(g);
  }

  private get day(): number {
    return this.g.day.clock.day;
  }

  private get minutes(): number {
    return this.g.day.clock.minutes;
  }

  private get lateNight(): boolean {
    return this.minutes >= BED_TIME || this.g.day.over;
  }

  /** Sleep: go to the bed, then let the core end the day. */
  endDay() {
    if (!this.g.day.over) this.walker.goToService("house", "bed");
    const report = sleep(
      this.g,
      maps.get(START.map).forageSpots,
      this.random,
      maps.get(START.map),
    );
    this.walker.wake();
    return report;
  }

  playDay(): void {
    this.playing = this.random() < this.p.playChance;
    if (!this.playing) return;
    this.daysPlayed++;
    this.chooseProfessions();
    const g = this.g;
    // Order follows what a player does: crops first, then the walk for goods.
    this.harvestRipe();
    this.plantWanted();
    if (g.weather !== "rainy" && !this.lateNight) this.waterAll();
    if (this.random() < this.p.forageChance) this.sweepForage();
    this.eatIfLow();
    if (this.dueFor(this.p.hallEvery)) this.visitHall();
    this.shipSurplus();
  }

  private dueFor(every: number): boolean {
    return this.daysPlayed % every === 0;
  }

  private chooseProfessions(): void {
    for (;;) {
      const skill = pendingChoice(this.g.skills);
      if (!skill) return;
      const first = optionsFor(skill)[0];
      if (!first || !choose(this.g.skills, skill, first.id)) return;
    }
  }

  // ---- the farm ----

  private act(target: Spot, run: () => { ok: boolean }): boolean {
    if (this.lateNight || !this.walker.goNextTo(target)) return false;
    const ok = run().ok;
    this.walker.spend(TIME.action);
    return ok;
  }

  /** Visit targets nearest first, as a player sweeping a field does. */
  private nearestFirst(targets: Spot[], visit: (s: Spot) => void): void {
    const left = [...targets];
    while (left.length > 0 && !this.lateNight) {
      const costs = this.walker.costsNextTo(left);
      const best = Math.min(...costs);
      const at = costs.indexOf(best);
      const [next] = left.splice(at, 1);
      if (next && best < Infinity) visit(next);
    }
  }

  private plots() {
    return [...this.g.farm.each()];
  }

  private harvestRipe(): void {
    if (this.walker.mapId !== "farm") this.walker.enter("farm");
    const ripe = this.plots().filter(({ x, y }) => this.g.farm.isRipe(x, y));
    this.nearestFirst(ripe, (s) =>
      this.act(s, () => harvest(this.g, s.x, s.y, this.random)),
    );
  }

  private waterAll(): void {
    if (this.random() < this.p.forgetWater) return;
    const dry = this.plots().filter(
      ({ plot }) => plot.crop && !plot.wateredToday,
    );
    this.nearestFirst(dry, (s) => this.act(s, () => water(this.g, s.x, s.y)));
  }

  private sweepForage(): void {
    const g = this.g;
    const map = maps.get(START.map);
    const spots = map.forageSpots.filter((s) => g.forage.itemAt(s.x, s.y));
    const cap = this.p.forageMax;
    this.nearestFirst(spots.slice(0, Math.max(cap, 0) || spots.length), (s) =>
      this.act(s, () => forage(g, s.x, s.y, this.random)),
    );
  }

  private eatIfLow(): void {
    if (this.g.day.energy.current > 40) return;
    const inv = this.g.inventory;
    for (let i = 0; i < inv.size; i++) {
      const slot = inv.slot(i);
      if (slot && itemById(slot.id)?.energy && eat(this.g, slot.id).ok) return;
    }
  }

  // ---- what the hall wants ----

  /**
   * Goods an unfinished bundle still takes, one entry for each unit still
   * owed. A bundle that asks for counts is played for its first `required`
   * goods only, since a stack of five is a lot of farming.
   */
  private wanted(): Want[] {
    const out: Want[] = [];
    for (const b of this.g.hall.bundles) {
      if (UNPLAYED_BUNDLES.includes(b.id) || this.g.hall.complete(b.id))
        continue;
      const bulk = b.items.some((i) => i.count > 1);
      const goods = bulk ? b.items.slice(0, b.required) : b.items;
      for (const i of goods)
        for (let n = this.g.hall.have(b.id, i.id); n < i.count; n++)
          out.push({
            bundle: b.id,
            item: i.id,
            room: b.room,
            min: i.minQuality,
          });
    }
    return out;
  }

  /** Stacks in the backpack, as stack id and count. */
  private stacks(): { id: string; count: number }[] {
    const out: { id: string; count: number }[] = [];
    const inv = this.g.inventory;
    for (let i = 0; i < inv.size; i++) {
      const s = inv.slot(i);
      if (s) out.push(s);
    }
    return out;
  }

  /** Hand-ins that would be accepted now: bundle and stack id. */
  private handable(): { bundle: string; stack: string; room: string }[] {
    const out: { bundle: string; stack: string; room: string }[] = [];
    const taken = new Map<string, number>();
    for (const w of this.wanted()) {
      for (const s of this.stacks()) {
        if (splitQuality(s.id).base !== w.item) continue;
        const used = taken.get(s.id) ?? 0;
        if (used >= s.count) continue;
        if (this.g.hall.problem(this.g.inventory, w.bundle, s.id)) continue;
        taken.set(s.id, used + 1);
        out.push({ bundle: w.bundle, stack: s.id, room: w.room });
        break;
      }
    }
    return out;
  }

  private visitHall(): void {
    const offers = this.handable();
    if (offers.length === 0 || this.lateNight) return;
    // Rooms that open mid visit are handled by looping until nothing is left.
    for (let round = 0; round < 4; round++) {
      const now = this.handable();
      if (now.length === 0) break;
      for (const room of new Set(now.map((o) => o.room))) {
        if (!this.walker.goToService("hall", room)) continue;
        for (const o of now.filter((x) => x.room === room))
          this.g.hall.handIn(this.g.inventory, this.g, o.bundle, o.stack);
      }
    }
    this.walker.enter("farm");
  }

  // ---- planting and the shop ----

  /** Crops worth putting in the ground today, most needed first. */
  private cropPlan(): string[] {
    const { season, dayOfSeason } = dateOf(this.day);
    const left = DAYS_PER_SEASON - dayOfSeason;
    const inGround = new Map<string, number>();
    for (const { plot } of this.plots())
      if (plot.crop)
        inGround.set(plot.crop.id, (inGround.get(plot.crop.id) ?? 0) + 1);
    const plan: string[] = [];
    const fits = (id: string) => {
      const def = cropById(id);
      return !!def && def.seasons.includes(season) && def.growDays <= left;
    };
    const wants = this.wanted();
    for (const def of CROPS) {
      if (!fits(def.id)) continue;
      const mine = wants.filter((w) => w.item === def.id);
      // A silver-only slot needs several plants for each unit.
      const share = silverShare(this.g.skills.level("farming"));
      const weight = (m: Quality) => (m === "normal" ? 1 : 1 / share);
      const owed = mine.reduce((n, w) => n + weight(w.min), 0);
      const held = this.stacks()
        .filter((s) => splitQuality(s.id).base === def.id)
        .reduce(
          (n, s) =>
            n +
            s.count *
              Math.max(
                0,
                ...mine
                  .filter(
                    (w) =>
                      QUALITIES.indexOf(splitQuality(s.id).quality) >=
                      QUALITIES.indexOf(w.min),
                  )
                  .map((w) => weight(w.min)),
              ),
          0,
        );
      const have = (inGround.get(def.id) ?? 0) + held;
      const want =
        mine.length > 0
          ? Math.max(this.p.cropsPerBundleCrop, Math.ceil(owed))
          : 0;
      for (let i = have; i < want; i++) plan.push(def.id);
    }
    // Spare plots go to the persona's cash crop.
    const cash = this.p.cashCrop;
    if (cash && fits(cash)) {
      const planted = inGround.get(cash) ?? 0;
      for (let i = planted; i < this.p.cashPlots; i++) plan.push(cash);
    }
    return plan;
  }

  private plantWanted(): void {
    if (this.lateNight) return;
    const plan = this.cropPlan();
    if (plan.length === 0) return;
    // Seeds missing from the bag mean a trip to the shop first.
    const short = plan.some(
      (id, i) =>
        this.g.inventory.count(seedId(id)) <
        plan.slice(0, i + 1).filter((x) => x === id).length,
    );
    if (short) this.visitShop(plan);
    const map = maps.get(START.map);
    const free = this.freeSoil(map, plan.length);
    for (const [i, crop] of plan.entries()) {
      const spot = free[i];
      if (!spot || this.lateNight) break;
      if (this.g.inventory.count(seedId(crop)) < 1) continue;
      this.walker.enter("farm");
      if (!this.g.farm.plotAt(spot.x, spot.y)?.tilled)
        this.act(spot, () => till(this.g, spot.x, spot.y));
      this.act(spot, () => plant(this.g, spot.x, spot.y, seedId(crop)));
    }
  }

  /** The nearest open soil to the house door, as a player would lay out a field. */
  private freeSoil(map: ReturnType<typeof maps.get>, n: number): Spot[] {
    const door = map.entry("from_house") ?? { x: 0, y: 0 };
    const out: Spot[] = [];
    for (let y = 0; y < map.height; y++)
      for (let x = 0; x < map.width; x++) {
        if (!map.isTillable(x, y) || this.g.trees.at(x, y)) continue;
        // Weeds block planting and the bot does not clear them, so plant round them.
        if (this.g.weeds.at(x, y)) continue;
        if (this.g.farm.plotAt(x, y)?.crop) continue;
        out.push({ x, y });
      }
    out.sort(
      (a, b) =>
        Math.abs(a.x - door.x) +
        Math.abs(a.y - door.y) -
        (Math.abs(b.x - door.x) + Math.abs(b.y - door.y)),
    );
    return out.slice(0, n);
  }

  /** Walk to the shop and buy seeds for the plan; keep a cash reserve. */
  private visitShop(plan: string[] = this.cropPlan()): void {
    if (this.lateNight) return;
    if (plan.length === 0 && this.g.bin.isEmpty) return;
    if (!this.walker.goToService("farm", "shop")) return;
    const stock = new Set(seedStock(dateOf(this.day).season));
    for (const crop of plan) {
      const seed = seedId(crop);
      if (!stock.has(seed)) continue;
      if (this.g.inventory.count(seed) >= plan.filter((c) => c === crop).length)
        continue;
      buy(this.g.inventory, this.g, seed);
    }
  }

  // ---- selling ----

  /** Ship everything the hall does not still want, at the bin by the house. */
  private shipSurplus(): void {
    if (this.lateNight) return;
    const keep: Want[] = this.p.keepsForHall ? this.wanted() : [];
    const lines: { id: string; n: number }[] = [];
    for (const s of this.stacks()) {
      const { base, quality } = splitQuality(s.id);
      const def = itemById(base);
      if (!def || base.endsWith("-seed") || QUALITIES.indexOf(quality) < 0)
        continue;
      // Hold one unit for each open slot this stack could fill.
      let held = 0;
      for (let u = 0; u < s.count; u++) {
        const at = keep.findIndex(
          (w) =>
            w.item === base &&
            QUALITIES.indexOf(quality) >= QUALITIES.indexOf(w.min),
        );
        if (at < 0) break;
        keep.splice(at, 1);
        held++;
      }
      const n = s.count - held;
      if (n > 0) lines.push({ id: s.id, n });
    }
    if (lines.length === 0) return;
    if (!this.walker.goToService("farm", "bin")) return;
    for (const l of lines)
      this.g.bin.ship(
        this.g.inventory,
        l.id,
        l.n,
        sellMultiplier(this.g.skills, l.id),
      );
  }
}
