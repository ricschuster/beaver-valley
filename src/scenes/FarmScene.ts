import Phaser from "phaser";
import { sleep } from "../core/sleep";
import type { GameState } from "../core/save";
import { cycle, heldAt, nextRow, toolbarSize } from "../core/toolbar";
import { pendingChoice } from "../core/professions";
import { eat } from "../core/actions";
import { clockText } from "../core/clock";
import { festivalOpen, festivalToday } from "../core/festivals";
import { itemById } from "../core/items";
import { reasonText, useHeld } from "../core/tools";
import { cropById } from "../core/crops";
import { mapFiles, maps } from "../content/maps";
import { START } from "../core/maps";
import { exitOpen, type Exit, type FarmMap } from "../core/map";
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
import { browserStore } from "./storage";
import { saveGame } from "../core/save";
import { SELECTED_KEY, STATE_KEY } from "./state";
import { cropKey, forageKey, soilKey, stageOf } from "./art";
import { Hud } from "./hud";
import {
  makePlaceholderTextures,
  PLAYER_KEY,
  TILES_KEY,
  TILESET_NAME,
} from "./placeholder-textures";

/** Real milliseconds per 10 game minutes (Stardew pace). */
const TICK_MS = 7000;
const TICK_MINUTES = 10;

/** World pixels per second. */
const SPEED = 80;
/** The player's feet box, in world pixels. */
const PLAYER: Body = { hw: 5, h: 6 };
/** The world is drawn at this zoom; the HUD is not. */
const WORLD_ZOOM = 2;

/** Fade time when the player walks through an exit, in milliseconds. */
const FADE_MS = 200;

/** Where the scene starts. Game state lives in the game registry, not here. */
interface SceneData {
  map: string;
  entry: string;
}

/**
 * A walkable map, a player and one `GameState`. Space uses the held tool, Z
 * sleeps. Walking through an exit restarts the scene on the next map; the
 * state and the selected toolbar slot survive in the game registry.
 */
export class FarmScene extends Phaser.Scene {
  private state!: GameState;
  private selected = 0;
  private mapId: string = START.map;
  private entryName: string = START.entry;
  private leaving = false;
  /** Conditions that currently hold, for gated exits. None exist yet. */
  private holds = new Set<string>();
  private message = "";
  private hud!: Hud;
  private uiCamera!: Phaser.Cameras.Scene2D.Camera;
  private sprites!: Phaser.GameObjects.Container;
  private ground!: Phaser.GameObjects.Graphics;
  private wash!: Phaser.GameObjects.Graphics;
  private map!: FarmMap;
  private controls!: Controls;
  private player!: Phaser.GameObjects.Image;
  private target!: Phaser.GameObjects.Rectangle;
  private pos: Vec = { x: 0, y: 0 };
  private facing: Facing = "down";
  private exitId: string | undefined;

  constructor() {
    super("farm");
  }

  init(data: Partial<SceneData>): void {
    this.mapId = data.map ?? START.map;
    this.entryName = data.entry ?? START.entry;
    this.state = this.registry.get(STATE_KEY) as GameState;
    this.selected =
      (this.registry.get(SELECTED_KEY) as number | undefined) ?? 0;
    this.leaving = false;
    this.exitId = undefined;
    this.message = "";
  }

  create(): void {
    if (!this.textures.exists(PLAYER_KEY)) makePlaceholderTextures(this);

    const problems = maps.problems();
    if (problems.length > 0) console.warn("Map problems:", problems.join("; "));
    const id = this.mapId;
    const json = mapFiles[id]!;
    this.map = maps.get(id);
    if (!this.cache.tilemap.exists(id))
      this.cache.tilemap.add(id, {
        format: Phaser.Tilemaps.Formats.TILED_JSON,
        data: json,
      });

    // World objects: the tile layers, the player and the facing marker.
    const tilemap = this.make.tilemap({ key: id });
    const tileset = tilemap.addTilesetImage(TILESET_NAME, TILES_KEY)!;
    const world: Phaser.GameObjects.GameObject[] = [];
    for (const layer of json.layers) {
      if (layer.type !== "tilelayer" || layer.visible === false) continue;
      const drawn = tilemap.createLayer(layer.name, tileset);
      if (drawn) world.push(drawn);
    }

    const ts = this.map.tileSize;
    // Plots and forage sit on the tiles, under the player.
    this.ground = this.add.graphics();
    this.sprites = this.add.container(0, 0);
    this.wash = this.add.graphics();
    world.push(this.ground, this.sprites, this.wash);
    const spawn = this.map.entry(this.entryName)!;
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
    this.hud = new Hud(
      this,
      (i) => this.select(i),
      () => this.use(),
      () => this.eatHeld(),
      () => this.open("skills"),
      () => this.select(nextRow(this.state, this.selected)),
    );
    this.controls = new Controls(this, (p) => this.hud.covers(p.x, p.y));
    const ui = [this.controls.stick, ...this.hud.objects];

    const { width, height } = this.scale.gameSize;
    const uiCamera = this.cameras.add(0, 0, width, height);
    this.uiCamera = uiCamera;
    uiCamera.ignore(world);
    // A map smaller than the view is centred rather than pinned to a corner.
    const mapW = this.map.width * ts;
    const mapH = this.map.height * ts;
    const viewW = width / WORLD_ZOOM;
    const viewH = height / WORLD_ZOOM;
    this.cameras.main
      .setBounds(
        Math.min(0, (mapW - viewW) / 2),
        Math.min(0, (mapH - viewH) / 2),
        Math.max(mapW, viewW),
        Math.max(mapH, viewH),
      )
      .setZoom(WORLD_ZOOM)
      .startFollow(this.player, true)
      .ignore(ui);

    this.cameras.main.fadeIn(FADE_MS);
    this.time.addEvent({
      delay: TICK_MS,
      loop: true,
      callback: () => {
        this.state.day.act(0, TICK_MINUTES);
        this.afterAction();
      },
    });
    const kb = this.input.keyboard;
    // Phaser can deliver one key press twice (seen after walking, in headless
    // Chromium), which used a tool twice. Run each press once per event.
    const seen = new Map<string, number>();
    const press = (name: string, run: () => void) =>
      kb?.on(`keydown-${name}`, (e: KeyboardEvent) => {
        if (seen.get(name) === e.timeStamp) return;
        seen.set(name, e.timeStamp);
        run();
      });
    press("SPACE", () => this.use());
    kb?.addCapture("TAB");
    press("TAB", () => this.select(nextRow(this.state, this.selected)));
    press("F", () => this.eatHeld());
    press("K", () => this.open("skills"));
    press("Z", () => this.endDay());
    press("Q", () =>
      this.select(cycle(this.selected, -1, toolbarSize(this.state))),
    );
    press("E", () =>
      this.select(cycle(this.selected, 1, toolbarSize(this.state))),
    );
    const digits = "ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,NINE".split(",");
    digits.forEach((name, i) => press(name, () => this.select(i)));
    // Restarting the scene keeps its event listeners, so drop this one on
    // shutdown or each map change would add another and run it twice.
    const resumed = (_sys: unknown, data?: { sleep?: boolean }) => {
      if (data?.sleep) return this.endDay();
      this.save();
      this.message = "";
      this.render();
    };
    this.events.on("resume", resumed);
    this.events.once("shutdown", () => this.events.off("resume", resumed));
    this.render();

    if (import.meta.env.DEV)
      (window as unknown as { farmGive: unknown }).farmGive = (
        id: string,
        n: number,
      ) => {
        this.state.inventory.add(id, n);
        this.render();
      };
    if (import.meta.env.DEV)
      (window as unknown as { farmDebug: () => unknown }).farmDebug = () => ({
        pos: this.pos,
        tile: tileOf(this.pos, PLAYER, ts),
        facing: this.facing,
        target: facingTile(this.pos, PLAYER, this.facing, ts),
        map: this.mapId,
        exit: this.exitId ?? null,
        zoom: this.cameras.main.zoom,
        energy: this.state.day.energy.current,
        plots: [...this.state.farm.each()].length,
        seeds: this.state.inventory.count("parsnip-seed"),
        harvested: this.state.inventory.count("parsnip"),
        message: this.message,
        day: this.state.day.clock.day,
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
    const exit = this.map.exitAt(here.x, here.y);
    if (exit?.id !== this.exitId) {
      this.exitId = exit?.id;
      this.message = exit && !exitOpen(exit, this.holds) ? "It is shut." : "";
      this.render();
      if (exit && exitOpen(exit, this.holds)) this.leave(exit);
    }
  }

  private leave(exit: Exit): void {
    if (this.leaving) return;
    this.leaving = true;
    const data: SceneData = { map: exit.map, entry: exit.entry };
    this.cameras.main.fadeOut(FADE_MS);
    this.cameras.main.once("camerafadeoutcomplete", () =>
      this.scene.restart(data),
    );
  }

  private select(index: number): void {
    if (index < 0 || index >= toolbarSize(this.state)) return;
    this.selected = index;
    this.registry.set(SELECTED_KEY, index);
    this.message = "";
    this.render();
  }

  /** Open a screen over the farm. The farm is paused until it closes. */
  private open(kind: string, data?: object): void {
    this.scene.launch(kind, data);
    this.scene.pause();
  }

  /** Use the held tool on the tile the player faces. */
  private use(): void {
    if (this.leaving) return;
    const front = facingTile(this.pos, PLAYER, this.facing, this.map.tileSize);
    const service = this.map.serviceAt(front.x, front.y);
    if (service?.kind === "festival") return this.openFestival();
    if (service)
      return this.open(
        service.kind,
        service.kind === "hall" ? { room: service.id } : undefined,
      );
    const held = heldAt(this.state, this.selected);
    const result = useHeld(this.state, this.map, held, front.x, front.y);
    if (!result.ok) {
      this.message = reasonText(result.reason);
    } else if (result.levelUp) {
      const { skill, level } = result.levelUp;
      this.message = `${skill} is now level ${level}.`;
    } else {
      this.message = "";
    }
    this.afterAction();
  }

  /** The festival green: open only while today's festival is on. */
  private openFestival(): void {
    const f = festivalToday(this.state.day.clock.day);
    if (f && festivalOpen(f, this.state.day.clock.minutes))
      return this.open("festival");
    if (!f) this.message = "The green is quiet today.";
    else if (this.state.day.clock.minutes >= f.closes)
      this.message = `${f.name} is over for today.`;
    else
      this.message = `${f.name} runs from ${clockText(f.opens)} to ${clockText(f.closes)}.`;
    this.render();
  }

  /** Eat the held item, if it is food. */
  private eatHeld(): void {
    if (this.leaving) return;
    const held = heldAt(this.state, this.selected);
    const result =
      held.kind === "item"
        ? eat(this.state, held.id)
        : { ok: false as const, reason: "not food" };
    this.message = result.ok
      ? `Ate ${itemById(held.kind === "item" ? held.id : "")?.name.toLowerCase()}.`
      : reasonText(result.reason);
    this.afterAction();
  }

  private afterAction(): void {
    if (this.state.day.over) this.endDay();
    else if (pendingChoice(this.state.skills)) this.open("profession");
    else this.render();
  }

  /** Save to the browser. The clock is not saved, so a reload is a new morning. */
  private save(): void {
    saveGame(browserStore, this.state);
  }

  private endDay(): void {
    const g = this.state;
    const report = sleep(g, maps.get(START.map).forageSpots, Math.random);
    this.message = "";
    this.save();
    this.render();
    this.open("report", { report });
  }

  /** Draw plots, crops and forage on the tiles. */
  private drawGround(): void {
    this.ground.clear();
    this.sprites.removeAll(true);
    if (!this.map.hasSoil) return;
    const ts = this.map.tileSize;
    const put = (x: number, y: number, key: string) => {
      const image = this.add.image(x * ts, y * ts, key).setOrigin(0);
      this.uiCamera.ignore(image); // the UI camera does not draw the world
      this.sprites.add(image);
    };
    for (const { x, y, plot } of this.state.farm.each()) {
      put(x, y, soilKey(plot.wateredToday));
      const crop = plot.crop;
      const def = crop && cropById(crop.id);
      if (!crop || !def) continue;
      const stage = stageOf(
        crop.daysGrown / def.growDays,
        this.state.farm.isRipe(x, y),
      );
      put(x, y, cropKey(crop.id, stage));
    }
    for (const { x, y, id } of this.state.forage.each())
      put(x, y, forageKey(id));
    this.drawBunting();
  }

  /** On a festival day, hang flags over the green so the village looks changed. */
  private drawBunting(): void {
    if (!festivalToday(this.state.day.clock.day)) return;
    const green = this.map.services.find((s) => s.kind === "festival");
    if (!green) return;
    const ts = this.map.tileSize;
    const colors = [0xd8503c, 0xf2d16b, 0x4a9fd8, 0x7ac05a];
    const g = this.ground;
    for (let i = -3; i <= 3; i++) {
      const x = (green.x + i) * ts;
      const y = (green.y - 1) * ts;
      g.fillStyle(0x6b4a2a).fillRect(x, y, ts, 2);
      g.fillStyle(colors[(i + 3) % colors.length]!).fillTriangle(
        x + 2,
        y + 2,
        x + ts - 2,
        y + 2,
        x + ts / 2,
        y + 10,
      );
    }
  }

  /**
   * The hall's progress display (docs/design/40_hall_layout.md): a room is
   * dim until it is done and warm after, a room that is not ready (locked or
   * with no bundles yet) is also greyed, and the plaque lights one mark per
   * finished room. Placeholder for the real ruined and restored tiles (#58).
   */
  private drawRooms(): void {
    const { regions, tileSize: ts } = this.map;
    this.wash.clear();
    const hall = this.state.hall;
    for (const r of regions) {
      if (r.id === "plaque") {
        hall.rooms.forEach((room, i) => {
          const lit = hall.roomComplete(room.id);
          this.wash
            .fillStyle(lit ? 0xf0c75e : 0x3a3028, 1)
            .fillRect((r.x + i) * ts + 3, r.y * ts + 5, ts - 6, ts - 10);
        });
        continue;
      }
      const status = hall.roomStatus(r.id);
      const [colour, alpha] =
        status === "done"
          ? [0xffd890, 0.12]
          : status === "ready"
            ? [0x1a1410, 0.4]
            : [0x606870, 0.6];
      this.wash
        .fillStyle(colour, alpha)
        .fillRect(r.x * ts, r.y * ts, r.w * ts, r.h * ts);
    }
  }

  private render(): void {
    this.drawGround();
    this.drawRooms();
    this.hud.update(this.state, this.selected, this.message);
  }
}
