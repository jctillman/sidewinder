var ElementManager = require('../../common/js/elementManager.js');
var Vector = require('../../common/js/vector.js');
var Settings = require('../../common/js/settings.js');

var maker = function(){
	var gameState = new ElementManager();
	var gridId = gameState.addElement('grid', new Vector(0,0), {});
	var foodStartAmount = Settings.foodMinimum();
	for(var x = 0; x < foodStartAmount; x++){
		gameState.addElement('food', new Vector(Math.random()*Settings.gridSize, Math.random()*Settings.gridSize),{})
	}
	return gameState;
}

module.exports = maker;