import { describe, expect, it } from "vitest";
import { categoryOf, isMushroom } from "../src/core/artisan";
import { craft, knownRecipes } from "../src/core/crafting";
import { itemById } from "../src/core/items";
import { MINUTES_PER_DAY, processFor } from "../src/core/processing";
import { loadMachine, jobDone } from "../src/core/machines";
import { newGame } from "../src/core/save";
import { RECIPES } from "../src/core/crafting";
import { LEVEL_XP } from "../src/core/skills";

describe("the dehydrator", () => {
  it("takes 5 fruit or edible mushrooms and dries them in a day", () => {
    const fruit = processFor("dehydrator", "peach@gold");
    expect(fruit).toMatchObject({
      input: "peach",
      use: 5,
      output: "peach-dried",
      count: 1,
      minutes: MINUTES_PER_DAY,
    });
    expect(processFor("dehydrator", "chanterelle")?.output).toBe(
      "chanterelle-dried",
    );
    expect(processFor("dehydrator", "bramble-berry")?.output).toBe(
      "bramble-berry-dried",
    );
  });

  it("refuses vegetables, plain forage and anything else", () => {
    expect(processFor("dehydrator", "parsnip")).toBeUndefined();
    expect(processFor("dehydrator", "daffodil")).toBeUndefined();
    expect(processFor("dehydrator", "wood")).toBeUndefined();
  });

  it("prices dried goods at 7.5 times the base plus 25g, with 3 times the energy", () => {
    // Peach is 140g with 38 energy.
    expect(itemById("peach-dried")?.sellPrice).toBe(Math.floor(7.5 * 140) + 25);
    expect(itemById("peach-dried")?.energy).toBe(3 * 38);
    // Morel is 150g with 20 energy.
    expect(itemById("morel-dried")?.sellPrice).toBe(Math.floor(7.5 * 150) + 25);
    expect(categoryOf("morel-dried")).toBe("dried");
    expect(isMushroom("morel")).toBe(true);
    expect(isMushroom("leek")).toBe(false);
  });

  it("is crafted from 30 wood, 5 stone and an iron bar at farming level 4", () => {
    const r = RECIPES.find((x) => x.id === "dehydrator")!;
    expect(r.ingredients).toEqual([
      { item: "wood", count: 30 },
      { item: "stone", count: 5 },
      { item: "iron-bar", count: 1 },
    ]);
    const g = newGame();
    g.inventory.add("wood", 30);
    g.inventory.add("stone", 5);
    g.inventory.add("iron-bar", 1);
    expect(knownRecipes(g).some((x) => x.id === "dehydrator")).toBe(false);
    g.skills.gain("farming", LEVEL_XP[3]!);
    expect(knownRecipes(g).some((x) => x.id === "dehydrator")).toBe(true);
    expect(craft(g, "dehydrator")).toBeUndefined();
    expect(g.inventory.count("dehydrator")).toBe(1);
  });

  it("runs a batch and gives the dried good the next morning", () => {
    const g = newGame();
    g.machines.add({ x: 1, y: 1, id: "dehydrator" });
    g.inventory.add("apple", 5);
    expect(loadMachine(g, 1, 1, "apple").ok).toBe(true);
    expect(g.inventory.count("apple")).toBe(0);
    expect(jobDone(g, g.machines.get(1, 1)!)).toBe(false);
    g.day.clock.day += 1;
    expect(jobDone(g, g.machines.get(1, 1)!)).toBe(true);
  });

  it("will not start with fewer than 5", () => {
    const g = newGame();
    g.machines.add({ x: 1, y: 1, id: "dehydrator" });
    g.inventory.add("apple", 4);
    expect(loadMachine(g, 1, 1, "apple")).toEqual({
      ok: false,
      reason: "not enough input",
    });
  });
});
