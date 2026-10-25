import { Clock, DAY_END } from "./clock";
import { Energy, MAX_ENERGY } from "./energy";

/** Passing out is a mild, recoverable loss: a little money and a later start. */
export const PASS_OUT_MONEY_COST = 50;
export const PASS_OUT_WAKE_MINUTES = 8 * 60;
export const PASS_OUT_WAKE_ENERGY = 75;

export type DayEnd =
  | { passedOut: false }
  | { passedOut: true; reason: "energy" | "time"; moneyLost: number };

/** One day: the clock and energy together. Money lives elsewhere and is passed in. */
export class Day {
  readonly clock = new Clock();
  readonly energy = new Energy();

  /** True once energy or time has run out, so the day must end. */
  get over(): boolean {
    return this.energy.empty || this.clock.minutes >= DAY_END;
  }

  /** Spend energy and time on an action. Returns true if the day is now over. */
  act(energy: number, minutes: number): boolean {
    this.energy.spend(energy);
    this.clock.advance(minutes);
    return this.over;
  }

  /**
   * End the day and start the next. Sleeping early (before the day is over)
   * is free and gives a full morning. Otherwise the player passes out.
   */
  end(money: number): DayEnd {
    const passedOut = this.over;
    const reason = this.energy.empty ? "energy" : "time";
    this.clock.nextDay();
    if (!passedOut) {
      this.energy.restore(MAX_ENERGY);
      return { passedOut: false };
    }
    this.clock.minutes = PASS_OUT_WAKE_MINUTES;
    this.energy.current = PASS_OUT_WAKE_ENERGY;
    return {
      passedOut: true,
      reason,
      moneyLost: Math.min(Math.max(money, 0), PASS_OUT_MONEY_COST),
    };
  }
}
