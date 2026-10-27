import Phaser from "phaser";
import { itemById } from "../core/items";
import {
  enterFestival,
  enterProblem,
  festivalToday,
  leaveFestival,
} from "../core/festivals";
import type { GameState } from "../core/save";
import { frame } from "./panel";
import { STATE_KEY } from "./state";

/**
 * Today's festival, drawn over the farm. As in Stardew, time stands still
 * while the player is here, and leaving puts them back outside at 10 pm. It first asks, since
 * leaving cannot be undone. The prize counter and the festival game are hooks:
 * a festival lists them in its data and they show here once it has any.
 */
export class FestivalScene extends Phaser.Scene {
  private state!: GameState;
  private inside = false;

  constructor() {
    super("festival");
  }

  init(): void {
    this.state = this.registry.get(STATE_KEY) as GameState;
    this.inside = false;
  }

  create(): void {
    const f = festivalToday(this.state.day.clock.day);
    if (!f || enterProblem(this.state)) return this.close(false);
    frame(this, f.name, () => this.close(this.inside));
    this.add
      .text(
        480,
        200,
        `Go to the ${f.name}?\nTime stops while you are there, and it is 10 pm when you leave.`,
        { fontSize: "22px", color: "#ffffff", align: "center" },
      )
      .setOrigin(0.5);
    const yes = this.button(340, 330, "Go", 0x3f7d3a, () => this.enter());
    const no = this.button(620, 330, "Not now", 0xa0482e, () =>
      this.close(false),
    );
    this.input.keyboard?.on("keydown-ENTER", () =>
      this.inside ? this.close(true) : this.enter(),
    );
    this.add
      .text(480, 500, "Enter: yes   Esc: no", {
        fontSize: "13px",
        color: "#ffffffaa",
      })
      .setOrigin(0.5);
    this.asking = [yes, no].flat();
  }

  private asking: Phaser.GameObjects.GameObject[] = [];

  private enter(): void {
    if (this.inside) return;
    const f = enterFestival(this.state);
    if (!f) return this.close(false);
    this.inside = true;
    this.asking.forEach((o) => o.destroy());
    this.add
      .rectangle(0, 0, 960, 540, 0x10201a, 1)
      .setOrigin(0)
      .setInteractive();
    this.add.text(24, 16, f.name, { fontSize: "30px", color: "#ffffff" });
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
    this.button(480, 440, "Leave", 0xa0482e, () => this.close(true));
  }

  private button(
    x: number,
    y: number,
    text: string,
    color: number,
    run: () => void,
  ): Phaser.GameObjects.GameObject[] {
    const box = this.add
      .rectangle(x, y, 300, 60, color, 1)
      .setStrokeStyle(2, 0xffffff, 0.8)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", run);
    const label = this.add
      .text(x, y, text, { fontSize: "22px", color: "#ffffff" })
      .setOrigin(0.5);
    return [box, label];
  }

  /** Close the screen. Leaving a festival you went to moves the clock on. */
  private close(left: boolean): void {
    if (left) leaveFestival(this.state);
    this.scene.stop();
    this.scene.resume("farm");
  }
}
