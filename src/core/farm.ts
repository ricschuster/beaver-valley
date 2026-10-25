import { cropById } from "./crops";
import type { Season } from "./calendar";

export interface Plot {
  tilled: boolean;
  crop?: { id: string; daysGrown: number; harvests: number };
  wateredToday: boolean;
}

const key = (x: number, y: number) => `${x},${y}`;

/** The farm's soil and crops. Pure rules; the scene draws it. */
export class Farm {
  private plots = new Map<string, Plot>();

  /** Plots keyed by "x,y", as plain data. */
  save(): Record<string, Plot> {
    return structuredClone(Object.fromEntries(this.plots));
  }

  load(saved: Record<string, Plot>): void {
    this.plots = new Map(Object.entries(structuredClone(saved)));
  }

  plotAt(x: number, y: number): Plot | undefined {
    return this.plots.get(key(x, y));
  }

  /** Dig the ground. Returns false if it is already tilled. */
  till(x: number, y: number): boolean {
    if (this.plotAt(x, y)) return false;
    this.plots.set(key(x, y), { tilled: true, wateredToday: false });
    return true;
  }

  /** Plant a seed in tilled, empty soil. Fails out of season. */
  plant(x: number, y: number, cropId: string, season: Season): boolean {
    const plot = this.plotAt(x, y);
    const def = cropById(cropId);
    if (!plot || plot.crop || !def || !def.seasons.includes(season))
      return false;
    plot.crop = { id: cropId, daysGrown: 0, harvests: 0 };
    return true;
  }

  /** Water a plot. Returns false if there is nothing to water. */
  water(x: number, y: number): boolean {
    const plot = this.plotAt(x, y);
    if (!plot) return false;
    plot.wateredToday = true;
    return true;
  }

  /** Harvest a ripe crop. Returns the crop id, or undefined if not ripe. */
  harvest(x: number, y: number): string | undefined {
    const plot = this.plotAt(x, y);
    const crop = plot?.crop;
    const def = crop && cropById(crop.id);
    if (!plot || !crop || !def || crop.daysGrown < def.growDays)
      return undefined;
    if (def.regrowDays !== undefined) {
      crop.daysGrown = def.growDays - def.regrowDays;
      crop.harvests += 1;
    } else {
      delete plot.crop;
    }
    return def.id;
  }

  /**
   * Overnight: watered crops grow a day, then all plots dry out. Crops whose
   * season has ended wither. Pass the season of the new day.
   */
  endDay(newSeason: Season): void {
    for (const plot of this.plots.values()) {
      const crop = plot.crop;
      if (crop) {
        const def = cropById(crop.id);
        if (!def || !def.seasons.includes(newSeason)) delete plot.crop;
        else if (plot.wateredToday) crop.daysGrown += 1;
      }
      plot.wateredToday = false;
    }
  }
}
