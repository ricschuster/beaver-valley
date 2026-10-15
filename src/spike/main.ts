// Performance spike (ADR 0004). Throwaway: a large Tiled-format map, many
// moving sprites and a day tick, with an fps and memory overlay.
// Open /spike.html. Add ?sprites=500 to change the sprite count and
// ?zoom=2 to change the camera zoom. Drag (touch or mouse) to pan.
import Phaser from "phaser";
import { Clock } from "../core/clock";

const params = new URLSearchParams(location.search);
const SPRITE_COUNT = Number(params.get("sprites") ?? 300);
const ZOOM = Number(params.get("zoom") ?? 3);
const T = 16;

/** Tile colours: grass, grass2, dirt, water, tree, flower, stone. */
const TILE_COLOURS = [
  "#3f7d3a",
  "#468a40",
  "#8a6a3f",
  "#2f6fb0",
  "#1f4d25",
  "#d94f8c",
  "#8d8d8d",
];

class SpikeScene extends Phaser.Scene {
  private clock = new Clock();
  private sprites: { s: Phaser.GameObjects.Image; vx: number; vy: number }[] =
    [];
  private hud!: HTMLDivElement;
  private frames: number[] = [];
  private worst = 0;

  constructor() {
    super("spike");
  }

  preload(): void {
    this.load.tilemapTiledJSON("map", "spike/spike-map.json");
  }

  create(): void {
    // Tileset and sprite textures are drawn at runtime, so the spike has no art files.
    const tiles = this.textures.createCanvas("spike-tiles", T * 7, T)!;
    const ctx = tiles.getContext();
    TILE_COLOURS.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(i * T, 0, T, T);
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(i * T + 3, 3, 2, 2);
    });
    tiles.refresh();

    const guy = this.textures.createCanvas("guy", T, T)!;
    const g = guy.getContext();
    g.fillStyle = "#f2d16b";
    g.fillRect(3, 2, 10, 12);
    g.fillStyle = "#222";
    g.fillRect(5, 5, 2, 2);
    g.fillRect(9, 5, 2, 2);
    guy.refresh();

    const map = this.make.tilemap({ key: "map" });
    const set = map.addTilesetImage("spike", "spike-tiles")!;
    for (const name of ["ground", "decor", "objects"])
      map.createLayer(name, set);

    const w = map.widthInPixels;
    const h = map.heightInPixels;
    for (let i = 0; i < SPRITE_COUNT; i++) {
      const s = this.add.image(Math.random() * w, Math.random() * h, "guy");
      this.sprites.push({
        s,
        vx: (Math.random() - 0.5) * 60,
        vy: (Math.random() - 0.5) * 60,
      });
    }

    const cam = this.cameras.main;
    cam
      .setBounds(0, 0, w, h)
      .setZoom(ZOOM)
      .centerOn(w / 2, h / 2);

    // Drag to pan, and a slow automatic pan so a still screenshot is not the only test.
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (!p.isDown) return;
      cam.scrollX -= (p.x - p.prevPosition.x) / cam.zoom;
      cam.scrollY -= (p.y - p.prevPosition.y) / cam.zoom;
    });

    this.hud = document.createElement("div");
    this.hud.style.cssText =
      "position:fixed;left:8px;top:8px;padding:4px 8px;font:14px monospace;color:#fff;background:#000a;pointer-events:none";
    document.body.appendChild(this.hud);

    this.time.addEvent({
      delay: 250,
      loop: true,
      callback: () => {
        if (this.clock.advance(10)) this.clock.nextDay();
      },
    });
  }

  update(_t: number, dt: number): void {
    const cam = this.cameras.main;
    const w = cam.getBounds().width;
    const h = cam.getBounds().height;
    const sec = dt / 1000;
    for (const o of this.sprites) {
      o.s.x = Phaser.Math.Wrap(o.s.x + o.vx * sec, 0, w);
      o.s.y = Phaser.Math.Wrap(o.s.y + o.vy * sec, 0, h);
    }
    if (!this.input.activePointer.isDown) {
      cam.scrollX += 20 * sec * Math.sin(this.time.now / 4000);
      cam.scrollY += 12 * sec * Math.cos(this.time.now / 3000);
    }

    this.frames.push(dt);
    this.worst = Math.max(this.worst, dt);
    if (this.frames.length >= 30) {
      const avg = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
      const mem = (
        performance as unknown as { memory?: { usedJSHeapSize: number } }
      ).memory;
      const heap = mem
        ? `${(mem.usedJSHeapSize / 1048576).toFixed(0)} MB heap`
        : "heap n/a";
      const line = `${(1000 / avg).toFixed(0)} fps, worst frame ${this.worst.toFixed(0)} ms, ${this.sprites.length} sprites, ${heap}, Day ${this.clock.day} ${this.clock.format()}`;
      this.hud.textContent = line;
      (window as unknown as { spikeStats: unknown }).spikeStats = {
        fps: 1000 / avg,
        worst: this.worst,
        sprites: this.sprites.length,
      };
      this.frames = [];
      this.worst = 0;
    }
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#000",
  pixelArt: true,
  scale: { mode: Phaser.Scale.RESIZE },
  scene: [SpikeScene],
});
