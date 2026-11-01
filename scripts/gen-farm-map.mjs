// PLACEHOLDER. Writes a small Tiled-format farm map (JSON) so the scene work
// has something to walk on. The layout is throwaway and is not a design; see
// docs/design/05_farm_map_placeholder.md for what is undecided and for the map
// contract any real map must meet. Writes the farm, a small house interior and the village hall interior.
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
const BED = 10;
const SCROLL = 11;
const BIN = 12;

const idx = (x, y) => y * W + x;
const grid = () => new Array(W * H).fill(0);
const ground = grid();
const objects = grid();
const collision = grid();
const soil = grid();
const paths = grid();

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
const services = [];
const building = (x0, y0, w, h, doorX, doorY, service) => {
  for (let y = y0; y < y0 + h; y++)
    for (let x = x0; x < x0 + w; x++) {
      objects[idx(x, y)] = y === y0 ? ROOF : WALL;
      block(x, y);
    }
  objects[idx(doorX, doorY)] = DOOR;
  // A service door is faced and used, not walked through, so it stays blocked.
  if (service) services.push({ kind: service, x: doorX, y: doorY });
  else collision[idx(doorX, doorY)] = 0;
};
building(4, 2, 6, 4, 6, 5); // house, door on its south face
building(4, 22, 6, 4, 6, 22); // hall, door on its north face
building(31, 20, 6, 4, 33, 20, "shop"); // shop, door on its north face
building(31, 8, 6, 4, 33, 11); // sawmill (the carpenter), door on its south face

// The shipping bin (docs/design/28_shipping_bin.md): one blocked tile just
// outside the house, beside the door. The player faces it from the south.
objects[idx(8, 6)] = BIN;
block(8, 6);
services.push({ kind: "bin", x: 8, y: 6 });

// Dirt paths joining the doors.
const path = (x, y) => {
  if (!collision[idx(x, y)] && !objects[idx(x, y)]) {
    ground[idx(x, y)] = PATH;
    paths[idx(x, y)] = 1;
  }
};
for (let y = 6; y <= 21; y++) path(6, y);
for (let x = 6; x <= 33; x++) path(x, 19);
path(33, 19);
for (let y = 12; y <= 18; y++) path(33, y);

// Choppable trees (docs/design/43_wood_source.md): 30 hand-placed points, 8 of
// them on the soil patch and the rest on open grass. The player cuts these, so
// they are objects, not tiles. Kept off paths, the border and the ground around
// buildings. Stage 5 is mature, 4 young, 2 and 3 seedlings.
const trees = [];
const treeFree = (x, y, onSoil) =>
  x >= 1 &&
  x < W - 1 &&
  y >= 1 &&
  y < H - 1 &&
  !collision[idx(x, y)] &&
  !objects[idx(x, y)] &&
  (onSoil
    ? ground[idx(x, y)] === SOIL && y >= 14 // rows 11 to 13 stay clear for the playtests
    : ground[idx(x, y)] <= GRASS2) &&
  !(x >= 3 && x <= 10 && y >= 1 && y <= 27) &&
  !(x >= 30 && x <= 38 && y >= 7 && y <= 25) &&
  (onSoil || !(x >= 12 && x <= 27 && y >= 8 && y <= 20)) &&
  !trees.some((t) => Math.max(Math.abs(t.x - x), Math.abs(t.y - y)) < 2);
const placeTrees = (count, onSoil) => {
  for (let tries = 0, n = 0; n < count && tries < 20000; tries++) {
    const x = 1 + Math.floor(rnd() * (W - 2));
    const y = 1 + Math.floor(rnd() * (H - 2));
    if (!treeFree(x, y, onSoil)) continue;
    trees.push({ x, y, stage: 5 });
    n++;
  }
};
placeTrees(8, true);
placeTrees(22, false);
// A few are still growing. The rest are mature.
trees[3].stage = 4;
trees[14].stage = 4;
trees[25].stage = 3;

// Forage spots: free grass tiles, picked at random.
const forage = [];
for (let tries = 0; forage.length < 14 && tries < 5000; tries++) {
  const x = 1 + Math.floor(rnd() * (W - 2));
  const y = 1 + Math.floor(rnd() * (H - 2));
  if (
    ground[idx(x, y)] <= GRASS2 &&
    !collision[idx(x, y)] &&
    !objects[idx(x, y)] &&
    !trees.some((t) => t.x === x && t.y === y) &&
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
const service = (kind, x, y) => ({
  ...point("service", kind, x, y),
  properties: [{ name: "kind", type: "string", value: kind }],
});
// A service with its own name, so one map can hold several of one kind.
const service2 = (name, kind, x, y) => ({
  ...point("service", name, x, y),
  properties: [{ name: "kind", type: "string", value: kind }],
});
const treePoint = (x, y, stage) => ({
  ...point("tree", "tree", x, y),
  properties: [{ name: "stage", type: "int", value: stage }],
});
const exit = (name, x, y, target, entry) => ({
  id: objectId++,
  name,
  class: "exit",
  type: "exit",
  x: x * T,
  y: y * T,
  width: T,
  height: T,
  rotation: 0,
  visible: true,
  properties: [
    { name: "map", type: "string", value: target },
    { name: "entry", type: "string", value: entry },
  ],
});

const tileset = {
  firstgid: 1,
  name: "placeholder",
  tilewidth: T,
  tileheight: T,
  tilecount: 12,
  columns: 10,
  image: "placeholder-tiles.png",
  imagewidth: 12 * T,
  imageheight: T,
};

const farm = {
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
  nextlayerid: 8,
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
        point("entry", "start", 6, 7),
        point("entry", "from_house", 6, 6),
        exit("house", 6, 5, "house", "door"),
        point("entry", "from_hall", 6, 21),
        exit("hall", 6, 22, "hall", "door"),
        point("entry", "from_sawmill", 33, 12),
        exit("sawmill", 33, 11, "sawmill", "door"),
        ...services.map((s) => service(s.kind, s.x, s.y)),
        ...forage.map((f) => point("forage", "forage", f.x, f.y)),
        ...trees.map((t) => treePoint(t.x, t.y, t.stage)),
      ],
    },
    tileLayer(6, "paths", paths, false),
  ],
  tilesets: [tileset],
};

// The house interior (docs/design/41_house.md): one open space, 18 by 8, with the
// kitchen on the left (columns 1 to 4), the start room in the middle (5 to 12)
// and the bedroom on the right (13 to 16). The file is the fully open house. The
// scene seals the kitchen and bedroom regions with earth until the house tier
// opens them, so the map never changes between tiers.
const HW = 18;
const HH = 8;
const hground = new Array(HW * HH).fill(PATH);
const hcollision = new Array(HW * HH).fill(0);
for (let y = 0; y < HH; y++)
  for (let x = 0; x < HW; x++)
    if (x === 0 || y === 0 || x === HW - 1 || y === HH - 1) {
      hground[y * HW + x] = WALL;
      hcollision[y * HW + x] = 1;
    }
hground[(HH - 1) * HW + 9] = DOOR;
hcollision[(HH - 1) * HW + 9] = 0;
// A bed against the north wall. Use it from the tile below to sleep.
hground[1 * HW + 6] = BED;
hcollision[1 * HW + 6] = 1;
const hregion = (name, x, y, w, h) => ({
  ...point("region", name, x, y),
  width: w * T,
  height: h * T,
});

const house = {
  ...farm,
  width: HW,
  height: HH,
  layers: [
    { ...tileLayer(1, "ground", hground), width: HW, height: HH },
    { ...tileLayer(2, "collision", hcollision, false), width: HW, height: HH },
    {
      ...farm.layers[4],
      objects: [
        point("entry", "door", 9, HH - 2),
        exit("door", 9, HH - 1, "farm", "from_house"),
        service("bed", 6, 1),
        hregion("kitchen", 1, 1, 4, 6),
        hregion("start", 5, 1, 8, 6),
        hregion("bedroom", 13, 1, 4, 6),
      ],
    },
  ],
};

// The carpenter's sawmill (docs/design/41_house.md): a small room with the
// carpenter's counter on the back wall and the door at the bottom. It stands on
// the farm until Hearthwell has a river for it.
const SW = 10;
const SH = 7;
const sground = new Array(SW * SH).fill(PATH);
const scollision = new Array(SW * SH).fill(0);
for (let y = 0; y < SH; y++)
  for (let x = 0; x < SW; x++)
    if (x === 0 || y === 0 || x === SW - 1 || y === SH - 1) {
      sground[y * SW + x] = WALL;
      scollision[y * SW + x] = 1;
    }
sground[(SH - 1) * SW + 5] = DOOR;
scollision[(SH - 1) * SW + 5] = 0;
// The counter, used from the tile below.
sground[1 * SW + 5] = SCROLL;
scollision[1 * SW + 5] = 1;

const sawmill = {
  ...farm,
  width: SW,
  height: SH,
  layers: [
    { ...tileLayer(1, "ground", sground), width: SW, height: SH },
    { ...tileLayer(2, "collision", scollision, false), width: SW, height: SH },
    {
      ...farm.layers[4],
      objects: [
        point("entry", "door", 5, SH - 2),
        exit("door", 5, SH - 1, "farm", "from_sawmill"),
        service("carpenter", 5, 1),
      ],
    },
  ],
};

// The village hall interior (docs/design/40_hall_layout.md): a main room, a
// corridor to each side, four walled rooms off the corridors, and two alcoves
// (the tank on the main room's back wall, the board on a corridor wall). Each
// room has a scroll the player faces and uses. Each scroll opens its
// own room's panel. The door is at the bottom centre. Tile coordinates, mirrored about
// the centre line x = 23.5.
const LW = 48;
const LH = 20;
const lground = new Array(LW * LH).fill(WALL);
const lcollision = new Array(LW * LH).fill(1);
const open = (x, y) => {
  lground[y * LW + x] = PATH;
  lcollision[y * LW + x] = 0;
};
const rect = (x0, y0, x1, y1) => {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) open(x, y);
};
const both = (x0, y0, x1, y1) => {
  rect(x0, y0, x1, y1);
  rect(LW - 1 - x1, y0, LW - 1 - x0, y1);
};
rect(16, 6, 31, 16); // main room
rect(23, 17, 24, 18); // entrance nook
both(3, 10, 15, 11); // corridors, through the gap in the main room's side wall
both(6, 8, 7, 9); // passages up to the north rooms
both(6, 12, 7, 13); // passages down to the south rooms
both(3, 2, 10, 7); // Foragers' Shelf and the Hearth
both(3, 14, 10, 18); // Larder and The Last Seat
for (const x of [23, 24]) lground[(LH - 1) * LW + x] = DOOR;
for (const x of [23, 24]) lcollision[(LH - 1) * LW + x] = 0;
const scroll = (x, y) => {
  lground[y * LW + x] = SCROLL;
  lcollision[y * LW + x] = 1;
  return { x, y };
};
const scrolls = [
  ["foragers-shelf", scroll(4, 1)],
  ["larder", scroll(4, 13)],
  ["hearth", scroll(LW - 1 - 4, 1)],
  ["last-seat", scroll(LW - 1 - 4, 13)],
  ["water-room", scroll(28, 5)], // the tank, on the main room's back wall
  ["guests-board", scroll(LW - 1 - 12, 9)], // the board, on a corridor wall
];

// Each room's footprint, for the ruined and restored wash; "plaque" is the
// row of six marks on the main room's back wall, one per room.
const region = (name, x, y, w, h) => ({
  ...point("region", name, x, y),
  width: w * T,
  height: h * T,
});
const regions = [
  region("foragers-shelf", 3, 2, 8, 6),
  region("hearth", LW - 11, 2, 8, 6),
  region("larder", 3, 14, 8, 5),
  region("last-seat", LW - 11, 14, 8, 5),
  region("water-room", 26, 5, 6, 3),
  region("guests-board", LW - 14, 9, 3, 2),
  region("plaque", 20, 5, 6, 1),
];

const hall = {
  ...farm,
  width: LW,
  height: LH,
  layers: [
    { ...tileLayer(1, "ground", lground), width: LW, height: LH },
    { ...tileLayer(2, "collision", lcollision, false), width: LW, height: LH },
    {
      ...farm.layers[4],
      objects: [
        point("entry", "door", 23, LH - 2),
        { ...exit("door", 23, LH - 1, "farm", "from_hall"), width: 2 * T },
        ...scrolls.map(([name, s]) => service2(name, "hall", s.x, s.y)),
        ...regions,
      ],
    },
  ],
};

const dir = "src/content/maps";
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/farm.json`, JSON.stringify(farm));
writeFileSync(`${dir}/house.json`, JSON.stringify(house));
writeFileSync(`${dir}/sawmill.json`, JSON.stringify(sawmill));
writeFileSync(`${dir}/hall.json`, JSON.stringify(hall));
console.log(
  `wrote the farm, house, sawmill and hall maps in ${dir} (placeholders)`,
);
