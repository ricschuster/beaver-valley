// Load a TypeScript sim file through Vite's module runner, so it can import
// src/core and the JSON content as the game does. Usage: node run.mjs <file> [args]
import { createServer } from "vite";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const [file, ...args] = process.argv.slice(2);
const server = await createServer({
  root,
  logLevel: "error",
  server: { middlewareMode: true, ws: false, watch: null },
  appType: "custom",
  optimizeDeps: { noDiscovery: true },
});
try {
  const mod = await server.ssrLoadModule(path.resolve(file));
  await mod.main(args);
} finally {
  await server.close();
}
