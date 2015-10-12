var Food = require('../../common/js/elementFood.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');

//This is passed into the step function.  The step function, for the 
//state manager.
var foodManager = function(elementManager){

	var foodCount = elementManager.elements.filter(function(ele){return ele.type == 'food';}).length;

	var ret = [];
	for(var x = foodCount, len = Settings.foodStartAmount; x < len; x++){
		elementManager.addElement('food', new Vector(Math.random()*Settings.gridSize, Math.random()*Settings.gridSize), { growing: true });
	}
	

}

module.exports = foodManager;
