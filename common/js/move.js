var Vector = require('../../common/js/vector.js');

var Move = function(options){

	if((options.aim && options.mousePosition) || (!options.aim && !options.mousePosition)){
		throw new Error("Must either provide mouse position xor an exact location.")
	}

	if(options.mousePosition && !options.player){
		throw new Error("If you provide a mouse position, you must provide a player.")
	}

	if(options.mousePosition){

		var playSpot = options.player.avLocation;
		var off = new Vector( -playSpot.x+cnv.width*0.5, -playSpot.y+cnv.height*0.5);
		//console.log(options.mousePosition)
		this.aim = options.mousePosition.sub(off);

	}else{
		if(!(options.aim instanceof Vector)){
			throw new Error("Move must have valid location")
		}else{
			this.aim = options.aim;
		}
	}

	this.split = options.split || false;
}

module.exports = Move