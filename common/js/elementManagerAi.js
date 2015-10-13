var Food = require('../../common/js/elementFood.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/vector.js');
var Move = require('../../common/js/move.js');

//This is passed into the step function.  The step function, for the 
//state manager.
var time = 0;

//This needs to be made waaay cleaner than it is, and
//also needs to be made so that the AI doesn't suicide
//so easily.
var elementManagerAi = function(elementManager){
	time++;
	var AIs = elementManager.elements.filter(function(ele){return ele.type == 'player' && ele.isHuman == false;});

	var Feed = elementManager.elements.filter(function(ele){return ele.type == 'food'});

	// if ( (time % Settings.aiCheckFrequency) == 0){
	// 	for(var x = 0, len = AIs.length; x < len; x++){

	// 		var dist = Settings.gridSize;
	// 		var index = 0;
	// 		var spot = new Vector(0,0);
	// 		for(var y = 0; y < Feed.length; y++){

	// 			var newDist = Feed[y].location.dist(AIs[x].location)
	// 			if (newDist < dist){
	// 				spot = Vector.copy(Feed[y].location);
	// 				dist = newDist;
	// 			}

	// 		}

	// 		AIs[x].setMove(new Move({aim: spot}));

	// 	}
	// }
	//console.log(AIs.length, Settings.aiMinimum)
	if (AIs.length < Settings.aiMinimum){
		elementManager.addElement('player', new Vector(Math.random()*Settings.gridSize, Math.random()*Settings.gridSize), {isHuman: false});
	}


}

module.exports = elementManagerAi;
