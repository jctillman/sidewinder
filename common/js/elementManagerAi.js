var Food = require('../../common/js/elementFood.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
var Move = require('../../common/js/move.js');

var Brain = require('../../common/js/brain.js');

//This is passed into the step function.  The step function, for the 
//state manager.
var time = 0;

//This needs to be made waaay cleaner than it is, and
//also needs to be made so that the AI doesn't suicide
//so easily.
var elementManagerAi = function(elementManager){
	time++;

	var Players = elementManager.elements.filter(function(ele){return ele.type == 'player'})
	var AIs = elementManager.elements.filter(function(ele){return ele.type == 'player' && ele.isHuman == false;});
	var Feed = elementManager.elements.filter(function(ele){return ele.type == 'food' && ele.shrinking == false;});

	if ( (time % Settings.aiCheckFrequency) == 0){
		for(var x = 0, len = AIs.length; x < len; x++){
			Brain.setMove(AIs[x], Players, Feed)
		}
	}
	



	if (AIs.length < Settings.aiMinimum){
		Utilities.addPlayer('computer', elementManager);
	}


}

module.exports = elementManagerAi;
