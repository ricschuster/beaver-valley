/** Game day clock. Time is whole minutes since midnight; the day runs 06:00 to 26:00 (2am). */
export const DAY_START = 6 * 60;
export const DAY_END = 26 * 60;

export class Clock {
  day = 1;
  minutes = DAY_START;

  /** Advance by n game minutes. Returns true if the day just ended. */
  advance(n: number): boolean {
    this.minutes = Math.min(this.minutes + n, DAY_END);
    return this.minutes >= DAY_END;
  }

  /** Start the next day at the morning time. */
  nextDay(): void {
    this.day += 1;
    this.minutes = DAY_START;
  }

  /** Clock text such as "6:00 am". */
  format(): string {
    return clockText(this.minutes);
  }
}

/** Clock text such as "6:00 am" for minutes since midnight. */
export function clockText(minutes: number): string {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const suffix = h24 >= 12 ? "pm" : "am";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Minutes since midnight when night falls, by season: 8 pm, 8 pm, 7 pm, 6 pm (note 07). */
export const NIGHTFALL: Record<string, number> = {
  spring: 20 * 60,
  summer: 20 * 60,
  fall: 19 * 60,
  winter: 18 * 60,
};

/** Minutes over which the light fades, ending at nightfall plus this much. */
export const DUSK_MINUTES = 90;

/** How dark it is outdoors, 0 (day) to 1 (full night), fading in from an hour before nightfall. */
export function darkness(season: string, minutes: number): number {
  const fall = NIGHTFALL[season] ?? NIGHTFALL.spring!;
  const start = fall - 60;
  return Math.min(Math.max((minutes - start) / DUSK_MINUTES, 0), 1);
}
