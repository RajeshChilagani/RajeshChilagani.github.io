var timerEvents = [];
class Wave1 extends Phaser.Scene
{
    
    constructor(){
        super({key:"Wave1"});
        this.IsTouching=false;
        //this.IsOnground=true;
        this.playerSpriteDirection="right"
        this.playerLives=5
        this.playerLivesText
        this.IsPlayerImmune=true;
        this.isAnyKeypressed=false;
        this.UIScale=.75;
        this.scoreText
        this.score=0
        this.isGameover=false
        this.soundtime=16;
    }
    preload()
    {
       
        //this.load.image('baseplatform','../Assets/baseplatform.png');
        this.load.image('background', '../Assets/background.png')
        this.load.image('platform','../Assets/platform1.png');
        this.load.image('enemy','../Assets/enemy.png');
        this.load.image('pong','../Assets/pong_new.png');
        this.load.spritesheet('player','../Assets/Play.png',{frameWidth:90,frameHeight:85});
        this.load.spritesheet('playerfly','../Assets/fly.png',{frameWidth:90,frameHeight:85});
        this.load.spritesheet('playerflyspeed','../Assets/FlyNew.png',{frameWidth:112.5,frameHeight:85});
        this.load.spritesheet('playerflyMaxSpeed','../Assets/MaxSpeed.png',{frameWidth:120,frameHeight:85});
        this.load.spritesheet('eggShake','../Assets/egg_shake.png',{frameWidth:256/4,frameHeight:70});
        this.load.spritesheet('eggHatch','../Assets/egg_hatch.png',{frameWidth:256/4,frameHeight:70});
        this.load.spritesheet('enemyFly','../Assets/enemy_fly.png',{frameWidth:60,frameHeight:55});
        this.load.spritesheet('enemy2','../Assets/enemy2.png',{frameWidth:90,frameHeight:85});
        this.load.spritesheet('sludge','../Assets/sludge.png',{frameWidth:550,frameHeight:85});
        this.load.image('egg', '../Assets/egg.png')
        //this.load.image('pterodactyl', '../Assets/pika.png');
    //Sounds
        this.load.audio('egg_hatching','../Assets/egg_hatching.wav')
        this.load.audio('game_over','../Assets/game_over.wav')
        this.load.audio('enemy_killed','../Assets/enemy_killed.wav')
        this.load.audio('ghost_killed','../Assets/ghost_killed.wav')
        this.load.audio('player_bounce','../Assets/player_bounce.wav')
        this.load.audio('player_killed','../Assets/player_killed.wav')
        this.load.audio('wind','../Assets/boost.wav')
        this.load.audio('flap','../Assets/flap.wav')
        this.load.audio('footstep','../Assets/walk.wav')

    }
    create()
    {
        //reAL DIMENSIONs with .55 scale player, .75 scale enemy
        //55.5 x 35.25 Enemy
        //49.5 x 46.75 Player
        this.time.addEvent({ delay: 10000, callback: this.pterodactylSpawn, callbackScope: this, repeat: 0, startAt: 0 });
        var background = this.add.image(256*1.75, 192*1.6, 'background');
        background.setScale(1.75, 1.6);

      
        let playerHeight=85;
        let playerWidth=90;
        let playerScale=0.55;
        //this.platforms = this.physics.add.staticGroup();
        this.platforms = this.physics.add.group();
        this.cursors = this.input.keyboard.createCursorKeys();

    
    //Sludge
        this.sludge = this.physics.add.sprite(400,595,'sludge');
        this.sludge.setScale(1.64,1);
        this.sludge.body.setAllowGravity(false);
        this.sludge.setImmovable(true);

    //Pong
        this.pong= this.physics.add.sprite(400,600-16,'pong');
        this.pong.setCollideWorldBounds(true);
        this.pong.setScale(this.UIScale);

    //UI
    
        this.scoreText = this.add.text(this.pong.getCenter().x,this.pong.getCenter().y - 75/1.6,this.score,{ fontSize: '24px', fontFamily: '"Roboto Condensed"' ,fill: '#FF8833' });
        this.playerLivesText = this.add.text(this.pong.getCenter().x,this.pong.getCenter().y- 75/1.6,this.playerLives,{ fontSize: '24px', fontFamily: '"Roboto Condensed"' ,fill: '#FF8833' });
    //Platforms
        //this.platforms.create(350, 568, 'baseplatform').setScale(2).refreshBody();
        this.platforms.create(100, 150, 'platform');
        //this.platforms.create(400, 300, 'platform');
        this.platforms.create(700, 150, 'platform');
        this.platforms.create(700, 400, 'platform');
        this.platforms.create(100, 400, 'platform');

    //Player
    
        this.player = this.physics.add.sprite(400,600-this.pong.displayHeight-(playerHeight/2)*playerScale,'player');
        this.player.setScale(playerScale);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(1.2,.7);
        
    //Enemies & Eggs
        this.enemies = this.physics.add.group({
            key: 'enemy',
            repeat: 3,
        });

        this.eggs = this.physics.add.group({
            key: 'egg',
            repeat: 3,
        });
        
        this.pterodactyls = this.physics.add.group({
            key: 'enemy2'
        });

        this.enemies.children.iterate(function (child) { //sets initial position, velocity
            child.setX(1000);
            child.setY(1000);
            timerEvents.push(this.time.addEvent({ delay: 1000*this.enemies.children.getArray().indexOf(child), callback: this.spawnEnemy, callbackScope: this, args: [child]}));
        }, this);


        this.eggs.children.iterate(function (child) { //sets initial position, velocity
            child.setScale(.3);
            child.setCollideWorldBounds(true);
            child.setBounce(.6,.6);
            child.setDrag(3);
            child.setState('invis');
            child.disableBody(true, true);
            
        }, this);

        this.pterodactyls.children.iterate(function (child) { //sets initial position, velocity
            child.setScale(.5);
            child.setCollideWorldBounds(true);
            child.setBounce(1,0);    
            child.disableBody(true, true);      
            child.setState('notSpawned'); 
            child.body.setAllowGravity(false);
        }, this);

        this.platforms.children.iterate(function (child) { //sets initial position, velocity
            child.body.setAllowGravity(false);
            child.body.setImmovable(true);
        }, this);

    //Animations
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 8 }),
            frameRate: 16,
            repeat: -1
        });
        
         this.anims.create({
          key: 'idle',
            frames: [ { key: 'player', frame: 4 } ],
             frameRate: 20
        });

        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('playerfly', { start: 0, end: 4 }),
            frameRate: 16,
            repeat: -1,
            scale: .7
        });
        this.anims.create({
            key: 'flylines',
            frames: this.anims.generateFrameNumbers('playerflyspeed', { start: 0, end: 4 }),
            frameRate: 16,
            repeat: -1,
            scale: .7
        });
        this.anims.create({
            key: 'boost',
            frames: this.anims.generateFrameNumbers('playerflyMaxSpeed', { start: 0, end: 4 }),
            frameRate: 16,
            repeat: -1,
            scale: .7
        });

        this.anims.create({
            key: 'eggShake',
            frames: this.anims.generateFrameNumbers('eggShake', { start: 0, end: 3 }),
            frameRate: 16,
            repeat: -1
        });
           
        this.anims.create({
            key: 'eggHatch',
            frames: this.anims.generateFrameNumbers('eggHatch', { start: 0, end: 3 }),
            frameRate: 1,
            repeat: 0
        });

        this.anims.create({
            key: 'enemyFly',
            frames: this.anims.generateFrameNumbers('enemyFly', { start: 0, end: 3 }),
            frameRate: 16,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy2',
            frames: this.anims.generateFrameNumbers('enemy2', { start: 0, end: 3 }),
            frameRate: 16,
            repeat: -1
        });

        this.anims.create({
            key: 'sludge',
            frames: this.anims.generateFrameNumbers('sludge', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1,
            yoyo:false,
            skipMissedFrames:true
        });
    //Play BG animations
        this.sludge.anims.play('sludge',true);
    //Audio
        this.sound.add('egg_hatching');
        this.sound.add('game_over');
        this.sound.add('enemy_killed');
        this.sound.add('ghost_killed');
        this.sound.add('player_bounce');
        this.sound.add('player_killed');
        this.sound.add('wind');
        this.sound.add('flap');
        this.footstep=this.sound.add('footstep');
        
        
        
    //Colliders
        this.physics.add.collider(this.player,this.platforms, hitPlatform, null, this);
        this.physics.add.collider(this.player,this.pong,hitPong,null,this);
        this.physics.add.collider(this.enemies,this.pong,hitPongEnemy,null,this);
        this.physics.add.collider(this.eggs,this.pong);
        this.physics.add.collider(this.enemies,this.platforms, hitPlatformEnemy,null, this);
        //this.physics.add.collider(this.player,this.enemies,CheckCollision,null,this);
        this.physics.add.collider(this.player,this.platforms, hitPlatform, null, this);
        this.physics.add.overlap(this.player,this.eggs, hitEgg, null, this);
        this.physics.add.collider(this.eggs,this.platforms);
        this.physics.add.collider(this.enemies,this.enemies);
        this.physics.add.collider(this.pterodactyls,this.platforms);
        this.physics.add.collider(this.pterodactyls,this.pong);
        this.physics.add.overlap(this.player, this.pterodactyls, checkCollisionPterodactyl, null, this);
        //this.physics.add.overlap(this.player,this.enemies,CheckCollision,null,this);
        function hitEgg(player, egg) {
            egg.disableBody(true,true);
            this.score += 1;
            this.scoreText.setText(this.score);
        }
        /*
        if(!this.IsPlayerImmune) {
                var enemyCollider = this.physics.add.collider(this.player,this.enemies,CheckCollision,null,this);
            }
            else{
            }
        */
        function CheckCollision(player,enemy)
        {
            
           // console.log(player.y+24,enemy.y);
           if(player.getCenter().y < enemy.getCenter().y)
           {
            this.sound.play('enemy_killed');
            enemy.disableBody(true,true);
            this.score+=1;
            this.scoreText.setText(this.score);
           } 
           else if(this.IsPlayerImmune==false) 
           {
            this.Lives();
           }
           /*if(player.y+playerHeight*playerScale-5<enemy.y)
           {
               enemy.disableBody(true,true);
               score+=1;
               scoreText.setText('Score: ' + score);
           }
           if(player.y+player.displayHeight*playerScale-5>enemy.y)
           {  
                this.GameOver();
           }*/
        }

        function checkCollisionPterodactyl(player, pterodactyl){
            if(this.IsPlayerImmune==false)
            {
                if(Math.abs(this.player.body.velocity.x) + Math.abs(this.player.body.velocity.y) > 500){
                    this.sound.play('ghost_killed');
                    pterodactyl.disableBody(true,true);
                    this.score+=3;
                    this.scoreText.setText(this.score);
                } else {
                    this.Lives();
                }
            }

        }

        function hitPlatform() {
            if(this.player.body.touching.down && !this.player.body.touching.left && !this.player.body.touching.right) { //Collisions with just the bottom of the player don't cause y bounce   
            this.IsTouching=true;
            
            this.playAnim();
            this.player.body.setVelocity(this.player.body.velocity.x,0);
            }
            else{
                this.sound.play('player_bounce')
            }
        }

        function hitPlatformEnemy(e, floor) {
            if(e.body.touching.down && !e.body.touching.left && !e.body.touching.right) { //Collisions with just the bottom of the player don't cause y bounce
                e.body.setVelocity(e.body.velocity.x,0);
            }
        }  
        function hitPong() {
            
            
            if(this.player.body.touching.down) { //Collisions with just the bottom of the player don't cause y bounce   
            this.IsTouching=true;
            this.player.body.setVelocity(this.player.body.velocity.x,this.player.body.velocity.y);
            }
            else{
                this.sound.play('player_bounce')
                this.IsTouching=false;
            }
        }
        function hitPongEnemy(platform, enemy) {
            console.log(enemy.getBottomLeft().y);
            console.log(this.pong.getTopLeft().y);
            console.log(Math.abs(this.pong.body.velocity.x));
            if(enemy.getBottomLeft().y >= (this.pong.getTopLeft().y + 10) && Math.abs(this.pong.body.velocity.x) > 100){
                enemy.disableBody(true, true);
                this.score+=1;
                this.scoreText.setText(this.score);
            }
        }

        
     
        this.input.keyboard.on("keyup_X", function(event){
            this.player.setVelocity(this.player.body.velocity.x, this.player.body.velocity.y -70);
            this.IsTouching=false;
            this.playAnim();
            this.isAnyKeypressed==true
            this.IsPlayerImmune=false
            this.move(true);
            this.sound.play('flap');    
        }, this); 
        this.input.keyboard.on("keyup_R", function(event){
           
            this.player.disableBody(false,false);
        }, this);
        
    }
    playAnim()
    {
         if(this.playerSpriteDirection=='left')
         {
             this.player.setFlipX(true)     
         }
         else
         {
             this.player.setFlipX(false);
         }
        if(this.player.body.velocity.x==0)
        {
            this.player.anims.play('idle',true)
        }
        if(this.player.body.velocity.x>0 || this.player.body.velocity.x<0||this.player.body.velocity.y>0 || this.player.body.velocity.y<0)
        {
            if(this.IsTouching)
            {
                console.log(this.player.body.velocity.x , this.player.body.velocity.y)
                this.player.anims.play('run',true)
                if(this.player.body.velocity.x>0 || this.player.body.velocity.x<0)
                {
                    if(this.soundtime===16)
                    {
                        this.footstep.setVolume(0.2);
                        this.footstep.play();
                        this.soundtime=0;
                    }
                    this.soundtime++;
                }
            }
            else
            {
               
                if(Math.abs(this.player.body.velocity.x) + Math.abs(this.player.body.velocity.y) > 500)
                {
                   
                    this.player.anims.play('boost',true)
                    if(this.soundtime===16)
                    {
                        this.sound.play('wind');
                        this.soundtime=0;
                    }
                    this.soundtime++;
                    
                }
                else if(Math.abs(this.player.body.velocity.x) + Math.abs(this.player.body.velocity.y) > 300)
                {
                    this.player.anims.play('flylines',true)
                }
                else
                {
                    this.player.anims.play('fly',true)
                }
               
            }
            
        }
    }
    move(whenJumpPressed){ //player movement
        if(!this.IsPlayerImmune) {
            if(!this.physics.world.colliders.getActive().find(function(i){
                return i.name == 'enemyCollider'
            })){
                var enemyCollider = this.physics.add.collider(this.player,this.enemies,this.CheckCollision,null,this).name = "enemyCollider";
            }
        }
        else{
            if(this.physics.world.colliders.getActive().find(function(i){
                return i.name == 'enemyCollider'
            })){
                (this.physics.world.colliders.getActive().find(function(i){
                    return i.name == 'enemyCollider'
                })).destroy();
            }
        }
        if (this.cursors.left.isDown && (this.player.body.touching.down || whenJumpPressed))
        {
            this.IsPlayerImmune=false
            this.isAnyKeypressed==true
            this.player.setFlipX(true);
            this.playerSpriteDirection='left';
            if(this.player.body.velocity.x > -180 && this.player.body.velocity.x <= 0){
                if(whenJumpPressed){
                    this.player.setVelocityX(this.player.body.velocity.x-4);
                } else {
                    this.player.setVelocityX(this.player.body.velocity.x-2);
                }
            } else if (this.player.body.velocity.x > 0){
                if(whenJumpPressed){
                    this.player.setVelocityX(this.player.body.velocity.x-10);
                } else {
                    this.player.setVelocityX(this.player.body.velocity.x-5);
                }
            }
            this.playAnim()
        }
        if(this.cursors.right.isDown && (this.player.body.touching.down || whenJumpPressed))
        {
            this.IsPlayerImmune=false
            this.isAnyKeypressed==true
            this.player.setFlipX(false);
            this.playerSpriteDirection='right';
            if(this.player.body.velocity.x < 180 && this.player.body.velocity.x >= 0){
                if(whenJumpPressed){
                    this.player.setVelocityX(this.player.body.velocity.x+4);
                } else {
                    this.player.setVelocityX(this.player.body.velocity.x+2);
                }
            } else if (this.player.body.velocity.x < 0){
                if(whenJumpPressed){
                    this.player.setVelocityX(this.player.body.velocity.x+10);
                } else {
                    this.player.setVelocityX(this.player.body.velocity.x+5);
                }
            }
            this.playAnim()

            
        }
        if(this.player.body.velocity.y > 250) {this.player.setVelocityY(250);}
        if(this.player.body.velocity.y < -250) {this.player.setVelocityY(-250);}
        if(this.player.body.velocity.x > 750) {this.player.setVelocityX(750);}
        if(this.player.body.velocity.x < -750) {this.player.setVelocityX(-750);}
    }       

    enemyMove(){ //enemy random jumping
        this.enemies.children.iterate(function (child) {
            child.anims.play('enemyFly', true);
            if(child.y < 555){
                var z = Math.floor(Math.random() * 13);
            }
            else{
                var z = Math.floor(Math.random() * 10);
            }
            if(z === 1){
                child.setVelocity(child.body.velocity.x, child.body.velocity.y - 50);
            }
            if(child.body.velocity.y < - 150) {
                child.setVelocityY(-150);
            } else if(child.body.velocity.y > 150) {
                child.setVelocityY(150);
            } else if(child.body.velocity.x < 50 && child.body.velocity.x > -50) {
                if(child.flipX){
                    child.body.velocity.x = 50;
                } else{
                    child.body.velocity.x = -50;
                }

            }
            if(child.body.velocity.x > 0) {
                child.setFlipX(false);
            } else {
                child.setFlipX(true);
            }
        }, this);
    }

    eggMove(){
        var i = 0;
        this.eggs.children.iterate(function (child) {
            var correspondingEnemy = this.enemies.children.getArray()[i];
            if(correspondingEnemy.active){
                child.setPosition(correspondingEnemy.x, correspondingEnemy.y);
                child.setVelocity(correspondingEnemy.body.velocity.x + correspondingEnemy.y/10, correspondingEnemy.body.velocity.y);

            } else {
                if(child.state === 'invis') {
                    child.enableBody(false, child.x, child.y, true, true);
                    child.setState('vis');
                    timerEvents.push(this.time.addEvent({ delay: 4000, callback: this.preactivation, callbackScope: this, args: [correspondingEnemy, child]}));
                    child.anims.play('eggShake'); 
                   // var timedEvent = this.time.delayedCall(this.time.now+3000, this.activateEnemy(correspondingEnemy), [], this);//correspondingEnemy.active
                }
            }
            if(child.getCenter().y >= 575 && child.state === 'vis') {
                //this.activateEnemy(correspondingEnemy, child);
                this.pterodactyls.create(child.x,child.y,'enemy2');
                this.pterodactyls.children.getArray()[ this.pterodactyls.getLength()-1 ].setScale(.5);
                this.pterodactyls.children.getArray()[ this.pterodactyls.getLength()-1 ].setBounce(1,0);
                this.pterodactyls.children.getArray()[ this.pterodactyls.getLength()-1 ].setCollideWorldBounds(true);
                this.pterodactyls.children.getArray()[ this.pterodactyls.getLength()-1 ].setState('spawned');
                this.pterodactyls.children.getArray()[ this.pterodactyls.getLength()-1 ].body.setAllowGravity(false);
                this.pterodactyls.children.getArray()[ this.pterodactyls.getLength()-1 ].setVelocity(1, -45);
                child.setState("Hatched");
                child.disableBody(true, true);
            }
            
            i++;
            
        }, this);
    }
    preactivation(correspondingEnemy, child){ //if you have any better implemenentations I'm all ears
        child.anims.play('eggHatch'); 
        timerEvents.push(this.time.addEvent({ delay: 4000, callback: this.activateEnemy, args: [correspondingEnemy, child]}));
    }
    activateEnemy(correspondingEnemy,child) {
        if(child.active && !(child.state === "Hatched")){ //In case we have hit the bottom early, we disrupt this event call.
            correspondingEnemy.enableBody(true, child.x, child.y, true, true);
            if(Math.random() < .5) {correspondingEnemy.setVelocityX(50);}
            else {correspondingEnemy.setVelocityX(-50);}
            child.setState("Hatched");
            child.disableBody(true, true);
        }
    }
    CheckCollision(player,enemy)
    {
        
       // console.log(player.y+24,enemy.y);
       if(player.getCenter().y < enemy.getCenter().y)
       {
        enemy.disableBody(true,true);
        this.score+=1;
        this.scoreText.setText(this.score);
        this.sound.play('enemy_killed')
       } 
       else if(this.IsPlayerImmune==false) 
       {
        this.Lives();
       }
       /*if(player.y+playerHeight*playerScale-5<enemy.y)
       {
           enemy.disableBody(true,true);
           score+=1;
           scoreText.setText('Score: ' + score);
       }
       if(player.y+player.displayHeight*playerScale-5>enemy.y)
       {  
            this.GameOver();
       }*/
    }
    movePong()
    {
        this.Key_Z=  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
        this.Key_C=  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
        if (this.Key_Z.isDown)
        {
            this.IsPlayerImmune=false
            this.isAnyKeypressed==true
            this.pong.body.velocity.x+=-10;
        }
     
        else if (this.Key_C.isDown )
        {
            this.IsPlayerImmune=false
            this.isAnyKeypressed==true
            this.pong.body.velocity.x+=10;
        }
        else
        {
            this.pong.body.velocity.x=0;
        }
        this.scoreText.setPosition(this.pong.getCenter().x-476/5 * this.UIScale,this.pong.getCenter().y-75/3  * this.UIScale);
        this.playerLivesText.setPosition(this.pong.getCenter().x+476/3.5  * this.UIScale,this.pong.getCenter().y-75/3  * this.UIScale);

    }

    pterodactylSpawn(){
        this.pterodactyls.children.iterate(function (child) {
            if(child.state === 'notSpawned') {
                child.setState('spawned');
                child.enableBody(true, 700, 300, true, true);
                child.setVelocity(70, 45);
            }
        }, this);
    }

    pterodactylMove(){
        this.pterodactyls.children.iterate(function (child) {
            child.anims.play('enemy2',true); 
            if(child.state === 'spawned'){
                var z = Math.floor(Math.random() * 400);
                if(z === 0) {
                    child.setVelocity(Math.floor(Math.random() * 50) + 20, Math.floor(Math.random() * 50) + 20);
                    if(child.x < this.player.x) { //enemy to the left
                        if(child.body.velocity.x < 0) {
                            child.body.velocity.x *= -1;
                        }
                    } else { //enemy to the right
                        if(child.body.velocity.x > 0) {
                            child.body.velocity.x *= -1;
                        }
                    }

                    if(child.y < this.player.y) { //enemy below
                        if(child.body.velocity.y < 0) {
                            child.body.velocity.y *= -1;
                        }
                    } else { //enemy to the right
                        if(child.body.velocity.y > 0) {
                            child.body.velocity.y *= -1;
                        }
                    }
                    if(child.body.velocity.x > 0) {
                        child.setFlipX(false);
                    } else {
                        child.setFlipX(true);
                    }
                    //child.body.setVelocity(child.x - this.player.x, child.x - this.player.x);
                    //child.body.setVelocity(child.body.velocity.x - this.player.body.velocity.x, child.body.velocity.y);
                    //child.rotation = Phaser.Math.Angle.Between(child.x, child.y, this.player.x, this.player.y);
                }
            }
            if(child.body.velocity.x > 60){child.body.velocity.x = 60;}
            if(child.body.velocity.y > 60){child.body.velocity.y = 60;}
            if(child.body.velocity.x < -60){child.body.velocity.x = -60;}
            if(child.body.velocity.y < -60){child.body.velocity.y = -60;}

        }, this);
    }

    spawnEnemy(child){
        var z = Math.floor(Math.random() * 4);
            child.setX(this.platforms.children.getArray()[z].body.x + 70); //70 hard code for center right now
            child.setY(this.platforms.children.getArray()[z].body.y - 20); //20 so above
            if(Math.random() < .5) {child.setVelocityX(50);}
            else {child.setVelocityX(-50);}
            child.setVelocityY(-10);
            child.setCollideWorldBounds(true);
            child.setBounce(1,0);
            child.setScale(.75)
    }
    GameOver()
    {
       
        this.player.disableBody(true,true);
        this.enemies.children.iterate(function (child) { //sets initial position, velocity
            child.disableBody(true,true);
        }, this);
        this.isGameover=true; 
        //this.scoreText = this.add.text(300,250,'GameOver',{ fontSize: '50Px', fill: '#ffffff' });
        this.pong.disableBody(true,true);
        this.sound.play('game_over');
        this.scene.start('EndScreen',{score:this.score})
        
    }
    Lives()
    {
        this.sound.play('player_killed');
        if(this.playerLives>0)
        {
            this.playerLives--;
            if( this.isAnyKeypressed==false)
            {
                this.IsPlayerImmune=true;
            }
            this.player.anims.play('idle',true)
            this.player.body.velocity.x=0;
            this.player.body.velocity.y=0;
            this.player.setPosition(this.pong.getCenter().x,600-this.pong.displayHeight-(this.player.displayHeight)/2)
            this.playerLivesText.setText(this.playerLives);
        }
        if(this.playerLives==0)
        {
            this.GameOver();
        }
    }
    Ui()
    {
        console.log(this.pong.getCenter().x)
        
        //this.playerLivesText.setPosition(this.pong.getTopRight().x-100,this.pong.getTopLeft().y+14);
    }
    update()
    {
        if(!this.isGameover)
        {
            if(this.player.body.touching.down===false)
            {
                this.IsTouching=false;
            }
            this.playAnim();
            this.move(false);
            this.enemyMove();
            this.eggMove();
            this.movePong();
            this.pterodactylMove();
        
            //console.log(this.player.displayHeight/2+this.player.y)
            if(this.player.getCenter().y>=600-this.player.displayHeight / 2)
            {
                
                if(this.IsPlayerImmune==false)
                {
                    this.Lives(this.pong.getTopLeft().x+150,this.pong.getTopLeft().y-7,this.score);
                }
            }   
        }
       
    }
    
}