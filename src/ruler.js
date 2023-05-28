export default class Ruler extends Phaser.GameObjects.Group {
    constructor ({scene,name,faction,id,homeProv,isPlayer}) {
        super(scene);

        this.scene=scene;

		this.name = name;
		this.id = id;
		this.faction = faction;
		this.homeProv = homeProv;
		this.armyPos = homeProv;
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
	
	might() {
		const s=this.army['soldier'];
		const k=this.army['knight'];
		const m=this.army['mage'];
		
		return s+k*10+m*24;
	}
	
	cost(sol,kni,mag) {
		return sol+kni*8+mag*22;
	}
	
	findTarget() {
		var tar=null;
		
		return tar;
	}
	
	moveToCastle() {
		
	}
	
	planActions() {
		this.actions = Array();
		
		const s=this.army['soldier'];
		const k=this.army['knight'];
		const m=this.army['mage'];
		
		this.moveToCastle();
		if(this.armyPos.hasCastle) {
			var sol=0;
			var kni=0;
			var mag=0;
			
			var unstable=true;
			
			do {
				unstable=false;	// assume no changes this round.

				const m2k=(k+kni)>0?0:Math.floor((m+mag)/3/(k+kni));
				const m2s=(s+sol)>0?0:Math.floor((m+mag)/60/(s+sol));
				const k2s=(s+sol)>0?0:Math.floor((k+kni)/20/(s+sol));
			
				//do we need a mage?
				if(m2k>(m+mag) || m2s>(m+mag)) {
					if(this.gold <= cost(sol,kni,mag+1)) {
						mag++;
						unstable=true;
					}
				} else
				//do we need a knight?
				if(k2s>(k+kni)) {
					if(this.gold <= cost(sol,kni+1,mag)) {
						kni++;
						unstable=true;
					}
				} else {
					if(this.gold <= cost(sol+1,kni,mag)) {
						sol++;
						unstable=true;
					}
				}
			} while(unstable);
			
			actions.push( {step:'recruit soldiers',count:sol} );
			actions.push( {step:'recruit knights',count:kni} );
			actions.push( {step:'recruit mages',count:mag} );
		}
		
		while(1) {
			tar = this.findTarget();
			if(!tar) return;
			if( tar.owner == this.name) {
			actions.push( {step:'move',target:tar});
			} else if(tar.hasCastle == false) {
				actions.push( {step:'attack',target:tar});
				return;
			} else if(tar.might()>this.might()*1.2) {
				actions.push( {step:'raid',target:tar});
				return;
			} else {
				actions.push( {step:'seige',target:tar});
				return;
			}
		}
	}
	
	applyActions() {
		
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
