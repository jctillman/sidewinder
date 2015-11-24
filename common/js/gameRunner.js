var Utilities = require('../../common/js/utilities.js');
var Settings = require('../../common/js/settings.js');
var Move = require('../../common/js/move.js');
var View = require('../../client/js/view.js');
var HighScore = require('../../client/js/highscore.js');
var ElementManager = require('../../common/js/elementManager.js');
var UpdateMemory = require('../../common/js/updateMemory.js');

function gameRunner(gameState, extras, maxStateMemory){
	var self = this;
	var maxStateMemory = maxStateMemory || 1;
	this.over = false;
	this.client = false;
	this.updateMemory = new UpdateMemory(maxStateMemory);
	this.ahead = 0;
	this.lastUpdateNum = 0;
	this.extras = extras;
	this.listeners = [];
	this.gameStates = [gameState];
	this.gameState = gameState;

	var runFunc = function(){
		
		var startTime = (new Date()).getTime();
		
		self.updateMemory.updateGameState(self.gameStates[self.gameStates.length-1])


		self.gameStates.push(self.gameStates[self.gameStates.length-1].step(extras));
		self.gameState = self.gameStates[self.gameStates.length-1];

		for(var x = 0; x < self.listeners.length; x++){
			self.listeners[x].func(self.gameState, self.gameState.frameNumber, self);
		}

		if (self.gameStates.length > maxStateMemory){
			self.gameStates.shift();
		}

		var endTime = (new Date()).getTime();
		//console.log("ahead", self.ahead)
		if(self.over){
			return;
		}

		if (!self.client){
			//console.log("Am not client")
			self.physicsLoops = setTimeout(Utilities.timed(false, runFunc), Settings.physicsRate - (endTime-startTime))
		}else{
			//console.log("Am client")
			if (self.ahead > Settings.clientAheadDistance){
				self.physicsLoops = setTimeout(Utilities.timed(false, runFunc), Settings.physicsRate - (endTime-startTime) + Settings.clientAdjustAmount)
			}else if (self.ahead < Settings.clientAheadDistance){
				self.physicsLoops = setTimeout(Utilities.timed(false, runFunc), Settings.physicsRate - (endTime-startTime) - Settings.clientAdjustAmount)
			}else{
				self.physicsLoops = setTimeout(Utilities.timed(false, runFunc), Settings.physicsRate - (endTime-startTime))
			}
		}
	}

	this.physicsLoops = setTimeout(Utilities.timed(false, runFunc), Settings.physicsRate );

}

gameRunner.prototype.update = function(gameState){

	var newFrame = gameState.frameNumber;
	var baseFrame = this.gameState.frameNumber;
	var lastUpdate = this.lastUpdateNum;

	var gameState = ElementManager.copy(gameState)

	this.ahead = this.gameStates[this.gameStates.length-1].frameNumber - gameState.frameNumber
	this.client = true;


	if(lastUpdate > newFrame){
		//console.log("Old Frame!")
	}else{

		var start = 0;
		for(var x = 0; x < this.gameStates.length; x++){
			if(this.gameStates[x].frameNumber == newFrame){
				start = x;
			}
		}

		this.gameStates[start] = gameState
		for(var x = start+1; x < this.gameStates.length; x++){
			this.updateMemory.updateGameState(this.gameStates[x-1]);
			this.gameStates[x] = this.gameStates[x-1].step(this.extras);
		}
		this.gameState = this.gameStates[this.gameStates.length-1];
	}


}

gameRunner.prototype.addListener = function(name, callback){
	this.listeners.push({name: name, func: callback});
}

gameRunner.prototype.killListener = function(name){
	this.listeners = this.listeners.filter(function(el){ return el.name !== name });
}

gameRunner.prototype.updateElement = function(elementId, updateWith, frameNumber){
	if(elementId && updateWith && !frameNumber){
		var ele = this.gameState.getElement(elementId);
		ele && ele.update(updateWith);
	}else{
		this.updateMemory.update(elementId, updateWith, frameNumber);
	}
}

gameRunner.prototype.end = function(){
	this.over = true;
}

module.exports = gameRunner;