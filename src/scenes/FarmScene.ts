import Phaser from "phaser";
import { Day } from "../core/day";
import { MAX_ENERGY } from "../core/energy";

/** Real milliseconds per 10 game minutes (Stardew pace). */
const TICK_MS = 7000;
const TICK_MINUTES = 10;

/** Placeholder scene: the day clock and energy. Space works, S sleeps. */
export class FarmScene extends Phaser.Scene {
  private day = new Day();
  private money = 500;
  private message = "";
  private label!: Phaser.GameObjects.Text;

  constructor() {
    super("farm");
  }

  create(): void {
    this.label = this.add.text(16, 16, "", {
      fontSize: "24px",
      color: "#ffffff",
    });
    this.time.addEvent({
      delay: TICK_MS,
      loop: true,
      callback: () => {
        this.day.act(0, TICK_MINUTES);
        this.afterAction();
      },
    });
    this.input.keyboard?.on("keydown-SPACE", () => {
      this.message = "";
      this.day.act(10, TICK_MINUTES);
      this.afterAction();
    });
    this.input.keyboard?.on("keydown-S", () => this.endDay());
    this.render();
  }

  private afterAction(): void {
    if (this.day.over) this.endDay();
    else this.render();
  }

  private endDay(): void {
    const end = this.day.end(this.money);
    if (end.passedOut) {
      this.money -= end.moneyLost;
      this.message = `You passed out and lost ${end.moneyLost}g.`;
    } else {
      this.message = "You slept well.";
    }
    this.render();
  }

  private render(): void {
    const { clock, energy } = this.day;
    this.label.setText(
      [
        `Day ${clock.day}  ${clock.format()}`,
        `Energy ${energy.current}/${MAX_ENERGY}  Money ${this.money}g`,
        "Space: work   S: sleep",
        this.message,
      ].join("\n"),
    );
  }
}
