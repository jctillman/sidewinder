var Food = require('../../common/js/elementFood.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');

//This is passed into the step function.  The step function, for the 
//state manager.
var elementFoodManager = function(elementManager){

	//Count how much food there is in the world, currently.
	var foodCount = 0;
	var len = elementManager.elements.length
	for(var x = 0; x < len; x++){
		foodCount = ( (elementManager.elements[x].type == 'food') ? foodCount + 1 : foodCount );
	}
	
	//Create more until we're at the minimum, foodStartAmount
	var total = Settings.foodMinimum();
	for(var x = foodCount; x < total; x++){
		elementManager.addElement(
			'food',
			new Vector(Math.random()*Settings.gridSize, Math.random()*Settings.gridSize),
			{ growing: true }
		);
	}
	

}

module.exports = elementFoodManager;
