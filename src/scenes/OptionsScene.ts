import Phaser from "phaser";
import {
  ACTIONS,
  keyLabel,
  resetAll,
  saveSettings,
  type Profile,
  type Settings,
  type TouchScheme,
} from "../core/bindings";
import { frame, Menu, type Row } from "./panel";
import { browserSettingsStore, loadDeviceSettings } from "./storage";

export const PROFILE_NAMES: Record<Profile, string> = {
  desktop: "Desktop",
  touch: "Touch",
};

const SCHEME_NAMES: Record<TouchScheme, string> = {
  tap: "Tap to move",
  stick: "Stick",
};

/**
 * The options screen, opened from the title (note 45 step 3). It holds the
 * controls only: the profile, the touch scheme, and the desktop key list (read
 * only until rebinding is built). Changes apply at once and are saved when the
 * screen closes.
 */
export class OptionsScene extends Phaser.Scene {
  private settings!: Settings;
  private menu!: Menu;

  constructor() {
    super("options");
  }

  init(): void {
    this.settings = loadDeviceSettings();
  }

  create(): void {
    const { message } = frame(this, "Options", () => this.close());
    message.setText("Changes are saved when you close this screen.");
    this.add.text(
      24,
      516,
      "Up and Down: move   Left and Right: choose   Enter: choose   Esc: close",
      { fontSize: "13px", color: "#ffffffaa" },
    );
    this.menu = new Menu(this, {
      x: 24,
      y: 64,
      w: 912,
      title: "Controls",
      visible: 8,
    });
    this.menu.setFocus(true);
    this.refresh();
    const kb = this.input.keyboard;
    kb?.on("keydown-UP", () => this.menu.move(-1));
    kb?.on("keydown-DOWN", () => this.menu.move(1));
    kb?.on("keydown-LEFT", () => this.menu.press(0));
    kb?.on("keydown-RIGHT", () => this.menu.press(1));
    kb?.on("keydown-ENTER", () => this.menu.press(0));
  }

  private mark(on: boolean, text: string): string {
    return on ? `[${text}]` : text;
  }

  private refresh(): void {
    const s = this.settings;
    const rows: Row[] = [
      {
        label: "Controls for this device",
        buttons: (Object.keys(PROFILE_NAMES) as Profile[]).map((p) => ({
          text: this.mark(s.profile === p, PROFILE_NAMES[p]),
          run: () => {
            s.profile = p;
            this.refresh();
          },
        })),
      },
    ];
    if (s.profile === "touch") {
      rows.push({
        label: "How to move",
        buttons: (Object.keys(SCHEME_NAMES) as TouchScheme[]).map((t) => ({
          text: this.mark(s.touchScheme === t, SCHEME_NAMES[t]),
          run: () => {
            s.touchScheme = t;
            this.refresh();
          },
        })),
      });
    } else {
      for (const a of ACTIONS) {
        rows.push({
          label: a.label,
          detail: keyLabel(s.bindings[a.id] ?? a.key),
          buttons: [],
        });
      }
      rows.push({
        label: "Reset all keys",
        buttons: [
          {
            text: "Reset",
            run: () => {
              s.bindings = resetAll();
              this.refresh();
            },
          },
        ],
      });
    }
    this.menu.setRows(rows);
  }

  private close(): void {
    saveSettings(browserSettingsStore, this.settings);
    this.scene.start("title");
  }
}
