import Phaser from "phaser";
import { BedScene } from "./scenes/BedScene";
import { EndScene } from "./scenes/EndScene";
import { FarmScene } from "./scenes/FarmScene";
import { HallScene } from "./scenes/HallScene";
import { ReportScene } from "./scenes/ReportScene";
import { TitleScene } from "./scenes/TitleScene";
import { ShopScene } from "./scenes/ShopScene";
import { SkillsScene } from "./scenes/SkillsScene";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 960,
  height: 540,
  backgroundColor: "#2f4a35",
  pixelArt: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [
    TitleScene,
    FarmScene,
    ShopScene,
    HallScene,
    EndScene,
    ReportScene,
    BedScene,
    SkillsScene,
  ],
});
