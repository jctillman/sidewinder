
var Utilities = require('../../common/js/utilities.js');
var gameInitializer = require('../../common/js/initialgamecreator.js');
var games = [];


module.exports = function(io){

	//One connection occurs per start of multiplayer games.
	io.on('connection', function(socket){
		console.log("A connection!");

		//For now, let's just always make a new game.
		games.push(gameInitializer());
		var selectedGame = games.length-1;
		var playerId = Utilities.addPlayer('human', games[selectedGame]);
		var newGameInformation = {
			elementManager: games[selectedGame],
			playerId: playerId
		}

		socket.emit('initialGameState', newGameInformation)


		socket.on('disconnect', function(socket){
			console.log("A disconnection!");
		});
	});



}