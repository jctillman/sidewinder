var Element = require('../../common/js/element.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
var BoundingBox = require('../../common/js/BoundingBox.js');

var ElementGrid = Element({
	//Constructor actually ignores required things, because this is such a background.. thing.
	construct: function(location, options){
		//mandatory
		this.type = 'grid' 
		this.nothingMatters = true;
		this.inactive = true;
		this.priority = 0;
		//optional
		this.location = new Vector(0,0);
		this.gridSize = Settings.gridSize;
		this.gridSpace = Settings.gridSpace;
		this.box = new BoundingBox([new Vector(0,0), new Vector(this.gridSize, this.gridSize)]);
	},
	draw: function(view){ 
		var gsi = this.gridSize;
		var gsp = this.gridSpace;
		var color = Settings.gridColor
	    for(var x = 0; x <= gsi; x = x + gsp){
	    	var right = new Vector(0,x);
	    	var left = new Vector(gsi,x);
	    	var top = new Vector(x, 0);
	    	var bottom = new Vector(x, gsi);
	    	view.drawPath([left, right], 0.5, color)
	    	view.drawPath([top, bottom], 0.5, color)
	    }
	},
	step: function(){ 
		return this.copy();
	},
	copy: function(){
		var ret = Utilities.shallowCopy(this);
		ret.location = Vector.copy(this.location);
		ret.box = BoundingBox.copy(this.box);
		return ret;
	},
	matters: function(element){
		return false;
	},
	encounters: function(element){
		throw new Error('This should never be called, because .nothingMatters is set to be true.');
	}
});

module.exports = ElementGrid;
