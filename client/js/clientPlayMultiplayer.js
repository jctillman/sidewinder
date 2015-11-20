var ElementManager = require('../../common/js/ElementManager.js');
var Settings = require('../../common/js/settings.js');
var Move = require('../../common/js/move.js');
var elementFoodManager = require('../../common/js/elementManagerFood.js');
var elementAIManager = require('../../common/js/elementManagerAi.js');
var GameRunner = require('../../common/js/gameRunner.js');
var Utilities = require('../../common/js/utilities.js');
var clientUtilities = require('../../client/js/clientUtilities.js');

var playGame = function(gameState, appState, playerId, finished, socket){
	var runningInstance = new GameRunner(gameState, [elementAIManager]);
	runningInstance.addListener('clientHandler', clientUtilities.clientHandling(appState, playerId, finished, socket));
	runningInstance.addListener('moveEmitter', function(gameState, frameNumber){
		var player = gameState.getElement(playerId);
		if (player){
			var movr = new Move({aim: player.aim});
			if (frameNumber % Settings.sendMoveInterval == 0 && movr){
				socket.send(JSON.stringify({'tag':'playerMove', 'contents': {move: movr, playerId: playerId} }))
			}
		}
	});
	socket.onmessage = function(data){
		var data = JSON.parse(data.data);
		runningInstance.update(data.contents, Settings.latencyAdjustment);
	};

}

module.exports = function(appState, finishedCallback){
	var host = location.origin.replace(/^http/, 'ws') 
	var socket = new WebSocket(host);
	socket.onopen = function(){ socket.send("multiplayer") };
	socket.onmessage = function(data){
		var data = JSON.parse(data.data);
		var gameState = ElementManager.copy(data.contents.elementManager);
		var playerId = data.contents.playerId;
		playGame(gameState, appState, playerId, finishedCallback, socket)
	};
}
