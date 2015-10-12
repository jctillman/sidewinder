var EnvironmentState = require('../../common/js/environmentState.js');
var Draw = require('../../client/js/draw.js');
var Settings = require('../../common/js/settings.js');
var Utilities = require('../../common/js/utilities.js');
var Move = require('../../common/js/move.js');
var View = require('../../common/js/view.js');
var Vector = require('../../common/js/vector.js');

var playGame = function(gameState, appState, playerId, finished){


	var physicsLoops = setInterval(Utilities.timed(false, function(){

		//Grab the player, and set the players move.
		var plyr = gameState.getElement(playerId)

		var movr = new Move({
			mousePosition: appState.game.mousePosition(),
			player: plyr
		});
		plyr.setMove(movr);

		//View is what is used in rendering.
		var tempView = new View(appState.game.canvas, plyr.location);
		gameState.draw(appState.game.context, tempView);

		//set this shit
		gameState = gameState.step([require('../../common/js/foodManager.js')]);

		var plyr = gameState.getElement(playerId)
		if(plyr == undefined){
			window.clearInterval(physicsLoops)
			console.log(physicsLoops)
			finished();
		}

	}), Settings.physicsRate)

} 


 
module.exports = function(appState, finished){


	var gameState = new EnvironmentState();
	var gridId =   gameState.addElement('grid', new Vector(0,0), {});
	for(var x = 0; x < Settings.foodStartAmount; x++){
		gameState.addElement('food', new Vector(Math.random()*Settings.gridSize, Math.random()*Settings.gridSize),{})
	}
	var playerId = gameState.addElement('player', new Vector(55,55),{});

	
	playGame(gameState, appState, playerId, finished)


}
