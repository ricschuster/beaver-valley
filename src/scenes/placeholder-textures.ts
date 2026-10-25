import Phaser from "phaser";

/**
 * Placeholder art, drawn at runtime so there are no art files. Throwaway: the
 * art pass (WP7) replaces it. The tile order must match the tileset in
 * scripts/gen-farm-map.mjs.
 */
export const TILES_KEY = "placeholder-tiles";
/** Must match the tileset name inside the map file. */
export const TILESET_NAME = "placeholder";
export const PLAYER_KEY = "player";
export const TILE = 16;

/** grass, grass2, path, water, soil, tree, wall, roof, door, bed */
const TILE_COLOURS = [
  "#3f7d3a",
  "#468a40",
  "#b59b6a",
  "#2f6fb0",
  "#7a5a36",
  "#1f4d25",
  "#8d7b6a",
  "#a0482e",
  "#f0c75e",
  "#c9a0dc",
];

export function makePlaceholderTextures(scene: Phaser.Scene): void {
  const tiles = scene.textures.createCanvas(
    TILES_KEY,
    TILE * TILE_COLOURS.length,
    TILE,
  )!;
  const ctx = tiles.getContext();
  TILE_COLOURS.forEach((colour, i) => {
    ctx.fillStyle = colour;
    ctx.fillRect(i * TILE, 0, TILE, TILE);
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(i * TILE + 3, 3, 2, 2);
  });
  tiles.refresh();

  const player = scene.textures.createCanvas(PLAYER_KEY, TILE, TILE)!;
  const g = player.getContext();
  g.fillStyle = "#f2d16b";
  g.fillRect(3, 2, 10, 12);
  g.fillStyle = "#222";
  g.fillRect(5, 5, 2, 2);
  g.fillRect(9, 5, 2, 2);
  player.refresh();
}
