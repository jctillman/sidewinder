var EnvironmentState = require('../../common/js/environmentState.js');
var Draw = require('../../client/js/draw.js');
var Settings = require('../../common/js/settings.js');
var Utilities = require('../../common/js/utilities.js');
var Move = require('../../common/js/move.js');
var View = require('../../common/js/view.js');
var Vector = require('../../common/js/vector.js');

var playGame = function(gameState, appState, playerId){


	var physicsLoops = setInterval(Utilities.timed(true, function(){

		gameState = gameState.step();

		var plyr = gameState.element(playerId)
		var movr = new Move({
			mousePosition: appState.game.mousePosition(),
			player: plyr
		});
		plyr.setMove(movr);


		var tempView = new View(appState.game.canvas, plyr.location);

		gameState.draw(appState.game.context, tempView);
		//console.log("!");
		//console.log(gameState)
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
	gameState.addElement('grid', new Vector(0,0), {});
	var playerId = gameState.addElement('player', new Vector(55,55),{});

	//gameState.addPlayer(100,150,10,10);
	// console.log(gameState)
	// var gs = gameState.step('dsd');
	// console.log(gs)
	// var ms = gs.step('dsds');
	// console.log(ms);

	playGame(gameState, appState, playerId)


}