import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
/** Screenshots, saves and logs go here. It is git-ignored. */
export const OUT = `${ROOT}playtest-out`;
fs.mkdirSync(`${OUT}/shots`, { recursive: true });
/** The dev server to play against. It must be `npm run dev`: the scripts use `window.farmDebug`. */
export const GAME_URL = process.env.BASE_URL ?? "http://localhost:5173/";
const map = JSON.parse(
  fs.readFileSync(`${ROOT}src/content/maps/farm.json`, "utf8"),
);
const W = map.width,
  H = map.height;
const col = map.layers.find((l) => l.name === "collision").data;
const blockedT = (x, y) =>
  x < 0 || y < 0 || x >= W || y >= H || col[y * W + x] !== 0;
const EXITS = new Set(["6,5"]);
export const isWalk = (x, y) => !blockedT(x, y) && !EXITS.has(`${x},${y}`);
const cx = (tx) => tx * 16 + 8;
const cy = (ty) => ty * 16 + 11;

export const sleepMs = (ms) => new Promise((r) => setTimeout(r, ms));
export const findings = [];
export function finding(msg) {
  findings.push(msg);
  log("FINDING: " + msg);
}
const t0 = Date.now();
export function log(...a) {
  const s = ((Date.now() - t0) / 1000).toFixed(0).padStart(5);
  console.log(`[${s}s]`, ...a);
}

/** A Galaxy Tab A 10.4 (SM-T500) in landscape: 1200x700 CSS pixels with browser bars. */
export const TABLET = {
  viewport: { width: 1200, height: 700 },
  deviceScaleFactor: 1.67,
  hasTouch: true,
  isMobile: true,
};

export async function launch({ fresh, context }) {
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });
  const p = await b.newPage(
    context ?? { viewport: { width: 960, height: 540 } },
  );
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") {
      const t = m.text();
      if (!/GL Driver Message|GPU stall/.test(t))
        errs.push(`${m.type()}: ${t}`);
    }
  });
  await p.route(/\/src\/main\.ts/, async (route) => {
    const res = await route.fetch();
    let t = await res.text();
    t = t.replace(
      /new Phaser\.Game\(|new [\w$]+\.Game\(/,
      (m) => "window.__game = " + m,
    );
    await route.fulfill({ response: res, body: t });
  });
  await p.goto(GAME_URL + (fresh ? "?new" : ""));
  await sleepMs(1500);
  return { b, p, errs };
}

export class Bot {
  constructor(p, errs) {
    this.p = p;
    this.errs = errs;
  }
  dbg() {
    return this.p.evaluate(() => window.farmDebug());
  }
  /** Live read of the game state. Used only to observe and verify. */
  snap() {
    return this.p.evaluate(() => {
      const g = window.__game;
      const s = g.registry.get("state");
      const scenes = g.scene.getScenes(true).map((x) => x.scene.key);
      return {
        scenes,
        day: s.day.clock.day,
        minutes: s.day.clock.minutes,
        energy: s.day.energy.current,
        over: s.day.over,
        money: s.money,
        weather: s.weather,
        endSeen: s.endSeen,
        inv: s.inventory.save(),
        plots: [...s.farm.each()].map(({ x, y, plot }) => ({
          x,
          y,
          ...plot,
          ripe: s.farm.isRipe(x, y),
        })),
        forage: [...s.forage.each()],
        hall: s.hall.save(),
        skills: s.skills.save(),
        selected: g.registry.get("selected") ?? 0,
      };
    });
  }
  count(snap, id) {
    return snap.inv.reduce((n, s) => (s && s.id === id ? n + s.count : n), 0);
  }
  async key(k, wait = 60) {
    await this.p.keyboard.press(k);
    await sleepMs(wait);
  }
  async shot(name) {
    await this.p.screenshot({
      path: `${OUT}/shots/${process.env.PERSONA ?? "expert"}-${name}.png`,
    });
  }

  async holdAxis(axis, target) {
    for (let i = 0; i < 3; i++) {
      const d = await this.dbg();
      const diff = target - d.pos[axis];
      if (Math.abs(diff) <= 2) return;
      const k =
        axis === "x"
          ? diff > 0
            ? "ArrowRight"
            : "ArrowLeft"
          : diff > 0
            ? "ArrowDown"
            : "ArrowUp";
      await this.p.keyboard.down(k);
      const limit = Date.now() + (Math.abs(diff) / 80) * 1000 + 1500;
      for (;;) {
        const c = (await this.dbg()).pos[axis];
        if ((diff > 0 && c >= target - 0.7) || (diff < 0 && c <= target + 0.7))
          break;
        if (Date.now() > limit) break;
      }
      await this.p.keyboard.up(k);
      await sleepMs(30);
    }
  }

  bfs(from, to) {
    const key = (x, y) => `${x},${y}`;
    const prev = new Map([[key(from.x, from.y), null]]);
    const q = [from];
    for (let i = 0; i < q.length; i++) {
      const c = q[i];
      if (c.x === to.x && c.y === to.y) break;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = c.x + dx,
          ny = c.y + dy,
          k = key(nx, ny);
        if (prev.has(k) || !isWalk(nx, ny)) continue;
        prev.set(k, c);
        q.push({ x: nx, y: ny });
      }
    }
    if (!prev.has(key(to.x, to.y))) return null;
    const path = [];
    for (let c = to; c; c = prev.get(key(c.x, c.y))) path.push(c);
    return path.reverse();
  }
  dist(from, to) {
    const p = this.bfs(from, to);
    return p ? p.length : Infinity;
  }

  async walkTo(tx, ty) {
    for (let attempt = 0; attempt < 4; attempt++) {
      const d = await this.dbg();
      if (d.map !== "farm") throw new Error("not on farm map: " + d.map);
      const path = this.bfs(d.tile, { x: tx, y: ty });
      if (!path)
        throw new Error(`no path ${JSON.stringify(d.tile)} -> ${tx},${ty}`);
      // split into straight runs
      let i = 0;
      while (i < path.length - 1) {
        const a = path[i];
        const dx = path[i + 1].x - a.x,
          dy = path[i + 1].y - a.y;
        let j = i + 1;
        while (
          j + 1 < path.length &&
          path[j + 1].x - path[j].x === dx &&
          path[j + 1].y - path[j].y === dy
        )
          j++;
        if (dx !== 0) await this.holdAxis("x", cx(path[j].x));
        else await this.holdAxis("y", cy(path[j].y));
        i = j;
      }
      await this.holdAxis("x", cx(tx));
      await this.holdAxis("y", cy(ty));
      const e = await this.dbg();
      if (e.tile.x === tx && e.tile.y === ty) return;
      log(`walkTo retry: at ${JSON.stringify(e.tile)} wanted ${tx},${ty}`);
    }
    throw new Error(`could not reach ${tx},${ty}`);
  }

  async face(dir) {
    const k = {
      up: "ArrowUp",
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight",
    }[dir];
    await this.p.keyboard.down(k);
    await sleepMs(45);
    await this.p.keyboard.up(k);
    await sleepMs(30);
  }

  async select(i) {
    if (i < 9) await this.key(String(i + 1));
    else {
      await this.key("9");
      for (let n = 8; n < i; n++) await this.key("e");
    }
    const s = (await this.snap()).selected;
    if (s !== i) throw new Error(`select ${i} got ${s}`);
  }

  /** Face a neighbour tile and use the held tool once. */
  async useToward(dir) {
    await this.face(dir);
    const before = await this.dbg();
    await this.key("Space", 90);
    return before;
  }

  /** Walk next to a target tile and use the held tool on it. */
  async useAt(tx, ty, prefer) {
    const cands = [
      { x: tx, y: ty + 1, dir: "up" },
      { x: tx, y: ty - 1, dir: "down" },
      { x: tx - 1, y: ty, dir: "right" },
      { x: tx + 1, y: ty, dir: "left" },
    ].filter((c) => isWalk(c.x, c.y));
    const d = await this.dbg();
    let best = null,
      bd = Infinity;
    for (const c of cands) {
      const dd =
        prefer && prefer.x === c.x && prefer.y === c.y
          ? -1
          : this.dist(d.tile, c);
      if (dd < bd) {
        bd = dd;
        best = c;
      }
    }
    if (!best) throw new Error(`no stand tile for ${tx},${ty}`);
    await this.walkTo(best.x, best.y);
    await this.face(best.dir);
    const f = await this.dbg();
    if (f.target.x !== tx || f.target.y !== ty) {
      log(
        `facing mismatch: target ${JSON.stringify(f.target)} wanted ${tx},${ty}`,
      );
      await this.walkTo(best.x, best.y);
      await this.face(best.dir);
    }
    await this.key("Space", 90);
    return best;
  }
}
