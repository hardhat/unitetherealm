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
		const s=this.army['soldier']>0?this.army['soldier']:0;
		const k=this.army['knight']>0?this.army['knight']:0;
		const m=this.army['mage']>0?this.army['mage']:0;
		
		return s+k*10+m*24;
	}
	
	cost(sol,kni,mag) {
		return sol+kni*8+mag*22;
	}
	
	findTarget() {
		var tar=null;
		
		if(this.might()==0) return null;
		if(this.armyPos==null) return null;
		var path = this.armyPos.searchFor('empty',7);
		if(!path) path = this.faction=='red'?this.armyPos.searchFor('blue',4):this.army.searchFor('red',4);
		if(!path) path = this.armyPos.searchFor('stronghold',6);
		if(!path) path = this.armyPos.searchFor('enemy',6);
		
		if(path) tar=path.pop();
		return tar;
	}
	
	moveToCastle() {
		if(this.might()==0) {
			this.armyPos=this.homeProv;
			return;
		}
		
		if(this.armyPos==null) return;
		
		const path=this.armyPos.searchFor('home',5);
		
		if(path==null) return;
		
		const home=path.pop();
		
		this.armyPos=home;
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
			
			this.actions.push( {step:'recruit soldiers',count:sol} );
			this.actions.push( {step:'recruit knights',count:kni} );
			this.actions.push( {step:'recruit mages',count:mag} );
		}
		
		while(1) {
			tar = this.findTarget();
			if(!tar) return;
			if( tar.owner == this.name) {
			this.actions.push( {step:'move',target:tar});
			} else if(tar.hasCastle == false) {
				this.actions.push( {step:'attack',target:tar});
				return;
			} else if(tar.might()>this.might()*1.2) {
				this.actions.push( {step:'raid',target:tar});
				return;
			} else {
				this.actions.push( {step:'seige',target:tar});
				return;
			}
		}
	}
	
	attack(from,to) {
		const f=from.might();
		const t=to.might();
		
		if(f>t) {
			to.army['soldier']-=6;
			if(to.army['soldier']<0) {
				to.army['knights']--;
				if(to.army['soldier']<0) {
					to.army['mage']--;
				}
			}
			if(to.army['soldier']<0) {
				to.army['soldier']=0;
			}
			if(to.army['knight']<0) {
				to.army['knight']=0;
			}
			if(to.army['mage']<0) {
				to.army['mage']=0;
			}
		}
	}
	
	applyBattle(target) {
		// for now do to the end of battle.
		while(this.might()>0 && target.might()>0) {
			attack(this,target);
			attack(target,this);
		}
	}
	
	applyActions() {
		if(this.actions.length==0) return null;
		const action=this.actions.shift();
		
		if(action.step=='recruit soldiers') {
			this.army['soldier']+=action.count;
			this.gold-=this.cost(action.count,0,0);
		} else if(action.step=='recruit knights') {
			this.army['knight']+=action.count;
			this.gold-=this.cost(0,action.count,0);
		} else if(action.step=='recruit mages') {
			this.army['mage']+=action.count;
			this.gold-=this.cost(0,0,action.count);
		} else if(action.step=='move') {
			const oldPos=this.armyPos;
			this.armyPos=action.target;
			oldPos.updateIcon();
			this.armyPos.updateIcon();
		} else if(action.step=='attack') {
			applyBattle(action.target);
		} else if(action.step=='raid') {
			action.target.ruler.wasRobbed=true;
			const amount=Math.ceil(action.target.ruler.calcTaxes()/2);
			this.gold += amount;
		} else if(action.step=='seige') {
			applyBattle(action.target);		
		}
		
		return action;
	}
	
	calcTaxes() {
		return 12*holdings.length + 3*holdings.length*holdings.length;
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
		var taxes = calcTaxes();
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
