var ElementManager = require('../../common/js/elementManager.js');
var Settings = require('../../common/js/settings.js');
var Move = require('../../common/js/move.js');
var elementFoodManager = require('../../common/js/elementManagerFood.js');
var elementAIManager = require('../../common/js/elementManagerAi.js');
var GameRunner = require('../../common/js/gameRunner.js');
var Utilities = require('../../common/js/utilities.js');
var clientUtilities = require('../../client/js/clientUtilities.js');

var playGame = function(gameState, appState, finished, socket){
	var runningInstance = new GameRunner(gameState, [elementAIManager]);
	runningInstance.addListener('watchHandler', clientUtilities.watchHandling(appState, finished, socket));
	socket.onmessage = function(data){
		var data = JSON.parse(data.data);
		runningInstance.update(data.contents, Settings.latencyAdjustment);
	};
}

module.exports = function(appState, finishedCallback){
	var host = location.origin.replace(/^http/, 'ws') 
	var socket = new WebSocket(host);
	socket.onopen = function(){ socket.send("watch") };
	socket.onmessage = function(data){
		var data = JSON.parse(data.data);
		var gameState = ElementManager.copy(data.contents.elementManager);
		playGame(gameState, appState, finishedCallback, socket)
	};
}
