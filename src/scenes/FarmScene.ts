import Phaser from "phaser";
import { Day } from "../core/day";
import { MAX_ENERGY } from "../core/energy";
import { FarmMap, type TiledMapJson } from "../core/map";
import {
  facingFrom,
  facingTile,
  move,
  tileOf,
  type Body,
  type Facing,
  type Vec,
} from "../core/movement";
import { Controls } from "./controls";
import {
  makePlaceholderTextures,
  PLAYER_KEY,
  TILES_KEY,
  TILESET_NAME,
} from "./placeholder-textures";

/**
 * PLACEHOLDER map. The real map design is still open; see
 * docs/design/05_farm_map_placeholder.md. To swap in a real map, change this
 * path and run the tests.
 */
const MAP_PATH = "maps/farm-placeholder.json";
const MAP_KEY = "farm";

/** Real milliseconds per 10 game minutes (Stardew pace). */
const TICK_MS = 7000;
const TICK_MINUTES = 10;

/** World pixels per second. */
const SPEED = 80;
/** The player's feet box, in world pixels. */
const PLAYER: Body = { hw: 5, h: 6 };
/** The world is drawn at this zoom; the HUD is not. */
const WORLD_ZOOM = 2;

/** A walkable farm map, a player and a day clock. Space works, Z sleeps. */
export class FarmScene extends Phaser.Scene {
  private day = new Day();
  private money = 500;
  private message = "";
  private label!: Phaser.GameObjects.Text;
  private map!: FarmMap;
  private controls!: Controls;
  private player!: Phaser.GameObjects.Image;
  private target!: Phaser.GameObjects.Rectangle;
  private pos: Vec = { x: 0, y: 0 };
  private facing: Facing = "down";
  private door: string | undefined;

  constructor() {
    super("farm");
  }

  preload(): void {
    this.load.tilemapTiledJSON(MAP_KEY, MAP_PATH);
  }

  create(): void {
    makePlaceholderTextures(this);

    const json = this.cache.tilemap.get(MAP_KEY).data as TiledMapJson;
    this.map = FarmMap.fromTiled(json);
    const problems = this.map.problems();
    if (problems.length > 0) console.warn("Map problems:", problems.join("; "));

    // World objects: the tile layers, the player and the facing marker.
    const tilemap = this.make.tilemap({ key: MAP_KEY });
    const tileset = tilemap.addTilesetImage(TILESET_NAME, TILES_KEY)!;
    const world: Phaser.GameObjects.GameObject[] = [];
    for (const layer of json.layers) {
      if (layer.type !== "tilelayer" || layer.visible === false) continue;
      const drawn = tilemap.createLayer(layer.name, tileset);
      if (drawn) world.push(drawn);
    }

    const ts = this.map.tileSize;
    const spawn = this.map.spawn;
    this.pos = { x: (spawn.x + 0.5) * ts, y: (spawn.y + 1) * ts - 2 };
    this.player = this.add
      .image(this.pos.x, this.pos.y, PLAYER_KEY)
      .setOrigin(0.5, 0.875);
    this.target = this.add
      .rectangle(0, 0, ts, ts)
      .setOrigin(0)
      .setStrokeStyle(1, 0xffffff, 0.6);
    world.push(this.player, this.target);

    // UI objects, drawn by a second camera that does not zoom.
    this.controls = new Controls(this);
    this.label = this.add.text(16, 16, "", {
      fontSize: "24px",
      color: "#ffffff",
    });
    const note = this.add.text(16, 512, "Placeholder map", {
      fontSize: "14px",
      color: "#ffffffaa",
    });
    const ui = [this.controls.stick, this.label, note];

    const { width, height } = this.scale.gameSize;
    const uiCamera = this.cameras.add(0, 0, width, height);
    uiCamera.ignore(world);
    this.cameras.main
      .setBounds(0, 0, this.map.width * ts, this.map.height * ts)
      .setZoom(WORLD_ZOOM)
      .startFollow(this.player, true)
      .ignore(ui);

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
    this.input.keyboard?.on("keydown-Z", () => this.endDay());
    this.render();

    if (import.meta.env.DEV)
      (window as unknown as { farmDebug: () => unknown }).farmDebug = () => ({
        pos: this.pos,
        tile: tileOf(this.pos, PLAYER, ts),
        facing: this.facing,
        target: facingTile(this.pos, PLAYER, this.facing, ts),
        door: this.door ?? null,
        zoom: this.cameras.main.zoom,
      });
  }

  update(_time: number, delta: number): void {
    // Cap the step so a stalled frame cannot throw the player across the map.
    const dt = Math.min(delta, 50) / 1000;
    const v = this.controls.vector();
    this.facing = facingFrom(v, this.facing);
    const ts = this.map.tileSize;
    this.pos = move(
      this.pos,
      { x: v.x * SPEED * dt, y: v.y * SPEED * dt },
      PLAYER,
      ts,
      (x, y) => this.map.isBlocked(x, y),
    );
    this.player.setPosition(this.pos.x, this.pos.y);

    const front = facingTile(this.pos, PLAYER, this.facing, ts);
    this.target.setPosition(front.x * ts, front.y * ts);

    const here = tileOf(this.pos, PLAYER, ts);
    const door = this.map.doorAt(here.x, here.y);
    if (door !== this.door) {
      this.door = door;
      this.render();
    }
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
        "Move: arrows, WASD or drag left side   Space: work   Z: sleep",
        this.door ? `At the ${this.door} door.` : this.message,
      ].join("\n"),
    );
  }
}
