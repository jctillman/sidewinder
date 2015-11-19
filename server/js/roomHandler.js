var Utilities = require('../../common/js/utilities.js');
var gameInitializer = require('../../common/js/initialgamecreator.js');
var Settings = require('../../common/js/settings.js');
var GameRunner = require('../../common/js/gameRunner.js');
var elementFoodManager = require('../../common/js/elementManagerFood.js');
var elementAIManager = require('../../common/js/elementManagerAi.js');

var RoomHandler = function(maxOccupancy){
	var self = this;	
	this.rooms = [];
	setInterval(function(){
		self.rooms = self.rooms.filter(function(room){
			var playerCount = room.gameState.elements.filter(function(element){
				return element.type == 'player' && element.isHuman == true;
			});
			return playerCount != 0;
		});
	}, Settings.roomDeleteInterval);

}

RoomHandler.prototype.getRoomWithSpace = function(){
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
			if (numPlayers < Settings.roomCapacity){
				return this.rooms[x];
			}
		}
	}

	this.rooms.push(new GameRunner( gameInitializer() , [elementFoodManager, elementAIManager]))
	return this.rooms[this.rooms.length-1];
}

RoomHandler.prototype.getRoomWithPlayers = function(){

	var most = undefined;
	var mostNumber = 0;
	for(var x = 0; x < this.rooms.length; x++){
		var roomState = this.rooms[x].gameState;
		var numPlayers = roomState.elements.filter(function(n){
				return n.type == 'player' && n.isHuman == true;
		}).length;
		if (numPlayers > mostNumber){
			most = this.rooms[x];
		}
	}
	if (most){
		return most;
	}

	this.rooms.push(new GameRunner( gameInitializer() , [elementFoodManager, elementAIManager]))
	return this.rooms[this.rooms.length-1];
}

module.exports = RoomHandler;