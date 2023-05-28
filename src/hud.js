// Hud - the heads up display

// Heads up display shows the status of each character.  What is their health meter?  What is their power up energy for a special move?
import TextButton from './game-objects/TextButton.js'
var menuOption = 0;
var soilderCount = 0;
var knightCount = 0;
var mageCount = 0;
var visible = true;
export default class Hud extends Phaser.GameObjects.Group {
    constructor ({scene}) {
        super(scene);
        this.scene=scene;
        this.menuOption = menuOption;
        this.visible = visible;
        this.soilderCount = soilderCount;
        this.knightCount = knightCount;
        this.mageCount = mageCount;
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
      this.growButtonList = []; //creats list for grow territory buttons
      this.armyTextList = []; //create a list of all text need for the build your army shop
      //var orderMenuImage = this.scene.add.image(0,0, 'Order_Menu');

      //var orderMenuImage = this.scene.add.image(0,0, 'test');
      //this.orderMenuImage = orderMenuImage;
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

        this.scene.buySoilder = new TextButton(this.scene, 38, 58, 'Soilder', {fill: '#000'}, () => this.buildYourArmy('soilder'));
        this.scene.add.existing(this.scene.buySoilder);
        this.armyButtonList.push(this.scene.buySoilder);

        this.scene.buyKnight = new TextButton(this.scene, 38, 88, 'Knight', {fill: '#000'}, () => this.buildYourArmy('knight'));
        this.scene.add.existing(this.scene.buyKnight);
        this.armyButtonList.push(this.scene.buyKnight);

        this.scene.buyMage = new TextButton(this.scene, 38, 118, 'Mage', {fill: '#000'}, () => this.buildYourArmy('mage'));
        this.scene.add.existing(this.scene.buyMage);
        this.armyButtonList.push(this.scene.buyMage);

        this.scene.armyFinish = new TextButton(this.scene, 18, 148, 'Finish', {fill: '#000'}, () => this.buildYourArmy('finish'));
        this.scene.add.existing(this.scene.armyFinish);
        this.armyButtonList.push(this.scene.armyFinish);

        this.scene.armyBuy = new TextButton(this.scene, 170, 148, 'Buy', {fill: '#000'}, () => this.buildYourArmy('buy'));
        this.scene.add.existing(this.scene.armyBuy);
        this.armyButtonList.push(this.scene.armyBuy);


        var text1 = this.scene.add.text(18,15, 'Buy Units', {fill: '#000'});
        this.armyTextList.push(text1);
        var text2 = this.scene.add.text(110,38, 'Cost', {fill: '#000'});
        this.armyTextList.push(text2);
        var text3 = this.scene.add.text(170,38, 'Total', {fill: '#000'});
        this.armyTextList.push(text3);
        var text4 = this.scene.add.text(120,58, '1', {fill: '#000'});
        this.armyTextList.push(text4);
        var text5 = this.scene.add.text(120,88, '8', {fill: '#000'});
        this.armyTextList.push(text5);
        var text6 = this.scene.add.text(120,118, '10', {fill: '#000'});
        this.armyTextList.push(text6);
        this.soilderTotalText = this.scene.add.text(180,58, '0', {fill: '#000'});
        this.armyTextList.push(this.soilderTotalText);
        this.knightTotalText = this.scene.add.text(180,88, '0', {fill: '#000'});
        this.armyTextList.push(this.knightTotalText);
        this.mageTotalText = this.scene.add.text(180,118, '0', {fill: '#000'});
        this.armyTextList.push(this.mageTotalText);

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
    hideText(){
      this.armyTextList.forEach(text => {
          text.setVisible(false);
      })
    }
    showText(){
      this.armyTextList.forEach(text => {
          text.setVisible(true);
      })
    }
    buildYourArmy(unitType){
      //this.scene.add.image(0,0,'Build_Your_Army').setOrigin(0,0);
      if(unitType == 'inital'){
        this.menuOption = 4;

      } else if (unitType == 'soilder'){
        this.soilderCount += 1;
        this.updateArmyTotalText(unitType);

      } else if (unitType == 'knight'){
        this.knightCount += 1;
        this.updateArmyTotalText(unitType);

      } else if (unitType == 'mage'){
        this.mageCount += 1;
        this.updateArmyTotalText(unitType);

      } else if (unitType == 'finish'){
        this.menuOption = 0;

      } else if (unitType == 'buy'){
        this.menuOption = 0;
        this.soilderCount = 0;
        this.knightCount = 0;
        this.mageCount = 0;
        this.updateArmyTotalText(unitType);
      }
    }
    updateArmyTotalText(unit){
      if(unit == 'soilder'){
        this.soilderTotalText.setText(this.soilderCount);
      } else if (unit == 'knight'){
        this.knightTotalText.setText(this.knightCount);
      } else if (unit == 'mage'){
        this.mageTotalText.setText(this.mageCount);
      } else if (unit == 'buy'){
        this.mageTotalText.setText(this.mageCount);
        this.knightTotalText.setText(this.knightCount);
        this.soilderTotalText.setText(this.soilderCount);
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
        //this.orderMenuImage.setOrigin(0,0);
        this.visible = true;
        this.showButtons('Order');
        this.hideButtons('Army');
        this.hideText();
      } else if (this.menuOption == 4){
        this.visible = false;
        this.hideButtons('Order');
        this.showButtons('Army');
        //this.scene.add.image(0,0,'test').setOrigin(0,0);
        this.soilderTotalText.setVisible(true);
        this.knightTotalText.setVisible(true);
        this.mageTotalText.setVisible(true);
        this.showText();
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
      //this.orderMenuImage.setVisible(this.visible);
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
