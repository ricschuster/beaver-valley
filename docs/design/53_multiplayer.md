# 53 Multiplayer (draft)

Status: draft. Decided with the owner on 2026-11-02, as the first design for
milestone M4 (`docs/decisions/0007-multiplayer-milestone.md`). Nothing here is
built. Stardew's behaviour is from memory and unchecked: no co-op page is saved.
The model is the owner's own game beaver_cycle, whose same-network multiplayer is
built and measured (its ADR 0014 and note 42). Only ideas are taken from it, no
code.

## Decisions

- **Same network only (decided 2026-11-02, ours).** Friends on one router, no
  internet service, no relay and no hosting bill. Play over the internet is not
  planned.
- **Up to 8 players, host included (decided 2026-11-02; Stardew 1.6 from
  memory).** Whether a tablet host can carry 8 is untested (see Open).
- **The host runs the world (decided 2026-11-02).** One device runs the whole
  simulation: clock, farm, trees, weather, hall. A guest is a thin client. It
  sends what the player wants to do (the intents of note 47) and draws the state
  the host sends back. Only the host changes the world. This works because
  `src/core/` is free of Phaser and the DOM.
- **Any player can host, desktop or tablet (Stardew, decided 2026-11-02).**
  Browsers cannot listen on a socket, and neither can a tablet WebView, so:
  - The desktop app hosts through its own native socket server.
  - A tablet app hosts through a small native plugin. beaver_cycle built and
    measured one (about 30 ms round trips on one router).
  - A browser tab joins as a guest only. A small Node program stands in as the
    host for testing before the wrapper exists, as beaver_cycle's host bridge
    does.
- **The final form is a standalone desktop game, not a browser game (owner,
  2026-11-02).** The browser build stays for development and as a guest. This
  makes the wrapper ADR a prerequisite for M4: it must pick a wrapper that can
  listen on a socket, and a tablet route for hosting. ADR 0008 chooses Electron on desktop and Capacitor with a host plugin on tablets.
- **Transport: WebSocket carrying JSON (decided 2026-11-02, the beaver_cycle
  choice).** Every message is checked on arrival. Both ends send the game
  version, and a mismatch is refused with a plain message. WebRTC needs a
  signalling step that has no good form without internet, so it is not used.
- **Finding a host: a list of games on the network, or a typed address
  (decided 2026-11-02).** A desktop or tablet host announces itself on the local
  network (a UDP broadcast). A guest that can listen for it shows a list of games
  by name. A browser cannot listen, so it types the host's address. Typing also
  stays as a fallback for routers that block broadcasts. The guest remembers the
  last host. The host's screen shows its address.
- **A player's character lives in the host's save (Stardew from memory,
  decided 2026-11-02).** A guest's pack, skills, tools and cabin belong to that
  world and are kept on the host under a key the guest's device made, so a
  returning guest is the same character. A guest's device keeps only settings
  and the look. See "Travelling characters" for the later option.
- **Homes (decided 2026-11-02).** It depends on how the game began:
  - A game **started as multiplayer** gives every player a free cabin on the
    farm when they join, up to the cap.
  - A **single-player game turned into multiplayer** has the host buy cabins
    from the carpenter (Stardew from memory). A guest cannot join without a free
    cabin and is told so.
- **Money: the host chooses at creation, shared or separate (Stardew,
  decided 2026-11-02).** Shared is one purse. Separate gives each player their
  own, and the shipping bin pays the player who shipped each item.
- **A day ends when every player is in bed, with a timer fallback (Stardew,
  decided 2026-11-02).** The clock is the host's and shared. Players still up see
  who is left. At the day limit everyone who is not in bed passes out, with the
  usual cost (`src/core/sleep.ts`).
- **A dropped guest does not stall the day (decided 2026-11-02, ours).** A
  guest who disconnects counts as in bed for the day end, and their character is
  put in their cabin. They rejoin as the same character by their key.
- **Menus do not pause the clock in a multiplayer game (decided 2026-11-02,
  ours; Stardew unchecked).** Note 49's pause is a single-player rule, since one
  player cannot stop the others.

## What is shared and what is per player

| Shared | Per player |
| --- | --- |
| Farm, crops, trees, forage, weather, forecast | Pack, held slot, energy |
| Clock and calendar | Skills, professions, tool tiers, equipment |
| Village hall bundles and projects | Cabin and bed |
| Shipping bin (proceeds follow the money rule) | Journal (quests, mail, collections) |
| Money, when the host chose shared | Money, when the host chose separate |
| Festivals joined, house and cabin builds | Look and name |

Quests, mail, the request board and achievements each need a ruling when their
notes are revisited (see Open).

## Saves and exit

Builds on note 52. The host holds the night and resume records, with every
player's record inside, so a guest never saves the world.

- **Exit by the host ends the session for everyone.** Guests return to their
  title screen, and the world stays on the host. A guest's Exit just leaves.
- **Restart this day is the host's, and it affects everyone.** It asks first and
  says so.
- **Export and import move the host's whole world file**, guests' records
  included.
- A guest's record is self-contained in the code (see below) so the file can be
  read, split and checked as one piece per player.

## Travelling characters (later option, recorded 2026-11-02)

The owner finds a character that lives on the guest's device interesting. It is
not built in M4. The pros and cons, so the idea is not lost:

- **For:** friends can visit each other's farms with one character. A guest keeps
  their progress if a host's save is lost. It needs no server.
- **Against:** a guest can arrive with maxed tools, gold or rare items and
  trivialise a host's world, and the shared hall is the sharpest case. Cabins,
  beds, quests, hall contributions and unlocks belong to a world and do not
  travel. A shared wallet has no clear place for a guest's own gold. Two devices
  need one character format across game versions. Tampering with a local file
  becomes the host's problem.
- **What keeps it possible:** a player's record is self-contained and split into
  portable parts (name, look, maybe skills) and world-bound parts (pack, tools,
  gold, cabin, quests). A later option would be a host switch at world creation,
  like the money choice, with a rule on what a visitor may bring, such as a small
  satchel.

## What changes in the code

- `GameState` holds one player's things (`inventory`, `money`, skills, tool
  tiers, energy) next to the world's. M4 splits it into a world and a list of
  player records keyed by player id. This is a refactor that single player needs
  too, with no change to what a single-player game does.
- A `Room` in `src/core/` takes intents from players, steps the world and makes
  snapshots, with no socket, so it is unit tested with several fake players, as
  beaver_cycle's room is. The socket sits outside it in `src/net/`.
- The save gains a player list and a wallet mode (note 52's version bump).

## Build order

0. The wrapper ADR (host route on desktop and tablet), and a spike that proves a
   host and a guest talk on a real router, with a Node test host. Include a
   load check of 8 players against a tablet host.
1. Split `GameState` into world and players, still single player, with tests.
2. The `Room` and the protocol in `src/core/` and `src/net/`, no socket.
3. The socket, the Node test host, and a guest that joins and walks.
4. Host and Join screens, the game list, and the typed address.
5. Shared day end and a dropped guest.
6. Cabins (free at start, bought otherwise) and the join-needs-a-cabin rule.
7. The money mode and per-player shipping proceeds.
8. Native hosting in the wrapper, then the tablet plugin.

## For later

- **Travelling characters** (above).
- **Chat and quick phrases.** Quick phrases, not typing, as beaver_cycle did, for
  tablets.
- **Play over the internet.** Not planned. It would need a relay and a cost.
- **Co-op festival and hall moments**, with the story and hall notes.

## Open

- **Eight players on a tablet host.** beaver_cycle measured a host and two
  guests, not eight. The cap may be lower for a tablet host.
- **Quests, mail, the request board and achievements** (notes 50, 51 and 38):
  shared or per player. Stardew's mail is per player from memory.
- **Whether the wallet mode can change after creation**, and what a single-player
  game's money becomes when it turns multiplayer.
- **Joining a game in progress**: whether a late guest needs the host to be
  idle, and the price of a bought cabin.
- **A password or code to join**, since anyone on the network could otherwise
  join.
- **Snapshot size**: full state against changes only, settled in the spike.
- **Checking Stardew**: save the co-op pages (Multiplayer, Cabin) to confirm the
  host, cabin, wallet and sleep claims above.
- Existing notes that change when M4 starts: 49 (menu pause), 52 (save), 28
  (bin), 50, 51, 38, 42 (the debug menu) and `src/core/sleep.ts`.
