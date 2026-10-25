import { describe, expect, it } from "vitest";
import { RAIN_CHANCE, rollWeather } from "../src/core/weather";
import { plant, till } from "../src/core/actions";
import { deserialize, newGame, serialize } from "../src/core/save";
import { sleep } from "../src/core/sleep";
import { seedId } from "../src/core/items";
import { DAYS_PER_SEASON } from "../src/core/calendar";

const spots = [{ x: 0, y: 5 }];

describe("rollWeather", () => {
  it("is sunny on the first day of a season", () => {
    expect(rollWeather("spring", 1, () => 0)).toBe("sunny");
  });

  it("rains below the season's chance and is sunny at or above it", () => {
    expect(rollWeather("spring", 2, () => RAIN_CHANCE.spring - 0.01)).toBe(
      "rainy",
    );
    expect(rollWeather("spring", 2, () => RAIN_CHANCE.spring)).toBe("sunny");
  });
});

describe("rain", () => {
  it("waters crops overnight so they grow", () => {
    const g = newGame();
    g.inventory.add(seedId("parsnip"));
    till(g, 0, 0);
    plant(g, 0, 0, seedId("parsnip"));
    g.tomorrow = "rainy";
    const r = sleep(g, spots, () => 0.99);
    expect(r.weather).toBe("rainy");
    expect(g.weather).toBe("rainy");
    expect(g.farm.plotAt(0, 0)?.wateredToday).toBe(true);
    sleep(g, spots, () => 0.99);
    expect(g.farm.plotAt(0, 0)?.crop?.daysGrown).toBe(1);
  });

  it("waters freshly tilled soil", () => {
    const g = newGame();
    g.weather = "rainy";
    till(g, 3, 3);
    expect(g.farm.plotAt(3, 3)?.wateredToday).toBe(true);
  });

  it("is saved with the game", () => {
    const g = newGame();
    g.weather = "rainy";
    expect(deserialize(serialize(g))?.weather).toBe("rainy");
    const bad = { ...JSON.parse(serialize(g)), weather: "snow" };
    expect(deserialize(JSON.stringify(bad))).toBeUndefined();
  });
});

describe("forecast", () => {
  it("tomorrow becomes today after sleeping, and a new tomorrow is rolled", () => {
    const g = newGame();
    g.tomorrow = "rainy";
    const report = sleep(g, [], () => 0.99);
    expect(report.weather).toBe("rainy");
    expect(g.weather).toBe("rainy");
    expect(g.tomorrow).toBe("sunny");
  });

  it("the forecast for a season's first day is always clear", () => {
    const g = newGame();
    g.day.clock.day = DAYS_PER_SEASON - 1;
    sleep(g, [], () => 0);
    expect(g.tomorrow).toBe("sunny");
  });

  it("is saved, and old saves still load", () => {
    const g = newGame();
    g.tomorrow = "rainy";
    expect(deserialize(serialize(g))!.tomorrow).toBe("rainy");
    const raw = JSON.parse(serialize(g));
    delete raw.tomorrow;
    expect(deserialize(JSON.stringify(raw))!.tomorrow).toBe("sunny");
  });
});
