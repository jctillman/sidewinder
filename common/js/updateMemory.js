var UpdateMemory = function(maxFrames){

	this.maxFrames = maxFrames
	this.updates = {}

}

UpdateMemory.prototype.update = function(elementId, update, frameNumber){
	
	if (frameNumber in this.updates){
		this.updates[frameNumber][elementId] = update;
	}else{
		this.updates[frameNumber] = {};
		if(! (elementId in this.updates[frameNumber])) {
			this.updates[frameNumber][elementId] = {}
		}

		var updateKeys = Object.keys(update);
		for(var x = 0; x < updateKeys.length; x++){
			this.updates[frameNumber][elementId][updateKeys[x]] = update[updateKeys[x]];
		}
	}

	var frames = Object.keys(this.updates)
	if(frames.length > this.maxFrames){
		frames.sort(function(a,b){return parseInt(a) - parseInt(b)})
		var oldFrame = frames[0];
		delete this.updates[oldFrame]
	}

}

UpdateMemory.prototype.updateGameState = function(gameState){
	var frameNumber = gameState.frameNumber;
	if(frameNumber in this.updates){
		var elements = Object.keys( this.updates[frameNumber] )
		for(var x = 0; x < elements.length; x++){
			var element = gameState.getElement(elements[x]);
			element.update(this.updates[frameNumber][elements[x]]);
		}
	}
}

UpdateMemory.prototype.frameUpdate = function(frameNumber){
	if (frameNumber in this.updates){
		return this.updates[frameNumber]
	}else{
		return {};
	}
}

module.exports = UpdateMemory;