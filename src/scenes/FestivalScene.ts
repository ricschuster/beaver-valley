import Phaser from "phaser";
import { itemById } from "../core/items";
import { festivalToday, joinFestival, joinProblem } from "../core/festivals";
import type { GameState } from "../core/save";
import { saveGame } from "../core/save";
import { browserStore } from "./storage";
import { frame } from "./panel";
import { STATE_KEY } from "./state";

/**
 * Today's festival, drawn over the farm. Joining takes some time and is
 * remembered for the year. The prize counter and the festival game are hooks:
 * a festival lists them in its data and they show here once it has any.
 */
export class FestivalScene extends Phaser.Scene {
  private state!: GameState;
  private message!: Phaser.GameObjects.Text;
  private join!: Phaser.GameObjects.Rectangle;
  private joinText!: Phaser.GameObjects.Text;

  constructor() {
    super("festival");
  }

  init(): void {
    this.state = this.registry.get(STATE_KEY) as GameState;
  }

  create(): void {
    const f = festivalToday(this.state.day.clock.day);
    const { message } = frame(this, f?.name ?? "Festival", () => this.close());
    this.message = message;
    if (!f) return;
    this.add.text(24, 80, f.blurb, {
      fontSize: "20px",
      color: "#ffffff",
      wordWrap: { width: 900 },
    });
    const extras: string[] = [];
    if (f.prizes.length > 0)
      extras.push(
        `Prize counter: ${f.prizes.map((p) => itemById(p)?.name ?? p).join(", ")}`,
      );
    if (f.minigame) extras.push(`Festival game: ${f.minigame}`);
    this.add.text(24, 150, extras.join("\n"), {
      fontSize: "18px",
      color: "#ffe9a0",
    });
    this.join = this.add
      .rectangle(480, 330, 320, 64, 0x3f7d3a, 1)
      .setStrokeStyle(2, 0xffffff, 0.8)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.doJoin());
    this.joinText = this.add
      .text(480, 330, "", { fontSize: "24px", color: "#ffffff" })
      .setOrigin(0.5);
    this.add.text(24, 500, "Enter: join in   Esc: close", {
      fontSize: "13px",
      color: "#ffffffaa",
    });
    this.input.keyboard?.on("keydown-ENTER", () => this.doJoin());
    this.refresh();
  }

  private refresh(): void {
    const can = joinProblem(this.state) === undefined;
    this.join.setAlpha(can ? 1 : 0.4);
    this.joinText.setText(can ? "Join in" : "Joined").setAlpha(can ? 1 : 0.5);
  }

  private doJoin(): void {
    const why = joinProblem(this.state);
    if (why) return void this.message.setText(why);
    const f = joinFestival(this.state)!;
    this.message.setText(`You join the ${f.name}. It is a lovely afternoon.`);
    this.refresh();
  }

  private close(): void {
    this.scene.stop();
    this.scene.resume("farm");
    saveGame(browserStore, this.state);
  }
}
