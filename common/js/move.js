var Vector = require('../../common/js/vector.js');
var Settings = require('../../common/js/settings.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var Move = function(options){

	if((options.aim && options.mousePosition) || (!options.aim && !options.mousePosition)){
		throw new Error("Must either provide mouse position xor an exact location.")
	}

	if(options.mousePosition && !options.canvas){
		throw new Error("If you provide a mouse position, you must provide a canvas.")
	}

	if(options.mousePosition && !options.boundingView){
		throw new Error("If you provide a mouse position, you must provide a bounding view.")
	}

	if(options.mousePosition){
		var viewBox = options.boundingView;
		var w = viewBox.right - viewBox.left;
		var h = viewBox.bottom - viewBox.top;
		var actualX = options.mousePosition.x / (options.canvas.width / w) + viewBox.left;
		var actualY = options.mousePosition.y / (options.canvas.height / h) + viewBox.top;
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