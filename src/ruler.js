export default class Ruler extends Phaser.GameObjects.Group {
    constructor ({scene,name,id,homeProv,isPlayer}) {
        super(scene);

        this.scene=scene;

		this.name = name;
		this.id = id;
		this.faction = faction;
		this.homeProv = homeProv;
		this.isPlayer = isPlayer;
		this.holdings = [homeProv];
		this.gold = 12;
		this.taxes = 12;
		this.wasRobbed = false;
		this.army = {'soldier':0, 'knight':0, 'mage':0};
    }
 
    create(){

    }
	
    update ()
    {

    }

	nextMonth() {
		// Update game state for this ruler
		let holdings = Array();
		const prov = this.scene.prov;
		for(let i=0; i < prov.length; i++) {
				if(prov.owner == this.name) {
					holdings.push(prov);
				}
		}
		this.holdings = holdings;
		var taxes = 12*holdings.length + 3*holdings.length*holdings.length;
		if(this.wasRobbed) {
			taxes = Math.floor(taxes/2);
		}
		this.gold += taxes;
		this.taxes = taxes;
		this.wasRobbed=false;
	}
	
	addFancyText(x,y) {
        var text = this.scene.add.text(x,y,'',{font: "20px Arial Black", fill: "#fff"});
        text.setStroke('#00f', 5);
        text.setShadow(2,2,'#333333',2,true,true);
		text.setDepth(1000);
        return text;
    }
}
