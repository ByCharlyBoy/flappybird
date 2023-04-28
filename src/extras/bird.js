const FLAP_VELOCITY=250;
const OFFBOUNS_THERSHOLD=15;

export default class Bird extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.immovable = true; 
        scene.input.keyboard.on("keydown-SPACE",this.flap,this);
        scene.input.keyboard.on("keydown-W",this.flap,this);
        this.blocked = false; 

        this.createAnimations(); 
        this.play("fly"); 
        this.setScale(2);
        this.flipX = true; 
        this.body.setSize(12, 7); 
        
        //this.body.width = this.width * 1; // reduce el ancho del box collider
        //this.body.offset.x = this.width * 1; // mueve el box collider a la izquierda
        //limite de pantalla
        //this.body.setCollideWorldBounds(true);
        
    }

    createAnimations(){
        this.scene.anims.create({
            key: "fly", 
            frames: this.scene.anims.generateFrameNumbers("bird", {start: 8, end: 15}), 
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: "die", 
            frames: this.scene.anims.generateFrameNumbers("bird", {start: 16, end: 18}), 
            frameRate: 8,
            repeat: 0
        });
    }

    checkOffbounds(callback){
        if(this.getBounds().top >= 0-OFFBOUNS_THERSHOLD&&this.getBounds().bottom<=this.scene.config.height+OFFBOUNS_THERSHOLD){
           return;
        }
        callback();
    } 

    flap(){
        if (this.blocked) return; 
        this.body.velocity.y = -FLAP_VELOCITY;
    }
    
    triggerLoseAnimation(endcallback){
        this.setTint(0xFF0000); 
        this.flap();
        this.play("die"); 
        //console.log("fe");
        this.blocked = true; 
        const loseTimer = this.scene.time.addEvent({
            delay: 2, 
            callback: () => {
                this.checkLoseAnimation(loseTimer, endcallback); 
            }, 
            loop: true
        }) 
    }

    checkLoseAnimation(timer, endcallback){
        if (this.getBounds().top > this.scene.config.height) {
            timer.remove(); 
            endcallback(); 
        }
    }
}