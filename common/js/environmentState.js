var Player = require('../../common/js/player.js');
var Food = require('../../common/js/food.js');
var Settings = require('../../common/js/settings.js');

var EnvironmentState = function(toCopy){ 
	if(!toCopy){
		this.players = [];
		this.food = []; 
		for(var x = 0; x < Settings.foodStartAmount; x++){
			this.food.push(new Food());
		}
	}else{
		this.players = toCopy.players.map(function(n){return new Player(n)});
		this.food = toCopy.food.slice();  
	}
}

EnvironmentState.prototype.step = function(){
	
	var ret = new EnvironmentState()

	ret.players = [];
	for(var x = 0; x < this.players.length; x++){
		ret.players.push( this.players[x].step() );
	}

	ret.food = [];
	for(var x = 0; x < this.food.length; x++){
		var temp = this.food[x].step()
		temp && ret.food.push(temp);
	}

	for(var x = ret.food.length; x < Settings.foodStartAmount; x++){
		console.log("!")
		ret.food.push(new Food(true));
	}
	

	for(var x = 0; x < ret.players.length; x++){
		for(var y = 0; y < ret.food.length; y++){
			if (ret.players[x].places[0].dist(ret.food[y].location) < Settings.foodMaxSize && !ret.food[y].shrinking){
				ret.players[x] = ret.players[x].eatFood(Settings.foodValue);
				ret.food[y].shrinking = true;
			}
		}
	}

	return ret;

}

EnvironmentState.prototype.addPlayer = function(a,b,c,d){
	this.players.push(new Player(a,b,c,d));
}

EnvironmentState.prototype.advance = function(num){
	var ret = new EnvironmentState(this);
	for(var x = 0; x < num; x++){
		ret = ret.step();
	}
	return ret;
}

EnvironmentState.prototype.setMove = function(playerIndex, move){
	this.players[playerIndex].setMove(move);
}

module.exports = EnvironmentState