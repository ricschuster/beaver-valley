import Phaser from "phaser";

/**
 * Throwaway test: the hand-drawn witch at Stardew-like sizes. Open the game
 * with `?scene=witch`. A Stardew dialogue portrait is 64 by 64 pixels drawn at
 * 4x (256 on screen); a character sprite is 16 by 32, so 64 by 128 at 4x.
 */
export class WitchTestScene extends Phaser.Scene {
  constructor() {
    super("witch-test");
  }

  preload(): void {
    this.load.image("witch", "art/witch-portrait.png");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#3f7d3a");
    this.textures.get("witch").setFilter(Phaser.Textures.FilterMode.LINEAR);
    const text = (x: number, y: number, s: string, size = "16px") =>
      this.add
        .text(x, y, s, { fontSize: size, color: "#ffffff", align: "center" })
        .setOrigin(0.5);

    text(480, 28, "Witch test: Stardew sizes at 4x", "22px");

    // Dialogue box with a 64 by 64 portrait at 4x.
    this.add
      .rectangle(300, 250, 520, 300, 0x5b3a1e)
      .setStrokeStyle(4, 0x2a1a0c);
    this.add
      .rectangle(180, 250, 256, 256, 0xf3e3b5)
      .setStrokeStyle(2, 0x2a1a0c);
    const portrait = this.add.image(180, 250, "witch");
    portrait.setScale(256 / portrait.height);
    this.add
      .text(
        330,
        160,
        "Hello! This is a test.\nHow do I look in the\ndialogue box?",
        { fontSize: "20px", color: "#ffffff", wordWrap: { width: 230 } },
      )
      .setOrigin(0, 0);
    text(180, 410, "portrait 64x64, at 4x", "14px");

    // A character sprite box, 16 by 32 at 4x, for scale.
    this.add.rectangle(700, 250, 64, 128, 0xf3e3b5).setStrokeStyle(2, 0x2a1a0c);
    const small = this.add.image(700, 250, "witch");
    small.setScale(128 / small.height);
    text(700, 340, "sprite 16x32, at 4x", "14px");

    // A tile row for scale.
    for (let i = 0; i < 4; i++)
      this.add
        .rectangle(600 + i * 64 + 32, 440, 64, 64, i % 2 ? 0x6aa84f : 0x5f9a46)
        .setStrokeStyle(1, 0x2a1a0c);
    text(728, 490, "four 16px tiles, at 4x", "14px");
  }
}
