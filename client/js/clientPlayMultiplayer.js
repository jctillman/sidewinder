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

var playGame = function(gameState, appState, playerId, finished, socket){
	var tempView = null,
	    stepsAfterDeath = 0;

	var physicsLoops = setInterval(Utilities.timed(false, function(){
		//Grab player, if player is there.
		var plyr = gameState.getElement(playerId)
		if(plyr == undefined){  	//If the player has died
			stepsAfterDeath++;
			if (stepsAfterDeath > Settings.framesToViewAfterDeath){
				window.clearInterval(physicsLoops)
				socket.disconnect();
				finished();
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

		//First draws board; second draws high score.
		gameState.draw(tempView);
		HighScore(gameState, appState.game.context, plyr && plyr.id);

		//step
		gameState = gameState.step([elementFoodManager, elementAIManager]);

	}), Settings.physicsRate)
} 

module.exports = function(appState, finishedCallback){

	var socket = io.connect('http://localhost:3000', {multiplex: false});

	socket.on('initialGameState', function(data){
		var gameState = ElementManager.copy(data.elementManager);
		var playerId = data.playerId;
		playGame(gameState, appState, playerId, finishedCallback, socket)
	});
}
