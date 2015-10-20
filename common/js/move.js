var Vector = require('../../common/js/vector.js');
var Settings = require('../../common/js/settings.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var Move = function(options){

	if((options.aim && options.mousePosition) || (!options.aim && !options.mousePosition)){
		throw new Error("Must either provide mouse position xor an exact location.")
	}

	if(options.mousePosition && !options.player){
		throw new Error("If you provide a mouse position, you must provide a player.")
	}

	if(options.mousePosition && !options.canvas){
		throw new Error("If you provide a mouse position, you must provide a canvas.")
	}

	if(options.mousePosition){
		var temp = new BoundingBox(options.player.places);
		var screenWidth = options.canvas.width;
		var screenHeight = options.canvas.height;
		var screenRatio = screenWidth / screenHeight;
		temp = temp.expanded(300);
		var boxRatio = (temp.right - temp.left) / (temp.bottom - temp.top) ;
		console.log(boxRatio / screenRatio)
		temp = temp.scaleVert( boxRatio / screenRatio )
		var viewBox = temp;

		var w = viewBox.right - viewBox.left;
		var h = viewBox.bottom - viewBox.top;	
		var actualX = options.mousePosition.x / (cnv.width / w) + viewBox.left;
		var actualY = options.mousePosition.y / (cnv.height / h) + viewBox.top;
		this.aim = new Vector(actualX, actualY);
	}else{
		if(!(options.aim instanceof Vector)){
			throw new Error("Move must have valid location")
		}else{
			this.aim = options.aim;
		}
	}

	this.aim.x = Math.max(Math.min(Settings.gridSize, this.aim.x), 0) 
	this.aim.y = Math.max(Math.min(Settings.gridSize, this.aim.y), 0)

	this.split = options.split || false;
}

module.exports = Move