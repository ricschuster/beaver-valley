// PLACEHOLDER. Writes a small Tiled-format farm map (JSON) so the scene work
// has something to walk on. The layout is throwaway and is not a design; see
// docs/design/05_farm_map_placeholder.md for what is undecided and for the map
// contract any real map must meet.
// Run: node scripts/gen-farm-map.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const W = 40;
const H = 30;
const T = 16;

// Deterministic pseudo-random so the file does not churn between runs.
let seed = 4242;
const rnd = () =>
  (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;

// Tileset ids (1-based in Tiled).
const GRASS = 1;
const GRASS2 = 2;
const PATH = 3;
const WATER = 4;
const SOIL = 5;
const TREE = 6;
const WALL = 7;
const ROOF = 8;
const DOOR = 9;

const idx = (x, y) => y * W + x;
const grid = () => new Array(W * H).fill(0);
const ground = grid();
const objects = grid();
const collision = grid();
const soil = grid();

for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) ground[idx(x, y)] = rnd() < 0.5 ? GRASS : GRASS2;

const block = (x, y) => (collision[idx(x, y)] = 1);

// A tree border.
for (let x = 0; x < W; x++)
  for (const y of [0, H - 1]) {
    objects[idx(x, y)] = TREE;
    block(x, y);
  }
for (let y = 0; y < H; y++)
  for (const x of [0, W - 1]) {
    objects[idx(x, y)] = TREE;
    block(x, y);
  }

// A pond.
for (let y = 3; y <= 8; y++)
  for (let x = 30; x <= 35; x++) {
    if (Math.hypot(x - 32.5, y - 5.5) > 3.2) continue;
    ground[idx(x, y)] = WATER;
    block(x, y);
  }

// A patch of soil that can be tilled.
for (let y = 10; y <= 17; y++)
  for (let x = 14; x <= 25; x++) {
    ground[idx(x, y)] = SOIL;
    soil[idx(x, y)] = 1;
  }

// Buildings: a block of wall with a door in one tile of the chosen row.
const building = (x0, y0, w, h, doorX, doorY) => {
  for (let y = y0; y < y0 + h; y++)
    for (let x = x0; x < x0 + w; x++) {
      objects[idx(x, y)] = y === y0 ? ROOF : WALL;
      block(x, y);
    }
  objects[idx(doorX, doorY)] = DOOR;
  collision[idx(doorX, doorY)] = 0;
};
building(4, 2, 6, 4, 6, 5); // house, door on its south face
building(4, 22, 6, 4, 6, 22); // hall, door on its north face
building(31, 20, 6, 4, 33, 20); // shop, door on its north face

// Dirt paths joining the doors.
const path = (x, y) => {
  if (!collision[idx(x, y)] && !objects[idx(x, y)]) ground[idx(x, y)] = PATH;
};
for (let y = 6; y <= 21; y++) path(6, y);
for (let x = 6; x <= 33; x++) path(x, 19);
path(33, 19);

// Scattered trees, kept off the soil, the paths and the area around buildings.
for (let y = 1; y < H - 1; y++)
  for (let x = 1; x < W - 1; x++) {
    const free =
      !collision[idx(x, y)] &&
      !objects[idx(x, y)] &&
      ground[idx(x, y)] <= GRASS2 &&
      !(x >= 3 && x <= 10 && y >= 1 && y <= 27) &&
      !(x >= 12 && x <= 27 && y >= 8 && y <= 20) &&
      !(x >= 30 && x <= 38 && y >= 18 && y <= 25);
    if (free && rnd() < 0.05) {
      objects[idx(x, y)] = TREE;
      block(x, y);
    }
  }

// Forage spots: free grass tiles, picked at random.
const forage = [];
for (let tries = 0; forage.length < 14 && tries < 5000; tries++) {
  const x = 1 + Math.floor(rnd() * (W - 2));
  const y = 1 + Math.floor(rnd() * (H - 2));
  if (
    ground[idx(x, y)] <= GRASS2 &&
    !collision[idx(x, y)] &&
    !objects[idx(x, y)] &&
    !forage.some((f) => f.x === x && f.y === y)
  )
    forage.push({ x, y });
}

const tileLayer = (id, name, data, visible = true) => ({
  id,
  name,
  type: "tilelayer",
  width: W,
  height: H,
  x: 0,
  y: 0,
  opacity: 1,
  visible,
  data,
});

let objectId = 1;
const point = (cls, name, x, y) => ({
  id: objectId++,
  name,
  class: cls,
  type: cls,
  x: x * T + T / 2,
  y: y * T + T / 2,
  width: 0,
  height: 0,
  point: true,
  rotation: 0,
  visible: true,
});
const door = (name, x, y) => ({
  id: objectId++,
  name,
  class: "door",
  type: "door",
  x: x * T,
  y: y * T,
  width: T,
  height: T,
  rotation: 0,
  visible: true,
});

const map = {
  type: "map",
  version: "1.10",
  tiledversion: "1.10.2",
  orientation: "orthogonal",
  renderorder: "right-down",
  infinite: false,
  width: W,
  height: H,
  tilewidth: T,
  tileheight: T,
  nextlayerid: 7,
  nextobjectid: 100,
  properties: [{ name: "placeholder", type: "bool", value: true }],
  layers: [
    tileLayer(1, "ground", ground),
    tileLayer(2, "objects", objects),
    tileLayer(3, "collision", collision, false),
    tileLayer(4, "soil", soil, false),
    {
      id: 5,
      name: "markers",
      type: "objectgroup",
      draworder: "topdown",
      opacity: 1,
      visible: true,
      x: 0,
      y: 0,
      objects: [
        point("spawn", "spawn", 6, 7),
        door("house", 6, 5),
        door("hall", 6, 22),
        door("shop", 33, 20),
        ...forage.map((f) => point("forage", "forage", f.x, f.y)),
      ],
    },
  ],
  tilesets: [
    {
      firstgid: 1,
      name: "placeholder",
      tilewidth: T,
      tileheight: T,
      tilecount: 9,
      columns: 9,
      image: "placeholder-tiles.png",
      imagewidth: 9 * T,
      imageheight: T,
    },
  ],
};

mkdirSync("public/maps", { recursive: true });
writeFileSync("public/maps/farm-placeholder.json", JSON.stringify(map));
console.log(
  `wrote public/maps/farm-placeholder.json (${W}x${H} tiles, placeholder)`,
);
