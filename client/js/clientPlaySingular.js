var ElementManager = require('../../common/js/ElementManager.js');
var Settings = require('../../common/js/settings.js');
var Move = require('../../common/js/move.js');
var View = require('../../client/js/view.js');
var Vector = require('../../common/js/vector.js');
var HighScore = require('../../client/js/highscore.js');
var elementFoodManager = require('../../common/js/elementManagerFood.js');
var elementAIManager = require('../../common/js/elementManagerAi.js');
var BoundingView = require('../../client/js/boundingview.js');
var GameRunner = require('../../common/js/gameRunner.js');

var playGame = function(gameState, appState, playerId, finished){
	var runningInstance = new GameRunner(gameState, [elementFoodManager, elementAIManager]);
	var stepsAfterDeath = 0;
	var tempView;
	runningInstance.addListener('moveHandler', function(gameState){
		var plyr = gameState.getElement(playerId);
		if(plyr == undefined){ 
			stepsAfterDeath++;
			if (stepsAfterDeath > Settings.framesToViewAfterDeath){
				finished();
				runningInstance = null;
			}
		}else{  					//Player lives!
			var bv = BoundingView(plyr, appState.game.canvas);
			var movr = new Move({
				mousePosition: appState.game.mousePosition(),
				boundingView: bv,
				canvas: appState.game.canvas
			});
			plyr.setMove(movr);
			tempView = new View(bv, appState.game.canvas);
		}
		gameState.draw(tempView);
		HighScore(gameState, appState.game.context, plyr && plyr.id);
	});
} 

module.exports = function(appState, finishedCallback){
	var gameState = require('../../common/js/initialgamecreator.js')();
	var playerId = Utilities.addPlayer('human', gameState);
	playGame(gameState, appState, playerId, finishedCallback)
}
