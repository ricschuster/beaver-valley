import Phaser from "phaser";
import { BedScene } from "./scenes/BedScene";
import { BinScene } from "./scenes/BinScene";
import { EndScene } from "./scenes/EndScene";
import { FarmScene } from "./scenes/FarmScene";
import { FestivalScene } from "./scenes/FestivalScene";
import { HallScene } from "./scenes/HallScene";
import { ProfessionScene } from "./scenes/ProfessionScene";
import { ReportScene } from "./scenes/ReportScene";
import { ShippingScene } from "./scenes/ShippingScene";
import { WitchTestScene } from "./scenes/WitchTestScene";
import { WitchWalkScene } from "./scenes/WitchWalkScene";
import { TitleScene } from "./scenes/TitleScene";
import { ShopScene } from "./scenes/ShopScene";
import { CarpenterScene } from "./scenes/CarpenterScene";
import { DebugScene } from "./scenes/DebugScene";
import { SkillsScene } from "./scenes/SkillsScene";

// Throwaway test scenes, opened first with ?scene=witch or ?scene=witchwalk.
const tests = { witch: WitchTestScene, witchwalk: WitchWalkScene };
const wanted = new URLSearchParams(location.search).get("scene");
const first =
  wanted && wanted in tests ? [tests[wanted as keyof typeof tests]] : [];

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 960,
  height: 540,
  backgroundColor: "#2f4a35",
  pixelArt: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [
    ...first,
    TitleScene,
    FarmScene,
    ShopScene,
    CarpenterScene,
    HallScene,
    FestivalScene,
    EndScene,
    ShippingScene,
    ReportScene,
    BinScene,
    BedScene,
    SkillsScene,
    // Dev builds only: Vite drops the debug menu from `npm run build`.
    ...(import.meta.env.DEV ? [DebugScene] : []),
    ProfessionScene,
    ...Object.values(tests).filter((t) => !first.includes(t)),
  ],
});
