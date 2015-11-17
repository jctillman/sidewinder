var Utilities = require('../../common/js/utilities.js');
var Settings = require('../../common/js/settings.js');

var connectionHandler = {
	multiplayerConnection: function(rh, socket){
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
	},
	watchConnection: function(rh, socket){
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
	}
}

module.exports = connectionHandler;