import Bird from "../extras/bird";
import PipeSystem from "../extras/pipes";
import Score from "../extras/score";

export default class GameScene extends Phaser.Scene{
    constructor(config){
        super();
        this.config=config;
        this.bird=null;
        this.pipes=null;
        this.score=null;

        this.backgroundLayer={

            background:null,
            game:null,
            ui:null
            
        }
    } 
    preload(){
        this.load.image("fondo","assets/sky.png");
        this.load.image("bird","assets/bird.png");
        this.load.image("pipe","assets/pipe.png");
       this.load.image("pause_button","assets/pause.png")
    }
    create(){

        //instancea laayerr
        this.backgroundLayer.background=this.add.layer();
        this.backgroundLayer.game=this.add.layer();
        this.backgroundLayer.ui=this.add.layer();

        var fondo=this.add.image(0,0,"fondo").setOrigin(0.2,0.15);
        this.backgroundLayer.background.add(fondo);

        this.bird=new Bird(this,100,this.config.height/2,"bird");
        this.backgroundLayer.game.add(this.bird);

        //this.physics.add.collider(this.pipes, this.bird);
        this.pipes=new PipeSystem(this,this.backgroundLayer.game);
        this.physics.add.collider(this.bird,this.pipes.getGroup(),this.gameOver,null,this);

        this.score=new Score(this,16,16,this.backgroundLayer.ui);
        var pause_button=this.add.image(this.config.width-10,10,"pause_button").setOrigin(1,0);
        /*-> no funciona el button*/pause_button.on("pointer-down",this.pause,this);

        this.pipes.onPipeExited=()=>{
            this.score.addScore(1);
        }
        this.pipes.start();
    }
    update(){
        this.bird.checkOffbounds(()=>{
            this.gameOver();
        })
        this.pipes.update();
    }
   
    
    gameOver(){
        alert("Mamaste");
        this.score.checkHighScore();
        this.scene.restart();
    }
    pause(){
        this.physics.pause();
        this.scene.pause();
    }
}
