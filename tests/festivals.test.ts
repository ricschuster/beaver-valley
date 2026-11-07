import { describe, expect, it } from "vitest";
import { DAYS_PER_SEASON, SEASONS, dateOf } from "../src/core/calendar";
import {
  FESTIVALS,
  buyAtCounter,
  counterProblem,
  festivalOn,
  festivalOpen,
  festivalToday,
  enterFestival,
  enterProblem,
  leaveFestival,
  nextFestival,
} from "../src/core/festivals";
import { hatById } from "../src/core/hats";
import { itemById } from "../src/core/items";
import { deserialize, newGame, serialize } from "../src/core/save";
import { sleep } from "../src/core/sleep";
import { rollWeather } from "../src/core/weather";

const parade = FESTIVALS.find((f) => f.id === "hat-parade")!;
/** Game day for a season and day of the season, in year one. */
const dayOf = (season: (typeof SEASONS)[number], d: number) =>
  SEASONS.indexOf(season) * DAYS_PER_SEASON + d;

describe("festival data", () => {
  it("follows the calendar rules in 14_festival_calendar.md", () => {
    const keys = FESTIVALS.map((f) => `${f.season}${f.day}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(FESTIVALS.map((f) => f.id)).size).toBe(FESTIVALS.length);
    for (const f of FESTIVALS) {
      expect(SEASONS, f.id).toContain(f.season);
      expect(f.day, f.id).toBeGreaterThan(1);
      expect(f.day, f.id).toBeLessThanOrEqual(DAYS_PER_SEASON - 7);
      expect(f.opens, f.id).toBeLessThan(f.closes);
      expect(f.ends, f.id).toBeGreaterThanOrEqual(f.closes);
      for (const e of f.counter) {
        expect(e.price, f.id).toBeGreaterThan(0);
        expect(Boolean(e.item) !== Boolean(e.hat), f.id).toBe(true);
        if (e.item) expect(itemById(e.item), e.item).toBeDefined();
        if (e.hat) expect(hatById(e.hat), e.hat).toBeDefined();
      }
      if (f.gift) expect(hatById(f.gift.hat), f.id).toBeDefined();
    }
  });

  it("puts the hat parade on spring day 10", () => {
    expect(parade.season).toBe("spring");
    expect(parade.day).toBe(10);
  });
});

describe("lookup", () => {
  it("finds a festival by game day, in every year", () => {
    expect(festivalToday(dayOf("spring", 10))?.id).toBe("hat-parade");
    expect(festivalToday(dayOf("spring", 11))).toBeUndefined();
    const year2 = DAYS_PER_SEASON * SEASONS.length + 10;
    expect(festivalToday(year2)?.id).toBe("hat-parade");
    expect(festivalOn("summer", 10)).toBeUndefined();
    expect(festivalOn("spring", 21)?.id).toBe("seedswap-fair");
    expect(festivalOn("summer", 8)?.id).toBe("cake-day");
    expect(festivalOn("summer", 20)?.id).toBe("lamplight-evening");
  });

  it("finds the next festival, wrapping into the next year", () => {
    expect(nextFestival(1)?.day).toBe(10);
    expect(nextFestival(10)?.festival.id).toBe("seedswap-fair");
    const next = nextFestival(dayOf("summer", 20))!;
    expect(next.festival.id).toBe("hat-parade");
    expect(dateOf(next.day).year).toBe(2);
  });

  it("is open only between opening and closing", () => {
    expect(festivalOpen(parade, parade.opens - 1)).toBe(false);
    expect(festivalOpen(parade, parade.opens)).toBe(true);
    expect(festivalOpen(parade, parade.closes)).toBe(false);
  });
});

describe("weather", () => {
  it("is always sunny on a festival day", () => {
    expect(rollWeather("spring", parade.day, () => 0)).toBe("sunny");
  });

  it("forecasts a sunny festival the night before", () => {
    const g = newGame();
    g.day.clock.day = dayOf("spring", parade.day - 2);
    sleep(g, [], () => 0);
    expect(festivalToday(g.day.clock.day + 1)?.id).toBe("hat-parade");
    expect(g.tomorrow).toBe("sunny");
  });
});

describe("going", () => {
  const onParade = (minutes: number) => {
    const g = newGame();
    g.day.clock.day = dayOf("spring", parade.day);
    g.day.clock.minutes = minutes;
    return g;
  };

  it("needs a festival today", () => {
    expect(enterProblem(newGame())).toMatch(/no festival/);
  });

  it("waits for opening and ends at closing", () => {
    expect(enterProblem(onParade(parade.opens - 10))).toMatch(/not started/);
    expect(enterProblem(onParade(parade.closes))).toMatch(/over/);
  });

  it("stops time and costs no energy, and is remembered once a year", () => {
    const g = onParade(parade.opens);
    const energy = g.day.energy.current;
    expect(enterFestival(g)?.id).toBe("hat-parade");
    expect(g.day.clock.minutes).toBe(parade.opens);
    expect(g.day.energy.current).toBe(energy);
    expect(enterFestival(g)?.id).toBe("hat-parade");
    expect(g.festivalsJoined).toEqual(["hat-parade:1"]);
  });

  it("sets the clock to the festival's end on leaving, without ending the day", () => {
    const g = onParade(parade.opens);
    enterFestival(g);
    leaveFestival(g);
    expect(g.day.clock.minutes).toBe(parade.ends);
    expect(g.day.clock.day).toBe(dayOf("spring", parade.day));
    expect(g.day.over).toBe(false);
  });

  it("is remembered separately each year", () => {
    const g = onParade(parade.opens);
    enterFestival(g);
    g.day.clock.day += DAYS_PER_SEASON * SEASONS.length;
    enterFestival(g);
    expect(g.festivalsJoined).toEqual(["hat-parade:1", "hat-parade:2"]);
  });
});

describe("save", () => {
  it("remembers joined festivals, and old saves load with none", () => {
    const g = newGame();
    g.festivalsJoined.push("hat-parade:1");
    expect(deserialize(serialize(g))!.festivalsJoined).toEqual([
      "hat-parade:1",
    ]);
    const raw = JSON.parse(serialize(g));
    delete raw.festivalsJoined;
    expect(deserialize(JSON.stringify(raw))!.festivalsJoined).toEqual([]);
  });
});

describe("hats and the counter", () => {
  const joined = () => {
    const g = newGame();
    g.day.clock.day = dayOf("spring", parade.day);
    g.day.clock.minutes = parade.opens;
    return g;
  };

  it("gives the parade hat on the first visit, once", () => {
    const g = joined();
    expect(g.wardrobe.has("parade-ribbon")).toBe(false);
    enterFestival(g);
    enterFestival(g);
    expect(g.wardrobe.list()).toEqual(["parade-ribbon"]);
  });

  it("sells hats once, for coin, and only to a visitor", () => {
    const g = joined();
    const e = parade.counter[0]!;
    expect(counterProblem(g, parade, e)).toMatch(/Go to the festival/);
    enterFestival(g);
    g.money = e.price - 1;
    expect(buyAtCounter(g, parade, e)).toBe(false);
    g.money = e.price + 5;
    expect(buyAtCounter(g, parade, e)).toBe(true);
    expect(g.money).toBe(5);
    expect(g.wardrobe.has(e.hat!)).toBe(true);
    expect(buyAtCounter(g, parade, e)).toBe(false);
  });

  it("sells items without limit while the pack has room", () => {
    const g = newGame();
    const fair = FESTIVALS.find((f) => f.id === "seedswap-fair")!;
    g.day.clock.day = dayOf("spring", fair.day);
    g.day.clock.minutes = fair.opens;
    enterFestival(g);
    g.money = 100;
    expect(buyAtCounter(g, fair, fair.counter[0]!)).toBe(true);
    expect(buyAtCounter(g, fair, fair.counter[0]!)).toBe(true);
    expect(g.inventory.count("mixed-seed")).toBe(2);
    expect(g.money).toBe(60);
  });

  it("wears only owned hats", () => {
    const g = newGame();
    expect(g.wardrobe.wear("wool-beret")).toBe(false);
    g.wardrobe.add("wool-beret");
    expect(g.wardrobe.wear("wool-beret")).toBe(true);
    expect(g.wardrobe.wear(undefined)).toBe(true);
    expect(g.wardrobe.worn).toBeUndefined();
  });

  it("saves hats, and old or bad saves load with none", () => {
    const g = newGame();
    g.wardrobe.add("straw-boater");
    g.wardrobe.wear("straw-boater");
    const back = deserialize(serialize(g))!;
    expect(back.wardrobe.list()).toEqual(["straw-boater"]);
    expect(back.wardrobe.worn).toBe("straw-boater");
    const raw = JSON.parse(serialize(g));
    delete raw.wardrobe;
    expect(deserialize(JSON.stringify(raw))!.wardrobe.list()).toEqual([]);
    raw.wardrobe = { owned: ["nope", 3, "wool-beret"], worn: "straw-boater" };
    const odd = deserialize(JSON.stringify(raw))!;
    expect(odd.wardrobe.list()).toEqual(["wool-beret"]);
    expect(odd.wardrobe.worn).toBeUndefined();
  });
});
