var Utilities = require('../../common/js/utilities.js');
var gameInitializer = require('../../common/js/initialgamecreator.js');
var Settings = require('../../common/js/settings.js');
var GameRunner = require('../../common/js/gameRunner.js');
var elementFoodManager = require('../../common/js/elementManagerFood.js');
var elementAIManager = require('../../common/js/elementManagerAi.js');

var RoomHandler = function(maxOccupancy){
	this.rooms = [];
}

RoomHandler.prototype.getRoom = function(){
	//If we have no rooms.
	if (this.rooms.length <= 0){
		this.rooms.push(new GameRunner( gameInitializer() , [elementFoodManager, elementAIManager]))
		return this.rooms[0];
	}

	//If we have some rooms, can we add to any of them.
	if (this.rooms.length > 0){
		console.log("!")
		for(var x = 0; x < this.rooms.length; x++){
			var roomState = this.rooms[x].gameState
			var numPlayers = roomState.elements.filter(function(n){
				return n.type == 'player' && n.isHuman == true;
			}).length;
			console.log(numPlayers)
			if (numPlayers < Settings.roomCapacity){
				return this.rooms[x];
			}
		
		}
	}

	this.rooms.push(new GameRunner( gameInitializer() , [elementFoodManager, elementAIManager]))
	return this.rooms[this.rooms.length-1];
}

module.exports = RoomHandler;