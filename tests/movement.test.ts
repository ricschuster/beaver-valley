import { describe, expect, it } from "vitest";
import {
  facingFrom,
  facingTile,
  keyVector,
  move,
  stickVector,
  tileOf,
  type Body,
} from "../src/core/movement";

const T = 16;
const body: Body = { hw: 6, h: 8 };

// A wall of tiles: x = 3 blocked for every row, and the whole map is 6 wide.
const blockedAt = (x: number, y: number) =>
  x < 0 || y < 0 || x >= 6 || y >= 6 || x === 3;

describe("keyVector", () => {
  it("is zero with nothing held or opposite keys held", () => {
    expect(keyVector(false, false, false, false)).toEqual({ x: 0, y: 0 });
    expect(keyVector(true, true, false, false)).toEqual({ x: 0, y: 0 });
  });

  it("points along one axis", () => {
    expect(keyVector(false, true, false, false)).toEqual({ x: 1, y: 0 });
    expect(keyVector(false, false, true, false)).toEqual({ x: 0, y: -1 });
  });

  it("does not move faster on a diagonal", () => {
    const v = keyVector(true, false, false, true);
    expect(Math.hypot(v.x, v.y)).toBeCloseTo(1);
  });
});

describe("stickVector", () => {
  it("ignores a short drag", () => {
    expect(stickVector(3, 3)).toEqual({ x: 0, y: 0 });
  });

  it("grows with the drag and stops at full length", () => {
    const half = stickVector(23, 0);
    expect(half.x).toBeGreaterThan(0.4);
    expect(half.x).toBeLessThan(0.6);
    const far = stickVector(0, 400);
    expect(far.x).toBeCloseTo(0);
    expect(far.y).toBeCloseTo(1);
  });
});

describe("facing", () => {
  it("follows the stronger axis and keeps the old one when still", () => {
    expect(facingFrom({ x: 1, y: 0.2 }, "up")).toBe("right");
    expect(facingFrom({ x: -0.1, y: -1 }, "down")).toBe("up");
    expect(facingFrom({ x: 0, y: 0 }, "left")).toBe("left");
  });

  it("finds the tile in front of the player", () => {
    // Feet at the middle of tile (1, 1): x = 24, y = 24 + body.h / 2.
    const pos = { x: 24, y: 28 };
    expect(tileOf(pos, body, T)).toEqual({ x: 1, y: 1 });
    expect(facingTile(pos, body, "right", T)).toEqual({ x: 2, y: 1 });
    expect(facingTile(pos, body, "up", T)).toEqual({ x: 1, y: 0 });
  });
});

describe("move", () => {
  it("moves freely in open ground", () => {
    const to = move({ x: 24, y: 40 }, { x: 5, y: -3 }, body, T, blockedAt);
    expect(to.x).toBeCloseTo(29);
    expect(to.y).toBeCloseTo(37);
  });

  it("stops flush against a wall", () => {
    // Tile 3 starts at x = 48, so the box (half width 6) stops at x = 42.
    const to = move({ x: 40, y: 40 }, { x: 20, y: 0 }, body, T, blockedAt);
    expect(to.x).toBeCloseTo(42, 2);
    expect(to.x).toBeLessThanOrEqual(42);
  });

  it("slides along a wall", () => {
    const to = move({ x: 42, y: 40 }, { x: 4, y: 6 }, body, T, blockedAt);
    expect(to.x).toBeCloseTo(42, 2);
    expect(to.y).toBeCloseTo(46);
  });

  it("does not tunnel through a wall on a very long move", () => {
    const to = move({ x: 24, y: 40 }, { x: 200, y: 0 }, body, T, blockedAt);
    expect(to.x).toBeLessThanOrEqual(42);
  });

  it("cannot leave the map", () => {
    const left = move({ x: 8, y: 40 }, { x: -50, y: 0 }, body, T, blockedAt);
    expect(left.x).toBeGreaterThanOrEqual(body.hw);
    const up = move({ x: 24, y: 10 }, { x: 0, y: -50 }, body, T, blockedAt);
    expect(up.y).toBeGreaterThanOrEqual(body.h);
  });

  it("does not move on a zero delta", () => {
    expect(move({ x: 24, y: 40 }, { x: 0, y: 0 }, body, T, blockedAt)).toEqual({
      x: 24,
      y: 40,
    });
  });
});
