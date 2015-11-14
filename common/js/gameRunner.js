var Utilities = require('../../common/js/utilities.js');
var Settings = require('../../common/js/settings.js');
var BoundingView = require('../../client/js/boundingview.js');
var Move = require('../../common/js/move.js');
var View = require('../../client/js/view.js');
var HighScore = require('../../client/js/highscore.js');

function gameRunner(gameState, extras){
	var self = this;
	var frameNumber = 0;
	this.listeners = [];
	this.gameState = gameState;
	this.physicsLoops = setInterval(Utilities.timed(false, function(){
		frameNumber++;
		self.gameState = self.gameState.step(extras);
		for(var x = 0; x < self.listeners.length; x++){
			self.listeners[x].func(self.gameState, frameNumber);
		}

	}), Settings.physicsRate);
}

gameRunner.prototype.addListener = function(name, callback){
	this.listeners.push({name: name, func: callback});
}

gameRunner.prototype.killListener = function(name){
	this.listeners = this.listeners.filter(function(el){ return el.name !== name });
}

gameRunner.prototype.end = function(){
	clearInterval(this.physicsLoops);
}


module.exports = gameRunner;