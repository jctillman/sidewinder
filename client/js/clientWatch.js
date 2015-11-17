var ElementManager = require('../../common/js/ElementManager.js');
var Settings = require('../../common/js/settings.js');
var Move = require('../../common/js/move.js');
var elementFoodManager = require('../../common/js/elementManagerFood.js');
var elementAIManager = require('../../common/js/elementManagerAi.js');
var GameRunner = require('../../common/js/gameRunner.js');
var Utilities = require('../../common/js/utilities.js');
var clientUtilities = require('../../client/js/clientUtilities.js');

var playGame = function(gameState, appState, finished, socket){
	var runningInstance = new GameRunner(gameState, [elementAIManager]);
	runningInstance.addListener('clientHandler', clientUtilities.watchHandling(appState, finished, socket));
	socket.on('sendBoard', function(data){
		runningInstance.update(data, Settings.latencyAdjustment);
	})

}

module.exports = function(appState, finishedCallback){
	var socket = io.connect('192.168.1.153:3000', {multiplex: false});
	socket.on('initialWatchState', function(data){
		var gameState = ElementManager.copy(data.elementManager);
		playGame(gameState, appState, finishedCallback, socket)
	});
	socket.emit('watchGame');
}
