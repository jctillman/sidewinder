var ElementManager = require('../../common/js/ElementManager.js');
var Settings = require('../../common/js/settings.js');
var Utilities = require('../../common/js/utilities.js');
var Move = require('../../common/js/move.js');
var View = require('../../client/js/view.js');
var Vector = require('../../common/js/vector.js');
var HighScore = require('../../client/js/highscore.js');
var elementFoodManager = require('../../common/js/elementManagerFood.js');
var elementAIManager = require('../../common/js/elementManagerAi.js');
var BoundingView = require('../../client/js/boundingview.js');

var playGame = function(gameState, appState, playerId, finished){
	var tempView = null,
	    stepsAfterDeath = 0;

	var physicsLoops = setInterval(Utilities.timed(true, function(){
		//Grab player, if player is there.
		var plyr = gameState.getElement(playerId)
		//If the player has died
		if(plyr == undefined){
			stepsAfterDeath++;
			if (stepsAfterDeath > Settings.framesToViewAfterDeath){
				window.clearInterval(physicsLoops)
				finished();
			}
		//Player lives!
		}else{
			var bv = BoundingView(plyr, appState.game.canvas);
			var movr = new Move({
				mousePosition: appState.game.mousePosition(),
				boundingView: bv,
				player: plyr
			});
			plyr.setMove(movr);
			tempView = new View(bv, appState.game.canvas, appState.game.context, plyr);
		}

		//First draws board; second draws high score.
		gameState.draw(appState.game.context, tempView);
		HighScore(gameState, appState.game.context);

		//move this shit around
		gameState = gameState.step([elementFoodManager, elementAIManager]);

	}), Settings.physicsRate)

} 

module.exports = function(appState, finishedCallback){
	var gameState = require('../../common/js/initialgamecreator.js')();
	var playerId = Utilities.addPlayer('human', gameState);
	playGame(gameState, appState, playerId, finishedCallback)
}
