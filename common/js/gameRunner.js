var Utilities = require('../../common/js/utilities.js');
var Settings = require('../../common/js/settings.js');
var Move = require('../../common/js/move.js');
var View = require('../../client/js/view.js');
var HighScore = require('../../client/js/highscore.js');
var ElementManager = require('../../common/js/elementManager.js');

function gameRunner(gameState, extras){
	var self = this;
	this.lastUpdateNum = 0;
	this.listeners = [];
	this.gameState = gameState;
	this.physicsLoops = setInterval(Utilities.timed(false, function(){
		//self.frameNumber++;
		self.gameState = self.gameState.step(extras);
		for(var x = 0; x < self.listeners.length; x++){
			self.listeners[x].func(self.gameState, self.gameState.frameNumber, self);
		}
	}), Settings.physicsRate);
}

gameRunner.prototype.update = function(gameState){

	var newFrame = gameState.frameNumber;
	var baseFrame = this.gameState.frameNumber;
	var lastUpdate = this.lastUpdateNum;

	if(lastUpdate > newFrame){
		//console.log("Old Frame!")
	}else{
		//console.log(newFrame, baseFrame)
		this.gameState = ElementManager.copy(gameState)
		if(baseFrame > newFrame){
			this.gameState.frameNumber--;
			this.gameState.frameNumber--;
			for(var x = 0; x < baseFrame - newFrame - 2; x++){
				console.log(baseFrame - newFrame);
				this.gameState = this.gameState.step();
			}
		}
		this.lastUpdateNum = newFrame;
	}


}

gameRunner.prototype.addListener = function(name, callback){
	this.listeners.push({name: name, func: callback});
}

gameRunner.prototype.killListener = function(name){
	this.listeners = this.listeners.filter(function(el){ return el.name !== name });
}

gameRunner.prototype.updateElement = function(elementId, updateWith){
	if(elementId && updateWith){
		var ele = this.gameState.getElement(elementId);
		ele && ele.update(updateWith);
	}
}

gameRunner.prototype.end = function(){
	clearInterval(this.physicsLoops);
}

module.exports = gameRunner;