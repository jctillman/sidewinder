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
	if(grow === true){
		this.age = -Settings.foodCycleTime;
	}else{
		this.age = Math.random() * Settings.foodCycleTime;
	} 
	this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
	
}

Food.prototype.step = function(){
	var ret = new Food();
	ret.location = this.location;
	ret.color = this.color;
	ret.age = this.age + Settings.physicsRate;
	if (ret.age > Settings.foodCycleTime){
		ret.age = ret.age - Settings.foodCycleTime;
	}
	return ret;
}

module.exports = Food;