var RoomHandler = require('../../server/js/roomHandler.js');
var connectionHandler = require('../../server/js/connectionHandler.js');
//var games = [];
module.exports = function(io){
	var rh = new RoomHandler();
	io.on('connection', function(socket){
		console.log("A connection happened!");

		//When someone wishes to join a game.
		socket.on('multiplayerGame', function(){
			connectionHandler.multiplayerConnection(rh, socket)
		});

		//When someone just wishes to start watching a game.
		socket.on('watchGame', function(){
			connectionHandler.watchConnection(rh, socket)
		});
		
	});
}