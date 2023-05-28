// Game level goes here.
//import Phaser from 'phaser'
import TextButton from './game-objects/TextButton.js'
import Hud from './hud.js'
import Province from './province.js'
import Ruler from './ruler.js'

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
        this.load.audio('maintheme', [ 'assets/sfx/The_Bards_Tale.mp3','assets/sfx/The_Bards_Tale.wav' ]);
        this.load.audio('battletheme', [ 'assets/sfx/battle.mp3','assets/sfx/battle.wav' ]);
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
	this.music =  this.sound.add('maintheme', {
		volume: 0.2,
		loop: true
	})

	if (!this.sound.locked)
	{
		// already unlocked so play
		this.music.play()
	}
	else
	{
		// wait for 'unlocked' to fire and then play
		this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
			this.music.play()
		})
	}
	
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
	  this.prov = Array();
	  this.provText = Array();
	  this.ruler = Array();
      console.log(map);
	  const rulerId = ['🔴','🟠','🟡','🟢','🔵','🟣'];
	  let id=0;

      const tilewidth = data.tilewidth;
      const tileheight = data.tileheight;
	  this.tileHeight = tileheight;
      this.tileWidth = tilewidth;

      var tileWidthHalf = tilewidth / 2;
      var tileHeightHalf = tileheight / 2;

	  this.tileWidthHalf = tileWidthHalf;
	  this.tileHeightHalf = tileHeightHalf;

      this.layers = [];
      for(let j = 0; j < data.layers.length; j++){
        //console.log(j);
        if(data.layers[j].type == "objectgroup"){

		  // find poly and anchor
		  for(let i = 0; i < data.layers[j].objects.length; i++) {
			  var spawnX = data.layers[j].objects[i].x;
			  var spawnY = data.layers[j].objects[i].y;
			  const object = data.layers[j].objects[i];
			  if(object.name.startsWith('cap')) {
				  //console.log("province:"+object.name);

				  var castle = false;
				  var ruler = false;
				  var faction = false;
				  var hint = '';

				  for(let k=0; k<object.properties.length; k++) {
					  const prop = object.properties[k];

					  if(prop['name'] == 'hasCastle') castle=prop['value'];
					  if(prop['name'] == 'ruler') ruler=prop['value'];
					  if(prop['name'] == 'faction') faction=prop['value'];
					  if(prop['name'] == 'hint') hint=prop['value'];
				  }

				  console.log(object.name+' '+"hasCastle:" + castle + ", ruler:" + ruler + ', faction:' + faction);
				  
				  const prov = new Province( {scene: this, x: spawnX, y: spawnY, name:object.name, faction:faction, hint:hint, poly:[], hasCastle:castle });
				  if(ruler) {
					  const rulerObj = new Ruler({scene: this, name: ruler, faction: faction,homeProv:prov,id:rulerId[id],isPlayer:false});
					  id++;
					  this.ruler.push(rulerObj);
					  prov.newRuler(rulerObj);
				  }
				  this.prov.push(prov);

			  }
		  }

        }
		
		for(let i=0;i<this.prov.length;i++) {
			this.prov[i].calcAdjacent();
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
