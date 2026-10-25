import { describe, expect, it } from "vitest";
import { DAY_END } from "../src/core/clock";
import { Day, PASS_OUT_MONEY_CAP, PASS_OUT_WAKE_ENERGY } from "../src/core/day";
import { MAX_ENERGY } from "../src/core/energy";

describe("Day", () => {
  it("spends energy and time on an action", () => {
    const d = new Day();
    expect(d.act(10, 30)).toBe(false);
    expect(d.energy.current).toBe(MAX_ENERGY - 10);
    expect(d.clock.format()).toBe("6:30 am");
  });

  it("is over when energy runs out", () => {
    const d = new Day();
    expect(d.act(MAX_ENERGY, 10)).toBe(true);
  });

  it("is over when time runs out", () => {
    const d = new Day();
    expect(d.act(1, DAY_END)).toBe(true);
  });

  it("sleeping early is free and gives a full morning", () => {
    const d = new Day();
    d.act(60, 600);
    expect(d.end(500)).toEqual({ passedOut: false });
    expect(d.clock.day).toBe(2);
    expect(d.clock.format()).toBe("6:00 am");
    expect(d.energy.current).toBe(MAX_ENERGY);
  });

  it("passing out from energy costs a share of money and half energy", () => {
    const d = new Day();
    d.act(MAX_ENERGY, 60);
    expect(d.end(500)).toEqual({
      passedOut: true,
      reason: "energy",
      moneyLost: 50,
    });
    expect(d.clock.day).toBe(2);
    expect(d.clock.format()).toBe("6:00 am");
    expect(d.energy.current).toBe(MAX_ENERGY * PASS_OUT_WAKE_ENERGY.energy);
  });

  it("passing out at 2:00 am reports the reason and wakes at 75 percent", () => {
    const d = new Day();
    d.act(1, DAY_END);
    expect(d.end(500)).toMatchObject({ passedOut: true, reason: "time" });
    expect(d.clock.format()).toBe("6:00 am");
    expect(d.energy.current).toBe(Math.round(MAX_ENERGY * 0.75));
  });

  it("caps the money lost and never goes below zero", () => {
    const d = new Day();
    d.act(MAX_ENERGY, 0);
    expect(d.end(1_000_000)).toMatchObject({ moneyLost: PASS_OUT_MONEY_CAP });
    d.act(MAX_ENERGY, 0);
    expect(d.end(-5)).toMatchObject({ moneyLost: 0 });
  });
});
