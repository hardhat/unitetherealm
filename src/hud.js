// Hud - the heads up display

// Heads up display shows the status of each character.  What is their health meter?  What is their power up energy for a special move?
import TextButton from './game-objects/TextButton.js'
var ordorMenu = true;
export default class Hud extends Phaser.GameObjects.Group {
    constructor ({scene}) {
        super(scene);
        this.scene=scene;
        this.ordorMenu = ordorMenu;
    }
    preload(){
      this.scene.load.image('Order_Menu','assets/gamemenus/Orders_Menu.png');
      this.scene.load.image('Build_YourArmy','assets/gamemenus/Build_YourArmy.png');
      this.scene.load.image('test','assets/gamemenus/test.png');
    }
    create(){
      this.clickCount = 0;
      this.normalButtonList = []; //creates list for buttons
      //var orderMenuImage = this.scene.add.image(0,0, 'Order_Menu');
      var orderMenuImage = this.scene.add.image(0,0, 'test');
      this.orderMenuImage = orderMenuImage;
        console.log(this.ordorMenu);
        this.scene.raidButton = new TextButton(this.scene, 38, 38, 'Go Raiding', {fill: '#000'}, () => this.updateClickCountText());
        this.scene.add.existing(this.scene.raidButton);
        this.normalButtonList.push(this.scene.raidButton);

        this.scene.growButton = new TextButton(this.scene, 38, 68, 'Grow Your Territory', {fill: '#000'}, () => this.updateClickCountText());
        this.scene.add.existing(this.scene.growButton);
        this.normalButtonList.push(this.scene.growButton);

        this.scene.stormButton = new TextButton(this.scene, 38, 98, 'Storm The Castle', {fill: '#000'}, () => this.updateClickCountText());
        this.scene.add.existing(this.scene.stormButton);
        this.normalButtonList.push(this.scene.stormButton);

        this.scene.armyButton = new TextButton(this.scene, 38, 128, 'Build Your Army', {fill: '#000'}, () => this.buildYourArmy());
        this.scene.add.existing(this.scene.armyButton);
        this.normalButtonList.push(this.scene.armyButton);
        //this.scene.add.image(0,0, 'Order_Menu').setOrigin(0,0);
    }
    hideNormalButtons() { /* hides and deactivates normal buttons */
        this.normalButtonList.forEach(button => {
            /*this.syllable3.play();*/
            button.setVisible(false);
            //button.input.enabled = false;
        });
    }

    showNormalButtons() { /* resets normal buttons */
        this.normalButtonList.forEach(button => {
            button.setVisible(true);
            //button.input.enabled = true;
        });
    }
    updateClickCountText(){
      console.log(this.clickCount);
      this.clickCount++;
    }
    buildYourArmy(){
      //this.scene.add.image(0,0,'Build_Your_Army').setOrigin(0,0);
      this.ordorMenu = false;
      console.log(this.ordorMenu);
    }
    drawMenus(){
      if(this.ordorMenu){
        this.orderMenuImage.setOrigin(0,0);
        this.showNormalButtons();
      } else {
        this.orderMenuImage.setVisible(false);
        this.hideNormalButtons();
        this.scene.add.image(0,0,'test').setOrigin(0,0);
      }
    }
    update ()
    {
        this.drawMenus();
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
