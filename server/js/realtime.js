
var Utilities = require('../../common/js/utilities.js');
var gameInitializer = require('../../common/js/initialgamecreator.js');
var Settings = require('../../common/js/settings.js');
var GameRunner = require('../../common/js/gameRunner.js');
var elementFoodManager = require('../../common/js/elementManagerFood.js');
var elementAIManager = require('../../common/js/elementManagerAi.js');
var RoomHandler = require('../../server/js/roomHandler.js');
//var games = [];
module.exports = function(io){

	var rh = new RoomHandler();

	io.on('connection', function(socket){
		console.log("A connection!");
		socket.on('multiplayerGame', function(data){
			console.log("Trying to start a multiplayer game!");
			var runningInstance = rh.getRoomWithSpace(); 

			var playerId = Utilities.addPlayer('human', runningInstance.gameState);
			var newGameInformation = {
				elementManager: runningInstance.gameState,
				playerId: playerId
			}
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

		})

		socket.on('watchGame', function(data){
			console.log("Trying to watch a game!");
			var runningInstance = rh.getRoomWithSpace(); 
			var newGameInformation = {
				elementManager: runningInstance.gameState,
			};
			socket.emit('initialWatchState', newGameInformation)
			var listenId = Utilities.makeUniqueId()
			runningInstance.addListener(listenId, function(gameState, frameNumber){
				if (frameNumber % Settings.sendBoardInterval == 0){
					socket.emit('sendBoard', runningInstance.gameState)
				}
			});

			socket.on('disconnect', function(socket){
				runningInstance.killListener(listenId);
				console.log("A disconnection!");
			});

		});



	});
}