import Phaser from "phaser";
import { keyVector, stickVector, type Vec } from "../core/movement";

/**
 * Movement input: arrows or WASD, and a floating touch stick. Touch down on the
 * left half of the screen, then drag. The right half is left free for tools.
 */
export class Controls {
  /** Draws the touch stick. A UI object: keep it off the world camera. */
  readonly stick: Phaser.GameObjects.Graphics;
  private keys: Record<string, Phaser.Input.Keyboard.Key> = {};
  private stickId = -1;
  private anchor: Vec = { x: 0, y: 0 };
  private current: Vec = { x: 0, y: 0 };

  /** `ignore` lets the HUD claim a touch, so it does not start the stick. */
  constructor(
    private scene: Phaser.Scene,
    ignore: (p: Phaser.Input.Pointer) => boolean = () => false,
  ) {
    const kb = scene.input.keyboard;
    if (kb) {
      this.keys = kb.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT") as Record<
        string,
        Phaser.Input.Keyboard.Key
      >;
    }
    // A second finger is needed for the stick and a tool at the same time.
    // The input manager outlives a scene restart, so add it only once.
    if (scene.input.manager.pointers.length < 3) scene.input.addPointer(1);
    this.stick = scene.add.graphics().setDepth(1000);

    scene.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.stickId !== -1 || p.x >= scene.scale.gameSize.width / 2) return;
      if (ignore(p)) return;
      this.stickId = p.id;
      this.anchor = { x: p.x, y: p.y };
      this.current = { ...this.anchor };
    });
    scene.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (p.id === this.stickId) this.current = { x: p.x, y: p.y };
    });
    const release = (p?: Phaser.Input.Pointer) => {
      if (!p || p.id === this.stickId) this.stickId = -1;
    };
    scene.input.on("pointerup", release);
    scene.input.on("gameout", () => release());
  }

  /** The direction to move, length 0 to 1. Touch wins over the keyboard. */
  vector(): Vec {
    this.drawStick();
    if (this.stickId !== -1) {
      const v = stickVector(
        this.current.x - this.anchor.x,
        this.current.y - this.anchor.y,
      );
      if (v.x !== 0 || v.y !== 0) return v;
    }
    const down = (...names: string[]) =>
      names.some((n) => this.keys[n]?.isDown === true);
    return keyVector(
      down("A", "LEFT"),
      down("D", "RIGHT"),
      down("W", "UP"),
      down("S", "DOWN"),
    );
  }

  private drawStick(): void {
    this.stick.clear();
    if (this.stickId === -1) return;
    const { x, y } = this.anchor;
    const knob = stickVector(this.current.x - x, this.current.y - y, 0, 40);
    this.stick.lineStyle(3, 0xffffff, 0.35).strokeCircle(x, y, 40);
    this.stick
      .fillStyle(0xffffff, 0.45)
      .fillCircle(x + knob.x * 40, y + knob.y * 40, 18);
  }
}
