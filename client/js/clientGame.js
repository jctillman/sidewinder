var EnvironmentState = require('../../common/js/environmentState.js');
var Draw = require('../../client/js/draw.js');
var Settings = require('../../common/js/settings.js');
var Utilities = require('../../common/js/utilities.js');
var Move = require('../../common/js/move.js');


var playGame = function(gameState, appState, playerId){


	var physicsLoops = setInterval(Utilities.timed(false, function(){

		//gameState = gameState.step();
		//Draw.clear(appState, gameState, playerIndex);
		//Draw.self(appState, gameState, playerIndex);
		//Draw.others(appState, gameState, playerIndex);

		//var move = new Move({
		//	mousePosition: appState.game.mousePosition(),
		//	player: gameState.players[playerIndex]
		//});

		//gameState.setMove(playerIndex, move);
		//gameState = gameState.step();



	}), Settings.physicsRate)

} 


 
module.exports = function(appState){

	//Get game
	//For now, just as stop

	var gameState = new EnvironmentState();
	//gameState.addPlayer(100,100,10,10);
	//gameState.addPlayer(100,150,10,10);
	console.log(gameState)
	var gs = gameState.step('dsd');
	console.log(gs)
	var ms = gs.step('dsds');
	console.log(ms);
	playGame(gameState, appState, 0)


}