import Phaser from "phaser";
import {
  BAT_ODDS,
  CAVE_MARK,
  MUSHROOM_BOXES,
  MUSHROOM_DAYS,
} from "../core/cave";
import type { GameState } from "../core/save";
import { frame } from "./panel";
import { STATE_KEY } from "./state";

/**
 * The farm cave choice (note 66). A villager at the door asks to use the cave
 * and the player picks fruit bats or mushrooms. The choice is permanent, so
 * the panel says what each does, and "Not yet" leaves it for another morning.
 */
export class CaveChoiceScene extends Phaser.Scene {
  private state!: GameState;
  private note!: Phaser.GameObjects.Text;

  constructor() {
    super("cave-choice");
  }

  create(): void {
    this.state = this.registry.get(STATE_KEY) as GameState;
    frame(this, "The cave on your farm", () => this.close());
    this.add
      .text(
        480,
        110,
        `A neighbour comes to the door. Your farm has earned ${CAVE_MARK}g, and the cave behind the north wall could be put to use. She asks which you would like. The choice is for good.`,
        {
          fontSize: "18px",
          color: "#ffffff",
          align: "center",
          wordWrap: { width: 760 },
        },
      )
      .setOrigin(0.5, 0);
    this.choice(
      250,
      "Fruit bats",
      `Each night the bats may leave fruit on the cave floor (about ${Math.round((1 - BAT_ODDS[0]) * 100)} nights in 100 bring some, up to 4). Pick it up by hand. Botanists get the best grade.`,
      () => this.pick("bats"),
    );
    this.choice(
      710,
      "Mushrooms",
      `${MUSHROOM_BOXES} growing boxes, each making a mushroom every ${MUSHROOM_DAYS} days, in any season. A free dehydrator comes with the cave.`,
      () => this.pick("mushrooms"),
    );
    this.note = this.add
      .text(480, 470, "", { fontSize: "18px", color: "#ffe9a0" })
      .setOrigin(0.5);
    this.add
      .text(480, 510, "Esc: not yet", { fontSize: "13px", color: "#ffffffaa" })
      .setOrigin(0.5);
  }

  private choice(
    x: number,
    title: string,
    text: string,
    run: () => void,
  ): void {
    this.add
      .rectangle(x, 320, 380, 220, 0x000000, 0.35)
      .setStrokeStyle(2, 0xffffff, 0.6);
    this.add
      .text(x, 230, title, { fontSize: "26px", color: "#ffe9a0" })
      .setOrigin(0.5);
    this.add
      .text(x, 300, text, {
        fontSize: "16px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 350 },
      })
      .setOrigin(0.5, 0.5);
    this.add
      .rectangle(x, 400, 220, 44, 0x3f7d3a, 1)
      .setStrokeStyle(2, 0xffffff, 0.8)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", run);
    this.add
      .text(x, 400, `Choose ${title.toLowerCase()}`, {
        fontSize: "18px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }

  private pick(choice: "bats" | "mushrooms"): void {
    if (!this.state.cave.choose(choice)) return;
    this.note.setText(
      "The cave door is open. You will find it in the north wall of the farm.",
    );
    this.time.delayedCall(1400, () => this.close());
  }

  private close(): void {
    this.scene.stop();
    this.scene.resume("farm");
  }
}
