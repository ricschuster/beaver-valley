import { describe, expect, it } from "vitest";
import { Clock, DAY_END } from "../src/core/clock";

describe("Clock", () => {
  it("starts day 1 at 6:00 am", () => {
    const c = new Clock();
    expect(c.day).toBe(1);
    expect(c.format()).toBe("6:00 am");
  });

  it("advances and formats noon and afternoon", () => {
    const c = new Clock();
    c.advance(6 * 60);
    expect(c.format()).toBe("12:00 pm");
    c.advance(75);
    expect(c.format()).toBe("1:15 pm");
  });

  it("reports the end of the day and stops there", () => {
    const c = new Clock();
    expect(c.advance(19 * 60)).toBe(false);
    expect(c.advance(120)).toBe(true);
    expect(c.minutes).toBe(DAY_END);
    expect(c.format()).toBe("2:00 am");
  });

  it("starts the next day in the morning", () => {
    const c = new Clock();
    c.advance(DAY_END);
    c.nextDay();
    expect(c.day).toBe(2);
    expect(c.format()).toBe("6:00 am");
  });
});
