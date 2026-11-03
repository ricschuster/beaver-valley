# 54 Stardew checks register

Status: live. One place for every Stardew claim in the design notes that is
"from memory" or "not checked", so none gets lost and the owner can answer them
in batches.

## What this is for

Many notes say "Stardew does X (from memory, unchecked)". Left in prose, those
claims are hard to find and never get checked. This register lists each one as a
row with the exact question and how to answer it. It is reference material about
Stardew's behaviour. It never holds copied text, art or code (ADR 0002).

It does not track build work (GitHub issues do that) and it does not track
questions only our own playtests can answer.

## How to check a claim

- **Play.** The owner plays Stardew and answers, or sends a screenshot or short
  clip. Black box only: observe what the game does, never inspect its code or
  data files. Reverse engineering tools are out (ADR 0002 and the Stardew EULA).
- **Wiki.** The owner saves the page by hand, per `CLAUDE.md`. The URL list goes
  in `docs/reference/stardew/urls_<topic>.txt` and is deleted after reading.
- **Guidebook.** Read the page on demand, cite by printed page, never quote.
- **Ours.** Stardew cannot answer it. Decide it by playtest. Not tracked here.

## Rules

1. Add a row when a note makes a Stardew claim without a checked source. Link the
   row ID from the note, for example "(Stardew, unchecked, SC-03)".
2. A row needs the exact question, the note it comes from, and the method.
3. When answered, fill the Answer column, set the status to `done`, and update
   the note. Keep the row as the record.
4. A row marked `blocks` stops a design decision. Ask those first.
5. Offer a question batch at the start of a session when five or more rows are
   open (rows grouped by area, one message). `CLAUDE.md` says to start sessions
   by asking what to design, so offer the batch as one of the choices.
6. Add new rows in the session handoff step (see `HANDOFF_TEMPLATE.md`).
7. Numbers in `07_tuning_numbers.md` marked "from memory" are not rows. They are
   placeholders that playtests will tune. Add a row only if a number needs to be
   right, not just close.

Status values: `open`, `asked` (question sent to the owner), `done`.

## Register: play

| ID | Note | Question | Blocks | Status | Answer |
| --- | --- | --- | --- | --- | --- |
| SC-01 | 52 | Does Stardew save only on sleeping? Does leaving to the title screen discard the day? | no | open | |
| SC-02 | 51 | Does one use of the mailbox open one letter or the whole pile? Does the flag stay up while letters wait? | no | open | |
| SC-03 | 28 | Where does the shipping bin stand on the farm, relative to the door and bed? | no | open | |
| SC-04 | 28 | What does the end-of-day shipping screen list, and in what order? | no | open | |
| SC-05 | 26, 33 | Does winter 28 of year 1 roll into spring of year 2 with no year-end screen? | no | open | |
| SC-06 | 49 | What tabs does the menu show, in what order? | no | open | |
| SC-07 | 49 | Does the clock pause while the journal is open? What does the mouse wheel do in a menu? | no | open | |
| SC-08 | 41 | Does the farmhouse outside change by upgrade tier? Can the player enter or sleep in it during an upgrade? | no | open | |
| SC-09 | 43 | How many trees does a new farm start with, and where? On what ground may a tree seed be planted? | no | open | |
| SC-10 | 50 | Can the board hold more than one request at once? In multiplayer, does everyone get the reward for a finished request? | no | open | |
| SC-11 | 16 | Is a finished Community Center room's reward granted when the room completes? | no | open | |
| SC-12 | 36 | How many weeds does a fresh farm start with on day 1, and how fast do they spread? | no | open | |

## Register: wiki or Guidebook

| ID | Note | Question | Blocks | Status | Answer |
| --- | --- | --- | --- | --- | --- |
| SC-20 | 24 | Seed maker recipe source and fish smoker craft costs. | no | done | Seed maker: farming level 9; 25 wood, 1 gold bar, 10 coal. Fish smoker: fish shop recipe 10,000g; 10 hardwood and 3 jellies. |
| SC-21 | 24 | How many cooking recipes come from TV or Ginger Island, so we know how many slots need dishes of our own? | no | done | 32 TV, 3 island sources, 2 from the island villager's mail: about 37 of 81. |
| SC-22 | 15 | Character frame and portrait sizes. | no | done | Sprite frames 16 by 32; portraits 64 by 64. Note 15 already matches. |
| SC-23 | 22 | The mines claims marked "from memory" in note 22 (list them when asked). | no | open | |

## Not Stardew questions

These are flagged "unchecked" but only our own playtests or a real tablet can
settle them: notes 45 to 48 (controls, mouse, action order on one tile), the
touch quantity prompt in note 28 (#59, #63), and the wheel and Page Up rules in
note 49 that are marked "ours".
