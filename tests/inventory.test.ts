import { describe, expect, it } from "vitest";
import { Inventory, STACK_SIZE } from "../src/core/inventory";
import { buy, sell } from "../src/core/shop";
import { cropOfSeed, itemById, seedId } from "../src/core/items";

describe("Inventory", () => {
  it("adds, counts and removes", () => {
    const inv = new Inventory();
    expect(inv.add("parsnip", 5)).toBe(true);
    expect(inv.count("parsnip")).toBe(5);
    expect(inv.remove("parsnip", 2)).toBe(true);
    expect(inv.count("parsnip")).toBe(3);
    expect(inv.remove("parsnip", 4)).toBe(false);
    expect(inv.count("parsnip")).toBe(3);
  });

  it("splits stacks and fills slots", () => {
    const inv = new Inventory(2);
    expect(inv.add("a", STACK_SIZE + 1)).toBe(true);
    expect(inv.add("b")).toBe(false);
    expect(inv.add("a", STACK_SIZE - 1)).toBe(true);
    expect(inv.add("a")).toBe(false);
    expect(inv.count("a")).toBe(STACK_SIZE * 2);
  });

  it("is all or nothing when full", () => {
    const inv = new Inventory(1);
    inv.add("a", STACK_SIZE - 1);
    expect(inv.add("a", 2)).toBe(false);
    expect(inv.count("a")).toBe(STACK_SIZE - 1);
  });

  it("frees a slot when a stack empties", () => {
    const inv = new Inventory(1);
    inv.add("a");
    inv.remove("a");
    expect(inv.add("b")).toBe(true);
  });
});

describe("items and shop", () => {
  it("links seeds to crops", () => {
    expect(cropOfSeed(seedId("parsnip"))).toBe("parsnip");
    expect(cropOfSeed("parsnip")).toBeUndefined();
    expect(itemById(seedId("parsnip"))?.buyPrice).toBe(20);
  });

  it("sells for the item's price", () => {
    const inv = new Inventory();
    const w = { money: 0 };
    inv.add("parsnip", 3);
    expect(sell(inv, w, "parsnip", 2)).toBe(70);
    expect(w.money).toBe(70);
    expect(sell(inv, w, "parsnip", 2)).toBe(0);
    expect(sell(inv, w, "nothing")).toBe(0);
  });

  it("buys seeds with enough money and room", () => {
    const inv = new Inventory();
    const w = { money: 50 };
    expect(buy(inv, w, seedId("parsnip"), 2)).toBe(true);
    expect(w.money).toBe(10);
    expect(inv.count(seedId("parsnip"))).toBe(2);
    expect(buy(inv, w, seedId("parsnip"), 1)).toBe(false);
    expect(w.money).toBe(10);
    expect(buy(inv, w, "parsnip")).toBe(false);
  });
});
