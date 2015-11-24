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
		for(var x = 0; x < self.listeners.length; x++){
			self.listeners[x].func(self.gameState, self.gameState.frameNumber, self);
		}
		self.updateMemory.updateGameState(self.gameStates[self.gameStates.length-1])
		self.gameStates.push(self.gameStates[self.gameStates.length-1].step(self.extras));
		self.gameState = self.gameStates[self.gameStates.length-1];
		(self.gameStates.length > maxStateMemory) && self.gameStates.shift();
		var endTime = (new Date()).getTime();

		console.log(self.ahead)
		if(!self.over){
			var delay = endTime - startTime + Settings.physicsRate;
			if(self.client){
				delay = delay + Settings.clientAdjustAmount * (self.ahead - Settings.clientAheadDistance)
			}
			self.physicsLoops = setTimeout(Utilities.timed(false, runFunc), delay)
		}
	}

	this.physicsLoops = setTimeout(Utilities.timed(false, runFunc), Settings.physicsRate );

}

gameRunner.prototype.update = function(gameState){

	//Only the client ever calls this.
	this.client = true;

	var receivedFrameNumber = gameState.frameNumber;
	var currentFrameNumber = this.gameStates[this.gameStates.length-1].frameNumber;
	this.ahead = currentFrameNumber - receivedFrameNumber;

	var gameState = ElementManager.copy(gameState)
	var start = this.gameStates.reduce(function(old, cur, x){return cur.frameNumber == receivedFrameNumber ? x : old}, 0);

	this.gameStates[start] = gameState
	for(var x = start+1; x < this.gameStates.length; x++){
		this.updateMemory.updateGameState(this.gameStates[x-1]);
		this.gameStates[x] = this.gameStates[x-1].step(this.extras);
	}
	this.gameState = this.gameStates[this.gameStates.length-1];

}

gameRunner.prototype.addListener = function(name, callback){
	this.listeners.push({name: name, func: callback});
	this.listeners.sort(function(a,b){ return (b.name < a.name) ? 1 : -1 } );
	//console.log(this.listeners.map(function(n){return n.name}));
}

gameRunner.prototype.killListener = function(name){
	this.listeners = this.listeners.filter(function(el){ return el.name !== name });
}

gameRunner.prototype.updateElement = function(elementId, updateWith, frameNumber){
	this.updateMemory.update(elementId, updateWith, frameNumber);
}

gameRunner.prototype.end = function(){
	this.over = true;
}

module.exports = gameRunner;