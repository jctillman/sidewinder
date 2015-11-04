var Element = require('../../common/js/element.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
var BoundingBox = require('../../common/js/boundingbox.js');
var _ = require('lodash');

var ElementFood = Element({
	construct: function(location, options){
		//Non-mandatory
		this.location = location;
		this.growing = options.growing || false;
		this.shrinking = false;
		this.size = (options.growing) ? 1 : Settings.foodMaxSize
		this.color = Settings.foodPossibleColors[Math.floor(Math.random() * Settings.foodPossibleColors.length)];
		//Mandatory
		this.type = 'food' 
		this.nothingMatters = true;
		this.inactive = true;
		this.priority = 1;
		var rad = new Vector(Settings.foodMaxSize, Settings.foodMaxSize)
		this.box = new BoundingBox([this.location.add(rad), this.location.sub(rad)]);
	},
	draw: function(view){
		view.drawCircle(this.location, this.size, 2, this.color)
	},
	step: function(){
		var ret = this.constructor.copy(this);
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
	copy: function(stuff){
		var ret = Utilities.shallowCopy(stuff);
		ret.location = Vector.copy(stuff.location);
		ret.box = BoundingBox.copy(stuff.box);
		return _.merge(new this(ret.location, {}), ret);
	},
	matters: function(element){
		return false;
	},
	encounters: function(element){
		throw new Error("This shouldn't ever be called.")
	}
});

module.exports = ElementFood;
