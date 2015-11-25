var ElementManager = require('../../common/js/ElementManager.js');
var Settings = require('../../common/js/settings.js');
var Move = require('../../common/js/move.js');
var elementFoodManager = require('../../common/js/elementManagerFood.js');
var elementAIManager = require('../../common/js/elementManagerAi.js');
var elementAIAdderManager = require('../../common/js/elementManagerAiAdder.js');
var GameRunner = require('../../common/js/gameRunner.js');
var Utilities = require('../../common/js/utilities.js');
var clientUtilities = require('../../client/js/clientUtilities.js');

var playGame = function(gameState, appState, playerId, finished){
	var runningInstance = new GameRunner(gameState, [elementFoodManager, elementAIManager, elementAIAdderManager], Settings.maxStateMemory);
	runningInstance.addListener('clientHandler', clientUtilities.clientHandling(appState, playerId, finished));
} 

module.exports = function(appState, finishedCallback){
	var gameState = require('../../common/js/initialgamecreator.js')();
	var playerId = Utilities.addPlayer({isHuman: true, name: appState.menu.nameText.value}, gameState);
	playGame(gameState, appState, playerId, finishedCallback)
}
