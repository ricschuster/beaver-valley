// The input profiles (note 45): a mouse drag must not start the stick on the
// desktop profile, a held key must not move the player on the touch profile,
// and a rebound key must move the player (missing bindings stay default). About 20 seconds.
import {
  launch,
  Bot,
  TABLET,
  log,
  sleepMs,
  finding,
  findings,
} from "./lib.mjs";

const moved = (a, b) => Math.hypot(a.pos.x - b.pos.x, a.pos.y - b.pos.y) > 1;

// ---- desktop: the mouse does not move the player --------------------------
{
  const { b, p, errs } = await launch({ fresh: true });
  const bot = new Bot(p, errs);
  const before = await bot.dbg();
  // Press in the left half, where the touch stick would start, and drag.
  await p.mouse.move(200, 300);
  await p.mouse.down();
  await p.mouse.move(320, 300, { steps: 6 });
  await sleepMs(500);
  await p.mouse.up();
  const after = await bot.dbg();
  if (moved(before, after))
    finding(
      `desktop: a mouse drag moved the player ${JSON.stringify(after.pos)}`,
    );
  else log("desktop: a mouse drag leaves the player where it is");
  // The keyboard still works.
  await p.keyboard.down("KeyD");
  await sleepMs(400);
  await p.keyboard.up("KeyD");
  if (!moved(after, await bot.dbg())) finding("desktop: KeyD did not move");
  if (errs.length) finding(`desktop errors: ${errs.join(" | ")}`);
  await b.close();
}

// ---- desktop: a rebound key moves the player ------------------------------
{
  const bindings = { moveRight: "KeyL", moveLeft: "KeyJ" };
  const { b, p, errs } = await launch({ fresh: true, bindings });
  const bot = new Bot(p, errs);
  const start = await bot.dbg();
  await p.keyboard.down("KeyL");
  await sleepMs(400);
  await p.keyboard.up("KeyL");
  const east = await bot.dbg();
  if (east.pos.x <= start.pos.x) finding("rebound: KeyL did not move right");
  await p.keyboard.down("KeyD");
  await sleepMs(400);
  await p.keyboard.up("KeyD");
  if (moved(east, await bot.dbg()))
    finding("rebound: the old key KeyD still moves the player");
  else log("rebound: KeyL moves right and KeyD no longer does");
  if (errs.length) finding(`rebound errors: ${errs.join(" | ")}`);
  await b.close();
}

// ---- touch: the keyboard does not move the player -------------------------
{
  const { b, p, errs } = await launch({
    fresh: true,
    context: TABLET,
    profile: "touch",
  });
  const bot = new Bot(p, errs);
  const before = await bot.dbg();
  for (const k of ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowRight"]) {
    await p.keyboard.down(k);
    await sleepMs(300);
    await p.keyboard.up(k);
  }
  if (moved(before, await bot.dbg()))
    finding("touch: the keyboard moved the player");
  else log("touch: the keyboard leaves the player where it is");
  if (errs.length) finding(`touch errors: ${errs.join(" | ")}`);
  await b.close();
}

log(findings.length ? `${findings.length} findings` : "no findings");
process.exit(findings.length ? 1 : 0);
