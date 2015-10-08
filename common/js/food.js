var Vector = require('../../common/js/vector.js');
var Settings = require('../../common/js/settings.js');

var possibleColors = [
	'red',
	'orange',
	'blue',
	'green',
	'gray',
	'purple',
	'maroon'
]


var Food = function(grow){
	this.location = new Vector(Math.random() * Settings.boardSize, Math.random() * Settings.boardSize);
	this.growing = !!grow;
	this.shrinking = false;
	this.size = (!!grow) ? 0 : Settings.foodMaxSize;
	this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
	if(this.growing){
		console.log(this);
	}
}

Food.prototype.step = function(){
	var ret = new Food();

	ret.location = this.location;
	ret.growing = this.growing;
	ret.shrinking = this.shrinking;
	ret.color = this.color;
	ret.size = this.size;

	if(ret.growing){
		ret.size = this.size + Settings.foodGrowthRate;
		if(ret.size >= Settings.foodMaxSize){
			ret.size = Settings.foodMaxSize;
			ret.growing = false;
		}
	}
	if(this.shrinking){
		ret.size = this.size - Settings.foodGrowthRate;
		if(ret.size <= 0){
			ret = undefined;
		}
	}

	
	return ret;
}

module.exports = Food;