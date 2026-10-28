// Builds docs/overview.html from docs/overview.json.
//   node scripts/overview/build.mjs          write the page
//   node scripts/overview/build.mjs --check  validate and fail if the page is stale
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const dataPath = join(root, "docs/overview.json");
const outPath = join(root, "docs/overview.html");
const issuesPath = join(root, "docs/overview-issues.json");
const designDir = join(root, "docs/design");
const STATUSES = ["decided", "proposed", "open"];
const BUILT = ["none", "partial", "done"];

export function issueNumbers(area) {
  const nums = new Set(area.issues ?? []);
  area.items.forEach((i) => i.issue && nums.add(i.issue));
  return [...nums].sort((a, b) => a - b);
}

export function validate(data, snapshot) {
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
    for (const n of issueNumbers(a)) {
      if (!snapshot.issues[n])
        errors.push(
          `${a.id}: issue #${n} not in the snapshot (npm run overview:refresh)`,
        );
    }
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

export function render(data, snapshot) {
  const full = {
    ...data,
    fetched: snapshot.fetched,
    issueInfo: snapshot.issues,
  };
  for (const a of full.areas) a.issueNums = issueNumbers(a);
  const json = JSON.stringify(full).replace(/</g, "\\u003c");
  const tpl = readFileSync(
    join(root, "scripts/overview/template.html"),
    "utf8",
  );
  return tpl.replace("/*DATA*/null", json);
}

function refresh() {
  const out = execFileSync(
    "gh",
    [
      "issue",
      "list",
      "--state",
      "all",
      "--limit",
      "500",
      "--json",
      "number,title,state,labels",
    ],
    { encoding: "utf8" },
  );
  const issues = {};
  for (const i of JSON.parse(out).sort((a, b) => a.number - b.number)) {
    issues[i.number] = {
      t: i.title,
      state: i.state.toLowerCase(),
      labels: i.labels.map((l) => l.name),
    };
  }
  const fetched = new Date().toISOString().slice(0, 10);
  writeFileSync(
    issuesPath,
    JSON.stringify({ fetched, issues }, null, 2) + "\n",
  );
  console.log(`overview: refreshed ${Object.keys(issues).length} issues`);
}

function main() {
  if (process.argv.includes("--refresh")) refresh();
  const data = JSON.parse(readFileSync(dataPath, "utf8"));
  const snapshot = JSON.parse(readFileSync(issuesPath, "utf8"));
  const errors = validate(data, snapshot);
  if (errors.length) {
    console.error(errors.map((e) => `overview: ${e}`).join("\n"));
    process.exit(1);
  }
  const html = render(data, snapshot);
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
