import Phaser from "phaser";
import { GREENCOAT_LINES, hearGreencoat } from "../core/camp";
import type { GameState } from "../core/save";
import { frame } from "./panel";
import { STATE_KEY } from "./state";

/**
 * Old Greencoat at the farm door on the morning the mines open (note 22). He
 * brings the news and gives nothing. Placeholder words and no portrait until
 * the dialogue and art notes. The farm is paused behind it.
 */
export class GreencoatScene extends Phaser.Scene {
  constructor() {
    super("greencoat");
  }

  create(): void {
    const g = this.registry.get(STATE_KEY) as GameState;
    hearGreencoat(g);
    frame(this, "Old Greencoat", () => this.close());
    this.add
      .text(480, 150, GREENCOAT_LINES.join("\n\n"), {
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 760 },
      })
      .setOrigin(0.5, 0);
    this.add
      .text(480, 500, "Esc: close", { fontSize: "13px", color: "#ffffffaa" })
      .setOrigin(0.5);
    this.input.keyboard?.on("keydown-ENTER", () => this.close());
  }

  private close(): void {
    this.scene.stop();
    this.scene.resume("farm");
  }
}
