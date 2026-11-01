import Phaser from "phaser";
import { createControls, type Controls } from "./controls";
import { loadDeviceSettings } from "./storage";
import { type Dir, WITCH_KEY, paintWitch } from "./witch-art";

/**
 * Throwaway test: the witch walking around a bare field, Stardew style. Open
 * the game with `?scene=witchwalk`. Arrows or WASD, or the touch stick on the
 * left half of the screen. Everything is drawn at 4x, so a 16 by 32 sprite is
 * 64 by 128 on screen.
 */
const ZOOM = 4;
const SPEED = 48 * ZOOM; // 48 pixels a second, like a brisk Stardew walk
const FRAME_MS = 130;

export class WitchWalkScene extends Phaser.Scene {
  private witch!: Phaser.GameObjects.Image;
  private controls!: Controls;
  private facing: Dir = "down";
  private clock = 0;

  constructor() {
    super("witch-walk");
  }

  create(): void {
    paintWitch(this);
    this.drawField();
    this.witch = this.add
      .image(480, 300, WITCH_KEY, "down-0")
      .setOrigin(0.5, 1)
      .setScale(ZOOM);
    this.controls = createControls(this, loadDeviceSettings());
    this.add
      .text(
        480,
        14,
        "Witch walk test: arrows / WASD, or drag on the left half",
        {
          fontSize: "16px",
          color: "#ffffff",
        },
      )
      .setOrigin(0.5, 0)
      .setDepth(2000);
  }

  private drawField(): void {
    const g = this.add.graphics();
    const t = 16 * ZOOM;
    for (let y = 0; y < 540 / t + 1; y++)
      for (let x = 0; x < 960 / t; x++)
        g.fillStyle((x + y) % 2 ? 0x6aa84f : 0x5f9a46).fillRect(
          x * t,
          y * t,
          t,
          t,
        );
    // A dirt path and a few flowers, for a sense of movement.
    g.fillStyle(0xb08a58).fillRect(0, 7 * t, 960, 2 * t);
    const rnd = new Phaser.Math.RandomDataGenerator(["witch"]);
    for (let i = 0; i < 40; i++) {
      const x = rnd.between(0, 959);
      const y = rnd.between(0, 539);
      if (y > 7 * t - 8 && y < 9 * t + 8) continue;
      g.fillStyle(rnd.pick([0xf4f4ec, 0xf0d040, 0xd9432f])).fillRect(
        x,
        y,
        ZOOM * 2,
        ZOOM * 2,
      );
    }
  }

  update(_time: number, delta: number): void {
    const v = this.controls.vector();
    const moving = v.x !== 0 || v.y !== 0;
    const dt = Math.min(delta, 50) / 1000;
    if (moving) {
      this.facing =
        Math.abs(v.x) > Math.abs(v.y)
          ? v.x > 0
            ? "right"
            : "left"
          : v.y > 0
            ? "down"
            : "up";
      this.witch.x = Phaser.Math.Clamp(
        this.witch.x + v.x * SPEED * dt,
        32,
        928,
      );
      this.witch.y = Phaser.Math.Clamp(
        this.witch.y + v.y * SPEED * dt,
        140,
        530,
      );
      this.clock += delta;
    } else {
      this.clock = 0;
    }
    const frame = moving ? Math.floor(this.clock / FRAME_MS) % 4 : 0;
    this.witch.setFrame(`${this.facing}-${frame}`);
    this.witch.setDepth(this.witch.y);
  }
}
