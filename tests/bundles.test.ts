import { describe, expect, it } from "vitest";
import { BUNDLES, Hall } from "../src/core/bundles";
import { Inventory } from "../src/core/inventory";
import { itemById } from "../src/core/items";

describe("bundle data", () => {
  it("has five bundles with known items and sane requirements", () => {
    expect(BUNDLES).toHaveLength(5);
    for (const b of BUNDLES) {
      expect(b.required).toBeGreaterThanOrEqual(1);
      expect(b.required).toBeLessThanOrEqual(b.items.length);
      for (const id of b.items)
        expect(itemById(id), `${b.id}: ${id}`).toBeDefined();
      if (b.reward.item) expect(itemById(b.reward.item.id)).toBeDefined();
    }
  });
});

describe("Hall", () => {
  it("accepts goods one by one and rewards on completion", () => {
    const hall = new Hall();
    const inv = new Inventory();
    const wallet = { money: 0 };
    inv.add("parsnip");
    inv.add("potato");
    inv.add("cauliflower");
    expect(hall.handIn(inv, wallet, "spring-crops", "parsnip")).toBe(
      "accepted",
    );
    expect(hall.handIn(inv, wallet, "spring-crops", "potato")).toBe("accepted");
    expect(wallet.money).toBe(0);
    expect(hall.handIn(inv, wallet, "spring-crops", "cauliflower")).toBe(
      "completed",
    );
    expect(wallet.money).toBe(300);
    expect(hall.complete("spring-crops")).toBe(true);
    expect(inv.count("parsnip")).toBe(0);
  });

  it("gives item rewards", () => {
    const hall = new Hall();
    const inv = new Inventory();
    for (const id of ["grape", "spice-berry", "sweet-pea"]) {
      inv.add(id);
      hall.handIn(inv, { money: 0 }, "summer-foraging", id);
    }
    expect(inv.count("radish-seed")).toBe(15);
  });

  it("rejects unwanted, duplicate, missing and unknown hand-ins", () => {
    const hall = new Hall();
    const inv = new Inventory();
    const w = { money: 0 };
    inv.add("melon", 2);
    expect(hall.handIn(inv, w, "spring-crops", "melon")).toBe("rejected");
    expect(hall.handIn(inv, w, "summer-crops", "radish")).toBe("rejected");
    expect(hall.handIn(inv, w, "nope", "melon")).toBe("rejected");
    expect(hall.handIn(inv, w, "summer-crops", "melon")).toBe("accepted");
    expect(hall.handIn(inv, w, "summer-crops", "melon")).toBe("rejected");
    expect(inv.count("melon")).toBe(1);
  });

  it("takes any N of M in the mixed bundle and then closes", () => {
    const hall = new Hall();
    const inv = new Inventory();
    const w = { money: 0 };
    const picks = ["parsnip", "leek", "melon", "grape", "tomato"];
    for (const id of picks) inv.add(id);
    const results = picks.map((id) => hall.handIn(inv, w, "pantry", id));
    expect(results).toEqual([
      "accepted",
      "accepted",
      "accepted",
      "completed",
      "rejected",
    ]);
    expect(w.money).toBe(500);
  });

  it("keeps progress through save and load, and reports all complete", () => {
    const hall = new Hall();
    const inv = new Inventory();
    const w = { money: 0 };
    inv.add("parsnip");
    hall.handIn(inv, w, "spring-crops", "parsnip");
    const again = new Hall(undefined, JSON.parse(JSON.stringify(hall.save())));
    expect(again.handedIn("spring-crops")).toEqual(["parsnip"]);
    expect(again.allComplete).toBe(false);
    for (const b of BUNDLES) {
      for (const id of b.items) {
        inv.add(id);
        again.handIn(inv, w, b.id, id);
      }
    }
    expect(again.allComplete).toBe(true);
  });
});
