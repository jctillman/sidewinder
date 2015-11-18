var RoomHandler = require('../../server/js/roomHandler.js');
var connectionHandler = require('../../server/js/connectionHandler.js');
//var games = [];
module.exports = function(io){
	var rh = new RoomHandler();
	io.on('connection', function(socket){
		console.log("A connection happened!");

		//Single-player games happen entirely on client side.

		//Multi-player games happen here.
		socket.on('multiplayerGame', function(){
			connectionHandler.multiplayerConnection(rh, socket)
		});

		//Spectating a game happens here.
		socket.on('watchGame', function(){
			connectionHandler.watchConnection(rh, socket)
		});
		
	});
}