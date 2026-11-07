import Phaser from "phaser";
import {
  canCraft,
  craft,
  ingredientText,
  knownRecipes,
  lockedRecipes,
} from "../core/crafting";
import { itemById } from "../core/items";
import { reasonText } from "../core/tools";
import type { GameState } from "../core/save";
import { frame, Menu, type Row } from "./panel";
import { STATE_KEY } from "./state";

/**
 * The crafting tab (note 34): the recipes the player knows, each with its
 * ingredients and what the pack holds. Crafting draws on the pack only; the
 * workbench and chests are build 7. Opened from the Craft key or button.
 */
export class CraftingScene extends Phaser.Scene {
  private state!: GameState;
  private menu!: Menu;
  private message!: Phaser.GameObjects.Text;

  constructor() {
    super("crafting");
  }

  init(): void {
    this.state = this.registry.get(STATE_KEY) as GameState;
  }

  create(): void {
    const { message } = frame(this, "Crafting", () => this.close());
    this.message = message;
    this.add.text(24, 500, "Arrows: move   Enter: craft   Esc: close", {
      fontSize: "13px",
      color: "#ffffffaa",
    });
    this.menu = new Menu(this, { x: 24, y: 64, w: 600, title: "Recipes" });
    const kb = this.input.keyboard;
    kb?.on("keydown-UP", () => this.menu.move(-1));
    kb?.on("keydown-DOWN", () => this.menu.move(1));
    kb?.on("keydown-ENTER", () => this.menu.press(0));
    this.menu.setFocus(true);
    this.refresh();
  }

  private say(text: string): void {
    this.message.setText(text);
    this.refresh();
  }

  private refresh(): void {
    const g = this.state;
    const rows: Row[] = knownRecipes(g).map((r) => {
      const name = itemById(r.result.item)?.name ?? r.result.item;
      return {
        label: name,
        detail: `${ingredientText(r)}   have ${r.ingredients
          .map((i) => g.inventory.count(i.item))
          .join("/")}`,
        dim: !canCraft(g, r),
        buttons: [
          {
            text: "Craft",
            run: () => {
              const why = craft(g, r.id);
              this.say(
                why ? reasonText(why) : `You make a ${name.toLowerCase()}.`,
              );
            },
          },
        ],
      };
    });
    for (const r of lockedRecipes(g)) {
      const s = r.source;
      rows.push({
        label: itemById(r.result.item)?.name ?? r.result.item,
        detail:
          s.kind === "level"
            ? `Learned at ${s.skill} level ${s.level}`
            : "Not known yet",
        dim: true,
        buttons: [],
      });
    }
    this.menu.setRows(rows);
  }

  private close(): void {
    this.scene.stop();
    this.scene.resume("farm");
  }
}
