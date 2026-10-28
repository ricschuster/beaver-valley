import Phaser from "phaser";

/**
 * The witch as a Stardew-style walking sprite: 16 by 32 pixels, four
 * directions, four walk frames each. Drawn in code from the hand drawing's
 * colours (blue hat and dress, orange hair, yellow broom). Test art only.
 */
export const WITCH_KEY = "witch-sheet";
export const FRAME_W = 16;
export const FRAME_H = 32;
export const FRAMES = 4;

/** Rows of the sheet, in this order. Left is the mirror of right. */
export type Dir = "down" | "right" | "up" | "left";
export const DIRS: Dir[] = ["down", "right", "up", "left"];

type Ctx = CanvasRenderingContext2D;

const C = {
  hat: "#3f6fb8",
  hatD: "#2f528c",
  hatL: "#7fb0e4",
  hair: "#e8962e",
  hairD: "#c47a1e",
  skin: "#f0d0b0",
  eye: "#2a2a2a",
  mouth: "#8a3a3a",
  dress: "#4a82cc",
  dressD: "#355f9e",
  sock: "#9cbbe4",
  boot: "#2f4a7a",
  stick: "#8a5a2a",
  straw: "#f0d040",
  strawD: "#c8a428",
};

function paint(c: Ctx, ox: number, oy: number, dir: Dir, frame: number) {
  const p = (col: string, x: number, y: number, w = 1, h = 1) => {
    c.fillStyle = col;
    c.fillRect(ox + x, oy + y, w, h);
  };
  // Walk cycle: frames 1 and 3 step and bob, 0 and 2 stand.
  const step = frame === 1 ? -1 : frame === 3 ? 1 : 0;
  const bob = frame % 2 === 1 ? 1 : 0;
  const mirror = dir === "left";
  const d = mirror ? "right" : dir;
  const sx = (x: number, w = 1) => (mirror ? 16 - x - w : x);
  const q = (col: string, x: number, y: number, w = 1, h = 1) =>
    p(col, sx(x, w), y, w, h);

  const hat = (by: number) => {
    // A tall cone leaning right, a pale band, then the wide brim.
    q(C.hat, 9, by, 2);
    q(C.hat, 8, by + 1, 3);
    q(C.hat, 7, by + 2, 4);
    q(C.hat, 6, by + 3, 5);
    q(C.hatL, 6, by + 4, 5);
    q(C.hat, 2, by + 5, 12);
    q(C.hat, 1, by + 6, 14);
    q(C.hatD, 3, by + 7, 10);
    q(C.hatD, 1, by + 6, 1);
    q(C.hatD, 14, by + 6, 1);
  };

  const legs = (by: number) => {
    // Two legs and boots; the stepping foot lifts one pixel.
    const lift = (side: number) => (step === side ? -1 : 0);
    q(C.sock, 6, by + lift(-1), 2, 3);
    q(C.sock, 9, by + lift(1), 2, 3);
    q(C.boot, 5, by + 3 + lift(-1), 3, 2);
    q(C.boot, 9, by + 3 + lift(1), 3, 2);
  };

  if (d === "down") {
    hat(0 + bob);
    q(C.hair, 3, 9 + bob, 10, 2);
    q(C.hair, 3, 11 + bob, 2, 12);
    q(C.hair, 11, 11 + bob, 2, 12);
    q(C.hairD, 3, 20 + bob, 1, 3);
    q(C.skin, 5, 10 + bob, 6, 5);
    q(C.hair, 5, 10 + bob, 6, 1);
    q(C.eye, 6, 12 + bob);
    q(C.eye, 9, 12 + bob);
    q(C.mouth, 7, 14 + bob, 2);
    q(C.dress, 5, 15 + bob, 6, 4);
    q(C.dress, 4, 19 + bob, 8, 5);
    q(C.dressD, 4, 24 + bob, 8, 1);
    // Arms swing opposite to the feet; the left hand holds the broom.
    q(C.dress, 4, 16 + bob - step, 1, 4);
    q(C.skin, 4, 20 + bob - step, 1, 1);
    q(C.dress, 11, 16 + bob + step, 1, 4);
    q(C.skin, 11, 20 + bob + step, 1, 1);
    q(C.stick, 4, 13 + bob - step, 1, 14);
    q(C.straw, 3, 9 + bob - step, 3, 4);
    q(C.strawD, 3, 12 + bob - step, 3, 1);
    legs(25);
  } else if (d === "up") {
    hat(0 + bob);
    q(C.hair, 3, 9 + bob, 10, 14);
    q(C.hairD, 3, 20 + bob, 10, 3);
    q(C.hairD, 7, 12 + bob, 1, 8);
    q(C.dress, 4, 23 + bob, 8, 2);
    q(C.dressD, 4, 24 + bob, 8, 1);
    q(C.stick, 12, 13 + bob + step, 1, 14);
    q(C.straw, 11, 9 + bob + step, 3, 4);
    q(C.strawD, 11, 12 + bob + step, 3, 1);
    legs(25);
  } else {
    // Side view, facing right: hair streams behind, broom held forward.
    hat(0 + bob);
    q(C.hair, 3, 9 + bob, 9, 2);
    q(C.hair, 3, 11 + bob, 4, 12);
    q(C.hairD, 3, 20 + bob, 1, 3);
    q(C.skin, 7, 10 + bob, 5, 5);
    q(C.hair, 7, 10 + bob, 5, 1);
    q(C.eye, 10, 12 + bob);
    q(C.mouth, 10, 14 + bob);
    q(C.dress, 6, 15 + bob, 5, 4);
    q(C.dress, 5, 19 + bob, 7, 5);
    q(C.dressD, 5, 24 + bob, 7, 1);
    q(C.stick, 12, 13 + bob, 1, 14);
    q(C.straw, 11, 9 + bob, 3, 4);
    q(C.strawD, 11, 12 + bob, 3, 1);
    q(C.dress, 8, 16 + bob + step, 2, 3);
    q(C.skin, 11, 19 + bob, 1, 1);
    // Legs scissor front to back.
    q(C.sock, 7 + step, 25, 2, 3);
    q(C.sock, 8 - step, 25, 2, 3);
    q(C.boot, 6 + step, 28, 3, 2);
    q(C.boot, 8 - step, 28, 3, 2);
  }
}

/** Builds the sheet texture and its frames, named "witch-<dir>-<n>". */
export function paintWitch(scene: Phaser.Scene): void {
  if (scene.textures.exists(WITCH_KEY)) return;
  const tex = scene.textures.createCanvas(
    WITCH_KEY,
    FRAME_W * FRAMES,
    FRAME_H * DIRS.length,
  )!;
  const c = tex.getContext();
  DIRS.forEach((dir, row) => {
    for (let f = 0; f < FRAMES; f++) {
      paint(c, f * FRAME_W, row * FRAME_H, dir, f);
      tex.add(`${dir}-${f}`, 0, f * FRAME_W, row * FRAME_H, FRAME_W, FRAME_H);
    }
  });
  tex.refresh();
}
