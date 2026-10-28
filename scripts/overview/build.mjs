// Builds docs/overview.html from docs/overview.json.
//   node scripts/overview/build.mjs          write the page
//   node scripts/overview/build.mjs --check  validate and fail if the page is stale
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const dataPath = join(root, "docs/overview.json");
const outPath = join(root, "docs/overview.html");
const designDir = join(root, "docs/design");
const STATUSES = ["decided", "proposed", "open"];
const BUILT = ["none", "partial", "done"];

export function validate(data) {
  const errors = [];
  const ids = new Set(data.areas.map((a) => a.id));
  const headings = new Map();
  const headingsOf = (file) => {
    if (!headings.has(file)) {
      headings.set(
        file,
        readFileSync(file, "utf8")
          .split("\n")
          .filter((l) => l.startsWith("#"))
          .map((l) => l.replace(/^#+\s*/, "").toLowerCase()),
      );
    }
    return headings.get(file);
  };
  if (ids.size !== data.areas.length) errors.push("duplicate area id");
  for (const a of data.areas) {
    if (!data.groups[a.group]) errors.push(`${a.id}: unknown group ${a.group}`);
    if (!BUILT.includes(a.built)) errors.push(`${a.id}: bad built value`);
    for (const d of a.deps) {
      if (!ids.has(d)) errors.push(`${a.id}: unknown dependency ${d}`);
    }
    for (const it of a.items) {
      if (!STATUSES.includes(it.s)) errors.push(`${a.id}: bad status ${it.s}`);
      if (it.issue !== undefined && !Number.isInteger(it.issue)) {
        errors.push(`${a.id}: issue must be a number`);
      }
      if (!it.ref) continue;
      const [file, heading] = it.ref.split("#");
      const path = join(designDir, file);
      if (!existsSync(path)) {
        errors.push(`${a.id}: missing note ${file}`);
      } else if (
        heading &&
        !headingsOf(path).some((h) => h.includes(heading.toLowerCase()))
      ) {
        errors.push(`${a.id}: no heading "${heading}" in ${file}`);
      }
    }
  }
  return errors;
}

export function render(data) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  const tpl = readFileSync(
    join(root, "scripts/overview/template.html"),
    "utf8",
  );
  return tpl.replace("/*DATA*/null", json);
}

function main() {
  const data = JSON.parse(readFileSync(dataPath, "utf8"));
  const errors = validate(data);
  if (errors.length) {
    console.error(errors.map((e) => `overview: ${e}`).join("\n"));
    process.exit(1);
  }
  const html = render(data);
  if (process.argv.includes("--check")) {
    if (!existsSync(outPath) || readFileSync(outPath, "utf8") !== html) {
      console.error(
        "overview: docs/overview.html is stale. Run npm run overview.",
      );
      process.exit(1);
    }
    console.log("overview: ok");
    return;
  }
  writeFileSync(outPath, html);
  console.log(
    `overview: wrote docs/overview.html (${data.areas.length} areas)`,
  );
}

main();
