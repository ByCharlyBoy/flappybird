import Phaser from "phaser";
import GameScene from "./scenes/game-scene";

const SHARED_CONFIG={
  width: 1000,
  height:500,

}
const config={
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics:{
    default:"arcade",
    arcade:{
      gravity:{y:400},
      debug: true
    }
    
  },
  scene:[new GameScene(SHARED_CONFIG)]
  
}
new Phaser.Game(config);
