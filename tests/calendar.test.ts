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
