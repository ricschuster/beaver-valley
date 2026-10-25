import type { TiledMapJson } from "../core/map";
import { MapRegistry } from "../core/maps";

const files = import.meta.glob<TiledMapJson>("./maps/*.json", {
  eager: true,
  import: "default",
});

/** Every map file in `./maps`, by id (the file name without extension). */
export const mapFiles: Record<string, TiledMapJson> = Object.fromEntries(
  Object.entries(files).map(([path, json]) => [
    path.replace(/^.*\/(.*)\.json$/, "$1"),
    json,
  ]),
);

export const maps = MapRegistry.fromTiled(mapFiles);
