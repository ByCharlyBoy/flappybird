const FLAP_VELOCITY=250;
const OFFBOUNS_THERSHOLD=15;
export default class Bird extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture){
        super(scene,x,y,texture);
        this.scene=scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.input.keyboard.on("keydown-SPACE",this.flap,this);
        scene.input.keyboard.on("keydown-W",this.flap,this);
        
        //limite de pantalla
        //this.body.setCollideWorldBounds(true);
    }
    checkOffbounds(callback){
        if(this.getBounds().top >= 0-OFFBOUNS_THERSHOLD&&this.getBounds().bottom<=this.scene.config.height+OFFBOUNS_THERSHOLD){
           return;
        }
        callback();
    }
    flap(){
        this.body.velocity.y = -FLAP_VELOCITY;
    }
    
}