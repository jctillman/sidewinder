var Player = require('../../common/js/player.js');
var Food = require('../../common/js/food.js');
var Settings = require('../../common/js/settings.js');

var members = {
	grid: require('../../common/js/elementgrid.js'),
	player: require('../../common/js/elementplayer.js')
}

var EnvironmentState = function(){ 
	this.elements = [];
}

EnvironmentState.prototype.draw = function(context, view){

	//Clear shit
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);

	//Draw shit
	this.elements.forEach(function(element){
		element.draw(context, view);
	});

};

EnvironmentState.prototype.element = function(id){
	return this.elements.filter(function(n){
		return n.id === id;
	})[0]
}

EnvironmentState.prototype.addElement = function(name, location, options){
	var nw = new members[name.toLowerCase()](location, options);
	this.elements.push(nw);
	return nw.id;
}

EnvironmentState.prototype.step = function(){
	var ret = new EnvironmentState();
	ret.elements = this.elements.map(function(element){
		return element.step();
	});
	return ret;
}


EnvironmentState.prototype.advance = function(num){
	var ret = new EnvironmentState(this);
	for(var x = 0; x < num; x++){
		ret = ret.step();
	}
	return ret;
}

module.exports = EnvironmentState