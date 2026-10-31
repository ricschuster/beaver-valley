# 26 Seasons and the year (draft)

Status: draft. Decided with the owner on 2026-10-31. This note is the design
note that `CLAUDE.md` asks for before scope grows past two seasons. Nothing here
is built. The wiki pages Spring, Summer, Fall, Winter, Day Cycle and Energy were
read as reference only (ADR 0002); no text is copied.

## Decisions

- The year has four seasons of 28 days each: spring, summer, fall, winter. That
  is a 112 day year. The first playable's two seasons are the first half.
- Fall and winter are built in slice 1 of M3 (`33_build_order.md`). The first playable
  (M2) stays at two seasons and its scope is unchanged.
- Winter has no outdoor crops. Crops and weeds clear when it starts, and the
  farm rests. The player's time goes to foraging, fishing, the mines, animals
  and crafting, so those systems must have winter content. An indoor growing
  option is needed (a greenhouse, see below).
- Each spring day 1 brings fresh forage, rocks and grass to the farm. Weeds
  land on day 1 of spring, summer and fall (`29_weeds.md`). Winter day 1
  clears crops and weeds. Forage tables change every season.
- Nightfall moves by season: 8 pm in spring and summer, 7 pm in fall, 6 pm in
  winter, darkening gradually outdoors (`07_tuning_numbers.md`).

## What each season has to give

Every season needs its own crops, forage, fish and a festival slot
(`14_festival_calendar.md`), so the player never repeats the same month.

- Spring and summer: as built (`src/content/`).
- Fall: a mix of single harvest and regrowing crops, with some of the highest
  value crops of the year. Own forage and fish tables.
- Winter: forage, fish and animal goods carry the season. One or two hardy
  indoor or special seeds at most.

## Effects on other systems

- Bundles (`16_bundles.md`): some goods are tied to a season already. With four
  seasons, a bundle can span the year, and a missed season means waiting for the
  next year. Needs a rule so the player is never locked out for good.
- Crops: a crop that is alive when its season ends dies, as spring crops do now.
  Multi-season crops (corn in summer and fall) become possible.
- Animals (`23_animals.md`): winter keeps animals indoors, so feed and heat
  matter. Pigs get no outdoor time in winter, already planned.
- Weather: snow replaces rain in winter. Rain chances for fall and winter are
  ours to set.
- Save: the calendar already stores a season and day, so adding two seasons
  should be a content change plus a longer season table.
- Weeds: settled in `29_weeds.md`. Rocks and twigs wait for the farm note.

## Open questions

- Fall and winter fish lists. The crop and forage lists and numbers are settled
  (`35_bundle_pools.md`, `07_tuning_numbers.md`, 2026-10-31).
- The greenhouse: settled as the Larder room reward (`31_farm_growth.md`). Its
  winter income is a tuning question.
- Rain and snow chances for fall and winter, and thunderstorms, are set
  (`07_tuning_numbers.md`, 2026-10-31). Storms are the source of battery packs
  (`34_crafting.md`) and are never harmful.
- Whether the first year's last day ends the game, as the first playable ends
  after its bundles, or the game goes on into a second year.
- Winter content for the mines and fishing, so the rest season is not empty.
