var RoomHandler = require('../../server/js/roomHandler.js');
var connectionHandler = require('../../server/js/connectionHandler.js');
//var games = [];
module.exports = function(wss){
	var rh = new RoomHandler();
	wss.on('connection', function(socket){
		console.log("A connection happened!");

		socket.on('message', function(data){

			if(data === 'multiplayer'){
				//console.log("Hey, let's start a multiplayer game!")
				connectionHandler.multiplayerConnection(rh, socket)
			}else if (data === 'watch'){
				//console.log("Let's watch a game!")
				connectionHandler.watchConnection(rh, socket)
			}

		})	
	});
}