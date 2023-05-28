// Hud - the heads up display

// Heads up display shows the status of each character.  What is their health meter?  What is their power up energy for a special move?
import TextButton from './game-objects/TextButton.js'

export default class Hud extends Phaser.GameObjects.Group {
    constructor ({scene}) {
        super(scene);

        this.scene=scene;


        //this.bg = this.scene.add.image(0,0,'hudBg').setOrigin(0, 0);
        this.width = 800;

        //this.healthbar = scene.add.sprite(2,2,'healthbar').setOrigin(0, 0);

        this.score = 0;
        //this.score.pts = int;
        //this.score.pts = 0;
        this.scoreLabel = 'Score: ';
        this.scene.hudText = [
			this.addFancyText(150,30),
			this.addFancyText(500,30),
			this.addFancyText(150,5),
			this.addFancyText(500,5)
		];
        this.scene.hudText[2].text='Player: ';
        this.scene.hudText[3].text='Enemy: ';
		this.scene.container.add(this.scene.hudText);	// In UI layer.
    }
    preload(){
      this.scene.load.image('Order_Menu','assets/gamemenus/Orders_Menu.png');
    }
    create(){
      this.scene.add.image(0,0, 'Order_Menu').setOrigin(0,0);
      this.clickCount = 0;
      this.scene.clickButton = new TextButton(this.scene, 38, 38, 'Go Raiding', {fill: '#000'}, () => this.updateClickCountText());
      this.scene.add.existing(this.scene.clickButton);
      this.scene.clickButton.on('pointerup', () => {
        this.clickCount++;
      })


      /*this.scene.raidButton = this.scene.add.text(38,38,'Go Raiding',{fill: '#000'})
      .setInteractive()
      .on('pointerover', () => this.enterButtonHoverState())
      .on('pointerout', () => this.enterButtonRestState())
      .on('pointerdown', () => this.enterButtonActiveState())
      .on('pointerup', () => {
        ++clickCount;
        this.enterButtonHoverState();
      });
      console.log(clickCount);*/
    }
    updateClickCountText(){
      console.log(this.clickCount);
      this.clickCount++;
    }
    enterButtonHoverState() {
      this.scene.raidButton.setStyle({ fill: '#999'});
    }
    enterButtonRestState() {
      this.scene.raidButton.setStyle({ fill: '#000' });
    }
    enterButtonActiveState() {
      this.scene.raidButton.setStyle({ fill: '#8323de' });
    }

    update ()
    {
        this.updateScore();
    }

    addFancyText(x,y) {
        var text = this.scene.add.text(x,y,'',{font: "20px Arial Black", fill: "#fff"});
        text.setStroke('#00f', 5);
        text.setShadow(2,2,'#333333',2,true,true);
        return text;
    }
    updateScore(amount)
    {
        this.score += amount;
        //this.scoreText.text = this.scoreLabel + (this.score * 10);
        this.scoreText = this.scoreLabel + (this.score * 10);
    }
}
