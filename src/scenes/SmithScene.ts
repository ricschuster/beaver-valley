import Phaser from "phaser";
import { itemById } from "../core/items";
import type { GameState } from "../core/save";
import { buy } from "../core/shop";
import { COPPER_ORE } from "../core/ore";
import { handOverCopper, SMITH_STOCK } from "../core/smith";
import { frame, Menu, type Row } from "./panel";
import { STATE_KEY } from "./state";

/**
 * The smith dwarf's counter (note 22): she sells ore and coal, never bars.
 * The first copper ore handed to her makes her bring a furnace the next
 * morning. The farm is paused behind this screen.
 */
export class SmithScene extends Phaser.Scene {
  private state!: GameState;
  private menu!: Menu;
  private money!: Phaser.GameObjects.Text;
  private message!: Phaser.GameObjects.Text;

  constructor() {
    super("smith");
  }

  init(): void {
    this.state = this.registry.get(STATE_KEY) as GameState;
  }

  create(): void {
    const { money, message } = frame(this, "The smith", () => this.close());
    this.money = money;
    this.message = message;
    this.add.text(
      24,
      500,
      "Arrows: move   Enter: buy 1   Space: buy 5   Esc: close",
      {
        fontSize: "13px",
        color: "#ffffffaa",
      },
    );
    this.menu = new Menu(this, { x: 24, y: 64, w: 600, title: "Ore and coal" });
    const kb = this.input.keyboard;
    kb?.on("keydown-UP", () => this.menu.move(-1));
    kb?.on("keydown-DOWN", () => this.menu.move(1));
    kb?.on("keydown-ENTER", () => this.menu.press(0));
    kb?.on("keydown-SPACE", () => this.menu.press(1));
    this.menu.setFocus(true);
    this.refresh();
  }

  private say(text: string): void {
    this.message.setText(text);
    this.refresh();
  }

  private refresh(): void {
    const g = this.state;
    this.money.setText(`Money ${g.money}g`);
    const rows: Row[] = SMITH_STOCK.map((id) => {
      const def = itemById(id)!;
      const price = def.buyPrice ?? 0;
      const tryBuy = (n: number) => () =>
        this.say(
          buy(g.inventory, g, id, n)
            ? `Bought ${n} ${def.name.toLowerCase()} for ${price * n}g.`
            : g.money < price * n
              ? "Not enough money."
              : "Your backpack is full.",
        );
      return {
        label: def.name,
        detail: `${price}g  have ${g.inventory.count(id)}`,
        buttons: [
          { text: "Buy 1", run: tryBuy(1) },
          { text: "Buy 5", run: tryBuy(5) },
        ],
      };
    });
    if (!g.mines.copperHandedIn)
      rows.push({
        label: "Show her a copper ore",
        detail: "She will bring a furnace",
        dim: g.inventory.count(COPPER_ORE) < 1,
        buttons: [
          {
            text: "Hand over",
            run: () =>
              this.say(
                handOverCopper(g)
                  ? "She turns it over and grins. Look by your house tomorrow."
                  : "You have no copper ore.",
              ),
          },
        ],
      });
    this.menu.setRows(rows);
  }

  private close(): void {
    this.scene.stop();
    this.scene.resume("farm");
  }
}
