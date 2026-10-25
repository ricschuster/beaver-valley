import type { SaveStore } from "../core/save";

const KEY = "beaver-valley-save";

/** A save store backed by localStorage. Reads and writes never throw. */
export const browserStore: SaveStore = {
  read() {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  write(text) {
    try {
      localStorage.setItem(KEY, text);
    } catch {
      // Private windows and full storage can refuse a write. Play on unsaved.
    }
  },
};
