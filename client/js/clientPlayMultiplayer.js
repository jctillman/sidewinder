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

var playGame = function(gameState, appState, playerId, finished, socket){
	var runningInstance = new GameRunner(gameState, [elementFoodManager, elementAIManager]);
	var stepsAfterDeath = 0;
	var tempView;
	runningInstance.addListener('moveHandler', function(gameState, frameNumber){
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
		if (frameNumber % Settings.sendMoveInterval == 0){
			if(movr)
			socket.emit('playerMove', {move: movr, playerId: playerId})
		}
	});
}


module.exports = function(appState, finishedCallback){
	var socket = io.connect('http://localhost:3000', {multiplex: false});
	socket.on('initialGameState', function(data){
		var gameState = ElementManager.copy(data.elementManager);
		var playerId = data.playerId;
		playGame(gameState, appState, playerId, finishedCallback, socket)
	});
}
