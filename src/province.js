export default class Province extends Phaser.GameObjects.Group {
    constructor ({scene,x,y,name,faction,hint,poly,hasCastle}) {
        super(scene);

        this.scene=scene;

		this.x=x;
		this.y=y;
		this.name = name;
		this.owner = 'unaligned';
		this.ruler = null;
		this.faction = 'none';
		this.hasCastle = hasCastle;
		this.army = {'soldier':0, 'knight':0, 'mage':0};
		this.adjacentProv = Array();
		this.adjacentHint = hint;
		
		this.label = this.addFancyText(x,y);
        this.scene.provText.push(this.label);
        this.label.text=(hasCastle?'🏰':'🏠')+'-'+(faction=='red'?'🔺':faction=='blue'?'🔹':'⬜️');
        
		//this.scene.container.add(this.label);	// In UI layer.
    }
	
	calcAdjacent() {
		var list=this.adjacentHint.split(',');
		var count=0;
		
		for(let i=0;i<list.length;i++) {
			var k;
			
			for(k=0;k<this.scene.prov.length;k++) {
				if(list[i] == this.scene.prov[k].name) {
						this.adjacentProv.push(this.scene.prov[k]);
						count++;
						break;
				}
			}
			if(k==this.scene.prov.length) console.log('bad adjacent province:'+list[i]);
		}
		
		console.log('prov '+this.name+' has '+count+' neighbours');
	}
 
    create(){

    }
	
    update ()
    {

    }
	
	adjacent() {
		return this.adjacentProv;
	}
	
	searchFor(type,maxDepth) {
		var result=null;
		
		if(maxDepth<=0) return null;
		for(let i=0;i<this.adjacentProv;i++) {
			const prov=this.adjacentProv[i];
			if(type=='empty' && prov.ruler==null) return [prov];
			else if(type=='red' && prov.faction=='red') return [prov];
			else if(type=='blue' && prov.faction=='blue') return [prov];
			else if(type=='home' && prov.ruler==this.ruler && prov.hasCastle) return [prov];
			else if(type=='stronghold' && prov.ruler!=this.ruler && prov.hasCastle) return [prov];
			else if(type=='enemy' && prov.ruler!=this.ruler && !prov.hasCastle) return [prov];
			
			// try deeper if on a safe square
			if{prov.ruler==this.ruler) {
				const list=prov.searchFor(type,maxDepth-1);
				if(list==null) cotinue;
				if(list.length+1<result.length) {
					result = [prov];
					result.push(list);
					result = result.flat();
				}
			}
		}
		return result;
	}
		
	might() {
		const s=this.army['soldier'];
		const k=this.army['knight'];
		const m=this.army['mage'];
		
		return s+k*10+m*24;
	}
	
	updateIcon() {
		const ruler=this.ruler;
		
        this.label.text=(this.hasCastle?'🏰':'🏠')+'-'+
			(ruler?ruler.id:'')+
			(this.faction=='red'?'🔺':this.faction=='blue'?'🔹':'⬜️')+
			(ruler && ruler.armyPos==this ?'⚔️':'');
		
	}
	
	newRuler(ruler) {
		this.owner = ruler.name;
		this.ruler = ruler;
		this.faction = ruler.faction;
		this.army = {'soldier':0, 'knight':0, 'mage':0};
		this.updateIcon();
	}

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
