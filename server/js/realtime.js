
var Utilities = require('../../common/js/utilities.js');
var gameInitializer = require('../../common/js/initialgamecreator.js');
var Settings = require('../../common/js/settings.js');
var GameRunner = require('../../common/js/gameRunner.js');
var elementFoodManager = require('../../common/js/elementManagerFood.js');
var elementAIManager = require('../../common/js/elementManagerAi.js');

//var games = [];
module.exports = function(io){


	var runningInstance = new GameRunner( gameInitializer() , [elementFoodManager, elementAIManager]);
	var num = 0;
	io.on('connection', function(socket){
		console.log("A connection!");
		//For now, let's just always use the old game
		//var selectedGame = games.length-1;
		var playerId = Utilities.addPlayer('human', runningInstance.gameState);
		var newGameInformation = {
			elementManager: runningInstance.gameState,
			playerId: playerId
		}
		//console.log("asdasd", runningInstance.gameState.elements.length);
		//console.log(runningInstance.gameState)
		socket.emit('initialGameState', newGameInformation)
		socket.on('playerMove', function(data){
			var move = data.move;
			var playerId = data.playerId;
			runningInstance.setPlayerMove(data.playerId, data.move)
		});
		runningInstance.addListener(playerId, function(gameState, frameNumber){
			if (frameNumber % Settings.sendBoardInterval == 0){
				socket.emit('sendBoard', runningInstance.gameState)
			}
		});
		socket.on('disconnect', function(socket){
			runningInstance.killListener(playerId);
			console.log("A disconnection!");
		});
	});
}