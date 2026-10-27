# 10 Customisation and decoration (draft)

Status: draft. Written from reader 1's feedback (decorating was raised three
times) and the design talk of 2026-10-27. Nothing here is built. It is outside
the first playable, so it needs this note before any code (see CLAUDE.md,
Scope). Target: M3 for the first slice, more later.

## Why

Reader 1, a long-time Stardew Valley player, named decorating as a genre like,
as something expeditions should give, and as what would keep them playing for
40 hours. Customisation is a long-term reason to keep playing that does not
need combat or threat, which suits a cozy game.

## Approach

Mechanics follow Stardew Valley's shape, in our own content and names (ADR
0002): customisation is earned as rewards, not only bought. The Brimmers
already love hats (see `09_story_and_lore.md`), so hats and clothes are a
natural centre.

Parts to consider, each a separate slice:

1. **Home decoration.** Place furniture in the house. Wallpaper and flooring.
   Sources: village hall bundle rewards, shops, quests and expedition finds.
   Placement is a grid on the house interior.
2. **House upgrades.** Larger house in steps, paid in coin and materials.
   More rooms mean more space to decorate.
3. **Character look.** Hats, clothes and hair. Hats come first because they are
   already part of the lore (a hat shows standing in the ledger).
4. **Tailoring.** A sewing machine station that turns cloth and found items
   into clothes and hats. Cloth comes from farming (a fibre crop and a loom, or
   similar) and expeditions, so it feeds the farm loop.
5. **Dyes.** Colour clothes with dyes made from crops and forage. Gives
   flowers and forage a second use.
6. **Farm decoration.** Fences, paths, lamps and small ornaments outdoors.
   Later.

## Where it comes from

- Hall bundles: a few bundle rewards are furniture or wallpaper. This reuses
  the existing bundle reward data.
- Shops: the general store sells basic furniture, rotating stock later.
- Expeditions (ring 2): rare furniture, cloth and dye plants.
- Friendship: villagers give or sell a keepsake at set hearts.
- Festivals: a festival shop or prize (see the festival list in
  `09_story_and_lore.md`).

## Fit with the rest

- Items are data, so furniture and clothes are new item kinds, not new systems.
- Saving needs to store placed items and what the player wears. Plan the save
  version bump when the first slice lands.
- No decay, no upkeep: decoration never needs maintaining.
- Placeholder art first. Furniture is many small sprites, so it is an art cost
  to budget for the art pass (#58).

## Suggested first slice (M3)

Furniture placement in the house with five to ten pieces, two wallpapers, two
floors, and hats you can wear. Rewards from two bundles. Tailoring, dyes and
house upgrades follow once the first slice feels good.

## Open

- Does the character look change the sprite in the world, or only a portrait?
  World sprites cost more art.
- Grid size and whether furniture can stack (rugs, tables with items).
- What the sewing machine costs and how the player unlocks it.
- Whether hats carry a ledger-standing effect, as the lore note suggests.
- Whether a catalogue of all furniture exists, as a collection goal.

Details of Stardew Valley's own system were recalled from memory, not
checked. Check the genre reference before fixing numbers.
