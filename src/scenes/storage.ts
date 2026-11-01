import type { SaveStore } from "../core/save";
import type { SettingsStore } from "../core/bindings";

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

const SETTINGS_KEY = "beaver-valley-settings";

/** The settings record, kept per device and apart from the save. */
export const browserSettingsStore: SettingsStore = {
  read() {
    try {
      return localStorage.getItem(SETTINGS_KEY);
    } catch {
      return null;
    }
  },
  write(text) {
    try {
      localStorage.setItem(SETTINGS_KEY, text);
    } catch {
      // Play on with the settings unsaved.
    }
  },
};
