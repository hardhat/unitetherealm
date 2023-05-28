// Game level goes here.
//import Phaser from 'phaser'
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
        this.load.json('country', 'assets/map/country.json');
        this.load.tilemapTiledJSON('countryTileMap', 'assets/map/country.json');
        this.load.spritesheet('tiles', 'assets/map/terrain_tiles24.png', {frameWidth: 32, frameHeight: 32});
        this.load.image('Order_Menu','assets/gamemenus/Orders_Menu.png');


			/*
        this.load.image('healthbar', 'assets/hud/healthbar.png');
        this.load.image('hudBg', 'assets/hud/hud-bg.png');
	*/

        this.load.audio('uhh', [ 'assets/sfx/uhh.wav','assets/sfx/uhh.mp3','assets/sfx/uhh.ogg' ]);
        //this.load.audio('maintheme', [ 'assets/sfx/maintheme.ogg','assets/sfx/maintheme.mp3' ]);
        //this.load.audio('dractheme', [ 'assets/sfx/dractheme.ogg','assets/sfx/dractheme.mp3' ]);
    }

    create ()
    {
		this.UICamera = this.cameras.add(0,0,800,600);
		this.container = this.add.container();
		this.playfield = this.add.container();
    //this.add.image(0,0,'Order_Menu').setOrigin(0,0);

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

    this.hud = new Hud({scene: this});
    this.hud.create();

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
      //this.hud.create();
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
      var scene = this
      const data = scene.cache.json.get('country');
      var map = this.add.tilemap('country');
      console.log(map);

      const tilewidth = data.tilewidth;
      const tileheight = data.tileheight;
	  this.tileHeight = tileheight;
	  this.tileWidth = tilewidth;2

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
		if(data.layers[j].type != "tilelayer") {
			continue;
		}
		// Apply tile layer
        const layer = data.layers[j].data;
        this.layers.push(layer);

        const mapwidth = data.layers[j].width;
        const mapheight = data.layers[j].height;

		this.mapacross=mapwidth;
		this.mapdown=mapheight;

        const centerX = tilewidth/2;//mapwidth * tileWidthHalf;
        const centerY = tileheight/2;//16;

		this.centerX = centerX;
		this.centerY = centerY;

        let i = 0;
        for(let y = 0; y < mapheight; y++){
          for(let x = 0; x < mapwidth; x++){
            const id = layer[i] - 1;

            const tx = x * tilewidth;
            const ty = y * tileheight;
            if(id != -1){
				const tile = scene.add.image(centerX + tx, centerY + ty, 'tiles', id);
				this.playfield.add(tile);

				//tile.setDepth(centerY + ty);
            }
            i++;
          }
        }
      }
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


    update ()
    {
      this.controls.update();
      //this.hud.create();
      this.hud.update();
    }

}
