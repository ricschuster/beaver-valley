import recipeData from "../content/recipes.json";
import { BUNDLES } from "./bundles";
import { itemById } from "./items";
import type { Skill } from "./skills";
import type { GameState } from "./save";

/**
 * Crafting (`docs/design/34_crafting.md`). Recipes are data in
 * `src/content/recipes.json`. A recipe is known when its source is met; build
 * 7 adds the other sources (shop, gifts, bundles), the workbench and chests.
 * A recipe whose ingredient item does not exist yet is not offered, so the
 * list can name items before they are built. Pure rules.
 */
export interface Ingredient {
  item: string;
  count: number;
}

export type RecipeSource =
  | { kind: "start" }
  | { kind: "level"; skill: Skill; level: number }
  /** Known once the hall bundle is finished (note 34: a bundle gives its machine and recipe together). */
  | { kind: "bundle"; bundle: string };

export interface Recipe {
  id: string;
  ingredients: Ingredient[];
  result: Ingredient;
  /** Any one source is enough to know the recipe. */
  sources: RecipeSource[];
}

export const RECIPES = recipeData as Recipe[];

export function recipeById(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}

/** True when every item in the recipe exists in the game. */
export function buildable(r: Recipe): boolean {
  return [...r.ingredients, r.result].every((i) => itemById(i.item));
}

/** True when the player has met the recipe's source. */
export function known(g: GameState, r: Recipe): boolean {
  return r.sources.some((s) =>
    s.kind === "start"
      ? true
      : s.kind === "level"
        ? g.skills.level(s.skill) >= s.level
        : g.hall.complete(s.bundle),
  );
}

/** Words for how a locked recipe is learned, such as "Farming level 4 or the Woodland bundle". */
export function sourceText(r: Recipe): string {
  const parts = r.sources.flatMap((s) => {
    if (s.kind === "level") return [`${s.skill} level ${s.level}`];
    if (s.kind === "bundle") {
      const name = BUNDLES.find((b) => b.id === s.bundle)?.name;
      return name ? [`the ${name} bundle`] : [];
    }
    return [];
  });
  return parts.length === 0
    ? "Not known yet"
    : `Learned at ${parts.join(" or ")}`;
}

/** Recipes the player knows and the game can make, in list order. */
export function knownRecipes(g: GameState): Recipe[] {
  return RECIPES.filter((r) => buildable(r) && known(g, r));
}

/** Recipes the game can make but the player has not unlocked yet. */
export function lockedRecipes(g: GameState): Recipe[] {
  return RECIPES.filter((r) => buildable(r) && !known(g, r));
}

/** True when the pack holds every ingredient. */
export function canCraft(g: GameState, r: Recipe): boolean {
  return r.ingredients.every((i) => g.inventory.count(i.item) >= i.count);
}

/** Craft one batch. Returns undefined on success, otherwise why not. */
export function craft(g: GameState, id: string): string | undefined {
  const r = recipeById(id);
  if (!r || !buildable(r)) return "no such recipe";
  if (!known(g, r)) return "recipe not known";
  if (!canCraft(g, r)) return "missing ingredients";
  // The ingredients leave first, so a stack they empty can hold the result.
  const before = g.inventory.save();
  for (const i of r.ingredients) g.inventory.remove(i.item, i.count);
  if (!g.inventory.add(r.result.item, r.result.count)) {
    g.inventory.load(before);
    return "backpack full";
  }
  return undefined;
}

/** Words for an ingredient list, such as "1 copper bar, 1 iron bar". */
export function ingredientText(r: Recipe): string {
  return r.ingredients
    .map((i) => `${i.count} ${itemById(i.item)?.name.toLowerCase() ?? i.item}`)
    .join(", ");
}
