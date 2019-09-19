var character;
class TestLevel extends Phaser.Scene{

    constructor(){
        super({key:"TestLevel"});
    }
    preload(){
        this.load.image("pika", "../Assets/pika.png");
        this.load.image("floor", "../Assets/background_groundfloor.png");
          
    }
    create(){
        this.floor = this.physics.add.image(200,500, "floor");
        this.floor.body.setAllowGravity(false);
        this.floor.setImmovable(true);
        character = this.physics.add.sprite(300,0,"pika"); 
        character.setCollideWorldBounds(true);
        character.body.setBounce(1,1);
        this.input.keyboard.on("keyup_X", function(event){
            character.setVelocity(character.body.velocity.x, character.body.velocity.y - 100);
        }, this);

        this.physics.add.collider(character, this.floor, this.hitPlatform, null, this);
    }
    update(delta){
        //Nothing yet
    }

    hitPlatform(character, floor) {
        if(character.body.touching.down && !character.body.touching.left && !character.body.touching.right) { //Collisions with just the bottom of the player don't cause y bounce
            character.body.setVelocity(character.body.velocity.x,0);
        }
    }
}