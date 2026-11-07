import hatData from "../content/hats.json";

/**
 * Hats (`docs/design/10_customisation.md`): cosmetic only, drawn on the player.
 * Content lives in `src/content/hats.json`. A hat comes from a festival, as a
 * gift or from its counter (`festivals.ts`).
 */
export interface HatDef {
  id: string;
  name: string;
  /** Placeholder colour for the world sprite, as `#rrggbb`. */
  color: string;
}

export const HATS = hatData as HatDef[];

export function hatById(id: string): HatDef | undefined {
  return HATS.find((h) => h.id === id);
}

/** The hats the player owns and the one worn, if any. */
export class Wardrobe {
  private owned: string[] = [];
  worn: string | undefined = undefined;

  /** Owned hat ids, in the order they were got. */
  list(): string[] {
    return [...this.owned];
  }

  has(id: string): boolean {
    return this.owned.includes(id);
  }

  /** Add a hat. Returns false for an unknown hat or one already owned. */
  add(id: string): boolean {
    if (!hatById(id) || this.has(id)) return false;
    this.owned.push(id);
    return true;
  }

  /** Wear an owned hat, or undefined to go bare headed. False if not owned. */
  wear(id: string | undefined): boolean {
    if (id !== undefined && !this.has(id)) return false;
    this.worn = id;
    return true;
  }

  save(): WardrobeSave {
    return { owned: [...this.owned], worn: this.worn };
  }

  /** Restore from a save, dropping unknown hats and a worn hat not owned. */
  load(raw: unknown): void {
    this.owned = [];
    this.worn = undefined;
    if (typeof raw !== "object" || raw === null) return;
    const data = raw as Partial<WardrobeSave>;
    if (Array.isArray(data.owned))
      for (const id of data.owned) if (typeof id === "string") this.add(id);
    if (typeof data.worn === "string" && this.has(data.worn))
      this.worn = data.worn;
  }
}

export interface WardrobeSave {
  owned: string[];
  worn: string | undefined;
}
