var ElementManager = require('../../common/js/ElementManager.js');
var Settings = require('../../common/js/settings.js');
var Move = require('../../common/js/move.js');
var elementFoodManager = require('../../common/js/elementManagerFood.js');
var elementAIManager = require('../../common/js/elementManagerAi.js');
var GameRunner = require('../../common/js/gameRunner.js');
//var Utilities = require('../../common/js/utilities.js');
var clientUtilities = require('../../client/js/clientUtilities.js');

var playGame = function(gameState, appState, playerId, finished, socket, name){
	var runningInstance = new GameRunner(gameState, [elementAIManager], Settings.maxStateMemory);
	
	runningInstance.addListener('clientHandler', clientUtilities.clientHandling(appState, playerId, finished, socket));
	runningInstance.addListener('moveEmitter', function(gameState, frameNumber){
		var player = gameState.getElement(playerId);
		if (player){
			var movr = new Move({aim: player.aim});
			if (frameNumber % Settings.sendMoveInterval == 0 && movr){
				socket.send(JSON.stringify({'tag':'playerMove', 'contents': {'frameNumber': frameNumber, aim: player.aim, playerId: playerId, name: name} }))
			}
		}
	});
	socket.onmessage = function(data){
		runningInstance.update(JSON.parse(data.data).contents);
	};

}

module.exports = function(appState, finishedCallback){
	var host = location.origin.replace(/^http/, 'ws') 
	var socket = new WebSocket(host);
	socket.onopen = function(){ socket.send("multiplayer") };
	socket.onmessage = function(data){
		var data = JSON.parse(data.data);
		var gameState = ElementManager
			.copy(data.contents.elementManager)
			.stepMultiple([elementAIManager], Settings.clientAheadDistance)
		var playerId = data.contents.playerId;
		playGame(gameState, appState, playerId, finishedCallback, socket, appState.menu.nameText.value)
	};
}
