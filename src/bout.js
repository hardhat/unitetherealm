// Game level goes here.
//import Phaser from 'phaser'
import Player from './player.js'
import Npc from './npc.js'
import Hud from './hud.js'

// Shows level background.  Stretch goal: scroll side to side
var destination = new Phaser.Geom.Point(15,9);
var tapPos = new Phaser.Geom.Point(0,0);


export default class Bout extends Phaser.Scene {
    constructor () {
        super('Bout');
        var borderOffset = new Phaser.Geom.Point(0,0);
        this.tapPos = tapPos;
        this.borderOffset = borderOffset;
        this.whoseTurn = -1;
    }

    preload ()
    {
        this.load.json('graveyard', 'assets/map/graveyard.json');
        this.load.tilemapTiledJSON('graveyardTileMap', 'assets/map/graveyard.json');
        this.load.spritesheet('tiles', 'assets/map/iso-64x64-outside.png', {frameWidth: 64, frameHeight: 64});

        this.stewie = this.load.spritesheet('stewie', 'assets/character/people-preview.png', { frameWidth: 64, frameHeight: 96 });

		this.bat = this.load.spritesheet('bat', 'assets/character/bat.png', { frameWidth: 64, frameHeight: 96 });
		this.thrall = this.load.spritesheet('thrall', 'assets/character/thrall-walk.png', { frameWidth: 64, frameHeight: 96 });
		this.rat = this.load.spritesheet('rat', 'assets/character/bat.png', { frameWidth: 64, frameHeight: 96 });
		this.dracula = this.load.spritesheet('dracula', 'assets/character/bat.png', { frameWidth: 64, frameHeight: 96 });

	/*
        this.load.image('healthbar', 'assets/hud/healthbar.png');
        this.load.image('hudBg', 'assets/hud/hud-bg.png');
	*/

        this.load.audio('uhh', [ 'assets/sfx/uhh.wav','assets/sfx/uhh.mp3','assets/sfx/uhh.ogg' ]);
        this.load.audio('maintheme', [ 'assets/sfx/maintheme.ogg','assets/sfx/maintheme.mp3' ]);
        this.load.audio('dractheme', [ 'assets/sfx/dractheme.ogg','assets/sfx/dractheme.mp3' ]);
    }

    create ()
    {
		this.UICamera = this.cameras.add(0,0,800,600);
		this.container = this.add.container();
		this.playfield = this.add.container();

        //scene = this;
        this.buildMap();


        /*var velocityX = 0;
        var velocityY = 0;*/
        /*var keys = this.input.keyboard.addKeys('W,S,A,D,LEFT,RIGHT,UP,DOWN');

        keys.W.on('down', function(event) {velocityY = -1});
        keys.W.on('up', function(event) {velocityY = 0});
        keys.S.on('down', function(event) {velocityY = 1});
        keys.S.on('up', function(event) {velocityY = 0});
        keys.A.on('down', function(event) {velocityX = -1});
        keys.A.on('up', function(event) {velocityX = 0});
        keys.D.on('down', function(event) {velocityX = 1});
        keys.D.on('up', function(event) {velocityX = 0});
        camX = camX + velocityX;
        camY = camY + velocityY;*/

        //this.cameras.main.setZoom();


        var health=30;

		var x=this.centerX + 200;
		var y=this.centerY + 400;


		this.playerSprite = this.add.sprite(x,y);
        this.playerSprite.setDepth(10000);
		console.log("The player sprite depth is " + this.playerSprite.depth);
		//this.playerSprite.setScale(4);
        this.playerSprite.flipX = true;
        var health=30;
        this.player = new Player({scene:this, sprite: this.playerSprite, x:x, y:y, health: health});
        this.player.createAnim('stewie');
        this.playerSprite.play('stewieidle');
		this.playfield.add(this.playerSprite);

        x=600;
        this.npcSprite = [this.add.sprite(x,y)];
        this.npcSprite[0].setDepth(10000);
        this.npc = [new Npc({scene: this, sprite: this.npcSprite[0], x:x, y:y, health: health, enemyType: 'thrall'})];
        this.npc[0].createAnims();
        this.npc[0].activityPoints=3;
		this.playfield.add(this.npcSprite[0]);


        x=500; y-=64;
        this.npcSprite.push(this.add.sprite(x,y));
        this.npcSprite[1].setDepth(10000);
        this.npc.push(new Npc({scene: this, sprite: this.npcSprite[1], x:x, y:y, health: health, enemyType: 'bat'}));
		this.playfield.add(this.npcSprite[1]);
		        this.npc[1].activityPoints=3;


        console.log("is npc [0] alive:" + this.npc[0].alive);
        if(this.npc[0].alive){
          this.npcSprite[0].play('thrallidle');
        }
        if(this.npc[1].alive){
          this.npcSprite[1].play('batidle');
        }

        this.hud = new Hud({scene: this, player: this.player, npc: this.npc});


        /* this.createSounds(); */
        var camX = x;
        var camY = y;
        this.cameras.main.setSize(1600, 1200);
        //this.cameras.main.setPosition(-camX, -camY);
        this.cameras.main.centerOn(camX+350, camY+300);
        this.cameras.main.setZoom(1.2);
        console.log(this.cameras.main.zoom);
        //var keyObj = this.input.keyboard.addKey('W');
        const cursors = this.input.keyboard.createCursorKeys();

        const controlConfig = {
          camera: this.cameras.main,
          left: cursors.left,
          right: cursors.right,
          up: cursors.up,
          down: cursors.down,
          zoomIn: this.input.keyboard.addKey('Q'),
          zoomOut: this.input.keyboard.addKey('E'),
          acceleration: 0.06,
          drag: 0.005,
          maxSpeed: 1.0
        };
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
        this.player.create();
        this.hud.create();
        this.npc.forEach(npc => {
			npc.create();
		});
	const arrow = '40 0 40 20 100 20 100 80 40 80 40 100 0 50';
        this.arrowPoly = this.add.polygon(this.player.sprite.x, this.player.sprite.y-45, arrow, 0x00ff00, 0.8);
	this.arrowPoly.setAngle(-90);
	this.arrowPoly.setScale(0.25);
	this.arrowPoly.setDepth(10000);
	this.playfield.add(this.arrowPoly);
		this.cameras.main.ignore(this.container);
		this.UICamera.ignore(this.playfield);
    }

  listToMatrix(list, elementPerSubArray){
    var matrix = [], i, k;
    for(i = 0, k = -1; i < list.length; i++){
      if(i % elementPerSubArray === 0){
        k++;
        matrix[k] = [];
      }
      matrix[k].push(list[i]);
    }
    return matrix;
  }


    buildMap(){
      /*var scene = this
      const data = scene.cache.json.get('graveyard');
      var map = this.add.tilemap('graveyard');
      console.log(map);

      const tilewidth = data.tilewidth;
      const tileheight = data.tileheight;
	  this.tileHeight = tileheight;

      var tileWidthHalf = tilewidth / 2;
      var tileHeightHalf = tileheight / 2;

	  this.tileWidthHalf = tileWidthHalf;
	  this.tileHeightHalf = tileHeightHalf;

      this.layers = [];
      for(let j = 0; j < data.layers.length; j++){
        console.log(j);
        if(data.layers[j].type == "objectgroup"){
          var spawnX = data.layers[j].objects[0].x;
          var spawnY = data.layers[j].objects[0].y;
          const object = data.layers[j].data;
          console.log("it worked");
          console.log(data.layers[j].objects[0].x);
          console.log(data.layers[j].objects[0].y);
          return {x: spawnX, y: spawnY};
        }
        const layer = data.layers[j].data;
        this.layers.push(layer);

        const mapwidth = data.layers[j].width;
        const mapheight = data.layers[j].height;

		this.mapacross=mapwidth;
		this.mapdown=mapheight;

        const centerX = 0;//mapwidth * tileWidthHalf;
        const centerY = 0;//16;

		this.centerX = centerX;
		this.centerY = centerY;

        let i = 0;
        for(let y = 0; y < mapheight; y++){
          for(let x = 0; x < mapwidth; x++){
            const id = layer[i] - 1;

            const tx = (x-y) * tileWidthHalf;
            const ty = (x+y) * tileHeightHalf;
            if(id != -1){
				const tile = scene.add.image(centerX + tx, centerY + ty, 'tiles', id);
				this.playfield.add(tile);

				tile.setDepth(centerY + ty);
            }
            i++;
          }
        }
      }*/
    }


    createSounds() {
		/*
        this.input.keyboard.on('keydown-SPACE', function () {
            console.log("Quiet.");
            this.sound.stopAll();
        }, this);

        this.womanWin = this.sound.add('womanwin');
        this.manWin = this.sound.add('manwin');
		*/
    }

    showSyllable(syllable,pos) {
        const posArray = [{x: 150,y: 300},{x:200,y:350},{x:150,y:300},{x:200,y:350}];

        var popup = this.add.sprite(posArray[pos].x, posArray[pos].y, 'syllable-'+syllable);

        this.tweens.add({
            targets: popup,
            y: 75,
            alpha: 0.05,
            duration: 1200,
            delay: 400
        });
        this.time.addEvent({ delay: 2000, callback: function() {
            popup.destroy();
        }, callbackScope: this, loop: false });
    }

	endOfTurn()
	{
		// player or enemy calls this when their activity points are used up.
		console.log("end of turn for "+(this.whoseTurn==-1?"player":"enemy "+this.whoseTurn));
		this.whoseTurn++;

		let active = null;

		while(this.whoseTurn>-1 && this.whoseTurn<this.npc.length) {
			console.log("Testing enemy "+this.whoseTurn+"; is alive?"+this.npc[this.whoseTurn].isAlive());
			if(this.npc[this.whoseTurn].isAlive()) {
				this.npc[this.whoseTurn].activityPoints=1;
				console.log(this.npc[this.whoseTurn].enemyType+" "+this.whoseTurn+" earned an activity point");
				active = this.npc[this.whoseTurn];
				break;
			}
			this.whoseTurn++;	// Try again
		}
		if(this.whoseTurn>=this.npc.length) {
			this.whoseTurn=-1;
		}

		if(this.whoseTurn==-1) {
			if(this.player.isAlive()) {
				console.log("Player earned an activity point");
				this.player.activityPoints=1;
				active=this.player;
			}
			// Could cull dead enemies here.
		}
		console.log("Active becomes "+(this.whoseTurn==-1?"player":"enemy "+this.whoseTurn));
		if(active) {
			this.arrowPoly.x=active.sprite.x;
			this.arrowPoly.y=active.sprite.y-45;
		} else {
			// Hide!
			this.arrowPoly.x=-100;
			this.arrowPoly.y=-100;
		}
	}

    update ()
    {
      this.controls.update();

      this.player.update();
      // Use actor for the animated figures.  Each player or npc has an actor.  This updates the player + npc.
	  this.npc.forEach(npc => {
		npc.update();
	  });
      this.hud.update();
    }

}
