import Bird from "../extras/bird";
import PipeSystem from "../extras/pipes";
import Score from "../extras/score";
import FlappyBirdScene from "./flappy-bird-scene";

export default class GameScene extends FlappyBirdScene{
    constructor(config){
        super("GameScene", config);
        this.bird = null;
        this.pipeSystem = null;
        this.score=null;
        this.pauseButton = null; 
        this.paused = false; 
        this.isGameOver = false;
    } 

    preload(){
        this.load.image("bird","assets/bird.png");
        this.load.image("pipe","assets/pipe.png");
        this.load.image("pauseButton","assets/pause.png");
    }

    create(){
        super.create(); 

        this.bird=new Bird(this,100,this.config.height/2,"bird");
        this.backgroundLayer.game.add(this.bird);

        //this.physics.add.collider(this.pipes, this.bird);
        this.pipeSystem=new PipeSystem(this,this.backgroundLayer.game);
        this.physics.add.collider(this.bird,this.pipeSystem.getGroup(), this.gameOver, null, this);

        this.score=new Score(this,16,16,this.backgroundLayer.ui);
        this.pauseButton=this.add.image(this.config.width - 10 , 10,"pauseButton")
        .setOrigin(1, 0)
        .setInteractive()
        .setScale(3);
        
        this.pauseButton.on("pointerup", this.pause,this);

        this.pipeSystem.onPipeExited= ()=> {
            this.score.addScore(1);
        }

        this.isGameOver = false;

        this.pipeSystem.start();
    }

    update(){
        if(this.paused || this.isGameOver) return;

        this.bird.checkOffbounds(()=>{
            this.gameOver();
        })
        this.pipeSystem.update();
    }
   
    
    gameOver(){
        this.isGameOver = true;
        this.pipeSystem.stop(); 
        this.pauseButton.setVisible(false);  
        this.backgroundLayer.game.bringToTop(this.bird); 
        this.bird.triggerLoseAnimation(()=>{
            this.score.checkHighScore();
            //this.scene.restart();
            this.showGameOverMenu(); 
        }); 
        
    }

    pause(){
        this.physics.pause();
        this.paused = true; 
        this.pipeSystem.pause(); //pausa timer --pipes
        this.pauseButton.setVisible(false); 

        const continueButtonCallbacks = {
            onClick: ()=> this.resume(), 
            onMouseEnter: text => text.setFill("#0F0"), 
            onMouseExit: text => text.setFill("#FFF")
        }

        const quitButtonCallbacks = {
            onClick: ()=> {
                this.quitMenu();
                this.scene.start("MenuScene"); 
            }, 
            onMouseEnter: text => text.setFill("#F00"), 
            onMouseExit: text => text.setFill("#FFF")
        }

        const mainMenu = {
            items: [
                {label: "Continue", style: {fontSize: "32px", fill: "#FFF"}, ...continueButtonCallbacks}, 
                {label: "Quit", style: {fontSize: "32px", fill: "#FFF"}, ...quitButtonCallbacks}
            ], 
            firstItemPosition: {x: this.config.width / 2,  y: this.config.height / 2},
            origin: {x: 0.5, y: 0.5},
            spacing: 45
        }
        this.showMenu(mainMenu) 
    }

    resume (){
        this.physics.resume(); 
        this.paused = false;  
        this.pipeSystem.resume(); 
        this.quitMenu();
        this.pauseButton.setVisible(true);
    }

    showGameOverMenu(){
        const retryButtonCallbacks = {
            onClick: ()=> {
                this.quitMenu(); 
                this.scene.restart(); 
            },
            onMouseEnter: text => text.setFill("#0F0"), 
            onMouseExit: text => text.setFill("#FFF")
        }

        const quitButtonCallbacks = {
            onClick: ()=> {
                this.quitMenu();
                this.scene.start("MenuScene"); 
            }, 
            onMouseEnter: text => text.setFill("#F00"), 
            onMouseExit: text => text.setFill("#FFF")
        }

        const gameOverMenu = {
            items: [
                {label: "Retry", style: {fontSize: "32px", fill: "#FFF"}, ...retryButtonCallbacks}, 
                {label: "Quit", style: {fontSize: "32px", fill: "#FFF"}, ...quitButtonCallbacks}
            ], 
            firstItemPosition: {x: this.config.width / 2,  y: this.config.height / 2},
            origin: {x: 0.5, y: 0.5},
            spacing: 45
        }
        this.showMenu(gameOverMenu) 
    }
}
