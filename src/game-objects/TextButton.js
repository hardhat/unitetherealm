// Hud - the heads up display

// Heads up display shows the status of each character.  What is their health meter?  What is their power up energy for a special move?

export default class TextButton extends Phaser.GameObjects.Text {
    constructor (scene,x,y,text,style, callback) {
        super(scene,x,y,text,style);

        this.scene=scene;
        this.setInteractive({useHandCursor: true})
        .on('pointerover', () => this.enterButtonHoverState() )
        .on('pointerout', () => this.enterButtonRestState() )
        .on('pointerdown', () => this.enterButtonActiveState() )
        .on('pointerup', () => {
          this.enterButtonHoverState();
          callback();
        });
    }
    enterButtonHoverState() {
      this.setStyle({ fill: '#999'});
    }
    enterButtonRestState() {
      this.setStyle({ fill: '#000' });
    }
    enterButtonActiveState() {
      this.setStyle({ fill: '#8323de' });
    }
  }
