var Utilities = require('../../common/js/utilities.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');

var connectionHandler = {
	multiplayerConnection: function(rh, socket, name){
		var runningInstance = rh.getRoomWithSpace(); 
		var playerId = Utilities.addPlayer({isHuman: true, name: name}, runningInstance.gameState);
		var newGameInformation = {
			elementManager: runningInstance.gameState,
			playerId: playerId
		}
		socket.send(JSON.stringify({'tag': 'initialGameState', 'contents': newGameInformation}));

		socket.on('message', function(data){
			var data = JSON.parse(data)
			if (data.tag === 'playerMove'){
				var update = {aim: Vector.copy(data.contents.aim), name: data.contents.name};
				var playerId = data.contents.playerId;
				var frameNumber = data.contents.frameNumber - 1;
				runningInstance.updateElement(playerId, update, frameNumber)
			}
		});

		runningInstance.addListener(playerId, function(gameState, frameNumber){
			if (frameNumber % Settings.sendBoardInterval == 0){
				try{
					socket.send(JSON.stringify({tag: 'sendBoard', contents: runningInstance.gameState}))
				}catch(err){
					console.log(err)
				}
			}
		});

		try{
			socket.on('close', function(socket){
				runningInstance.killListener(playerId);
				console.log("A disconnection!");
			});
		}catch(err){
			console.log(err)
		}

	},
	watchConnection: function(rh, socket){
			var runningInstance = rh.getRoomWithPlayers(); 
			var newGameInformation = {
				elementManager: runningInstance.gameState,
			};
			socket.send(JSON.stringify({'tag': 'initialGameState', 'contents': newGameInformation}));
			
			var listenId = Utilities.makeUniqueId()
			runningInstance.addListener(listenId, function(gameState, frameNumber){
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