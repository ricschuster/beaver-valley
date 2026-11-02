import { describe, expect, it } from "vitest";
import { playGame } from "../scripts/sim/bot";
import { PERSONAS } from "../scripts/sim/personas";

/** Same small generator as `scripts/sim/main.ts`, so a run can be repeated. */
function seeded(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("headless sim", () => {
  it("repeats exactly for the same seed", () => {
    const expert = PERSONAS.expert!;
    expect(playGame(expert, seeded(3), 60)).toEqual(
      playGame(expert, seeded(3), 60),
    );
  });

  it("lets the expert finish the hall, no sooner than the crops can grow", () => {
    const r = playGame(PERSONAS.expert!, seeded(1), 84);
    // Summer crops open on day 29 and the melon takes 12 days.
    expect(r.allDay).toBeGreaterThanOrEqual(41);
    expect(r.allDay).toBeLessThanOrEqual(60);
  });
});
