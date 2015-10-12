var Element = require('../../common/js/element.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');

var ElementFood = Element({
	construct: function(location, options){
		//Mandatory
		this.type = 'food' 
		this.nothingMatters = false;
		this.priority = 1;
		//Non-mandatory
		this.location = location;
		this.growing = options.growing || false;
		this.shrinking = false;
		this.size = (options.growing) ? 0 : Settings.foodMaxSize
		this.color = Settings.foodPossibleColors[Math.floor(Math.random() * Settings.foodPossibleColors.length)];
	},
	draw: function(context, view){
		var off = view.off;
		var fs = this.location.add(off)
		var size = this.size;
		// console.log(size);
		context.beginPath();
		context.arc(fs.x, fs.y, size, 0, 2 * Math.PI, false);
		context.lineWidth = 1; 
		context.strokeStyle = this.color;
		context.stroke();
	},
	step: function(){
		var ret = this.copy();
		if(ret.shrinking){
			ret.size = ret.size - Settings.foodGrowthRate;
		}
		if(ret.growing){
			ret.size = ret.size + Settings.foodGrowthRate;
		}
		if(ret.size >= Settings.foodMaxSize){
			ret.size = Settings.foodMaxSize;
			ret.growing = false;
		}
		return (ret.size <= 0) ? undefined : ret;
	},
	copy: function(){
		var ret = Utilities.shallowCopy(this);
		ret.location = Vector.copy(this.location);
		return ret;
	},
	matters: function(element){
		return Utilities.foodPlayerCollision(this, element);
	},
	encounters: function(element){
		var ret = this.copy();
		ret.shrinking = true;
		return ret;
	}
});

module.exports = ElementFood;
