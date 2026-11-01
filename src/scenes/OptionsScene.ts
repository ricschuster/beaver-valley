import Phaser from "phaser";
import {
  ACTIONS,
  keyLabel,
  rebind,
  resetAction,
  resetAll,
  saveSettings,
  swapBinding,
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
 * controls only: the profile, the touch scheme, and the desktop key list.
 * Choosing a key row waits for the next key press; a key already in use asks
 * before it swaps. Changes apply at once and are saved when the screen closes.
 */
export class OptionsScene extends Phaser.Scene {
  private settings!: Settings;
  private menu!: Menu;
  private message!: Phaser.GameObjects.Text;
  /** The action waiting for a key, if any. */
  private capturing: string | undefined;
  /** A key that is taken, waiting for the player to confirm the swap. */
  private clash: { action: string; other: string } | undefined;

  constructor() {
    super("options");
  }

  init(): void {
    this.settings = loadDeviceSettings();
    this.capturing = undefined;
    this.clash = undefined;
  }

  create(): void {
    const { message } = frame(this, "Options", () => this.escape());
    this.message = message;
    this.say("");
    this.add.text(
      24,
      516,
      "Up and Down: move   Enter: change a key   Right: default key   Esc: close",
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
    const idle = (f: () => void) => () => {
      if (!this.capturing && !this.clash) f();
    };
    kb?.on(
      "keydown-UP",
      idle(() => this.menu.move(-1)),
    );
    kb?.on(
      "keydown-DOWN",
      idle(() => this.menu.move(1)),
    );
    kb?.on(
      "keydown-LEFT",
      idle(() => this.menu.press(0)),
    );
    kb?.on(
      "keydown-RIGHT",
      idle(() => this.menu.press(1)),
    );
    kb?.on("keydown-ENTER", () => {
      if (this.clash) this.confirmSwap();
      else if (!this.capturing) this.menu.press(0);
    });
    kb?.on("keydown", (e: KeyboardEvent) => this.onKey(e));
  }

  private say(text: string): void {
    this.message.setText(
      text || "Changes are saved when you close this screen.",
    );
  }

  private label(id: string): string {
    return ACTIONS.find((a) => a.id === id)?.label ?? id;
  }

  /** Esc backs out of a key prompt first, and closes the screen otherwise. */
  private escape(): void {
    if (this.capturing || this.clash) {
      this.capturing = undefined;
      this.clash = undefined;
      this.say("");
      return;
    }
    this.close();
  }

  private startCapture(action: string): void {
    this.clash = undefined;
    this.capturing = action;
    this.say(`Press a key for "${this.label(action)}". Esc: cancel`);
  }

  private onKey(e: KeyboardEvent): void {
    if (!this.capturing || this.clash) return;
    e.preventDefault();
    if (e.code === "Escape") return;
    const action = this.capturing;
    const r = rebind(this.settings.bindings, action, e.code);
    if (r.kind === "ok") {
      this.settings.bindings = r.bindings;
      this.capturing = undefined;
      this.say(`${this.label(action)} is now ${keyLabel(e.code)}.`);
      this.refresh();
    } else if (r.kind === "reserved") {
      this.say(`${keyLabel(e.code)} cannot be used. Press another key.`);
    } else if (r.kind === "conflict") {
      this.capturing = undefined;
      this.clash = { action, other: r.with };
      this.say(
        `${keyLabel(e.code)} is used by "${this.label(r.with)}". Enter: swap   Esc: cancel`,
      );
    }
  }

  private confirmSwap(): void {
    const c = this.clash;
    if (!c) return;
    this.settings.bindings = swapBinding(
      this.settings.bindings,
      c.action,
      c.other,
    );
    this.clash = undefined;
    this.say(
      `Swapped: ${this.label(c.action)} is now ${keyLabel(this.settings.bindings[c.action] ?? "")}.`,
    );
    this.refresh();
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
            this.capturing = undefined;
            this.clash = undefined;
            this.say("");
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
          buttons: [
            { text: "Change", run: () => this.startCapture(a.id) },
            {
              text: "Default",
              run: () => {
                s.bindings = resetAction(s.bindings, a.id);
                this.say(`${a.label} is back to ${keyLabel(a.key)}.`);
                this.refresh();
              },
            },
          ],
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
