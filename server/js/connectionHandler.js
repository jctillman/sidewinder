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
		socket.send(JSON.stringify({'tag': 'initialGameState', 'contents': newGameInformation}));

		socket.on('message', function(data){
			var data = JSON.parse(data)
			if (data.tag === 'playerMove'){
				var move = data.contents.move;
				var playerId = data.contents.playerId;
				runningInstance.setPlayerMove(playerId, move)
			}
		});

		runningInstance.addListener(playerId, function(gameState, frameNumber){
			if (frameNumber % Settings.sendBoardInterval == 0){
				socket.send(JSON.stringify({tag: 'sendBoard', contents: runningInstance.gameState}))
			}
		});

		socket.on('close', function(socket){
			runningInstance.killListener(playerId);
			console.log("A disconnection!");
		});

	},
	watchConnection: function(rh, socket){
			var runningInstance = rh.getRoomWithPlayers(); 
			var newGameInformation = {
				elementManager: runningInstance.gameState,
			};
			socket.send(JSON.stringify({'tag': 'initialGameState', 'contents': newGameInformation}));
			
			var listenId = Utilities.makeUniqueId()
			runningInstance.addListener(listenId, function(gameState, frameNumber){
				console.log("!")
				if (frameNumber % Settings.sendBoardInterval == 0){
					socket.send(JSON.stringify({tag: 'sendBoard', contents: runningInstance.gameState}))
				}
			});

			socket.on('close', function(socket){
				runningInstance.killListener(listenId);
				console.log("A disconnection!");
			});
	}
}

module.exports = connectionHandler;