export default class Province extends Phaser.GameObjects.Group {
    constructor ({scene,x,y,poly,hasCastle}) {
        super(scene);

        this.scene=scene;

		this.x=x;
		this.y=y;
		this.owner='unaligned';
		this.faction='none';
		this.hasCastle=hasCastle;
		this.army = {'soldier':0, 'knight':0, 'mage':0};

		this.label = this.addFancyText(x,y);
        this.scene.provText.push(this.label);
        this.label.text=hasCastle?'Castle':'Prov';
        
		//this.scene.container.add(this.label);	// In UI layer.
    }
 
    create(){

    }
	
    update ()
    {

    }
	
	newRuler(ruler) (
		this.owner = ruler.name;
		this.faction = ruler.faction;
		this.army = {'soldier':0, 'knight':0, 'mage':0};
	)

	nextMonth() {
		// Update game state for this province
	}
	
	addFancyText(x,y) {
        var text = this.scene.add.text(x,y,'Prov',{font: "20px Arial Black", fill: "#fff"});
        text.setStroke('#00f', 5);
        text.setShadow(2,2,'#333333',2,true,true);
		text.setDepth(1000);
        return text;
    }
}
