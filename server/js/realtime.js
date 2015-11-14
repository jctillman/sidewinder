
var Utilities = require('../../common/js/utilities.js');
var gameInitializer = require('../../common/js/initialgamecreator.js');
var Settings = require('../../common/js/settings.js');
var GameRunner = require('../../common/js/gameRunner.js');

var games = [];
module.exports = function(io){

	games.push(gameInitializer());
	
	var runningInstance = new GameRunner( games[games.length-1], []);
	var num = 0;

	io.on('connection', function(socket){
		console.log("A connection!");

		//For now, let's just always use the old game
		var selectedGame = games.length-1;
		var playerId = Utilities.addPlayer('human', games[selectedGame]);
		var newGameInformation = {
			elementManager: games[selectedGame],
			playerId: playerId
		}
		socket.emit('initialGameState', newGameInformation)
		socket.on('playerMove', function(data){
			runningInstance.setPlayerMove(data.playerId, data.move)
		});
		runningInstance.addListener(playerId, function(gameState, frameNumber){
			if (frameNumber % 5 == 0){}
		});
		socket.on('disconnect', function(socket){
			runningInstance.killListener(playerId);
			console.log("A disconnection!");
		});
	});
}