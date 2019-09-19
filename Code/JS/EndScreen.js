class EndScreen extends Phaser.Scene
{
    constructor()
    {
        super({key:"EndScreen"});
        this.finalScore;
        this.lb
        this.prompt=false;
        this.playerName;
    }
    init(data)
    {
        this.finalScore=data.score;
      
    }
    preload()
    {
        this.load.image('Gameover', '../Assets/Gameover.png')
    }
    create()
    {
        
        this.GameoverImg=this.add.image(400,350,'Gameover');
        this.GameoverImg.setScale(1.6);
        let final = this.finalScore
        if(localStorage)    
        {
            this.lb=JSON.parse(localStorage.getItem("lbs"))
            if(JSON.stringify(this.lb)==='null')
            {
                console.log("error")
                 this.lb=  [
                    {
                      "name": "test",
                      "score": "03"
                    },
                    {
                      "name": "test",
                      "score": "02"
                    },
                    {
                      "name": "test",
                      "score": "01"
                    }
                  ]
            }
            let temp = final
            for(let i=0;i<3;i++)
            { 
                if(this.lb[i].score<temp)
                {
                    if(!this.prompt)
                    {
                        this.playerName=prompt("You have entered the LeaderBoard Enter your Name (3 Characters)", "");
                        this.prompt=true;
                    }  
                    let tempName= this.lb[i].name
                    let temptemp= this.lb[i].score
                    this.lb[i].score=temp;
                    this.lb[i].name=this.playerName;
                    this.playerName=tempName;
                    temp=temptemp;
                }
            }
            this.LeaderBoard=this.add.text(600,0,'LeaderBoard');
            this.LeaderBoard.setFontSize("24px");
            this.LeaderBoard.setFontFamily("Saira Stencil One");
            this.LeaderBoard.setFill("#34F1B1");
            this.LeaderBoard.setStroke("#BF136E",5);
           for(let i=0; i<3;i++)
           {
            this.Lb1 = this.add.text(625,(i+1)*50,this.lb[i].name);
            this.Lbname = this.add.text(725,(i+1)*50,this.lb[i].score);
           }
            
            localStorage.setItem("lbs",JSON.stringify(this.lb))
        }
    


    }

}