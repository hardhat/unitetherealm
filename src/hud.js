// Hud - the heads up display

// Heads up display shows the status of each character.  What is their health meter?  What is their power up energy for a special move?
import TextButton from './game-objects/TextButton.js'
var menuOption = 0;
var visible = true;
export default class Hud extends Phaser.GameObjects.Group {
    constructor ({scene}) {
        super(scene);
        this.scene=scene;
        this.menuOption = menuOption;
        this.visible = visible;
    }
    preload(){
      this.scene.load.image('Order_Menu','assets/gamemenus/Orders_Menu.png');
      this.scene.load.image('Build_YourArmy','assets/gamemenus/Build_YourArmy.png');
      this.scene.load.image('test','assets/gamemenus/test.png');
    }
    create(){
      this.clickCount = 0;
      this.normalButtonList = []; //creates list for order buttons
      this.armyButtonList = []; // creates list for build your army buttons
      var orderMenuImage = this.scene.add.image(0,0, 'Order_Menu');
      //var orderMenuImage = this.scene.add.image(0,0, 'test');
      this.orderMenuImage = orderMenuImage;
        console.log(this.menuOption);
        this.scene.raidButton = new TextButton(this.scene, 38, 38, 'Go Raiding', {fill: '#000'}, () => this.goRaiding());
        this.scene.add.existing(this.scene.raidButton);
        this.normalButtonList.push(this.scene.raidButton);

        this.scene.growButton = new TextButton(this.scene, 38, 68, 'Grow Your Territory', {fill: '#000'}, () => this.growTerritory());
        this.scene.add.existing(this.scene.growButton);
        this.normalButtonList.push(this.scene.growButton);

        this.scene.stormButton = new TextButton(this.scene, 38, 98, 'Storm The Castle', {fill: '#000'}, () => this.stormCastle());
        this.scene.add.existing(this.scene.stormButton);
        this.normalButtonList.push(this.scene.stormButton);

        this.scene.armyButton = new TextButton(this.scene, 38, 128, 'Build Your Army', {fill: '#000'}, () => this.buildYourArmy('inital'));
        this.scene.add.existing(this.scene.armyButton);
        this.normalButtonList.push(this.scene.armyButton);

        this.scene.buySoilder = new TextButton(this.scene, 38, 38, 'Soilder', {fill: '#000'}, () => this.buildYourArmy('soilder'));
        this.scene.add.existing(this.scene.buySoilder);
        this.armyButtonList.push(this.scene.buySoilder);

        this.scene.buyKnight = new TextButton(this.scene, 38, 68, 'Knight', {fill: '#000'}, () => this.buildYourArmy('knight'));
        this.scene.add.existing(this.scene.buyKnight);
        this.armyButtonList.push(this.scene.buyKnight);

        this.scene.buyMage = new TextButton(this.scene, 38, 98, 'Mage', {fill: '#000'}, () => this.buildYourArmy('mage'));
        this.scene.add.existing(this.scene.buyMage);
        this.armyButtonList.push(this.scene.buyMage);

        this.scene.armyFinish = new TextButton(this.scene, 18, 128, 'Finish', {fill: '#000'}, () => this.buildYourArmy('finish'));
        this.scene.add.existing(this.scene.armyFinish);
        this.armyButtonList.push(this.scene.armyFinish);


        //this.scene.add.image(0,0, 'Order_Menu').setOrigin(0,0);
    }
    hideButtons(buttonGroup) { /* hides and deactivates normal buttons */
      if(buttonGroup == 'Order'){
        this.normalButtonList.forEach(button => {
            /*this.syllable3.play();*/
            button.setVisible(false);
            //button.input.enabled = false;
        });
      } else if (buttonGroup == 'Army'){
        this.armyButtonList.forEach(button => {
            /*this.syllable3.play();*/
            button.setVisible(false);
            //button.input.enabled = false;
        });
      }
    }

    showButtons(buttonGroup) { /* resets normal buttons */
      if(buttonGroup == 'Order'){
        this.normalButtonList.forEach(button => {
            button.setVisible(true);
            //button.input.enabled = true;
        });
      } else if (buttonGroup == 'Army'){
        this.armyButtonList.forEach(button => {
            button.setVisible(true);
            //button.input.enabled = true;
        });
      }
    }
    buildYourArmy(unitType){
      //this.scene.add.image(0,0,'Build_Your_Army').setOrigin(0,0);
      if(unitType == 'inital'){
        this.menuOption = 4;
        console.log(this.menuOption);
      } else if (unitType == 'soilder'){
        console.log('soilder');
      } else if (unitType == 'knight'){
        console.log('knight');
      } else if (unitType == 'mage'){
        console.log('mage');
      } else if (unitType == 'finish'){
        this.menuOption = 0;
        console.log(this.menuOption);
      }
    }
    growTerritory(){
      this.menuOption = 2;
      console.log(this.menuOption);

    }
    goRaiding(){
      this.menuOption = 1;
      console.log(this.menuOption);
    }
    stormCastle(){
      this.menuOption = 3;
      console.log(this.menuOption);
    }
    drawMenus(){
    if(this.menuOption == 0){
        this.orderMenuImage.setOrigin(0,0);
        this.visible = true;
        this.showButtons('Order');
        this.hideButtons('Army');
      } else if (this.menuOption == 4){
        this.visible = false;
        this.hideButtons('Order');
        this.showButtons('Army');
        this.scene.add.image(0,0,'test').setOrigin(0,0);
      } else if (this.menuOption == 2){
        this.visible = false;
        this.hideButtons('Order');
        this.hideButtons('Army');
        this.scene.add.text(38,68,'Pick A territory to claim', {fill: '#000'});
      } else if (this.menuOption == 1){
        this.visible = false;
        this.hideButtons('Order');
        this.hideButtons('Army');
        this.scene.add.text(38,68,'Get That Gold BOiiiii', {fill: '#000'});
      } else if (this.menuOption == 3){
        this.visible = false;
        this.hideButtons('Order');
        this.hideButtons('Army');
        this.scene.add.text(38,68,'let that Castle feel that heat', {fill: '#000'});
      }
      this.orderMenuImage.setVisible(this.visible);
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
