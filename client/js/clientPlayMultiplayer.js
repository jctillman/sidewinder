var ElementManager = require('../../common/js/ElementManager.js');
var Settings = require('../../common/js/settings.js');
var Move = require('../../common/js/move.js');
var elementFoodManager = require('../../common/js/elementManagerFood.js');
var elementAIManager = require('../../common/js/elementManagerAi.js');
var GameRunner = require('../../common/js/gameRunner.js');
var Utilities = require('../../common/js/utilities.js');
var clientUtilities = require('../../client/js/clientUtilities.js');

var playGame = function(gameState, appState, playerId, finished, socket){
	var runningInstance = new GameRunner(gameState, [elementFoodManager, elementAIManager]);
	clientUtilities.clientHandling(runningInstance, appState, playerId, finished);
	runningInstance.addListener('moveEmitter', function(gameState, frameNumber){
		var player = gameState.getElement(playerId);
		if (player){
			var movr = new Move({aim: player.aim});
			if (frameNumber % Settings.sendMoveInterval == 0 && movr){
				socket.emit('playerMove', {move: movr, playerId: playerId})
			}
		}
	});
}

module.exports = function(appState, finishedCallback){
	var socket = io.connect('http://localhost:3000', {multiplex: false});
	socket.on('initialGameState', function(data){
		var gameState = ElementManager.copy(data.elementManager);
		var playerId = data.playerId;
		playGame(gameState, appState, playerId, finishedCallback, socket)
	});
}
