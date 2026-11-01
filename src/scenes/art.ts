import Phaser from "phaser";
import { CROPS } from "../core/crops";
import { FORAGE } from "../core/forage";
import { seedId } from "../core/items";
import { splitQuality } from "../core/quality";

/**
 * All of the game's art, drawn in code at start up. Every picture here is
 * original work, so there are no art files and no third party licences (see
 * ASSET_LICENCES.md). Sprites are 16 by 16 pixels.
 */
export const SIZE = 16;

type Ctx = CanvasRenderingContext2D;

/** Small deterministic random numbers, so the art is the same on every run. */
function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

const px = (c: Ctx, colour: string, x: number, y: number, w = 1, h = 1) => {
  c.fillStyle = colour;
  c.fillRect(Math.round(x), Math.round(y), w, h);
};

function disc(c: Ctx, colour: string, cx: number, cy: number, r: number) {
  c.fillStyle = colour;
  for (let y = -r; y <= r; y++)
    for (let x = -r; x <= r; x++)
      if (x * x + y * y <= r * r + r * 0.6) c.fillRect(cx + x, cy + y, 1, 1);
}

// ---- tiles, in the order of the tileset in scripts/gen-farm-map.mjs

function speckle(
  c: Ctx,
  ox: number,
  seed: number,
  colours: string[],
  count: number,
) {
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const colour = colours[Math.floor(r() * colours.length)] as string;
    px(c, colour, ox + Math.floor(r() * SIZE), Math.floor(r() * SIZE));
  }
}

const TILE_PAINTERS: ((c: Ctx, ox: number) => void)[] = [
  // grass
  (c, ox) => {
    px(c, "#3f7d3a", ox, 0, SIZE, SIZE);
    speckle(c, ox, 11, ["#4a8c44", "#356f31", "#52964a"], 26);
    for (const [x, y] of [
      [3, 4],
      [10, 9],
      [6, 13],
    ] as const) {
      px(c, "#5aa152", ox + x, y - 1);
      px(c, "#5aa152", ox + x, y);
    }
  },
  // grass with flowers
  (c, ox) => {
    px(c, "#468a40", ox, 0, SIZE, SIZE);
    speckle(c, ox, 23, ["#4f9549", "#3d7d38"], 22);
    px(c, "#f4f0e0", ox + 4, 5);
    px(c, "#f2d24a", ox + 4, 6);
    px(c, "#f4f0e0", ox + 11, 11);
    px(c, "#e98ac0", ox + 12, 3);
  },
  // path
  (c, ox) => {
    px(c, "#b59b6a", ox, 0, SIZE, SIZE);
    speckle(c, ox, 37, ["#a68c5c", "#c4aa78", "#9a8253"], 30);
    px(c, "#8f7a50", ox + 5, 6, 2, 1);
    px(c, "#8f7a50", ox + 11, 12, 2, 1);
  },
  // water
  (c, ox) => {
    px(c, "#2f6fb0", ox, 0, SIZE, SIZE);
    px(c, "#3b80c4", ox, 3, SIZE, 1);
    px(c, "#3b80c4", ox, 10, SIZE, 1);
    px(c, "#8fc4f0", ox + 2, 3, 3, 1);
    px(c, "#8fc4f0", ox + 9, 10, 4, 1);
    px(c, "#27609c", ox + 6, 7, 3, 1);
  },
  // soil
  (c, ox) => {
    px(c, "#7a5a36", ox, 0, SIZE, SIZE);
    speckle(c, ox, 41, ["#6b4e2d", "#876540", "#5e4327"], 30);
  },
  // tree (seen from above)
  (c, ox) => {
    px(c, "#2d6a2e", ox, 0, SIZE, SIZE);
    disc(c, "#1f4d25", ox + 8, 8, 7);
    disc(c, "#2a6b31", ox + 6, 6, 4);
    disc(c, "#3c8a40", ox + 5, 5, 2);
    px(c, "#14381a", ox + 11, 12, 2, 1);
  },
  // wall
  (c, ox) => {
    px(c, "#8d7b6a", ox, 0, SIZE, SIZE);
    for (let row = 0; row < 4; row++) {
      px(c, "#6f5f50", ox, row * 4 + 3, SIZE, 1);
      const off = row % 2 === 0 ? 4 : 0;
      px(c, "#6f5f50", ox + off + 4, row * 4, 1, 3);
      px(c, "#6f5f50", ox + off + 12, row * 4, 1, 3);
      px(c, "#9d8b7a", ox + 1, row * 4, 3, 1);
    }
  },
  // roof
  (c, ox) => {
    px(c, "#a0482e", ox, 0, SIZE, SIZE);
    for (let row = 0; row < 4; row++) {
      px(c, "#7d3622", ox, row * 4 + 3, SIZE, 1);
      for (let x = (row % 2) * 4; x < SIZE; x += 8)
        px(c, "#b85a3e", ox + x, row * 4, 3, 1);
    }
  },
  // door
  (c, ox) => {
    px(c, "#7a4f24", ox, 0, SIZE, SIZE);
    px(c, "#a8733a", ox + 1, 1, SIZE - 2, SIZE - 1);
    for (const x of [5, 10]) px(c, "#8a5c2a", ox + x, 1, 1, SIZE - 1);
    px(c, "#f0c75e", ox + 12, 9, 2, 2);
  },
  // bed
  (c, ox) => {
    px(c, "#7a4f24", ox, 0, SIZE, SIZE);
    px(c, "#c9a0dc", ox + 1, 4, SIZE - 2, SIZE - 5);
    px(c, "#b088c8", ox + 1, 9, SIZE - 2, 1);
    px(c, "#f4f0f8", ox + 2, 1, SIZE - 4, 4);
    px(c, "#d8d0e0", ox + 2, 4, SIZE - 4, 1);
  },
  // scroll, on a wall: a rolled sheet with ribbon ends
  (c, ox) => {
    px(c, "#8d7b6a", ox, 0, SIZE, SIZE);
    px(c, "#f0e6c8", ox + 3, 3, SIZE - 6, SIZE - 6);
    px(c, "#d8c9a0", ox + 3, 3, SIZE - 6, 1);
    px(c, "#d8c9a0", ox + 3, SIZE - 4, SIZE - 6, 1);
    px(c, "#a0482e", ox + 5, 6, SIZE - 10, 1);
    px(c, "#a0482e", ox + 5, 9, SIZE - 10, 1);
  },
  // shipping bin: a wooden crate with an open lid
  (c, ox) => {
    px(c, "#3f7d3a", ox, 0, SIZE, SIZE);
    px(c, "#6f4a22", ox + 1, 3, SIZE - 2, SIZE - 4);
    px(c, "#a8733a", ox + 2, 5, SIZE - 4, SIZE - 7);
    px(c, "#2a1a0a", ox + 3, 6, SIZE - 6, 3);
    px(c, "#c28a48", ox + 1, 2, SIZE - 2, 2);
    px(c, "#8a5c2a", ox + 2, 11, SIZE - 4, 1);
  },
];

export function paintTiles(scene: Phaser.Scene, key: string): void {
  const tiles = scene.textures.createCanvas(
    key,
    SIZE * TILE_PAINTERS.length,
    SIZE,
  )!;
  const c = tiles.getContext();
  TILE_PAINTERS.forEach((paint, i) => paint(c, i * SIZE));
  tiles.refresh();
}

// ---- tilled soil, drawn over the soil tile

export const soilKey = (wet: boolean) => (wet ? "soil-wet" : "soil-dry");

function paintSoil(scene: Phaser.Scene, wet: boolean): void {
  const t = scene.textures.createCanvas(soilKey(wet), SIZE, SIZE)!;
  const c = t.getContext();
  const [base, furrow, ridge, dot] = wet
    ? ["#4e3722", "#3c2a19", "#5c4128", "#6a4d31"]
    : ["#9a7a4c", "#7f6339", "#ad8d5c", "#b89868"];
  px(c, base, 0, 0, SIZE, SIZE);
  for (const y of [3, 8, 13]) {
    px(c, furrow, 1, y, SIZE - 2, 1);
    px(c, ridge, 1, y - 1, SIZE - 2, 1);
  }
  speckle(c, 0, wet ? 53 : 47, [dot, furrow], 10);
  // a darker edge so neighbouring plots read as separate beds
  px(c, furrow, 0, 0, SIZE, 1);
  px(c, furrow, 0, SIZE - 1, SIZE, 1);
  px(c, furrow, 0, 0, 1, SIZE);
  px(c, furrow, SIZE - 1, 0, 1, SIZE);
  t.refresh();
}

// ---- the frame menu screens and the toolbar sit in

export const UI_FRAME_KEY = "ui-frame";
/** Width of the frame's border in the texture, for a nine slice. */
export const UI_FRAME_EDGE = 8;

/** Safe to call twice: screens opened before the farm need the frame too. */
export function paintUiFrame(scene: Phaser.Scene): void {
  if (scene.textures.exists(UI_FRAME_KEY)) return;
  const size = UI_FRAME_EDGE * 2 + 8;
  const t = scene.textures.createCanvas(UI_FRAME_KEY, size, size)!;
  const c = t.getContext();
  px(c, "#5a3d1e", 0, 0, size, size); // wood rim
  px(c, "#8a5c2a", 1, 1, size - 2, size - 2);
  px(c, "#a8733a", 2, 2, size - 4, 1); // light edge on top and left
  px(c, "#a8733a", 2, 2, 1, size - 4);
  px(c, "#6b4a24", 2, size - 3, size - 4, 1); // shade on bottom and right
  px(c, "#6b4a24", size - 3, 2, 1, size - 4);
  px(c, "#f0c75e", 3, 3, 1, 1); // a brass stud in each corner
  px(c, "#f0c75e", size - 4, 3, 1, 1);
  px(c, "#f0c75e", 3, size - 4, 1, 1);
  px(c, "#f0c75e", size - 4, size - 4, 1, 1);
  px(
    c,
    "#10201a",
    UI_FRAME_EDGE,
    UI_FRAME_EDGE,
    size - UI_FRAME_EDGE * 2,
    size - UI_FRAME_EDGE * 2,
  );
  t.refresh();
}

// ---- the player

export function paintPlayer(scene: Phaser.Scene, key: string): void {
  const t = scene.textures.createCanvas(key, SIZE, SIZE)!;
  const c = t.getContext();
  px(c, "#5a3a1e", 4, 1, 8, 3); // hair
  px(c, "#f0c8a0", 5, 4, 6, 4); // face
  px(c, "#5a3a1e", 4, 3, 1, 3);
  px(c, "#5a3a1e", 11, 3, 1, 3);
  px(c, "#222222", 6, 5);
  px(c, "#222222", 9, 5);
  px(c, "#3f6fb8", 4, 8, 8, 5); // shirt
  px(c, "#2f528c", 4, 12, 8, 1);
  px(c, "#f0c8a0", 3, 9, 1, 3); // arms
  px(c, "#f0c8a0", 12, 9, 1, 3);
  px(c, "#4a3a2a", 5, 13, 3, 2); // boots
  px(c, "#4a3a2a", 8, 13, 3, 2);
  t.refresh();
}

// ---- crops

interface Palette {
  fruit: string;
  leaf: string;
}

const CROP_COLOURS: Record<string, Palette> = {
  parsnip: { fruit: "#f1e4b8", leaf: "#5aa83a" },
  potato: { fruit: "#c49a5a", leaf: "#4a9a3a" },
  cauliflower: { fruit: "#f4f4ec", leaf: "#5aa83a" },
  melon: { fruit: "#9bd45c", leaf: "#3f8f35" },
  tomato: { fruit: "#d9432f", leaf: "#3f8f35" },
  radish: { fruit: "#d94a7a", leaf: "#4a9a3a" },
  "green-bean": { fruit: "#7ac84a", leaf: "#3a8a30" },
  kale: { fruit: "#2f7f3f", leaf: "#2a6f38" },
  garlic: { fruit: "#efe9dc", leaf: "#6ab040" },
  "hot-pepper": { fruit: "#d92f1f", leaf: "#3f8f35" },
  corn: { fruit: "#f0d040", leaf: "#5aa83a" },
  "red-cabbage": { fruit: "#8a3a8a", leaf: "#4a9a3a" },
};
const FALLBACK: Palette = { fruit: "#e0c040", leaf: "#5aa83a" };

/** Growth stages drawn per crop: seedling, sprout, leafy, ripe. */
export const CROP_STAGES = 4;

export const cropKey = (id: string, stage: number) => `crop-${id}-${stage}`;

/** The stage to draw for a crop that has grown `fraction` of the way, or is ripe. */
export function stageOf(fraction: number, ripe: boolean): number {
  return ripe ? CROP_STAGES - 1 : Math.min(Math.floor(fraction * 3), 2);
}

function paintCrop(scene: Phaser.Scene, id: string): void {
  const pal = CROP_COLOURS[id] ?? FALLBACK;
  for (let stage = 0; stage < CROP_STAGES; stage++) {
    const t = scene.textures.createCanvas(cropKey(id, stage), SIZE, SIZE)!;
    const c = t.getContext();
    const dark = "#2d6a2e";
    if (stage === 0) {
      px(c, pal.leaf, 7, 11, 2, 2);
      px(c, dark, 7, 13);
    } else if (stage === 1) {
      px(c, dark, 8, 8, 1, 6);
      px(c, pal.leaf, 5, 8, 3, 2);
      px(c, pal.leaf, 9, 7, 3, 2);
    } else if (stage === 2) {
      px(c, dark, 8, 5, 1, 9);
      px(c, pal.leaf, 4, 5, 4, 2);
      px(c, pal.leaf, 9, 4, 4, 2);
      px(c, pal.leaf, 5, 9, 3, 2);
      px(c, pal.leaf, 9, 9, 3, 2);
    } else {
      px(c, dark, 8, 6, 1, 8);
      px(c, pal.leaf, 4, 5, 4, 2);
      px(c, pal.leaf, 9, 5, 4, 2);
      disc(c, pal.fruit, 5, 11, 2);
      disc(c, pal.fruit, 11, 10, 2);
      disc(c, pal.fruit, 8, 4, 2);
      px(c, "#ffffff55", 4, 10);
      px(c, "#ffffff55", 10, 9);
    }
    t.refresh();
  }
}

// ---- forage

const FORAGE_COLOURS: Record<string, string> = {
  daffodil: "#f6d83a",
  leek: "#c8e0a0",
  dandelion: "#f4e04a",
  horseradish: "#d8d0a8",
  grape: "#7a3a9a",
  "spice-berry": "#d03a2a",
  "sweet-pea": "#e98ac0",
  "spring-onion": "#a8d878",
  salmonberry: "#f08a3a",
  "fiddlehead-fern": "#3a9a4a",
};

export const forageKey = (id: string) => `forage-${id}`;

function paintForage(scene: Phaser.Scene, id: string): void {
  const colour = FORAGE_COLOURS[id] ?? "#e58fd0";
  const t = scene.textures.createCanvas(forageKey(id), SIZE, SIZE)!;
  const c = t.getContext();
  if (id === "fiddlehead-fern") {
    px(c, colour, 8, 7, 1, 7);
    px(c, colour, 8, 5, 3, 1);
    px(c, colour, 10, 6, 1, 2);
    px(c, "#2a7a38", 6, 9, 2, 1);
  } else if (id === "leek" || id === "spring-onion") {
    px(c, "#3a8a30", 6, 5, 1, 6);
    px(c, "#3a8a30", 9, 4, 1, 7);
    px(c, colour, 6, 11, 4, 3);
    px(c, "#ffffff", 7, 13, 2, 1);
  } else if (id === "horseradish") {
    px(c, "#4a9a3a", 5, 4, 3, 5);
    px(c, "#4a9a3a", 9, 5, 3, 4);
    px(c, colour, 7, 10, 2, 4);
  } else {
    px(c, "#3a8a30", 8, 8, 1, 6);
    px(c, "#4a9a3a", 5, 11, 3, 1);
    px(c, "#4a9a3a", 9, 10, 3, 1);
    for (const [x, y] of [
      [6, 5],
      [10, 6],
      [8, 3],
      [7, 8],
    ] as const)
      disc(c, colour, x, y, 1);
    px(c, "#ffffff66", 6, 4);
  }
  t.refresh();
}

// ---- item and tool icons for the toolbar

export const TOOL_ICONS = {
  hoe: "icon-hoe",
  can: "icon-can",
  axe: "icon-axe",
  hand: "icon-hand",
};

function paintToolIcons(scene: Phaser.Scene): void {
  const draw = (key: string, paint: (c: Ctx) => void) => {
    const t = scene.textures.createCanvas(key, SIZE, SIZE)!;
    paint(t.getContext());
    t.refresh();
  };
  draw(TOOL_ICONS.hoe, (c) => {
    px(c, "#8a5c2a", 7, 2, 2, 12);
    px(c, "#b8bcc4", 4, 2, 8, 2);
    px(c, "#8a8e96", 4, 4, 2, 1);
  });
  draw(TOOL_ICONS.can, (c) => {
    px(c, "#5a8ec0", 3, 6, 8, 7);
    px(c, "#3f6f9c", 3, 12, 8, 1);
    px(c, "#5a8ec0", 11, 4, 3, 2);
    px(c, "#5a8ec0", 12, 3, 3, 1);
    px(c, "#8fc4f0", 4, 7, 2, 1);
    px(c, "#3f6f9c", 4, 4, 5, 1);
    px(c, "#3f6f9c", 4, 5, 1, 1);
    px(c, "#3f6f9c", 8, 5, 1, 1);
  });
  draw(TOOL_ICONS.axe, (c) => {
    px(c, "#8a5c2a", 7, 3, 2, 11);
    px(c, "#b8bcc4", 3, 2, 5, 5);
    px(c, "#8a8e96", 3, 6, 5, 1);
    px(c, "#d8dce4", 4, 3, 2, 1);
  });
  draw(TOOL_ICONS.hand, (c) => {
    px(c, "#f0c8a0", 5, 7, 7, 6);
    for (const x of [5, 7, 9, 11]) px(c, "#f0c8a0", x, 3, 1, 5);
    px(c, "#d8a878", 5, 12, 7, 1);
  });
}

function paintSeedIcon(scene: Phaser.Scene, cropId: string): void {
  const pal = CROP_COLOURS[cropId] ?? FALLBACK;
  const t = scene.textures.createCanvas(`icon-${seedId(cropId)}`, SIZE, SIZE)!;
  const c = t.getContext();
  px(c, "#e8dcc0", 3, 2, 10, 12);
  px(c, "#c8bc9c", 3, 2, 10, 1);
  px(c, pal.fruit, 5, 5, 6, 4);
  px(c, pal.leaf, 6, 10, 4, 2);
  t.refresh();
}

// ---- trees and tree goods

export const treeKey = (stage: number, stump: boolean) =>
  stump ? "tree-stump" : `tree-${stage}`;

function paintTrees(scene: Phaser.Scene): void {
  const draw = (key: string, paint: (c: Ctx) => void) => {
    const t = scene.textures.createCanvas(key, SIZE, SIZE)!;
    paint(t.getContext());
    t.refresh();
  };
  // A seed in the ground: a pale mound and a speck.
  draw(treeKey(1, false), (c) => {
    px(c, "#6b4e2d", 6, 10, 4, 2);
    px(c, "#8a6a40", 7, 9, 2, 1);
    px(c, "#c9a24a", 7, 10, 2, 1);
  });
  // Seedlings: a stem with a few leaves.
  draw(treeKey(2, false), (c) => {
    px(c, "#5a3e22", 8, 9, 1, 5);
    px(c, "#4aa04a", 6, 8, 2, 2);
    px(c, "#4aa04a", 9, 7, 2, 2);
  });
  draw(treeKey(3, false), (c) => {
    px(c, "#5a3e22", 8, 7, 1, 7);
    disc(c, "#3c8a40", 8, 6, 3);
    disc(c, "#4aa04a", 7, 5, 1);
  });
  // A young tree: a thin trunk and a small crown.
  draw(treeKey(4, false), (c) => {
    px(c, "#5a3e22", 7, 9, 2, 6);
    disc(c, "#1f4d25", 8, 6, 5);
    disc(c, "#2a6b31", 7, 5, 3);
    disc(c, "#3c8a40", 6, 4, 1);
  });
  // A mature tree: the full crown over a trunk.
  draw(treeKey(5, false), (c) => {
    px(c, "#5a3e22", 7, 10, 3, 5);
    px(c, "#3e2a16", 9, 10, 1, 5);
    disc(c, "#1f4d25", 8, 7, 7);
    disc(c, "#2a6b31", 6, 5, 4);
    disc(c, "#3c8a40", 5, 4, 2);
    px(c, "#14381a", 11, 11, 2, 1);
  });
  draw(treeKey(5, true), (c) => {
    px(c, "#5a3e22", 4, 8, 8, 6);
    px(c, "#3e2a16", 4, 13, 8, 1);
    px(c, "#c9a470", 4, 7, 8, 2);
    px(c, "#a8844f", 6, 7, 4, 1);
    px(c, "#a8844f", 7, 8, 2, 1);
  });
  draw("icon-wood", (c) => {
    px(c, "#7a4e26", 2, 5, 12, 3);
    px(c, "#9a6a3a", 2, 5, 12, 1);
    px(c, "#7a4e26", 2, 9, 12, 3);
    px(c, "#9a6a3a", 2, 9, 12, 1);
    px(c, "#d9b27a", 2, 6, 1, 2);
    px(c, "#d9b27a", 2, 10, 1, 2);
  });
  draw("icon-sap", (c) => {
    px(c, "#e0a030", 7, 3, 2, 2);
    px(c, "#e0a030", 6, 5, 4, 5);
    px(c, "#e0a030", 7, 10, 2, 2);
    px(c, "#f8d878", 7, 6, 1, 3);
  });
  draw("icon-tree-seed", (c) => {
    px(c, "#7a5a2a", 5, 4, 6, 8);
    px(c, "#9a7a3a", 6, 3, 4, 2);
    px(c, "#5a3e1a", 5, 10, 6, 2);
    px(c, "#c9a24a", 7, 6, 1, 3);
  });
}

/** The texture key for a backpack item, or undefined if it has no picture. */
export function iconKey(itemId: string): string | undefined {
  const { base } = splitQuality(itemId);
  if (base === "wood" || base === "sap") return `icon-${base}`;
  if (base.endsWith("-seed")) return `icon-${base}`;
  if (CROPS.some((c) => c.id === base)) return cropKey(base, CROP_STAGES - 1);
  if (FORAGE.some((f) => f.id === base)) return forageKey(base);
  return undefined;
}

/** Make every texture the farm scene and the toolbar use. */
export function makeArt(
  scene: Phaser.Scene,
  tilesKey: string,
  playerKey: string,
) {
  paintTiles(scene, tilesKey);
  paintPlayer(scene, playerKey);
  paintSoil(scene, false);
  paintSoil(scene, true);
  paintUiFrame(scene);
  for (const c of CROPS) {
    paintCrop(scene, c.id);
    paintSeedIcon(scene, c.id);
  }
  for (const f of FORAGE) paintForage(scene, f.id);
  paintToolIcons(scene);
  paintTrees(scene);
}
