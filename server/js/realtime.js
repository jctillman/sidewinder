var RoomHandler = require('../../server/js/roomHandler.js');
var connectionHandler = require('../../server/js/connectionHandler.js');
//var games = [];
module.exports = function(wss){
	var rh = new RoomHandler();
	wss.on('connection', function(socket){
		console.log("A connection happened!");

		//Single-player games happen entirely on client side.

		//Multi-player games happen here.
		//console.log(socket.__proto__)
		socket.on('message', function(data){
			console.log("!!!", data)
			socket.send("Hey, you got something from the server")
		})

		//Spectating a game happens here.
		//socket.on('watchGame', function(){
		//	connectionHandler.watchConnection(rh, socket)
		//});
		
	});
}