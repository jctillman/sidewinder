var Food = require('../../common/js/elementFood.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
var Move = require('../../common/js/move.js');

var elementManagerAiAdder = function(elementManager){
	var AIs = elementManager.elements.filter(function(ele){return ele.type == 'player' && ele.isHuman == false;});
	if (AIs.length < Settings.aiMinimum){
		Utilities.addPlayer({isHuman: false}, elementManager);
	}
}

module.exports = elementManagerAiAdder;
