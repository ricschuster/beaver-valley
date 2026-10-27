import Phaser from "phaser";
import { heldAt, rowOf, TOOLS, TOOLBAR_SIZE, type Held } from "../core/toolbar";
import { SLOT_COUNT } from "../core/inventory";
import { iconKey as itemIcon, TOOL_ICONS } from "./art";
import { dateText } from "../core/calendar";
import { festivalToday } from "../core/festivals";
import { splitQuality } from "../core/quality";
import { itemById } from "../core/items";
import type { GameState } from "../core/save";
import { TIER_NAMES, type Upgradable } from "../core/upgrades";

const SLOT = 44;
const GAP = 4;
const BAR_W = TOOLBAR_SIZE * (SLOT + GAP) - GAP;
const BAR_Y = 540 - SLOT - 8;
const USE_R = 52;
const EAT_R = 36;

const HINT =
  "Move: arrows/WASD or drag left   Use: Space   Eat: F   Skills: K   Sleep: bed or Z   Tools: 1-9, Q/E, Tab: row";

const QUALITY_TINT = { normal: 0xffffff, silver: 0xc8d8ff, gold: 0xffd860 };

const TOOL_LABEL = { hoe: "Hoe", can: "Can", hand: "Hand" } as const;

/** Short text for a slot, until the art pass gives items icons. */
function caption(held: Held, g: GameState): string {
  if (held.kind === "tool") {
    const tier =
      held.tool === "hand" ? 0 : g.toolTiers[held.tool as Upgradable];
    return tier > 0
      ? `${TIER_NAMES[tier]} ${TOOL_LABEL[held.tool].toLowerCase()}`
      : TOOL_LABEL[held.tool];
  }
  if (held.kind === "empty") return "";
  return String(held.count);
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
  private readonly icons: Phaser.GameObjects.Image[] = [];
  private readonly heldName: Phaser.GameObjects.Text;
  private readonly rowButton: Phaser.GameObjects.Rectangle;
  private readonly rowText: Phaser.GameObjects.Text;
  /** Which row of backpack slots the bar is showing. */
  private row = 0;

  constructor(
    scene: Phaser.Scene,
    onSelect: (index: number) => void,
    onUse: () => void,
    onEat: () => void,
    onSkills: () => void,
    onRow: () => void,
  ) {
    this.status = scene.add.text(16, 16, "", {
      fontSize: "24px",
      color: "#ffffff",
    });
    this.hint = scene.add.text(16, 84, "", {
      fontSize: "14px",
      color: "#ffffffcc",
    });
    // The hint is for a keyboard; a tablet has the stick and the buttons.
    const { os, input } = scene.sys.game.device;
    this.hint.setText(input.touch && !os.desktop ? "" : HINT);
    this.message = scene.add.text(16, 106, "", {
      fontSize: "18px",
      color: "#ffe9a0",
    });
    this.objects.push(this.status, this.hint, this.message);

    const left = (960 - BAR_W) / 2;
    this.heldName = scene.add
      .text(480, BAR_Y - 14, "", { fontSize: "16px", color: "#ffffff" })
      .setOrigin(0.5, 1);
    this.objects.push(this.heldName);
    for (let i = 0; i < TOOLBAR_SIZE; i++) {
      const x = left + i * (SLOT + GAP);
      const box = scene.add
        .rectangle(x, BAR_Y, SLOT, SLOT, 0x000000, 0.5)
        .setOrigin(0)
        .setStrokeStyle(2, 0xffffff, 0.3)
        .setInteractive({ useHandCursor: true });
      box.on("pointerdown", () => onSelect(this.indexOf(i)));
      const text = scene.add
        .text(x + SLOT / 2, BAR_Y + SLOT - 2, "", {
          fontSize: "10px",
          color: "#ffffff",
          align: "center",
          wordWrap: { width: SLOT - 4 },
        })
        .setOrigin(0.5, 1);
      const icon = scene.add
        .image(x + SLOT / 2, BAR_Y + 15, TOOL_ICONS.hand)
        .setVisible(false);
      this.slots.push(box);
      this.captions.push(text);
      this.icons.push(icon);
      this.objects.push(box, icon, text);
    }

    this.rowButton = scene.add
      .rectangle(left, BAR_Y - 46, 90, 40, 0x000000, 0.5)
      .setOrigin(0)
      .setStrokeStyle(2, 0xffffff, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", onRow);
    this.rowText = scene.add
      .text(left + 45, BAR_Y - 26, "Row", {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
    this.objects.push(this.rowButton, this.rowText);

    const use = scene.add
      .circle(960 - USE_R - 24, BAR_Y - USE_R - 16, USE_R, 0xf2d16b, 0.45)
      .setStrokeStyle(3, 0xffffff, 0.7)
      .setInteractive({ useHandCursor: true });
    use.on("pointerdown", onUse);
    const useText = scene.add
      .text(use.x, use.y, "Use", { fontSize: "22px", color: "#ffffff" })
      .setOrigin(0.5);
    const eat = scene.add
      .circle(use.x, use.y - USE_R - 44, EAT_R, 0x8fd18a, 0.45)
      .setStrokeStyle(3, 0xffffff, 0.7)
      .setInteractive({ useHandCursor: true });
    eat.on("pointerdown", onEat);
    const eatText = scene.add
      .text(eat.x, eat.y, "Eat", { fontSize: "18px", color: "#ffffff" })
      .setOrigin(0.5);
    const skills = scene.add
      .rectangle(960 - 16 - 90, 16, 90, 40, 0x000000, 0.5)
      .setOrigin(0)
      .setStrokeStyle(2, 0xffffff, 0.5)
      .setInteractive({ useHandCursor: true });
    skills.on("pointerdown", onSkills);
    const skillsText = scene.add
      .text(skills.x + 45, 36, "Skills", { fontSize: "18px", color: "#ffffff" })
      .setOrigin(0.5);
    this.objects.push(use, useText, eat, eatText, skills, skillsText);
  }

  /** The toolbar index that bar slot i stands for, given the row shown. */
  private indexOf(i: number): number {
    return i < TOOLS.length ? i : i + this.row * SLOT_COUNT;
  }

  /** True if a screen point falls on the toolbar, which owns its touches. */
  covers(x: number, y: number): boolean {
    const left = (960 - BAR_W) / 2;
    return y >= BAR_Y && x >= left && x <= left + BAR_W;
  }

  update(g: GameState, selected: number, message: string): void {
    const { clock, energy } = g.day;
    this.status.setText(
      `${dateText(clock.day)}  ${clock.format()}${festivalToday(clock.day) ? "  Festival" : ""}\nEnergy ${Math.ceil(energy.current)}  ${g.money}g`,
    );
    this.message.setText(message);
    const now = heldAt(g, selected);
    this.heldName.setText(
      now.kind === "item" ? (itemById(now.id)?.name ?? now.id) : "",
    );
    if (selected >= TOOLS.length) this.row = rowOf(selected);
    const multiRow = g.inventory.size > SLOT_COUNT;
    this.rowButton.setVisible(multiRow);
    this.rowText.setVisible(multiRow);
    this.slots.forEach((box, i) => {
      const index = this.indexOf(i);
      const on = index === selected;
      box.setStrokeStyle(on ? 3 : 2, 0xffffff, on ? 1 : 0.3);
      box.setFillStyle(on ? 0xf2d16b : 0x000000, on ? 0.45 : 0.5);
      const held = heldAt(g, index);
      const iconKey =
        held.kind === "tool"
          ? TOOL_ICONS[held.tool]
          : held.kind === "item"
            ? itemIcon(held.id)
            : undefined;
      const icon = this.icons[i]!;
      icon.setVisible(iconKey !== undefined);
      if (iconKey) icon.setTexture(iconKey);
      const quality =
        held.kind === "item" ? splitQuality(held.id).quality : "normal";
      icon.setTint(QUALITY_TINT[quality]);
      this.captions[i]!.setText(caption(held, g));
    });
  }
}
