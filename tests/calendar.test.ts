import { describe, expect, it } from "vitest";
import { DAYS_PER_SEASON, dateOf } from "../src/core/calendar";

describe("dateOf", () => {
  it("starts on spring 1, year 1", () => {
    expect(dateOf(1)).toEqual({ season: "spring", dayOfSeason: 1, year: 1 });
  });

  it("changes season after the last day", () => {
    expect(dateOf(DAYS_PER_SEASON)).toMatchObject({
      season: "spring",
      dayOfSeason: 28,
    });
    expect(dateOf(DAYS_PER_SEASON + 1)).toMatchObject({
      season: "summer",
      dayOfSeason: 1,
    });
  });

  it("starts a new year after all seasons", () => {
    expect(dateOf(2 * DAYS_PER_SEASON + 1)).toEqual({
      season: "spring",
      dayOfSeason: 1,
      year: 2,
    });
  });
});

describe("dateText", () => {
  it("names the weekday and season, in a seven day week", async () => {
    const { dateText } = await import("../src/core/calendar");
    expect(dateText(1)).toBe("Mon. Spring 1");
    expect(dateText(8)).toBe("Mon. Spring 8");
    expect(dateText(28)).toBe("Sun. Spring 28");
    expect(dateText(29)).toBe("Mon. Summer 1");
  });
});
