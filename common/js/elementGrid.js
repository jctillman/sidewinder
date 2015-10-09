var Element = require('../../common/js/element.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');


var ElementGrid = Element({
	//Constructor actually ignores required things, because this is such a background.. thing.
	construct: function(location, options){
		this.location = new Vector(0,0);
		this.gridSize = Settings.gridSize;
		this.gridSpacing = Settings.gridSpacing;
		this.type = 'grid'
		this.priority = 0;
	},
	draw: function(context, view){

		//Setup
		var path = new Path2D();
		var off = view.off
		var gsi = this.gridSize;
		var gsp = this.gridSpacing

	    //Draw the grid.
		for(var x = 0; x <= Settings.gsi; x = x + Settings.gsi){
			path.moveTo(off.x, 						x+off.y);
			path.lineTo(off.x+Settings.gsi, 	x+off.y);
			path.moveTo(off.x+x, 					off.y);
			path.lineTo(off.x+x, 					Settings.gsi+off.y);
		}
		context.strokeStyle = Settings.gridColor; 
		context.lineWidth = 1;
		context.stroke(path); 

	},
	step: function(){
		return this;
		// console.log("!!!!!!")
		// var ret = {};
		// console.log(this);
		// var props = Object.keys(this).filter(function(n){return this.hasOwnProperty(n)});
		// for(var x = 0; x < props.length; x++){
		// 	ret[props[x]] = this[props[x]];
		// 	console.log(props[x])
		// }
		// return this;
	},
	matters: function(element){
		return false;
	}
});

module.exports = ElementGrid;