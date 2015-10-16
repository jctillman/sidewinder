var Element = require('../../common/js/element.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var ElementFood = Element({
	construct: function(location, options){
		//Mandatory
		this.type = 'food' 
		this.nothingMatters = true;
		this.inactive = true;
		this.priority = 1;
		//Non-mandatory
		this.location = location;
		this.growing = options.growing || false;
		this.shrinking = false;
		this.size = (options.growing) ? 0 : Settings.foodMaxSize
		this.color = Settings.foodPossibleColors[Math.floor(Math.random() * Settings.foodPossibleColors.length)];
		var rad = new Vector(this.size, this.size)
		this.box = new BoundingBox([this.location.add(rad), this.location.sub(rad)]);
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
		ret.location = ret.location
			.add(new Vector(Settings.gridSize/2, Settings.gridSize/2).sub(ret.location).scale(0.0002))
		var rad = new Vector(this.size, this.size)
		ret.box = new BoundingBox([this.location.add(rad), this.location.sub(rad)]);
		return (ret.size <= 0) ? undefined : ret;
	},
	copy: function(){
		var ret = Utilities.shallowCopy(this);
		ret.location = Vector.copy(this.location);
		ret.box = BoundingBox.copy(this.box);
		return ret;
	},
	relevantPoints: function(){
		return [Vector.copy(this.location)];
	},
	matters: function(element){
		return false;
	},
	encounters: function(element){
		throw new Error("This shouldn't ever be called.")
	}
});

module.exports = ElementFood;
