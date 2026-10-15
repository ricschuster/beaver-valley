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
    const h24 = Math.floor(this.minutes / 60) % 24;
    const m = this.minutes % 60;
    const suffix = h24 >= 12 ? "pm" : "am";
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
  }
}
