var Food = require('../../common/js/elementFood.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
var Move = require('../../common/js/move.js');

var Brain = require('../../common/js/brain.js');

//This is passed into the step function.  The step function, for the state manager
var elementManagerAi = function(elementManager){
	var Players = elementManager.elements.filter(function(ele){return ele.type == 'player'})
	var AIs = elementManager.elements.filter(function(ele){return ele.type == 'player' && ele.isHuman == false;});
	var Feed = elementManager.elements.filter(function(ele){return ele.type == 'food' && ele.shrinking == false;});
	if ( (elementManager.frameNumber % Settings.aiCheckFrequency) == 0){
		for(var x = 0, len = AIs.length; x < len; x++){
			Brain.setMove(AIs[x], Players, Feed)
		}
	}
}

module.exports = elementManagerAi;
