var ElementManager = require('../../common/js/ElementManager.js');
var Settings = require('../../common/js/settings.js');
var Utilities = require('../../common/js/utilities.js');
var Move = require('../../common/js/move.js');
var View = require('../../common/js/view.js');
var Vector = require('../../common/js/vector.js');
var HighScore = require('../../client/js/highscore.js');


var playGame = function(gameState, appState, playerId, finished){

	var tempView;
	var stepsAfterDeath = 0;

	var physicsLoops = setInterval(Utilities.timed(true, function(){

		//Grab player and make moves.
		var plyr = gameState.getElement(playerId)

		if(plyr == undefined){
			stepsAfterDeath++;
			if (stepsAfterDeath > Settings.framesToViewAfterDeath){
				window.clearInterval(physicsLoops)
				console.log(physicsLoops)
				finished();
			}
		}else{
			var movr = new Move({
				mousePosition: appState.game.mousePosition(),
				canvas: appState.game.canvas,
				player: plyr
			});
			plyr.setMove(movr);
			tempView = new View(appState.game.canvas, plyr);
		}

		//View is what is used in rendering.
		gameState.draw(appState.game.context, tempView);
		//Draw the high score HTML elements
		HighScore(gameState, appState.game.context);

		//set this shit
		gameState = gameState.step([
			require('../../common/js/elementManagerFood.js'),
			require('../../common/js/elementManagerAi.js')
		]);



	}), Settings.physicsRate)

} 


 
module.exports = function(appState, finished){
	var gameState = require('../../common/js/initialgamecreator.js')();
	var playerId = Utilities.addPlayer('human', gameState);
	playGame(gameState, appState, playerId, finished)
}
