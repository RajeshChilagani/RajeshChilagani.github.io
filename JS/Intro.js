class Intro extends Phaser.Scene
{
    constructor()
    {
        super({key:"Intro"});
        
    }
    preload()
    {
        //this.load.image('Intro', '../Assets/background_ui_start_game_02.png');
        this.load.image('Intro', '../Assets/Intro.png');
        this.load.audio('music','../Assets/bgm.mp3')
    }
    create()
    {
        let introText
        this.Intro = this.add.image(400,300,'Intro');
        this.Intro.setScale(1.6);
        //this.Intro.setScale(.842, .857);
        this.introText = this.add.text(250,300,'Press Enter to start game');
        this.introText.setFontSize("24px");
        this.introText.setFontFamily("Saira Stencil One");
        this.introText.setFill("#34F1B1"),
        this.introText.setStroke("#BF136E",5),
        this.input.keyboard.on('keyup',function(e){
        this.intro =this.sound.add('music');
        this.intro.setVolume(0.2);
        this.intro.setLoop(true);
        this.intro.play();
            if(e.key=='Enter')
            {
                this.scene.start('Wave1');
            }

        },this)
    }

}