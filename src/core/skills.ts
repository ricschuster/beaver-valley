export const SKILLS = ["farming", "foraging"] as const;
export type Skill = (typeof SKILLS)[number];

/** Total XP needed to reach level 1 to 10. */
export const LEVEL_XP = [
  100, 380, 770, 1300, 2150, 3300, 4800, 6900, 10000, 15000,
];
export const MAX_LEVEL = LEVEL_XP.length;

/** XP for one forage pickup. */
export const FORAGE_XP = 7;

/** XP for harvesting a crop, rising with its value. */
export function harvestXp(sellPrice: number): number {
  return Math.floor(16 * Math.log(0.018 * sellPrice + 1));
}

/** Skills level by doing. No gates or perks yet. */
export class Skills {
  private xp: Record<Skill, number> = { farming: 0, foraging: 0 };

  save(): Record<Skill, number> {
    return { ...this.xp };
  }

  load(saved: Record<Skill, number>): void {
    this.xp = { ...saved };
  }

  xpOf(skill: Skill): number {
    return this.xp[skill];
  }

  level(skill: Skill): number {
    return LEVEL_XP.filter((need) => this.xp[skill] >= need).length;
  }

  /** Add XP. Returns the new level if it rose, otherwise undefined. */
  gain(skill: Skill, amount: number): number | undefined {
    const before = this.level(skill);
    this.xp[skill] += Math.max(amount, 0);
    const after = this.level(skill);
    return after > before ? after : undefined;
  }
}

export interface SkillRow {
  skill: Skill;
  level: number;
  xp: number;
  /** XP total for the next level, or undefined at the top. */
  next?: number;
}

/** Every skill with its level and progress, for the skills screen. */
export function skillRows(skills: Skills): SkillRow[] {
  return SKILLS.map((skill) => {
    const level = skills.level(skill);
    return { skill, level, xp: skills.xpOf(skill), next: LEVEL_XP[level] };
  });
}
