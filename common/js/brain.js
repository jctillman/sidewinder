var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
var Move = require('../../common/js/move.js'); 

var pathColidesClosely = function(AI, players, destination){

	for(var z = 0; z < players.length; z++){
		var one = players[z].box.expanded(50);
		var two = AI.box.expanded(50);
		if(one.intersects(two)){
			for(var a = 0; a < players[z].places.length-5; a = a + 5){
				var colis = Utilities.collision(AI.places[0], destination, players[z].places[a], players[z].places[a+5] )
				if (colis) {
					return true;
				}
			}
		}
	}
	return false;

}

module.exports = {
	setMove: function(AI, Players, Feed){	
		var dist = Settings.gridSize * 10;
		var spot = undefined; //AI.places[0].sub(AI.location.sub(AI.places[0]));
		for(var y = 0; y < Feed.length; y++){
			var newDist = Feed[y].location.dist(AI.places[0])
			var collides = pathColidesClosely(AI, Players, Feed[y].location);
			if (newDist < dist && !collides){
				spot = Vector.copy(Feed[y].location);
				dist = newDist;
			}
		}
		if(spot){
			AI.setMove(new Move({aim: spot}));
		}else{
			var currentlyBad = pathColidesClosely(AI, Players, AI.aim)
			if(currentlyBad){
				var Other = [];
				for(var x = 0; x < 30; x++){
					var rand = AI.places[0].add( new Vector( (Math.random()-0.5)*50, (Math.random()-0.5)*50) );
					var collides = false;
					for(var z = 0; z < Players.length; z++){
						var one = Players[z].box.expanded(50);
						var two = AI.box.expanded(50);
						if(one.intersects(two)){
							for(var a = 0; a < Players[z].places.length-5; a = a + 5){
								var colis = Utilities.collision(AI.places[0], rand, Players[z].places[a], Players[z].places[a+5] )
								if (colis){
									collides = true;
								}
							}
						}
					}
					if (!collides){
						var n = Vector.copy(rand)
						AI.setMove(new Move({aim: n}));
						break;
					}
				}
			}
		}
	}
}

