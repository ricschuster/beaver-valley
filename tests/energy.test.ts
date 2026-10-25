import { describe, expect, it } from "vitest";
import { Energy, MAX_ENERGY } from "../src/core/energy";

describe("Energy", () => {
  it("starts full", () => {
    expect(new Energy().current).toBe(MAX_ENERGY);
  });

  it("spends and reports when empty", () => {
    const e = new Energy();
    expect(e.spend(30)).toBe(false);
    expect(e.current).toBe(MAX_ENERGY - 30);
    expect(e.spend(MAX_ENERGY)).toBe(true);
    expect(e.current).toBe(0);
    expect(e.empty).toBe(true);
  });

  it("restores up to the maximum", () => {
    const e = new Energy();
    e.spend(40);
    e.restore(10);
    expect(e.current).toBe(MAX_ENERGY - 30);
    e.restore(1000);
    expect(e.current).toBe(MAX_ENERGY);
  });
});
