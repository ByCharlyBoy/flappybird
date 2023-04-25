import Phaser from "phaser";
import GameScene from "./scenes/game-scene";

const SHARED_CONFIG={
  width: 650,
  height: 500,
  pixelArt: true,

}
const config={
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics:{
    default:"arcade",
    //pixelAr
    arcade:{
      gravity:{y:400},
      debug: true
    }
    
  },
  scene:[new GameScene(SHARED_CONFIG)]
  
}
new Phaser.Game(config);
