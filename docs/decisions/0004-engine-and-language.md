# Engine and language

## Status

Accepted

## Context

The first playable (`docs/design/03_milestones.md`) needs a 2D game with a day
clock, inventory, saving and loading, a hall UI with item hand-in, and rough
placeholder art. The target is an installed app on desktop and, later, tablets.

The developer is solo, works about 5 to 10 hours a week, knows none of the
candidate languages well, and relies on Claude Code for nearly all of the
code. The main criterion is therefore how much Claude can build, run, test and
visually check without the developer in the loop. Maps are painted by the
developer in an easy editor. The main arc is 40+ hours, so the stack must keep
boilerplate low and let content grow in layers. The release is free.

Options considered:

| Option | For | Against |
| --- | --- | --- |
| TypeScript with Phaser, Tiled maps | Code and text end to end. Runs headless in a browser for scripted play, screenshots and CI. Strong typing and testing. HTML UI for hall and inventory. Tiled is a free, easy map editor and Phaser loads its JSON directly. | Installed apps need a wrapper. Phaser has no scene editor. Webview memory limits on tablets. |
| Godot 4, GDScript | Native export to desktop, Android and iOS from one tool. Built-in tilemap painter and UI controls. Free (MIT). | Scenes are edited in a GUI editor that Claude cannot see. Visual checks and tests are harder. Niche language. |
| Godot 4, C# | Static typing and mature test tools. | Same editor problem, plus .NET setup and no web export. |
| MonoGame, C# (Stardew's stack) | Fully code driven. | No editor, UI toolkit or tilemap system, and no good tablet story. |
| Unity, C# | Native everywhere, large ecosystem. | Proprietary with past licence changes, heavy editor reliance, bulky scene files. |
| GameMaker, RPG Maker, Unreal | Fast starts (first two). | Editor centric, proprietary or a poor fit for this loop. |
| LÖVE, Defold, Raylib, Bevy, Pygame | Code driven. | Weak UI, weak tablet or packaging story, or too slow to build with at this pace. |

## Decision

Use **TypeScript with Phaser**, built and served with **Vite**, with maps
authored in **Tiled** and loaded as JSON.

Game rules (day clock, energy, inventory, bundles, skills, selling, save data)
live in plain TypeScript under `src/core/` with no dependency on Phaser or the
DOM, so they are unit tested directly. Scenes and UI sit on top of them. Content
such as items, crops and bundles is data files, not code.

Development runs in the browser. Installed apps are produced by wrapping the
same build: a desktop wrapper first, then tablet wrappers. The wrapper choice
(for example Electron, Tauri or Capacitor) gets its own ADR when packaging
starts.

Godot 4 with GDScript is the runner-up and the fallback if the wrapped build
fails the performance spike below.

## Consequences

- Claude can drive the whole loop: write, run, play by script, screenshot and
  test, in CI as well as locally. Node 22 is already installed.
- The developer paints maps in Tiled; tools for items and bundles can be small
  HTML forms over the data files.
- Performance budget, to confirm in a spike during the skeleton task: a large
  Tiled map, a few hundred sprites and a day tick, tested on a real target
  tablet. Initial target is a steady 60 fps on desktop and 30 fps or better on
  an older tablet, with art in compact texture atlases and areas loaded on
  demand. The minimum tablet is still to be chosen.
- Saves are plain data, so a save export and import path is needed in case a
  wrapper's storage is cleared.
- iOS builds will need a Mac and an Apple developer account when tablets start.
- If the spike fails, switching to Godot keeps the design docs, data files and
  `src/core/` logic ideas, but scene and UI code would be rewritten.
- `CLAUDE.md` Stack is filled in now. Commands and `CONTRIBUTING.md` Setup are
  filled in by the skeleton task.
