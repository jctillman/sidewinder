var Utilities = require('../../common/js/utilities.js');
var Settings = require('../../common/js/settings.js');

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

gameRunner.prototype.setPlayerMove = function(playerId, playerMove){
	if(playerId){
		var plyr = this.gameState.getElement(playerId)
		plyr && playerMove && plyr.setMove(playerMove);
	}
}

gameRunner.prototy

gameRunner.prototype.addListener = function(name, callback){
	this.listeners.push({name: name, func: callback});
}

gameRunner.prototype.killListener = function(name){
	this.listeners = this.listeners.filter(function(el){ return el.name !== name });
}

module.exports = gameRunner;