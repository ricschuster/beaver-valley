import Phaser from "phaser";
import { heldAt, TOOLBAR_SIZE, type Held } from "../core/toolbar";
import { itemById } from "../core/items";
import type { GameState } from "../core/save";

const SLOT = 44;
const GAP = 4;
const BAR_W = TOOLBAR_SIZE * (SLOT + GAP) - GAP;
const BAR_Y = 540 - SLOT - 8;
const USE_R = 52;

const HINT =
  "Move: arrows/WASD or drag left   Use: Space   Sleep: Z   Tools: 1-9, Q/E";

const TOOL_LABEL = { hoe: "Hoe", can: "Can", hand: "Hand" } as const;

/** Short text for a slot, until the art pass gives items icons. */
function caption(held: Held): string {
  if (held.kind === "tool") return TOOL_LABEL[held.tool];
  if (held.kind === "empty") return "";
  const name = itemById(held.id)?.name ?? held.id;
  return `${name}\n${held.count}`;
}

/**
 * The on-screen interface: a status readout, the toolbar and a use button. It
 * draws from the game state and reports taps through two callbacks. Every
 * object here belongs to the UI camera.
 */
export class Hud {
  readonly objects: Phaser.GameObjects.GameObject[] = [];
  private readonly status: Phaser.GameObjects.Text;
  private readonly message: Phaser.GameObjects.Text;
  private readonly hint: Phaser.GameObjects.Text;
  private readonly slots: Phaser.GameObjects.Rectangle[] = [];
  private readonly captions: Phaser.GameObjects.Text[] = [];

  constructor(
    scene: Phaser.Scene,
    onSelect: (index: number) => void,
    onUse: () => void,
  ) {
    this.status = scene.add.text(16, 16, "", {
      fontSize: "24px",
      color: "#ffffff",
    });
    this.hint = scene.add.text(16, 84, "", {
      fontSize: "14px",
      color: "#ffffffcc",
    });
    this.hint.setText(HINT);
    this.message = scene.add.text(16, 106, "", {
      fontSize: "18px",
      color: "#ffe9a0",
    });
    this.objects.push(this.status, this.hint, this.message);

    const left = (960 - BAR_W) / 2;
    for (let i = 0; i < TOOLBAR_SIZE; i++) {
      const x = left + i * (SLOT + GAP);
      const box = scene.add
        .rectangle(x, BAR_Y, SLOT, SLOT, 0x000000, 0.5)
        .setOrigin(0)
        .setStrokeStyle(2, 0xffffff, 0.3)
        .setInteractive({ useHandCursor: true });
      box.on("pointerdown", () => onSelect(i));
      const text = scene.add
        .text(x + SLOT / 2, BAR_Y + SLOT / 2, "", {
          fontSize: "10px",
          color: "#ffffff",
          align: "center",
          wordWrap: { width: SLOT - 4 },
        })
        .setOrigin(0.5);
      this.slots.push(box);
      this.captions.push(text);
      this.objects.push(box, text);
    }

    const use = scene.add
      .circle(960 - USE_R - 24, BAR_Y - USE_R - 16, USE_R, 0xf2d16b, 0.45)
      .setStrokeStyle(3, 0xffffff, 0.7)
      .setInteractive({ useHandCursor: true });
    use.on("pointerdown", onUse);
    const useText = scene.add
      .text(use.x, use.y, "Use", { fontSize: "22px", color: "#ffffff" })
      .setOrigin(0.5);
    this.objects.push(use, useText);
  }

  /** True if a screen point falls on the toolbar, which owns its touches. */
  covers(x: number, y: number): boolean {
    const left = (960 - BAR_W) / 2;
    return y >= BAR_Y && x >= left && x <= left + BAR_W;
  }

  update(g: GameState, selected: number, message: string): void {
    const { clock, energy } = g.day;
    this.status.setText(
      `Day ${clock.day}  ${clock.format()}\nEnergy ${energy.current}  ${g.money}g`,
    );
    this.message.setText(message);
    this.slots.forEach((box, i) => {
      const on = i === selected;
      box.setStrokeStyle(on ? 3 : 2, 0xffffff, on ? 1 : 0.3);
      box.setFillStyle(on ? 0xf2d16b : 0x000000, on ? 0.45 : 0.5);
      this.captions[i]!.setText(caption(heldAt(g, i)));
    });
  }
}
