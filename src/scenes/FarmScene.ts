import Phaser from "phaser";
import { Clock } from "../core/clock";

/** Placeholder scene: shows the day clock ticking. Real farm comes later. */
export class FarmScene extends Phaser.Scene {
  private clock = new Clock();
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
      delay: 700,
      loop: true,
      callback: () => {
        if (this.clock.advance(10)) this.clock.nextDay();
        this.render();
      },
    });
    this.render();
  }

  private render(): void {
    this.label.setText(`Day ${this.clock.day}  ${this.clock.format()}`);
  }
}
