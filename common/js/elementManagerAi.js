var Food = require('../../common/js/elementFood.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
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
	var Feed = elementManager.elements.filter(function(ele){return ele.type == 'food' && ele.shrinking == false;});

	if ( (time % Settings.aiCheckFrequency) == 0){


		for(var x = 0, len = AIs.length; x < len; x++){

			var AI = AIs[x]

			var dist = Settings.gridSize;
			var spot = AI.places[0].sub(AI.location.sub(AI.places[0]));
			var centerTipDist = AI.places[0].dist(AI.location);
			for(var y = 0; y < Feed.length; y++){

				var newDist = Feed[y].location.dist(AI.places[0])

				if (newDist < dist){
					spot = Vector.copy(Feed[y].location);
					dist = newDist;
				}
			}
			AI.setMove(new Move({aim: spot}));
		}


	}
	



	if (AIs.length < Settings.aiMinimum){
		Utilities.addPlayer('computer', elementManager);
	}


}

module.exports = elementManagerAi;
