import Phaser from "phaser";

const config = 
{
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: 
  {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }, 
      debug: true

    }
  },
  scene: 
  {
    preload,
    create,
    update 
  }
};

const FlapVelocity = 250; 
const PipeSpawnTime = 5000; 
const GapSize = 150; //huecos entre tuberias
const PipeYRange = { min: -200, max: config.height / 2 - GapSize }; 
const PipeYRange2 = { min: config.height - 200, max: config.height - 100 }; 

let bird = null; 
let pipes; 
let pipeTimeCount = 0; 

function preload () 
{
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

function create () 
{
  this.add.image(0, 0, 'sky').setOrigin(0); 

  bird = this.add.sprite(100, config.height / 2, "bird"); 
  this.physics.add.existing(bird); 

  pipes = this.physics.add.group();

  this.input.keyboard.on("keydown-SPACE", flap); 

  // Detecta collisiones cuando toca la tuberia jeje xD
  this.physics.add.collider(bird, pipes, () => { 
    alert("You Lose"); 
  }); 
}

function update(time, delta)
{
  pipeTimeCount +=  delta; 
  if(pipeTimeCount >= PipeSpawnTime)
  {
    spawnPipes(this); 
    pipeTimeCount = 0; 
  }

  pipes.getChildren().forEach((pipe) => 
  {
    if (pipe.getBounds().right < 0)
    {
      pipe.destroy(); 
    }
    /*if (Phaser.Geom.Intersects.GetRectangleToRectangle(bird.getBounds(), pipe.getBounds()))
    {
      alert("You lose");
    }*/
    
  });
}

function flap()
{
  bird.body.velocity.y = -FlapVelocity; 
}

function spawnPipes(scene)
{
  const pipeY = Phaser.Math.Between(PipeYRange.min, PipeYRange.max); 
  const pipeY2 = pipeY + 400 + GapSize;  

    
  const pipeTop = scene.add.sprite(
    config.width, 
    pipeY, 
    "pipe"
  ); 

  const pipeBottom = scene.add.sprite(
    config.width, 
    pipeY2, 
    "pipe"
  );

  pipes.add(pipeTop); 
  pipes.add(pipeBottom);

  pipeTop.body.allowGravity = false; 
  pipeBottom.body.allowGravity = false; 

  pipeTop.body.immovable = true; 
  pipeBottom.body.immovable = true; 

  pipeTop.body.velocity.x = -200; 
  pipeBottom.body.velocity.x = -200; 

}

new Phaser.Game(config); 

