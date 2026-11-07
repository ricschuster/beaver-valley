import Phaser from "phaser";
import type { GameState } from "../core/save";
import { BUILT_FLOORS, mineMapId } from "../core/mines";
import { frame, Menu, type Row } from "./panel";
import { STATE_KEY } from "./state";

/**
 * The mine lift, drawn over the paused mine hall. It stops at every floor the
 * player has reached (note 22, decision 13) and takes them there at once.
 */
export class LiftScene extends Phaser.Scene {
  private state!: GameState;
  private menu!: Menu;

  constructor() {
    super("lift");
  }

  init(): void {
    this.state = this.registry.get(STATE_KEY) as GameState;
  }

  create(): void {
    frame(this, "Lift", () => this.close());
    this.add.text(24, 500, "Arrows: move   Enter: go   Esc: close", {
      fontSize: "13px",
      color: "#ffffffaa",
    });
    this.menu = new Menu(this, { x: 24, y: 64, w: 450, title: "Floor" });
    const kb = this.input.keyboard;
    kb?.on("keydown-UP", () => this.menu.move(-1));
    kb?.on("keydown-DOWN", () => this.menu.move(1));
    kb?.on("keydown-ENTER", () => this.menu.press(0));
    this.menu.setFocus(true);
    const top = Math.min(this.state.mines.deepest, BUILT_FLOORS);
    const rows: Row[] = [];
    for (let floor = 1; floor <= top; floor++)
      rows.push({
        label: `Floor ${floor}`,
        buttons: [{ text: "Go", run: () => this.go(floor) }],
      });
    this.menu.setRows(
      rows.length > 0
        ? rows
        : [
            {
              label: "The lift has not reached any floor yet.",
              dim: true,
              buttons: [],
            },
          ],
    );
  }

  private go(floor: number): void {
    this.scene.stop();
    this.scene.resume("farm", {
      goto: { map: mineMapId(floor), entry: "from_above" },
    });
  }

  private close(): void {
    this.scene.stop();
    this.scene.resume("farm");
  }
}
