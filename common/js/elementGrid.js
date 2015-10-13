var Element = require('../../common/js/element.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');

var ElementGrid = Element({
	//Constructor actually ignores required things, because this is such a background.. thing.
	construct: function(location, options){
		//mandatory
		this.type = 'grid' 
		this.nothingMatters = true;
		this.priority = 0;
		//optional
		this.location = new Vector(0,0);
		this.gridSize = Settings.gridSize;
		this.gridSpace = Settings.gridSpace;
	},
	draw: function(context, view){ 
		//Setup
		var path = new Path2D();
		var off = view.off
		var gsi = this.gridSize;
		var gsp = this.gridSpace;
	    //Draw the grid.
		for(var x = 0; x <= gsi; x = x + gsp){
			path.moveTo(off.x, 		x+off.y);
			path.lineTo(off.x+gsi, 	x+off.y);
			path.moveTo(off.x+x, 	off.y);
			path.lineTo(off.x+x, 	gsi+off.y);
		}
		context.strokeStyle = Settings.gridColor; 
		context.lineWidth = 1
		context.stroke(path); 
	},
	step: function(){ 
		return this.copy();
	},
	copy: function(){
		var ret = Utilities.shallowCopy(this);
		ret.location = Vector.copy(this.location);
		return ret;
	},
	relevantPoints: function(){
		return [new Vector(0,0)];
	},
	matters: function(element){
		return false;
	},
	encounters: function(element){
		throw new Error('This should never be called, because .nothingMatters is set to be true.');
	}
});

module.exports = ElementGrid;
