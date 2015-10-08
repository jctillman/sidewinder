var Vector = require('../../common/js/vector.js')
var Settings = require('../../common/js/settings.js')
var averageSpot = function(arr){
	return arr.reduce(function(build, stuff){
			return build.add(stuff);
	}, new Vector(0,0)).scale(1/arr.length);
}

var initializeLocation = function(x,y, direction, length){
	var radians = 2 * direction / 360 * Math.PI;
	var distX = Math.sin(radians);
	var distY = Math.cos(radians); 

	var places = [];
	for(var i = 0; i < length; i++){
  		places.push(new Vector(
  			x+Settings.segmentSpacing*distX*i+Math.random()/100,
  			y+Settings.segmentSpacing*distY*i+Math.random()/100
  		)); 
  	}
  	return places;
}

function Player(x,y, direction, length){
	if(typeof x == 'number'){
		this.mouseVector = new Vector(0,0);
		this.amountToGrow = 0;
		this.speed = 1;
		this.segDist = 2;
		this.kink = 0;
		this.places = initializeLocation(x,y, direction, length);
	  	this.avLocation = averageSpot(this.places);		
	}else{
		this.speed = x.speed;
		this.amountToGrow = x.amountToGrow;
		this.segDist = x.segDist;
		this.kink = x.kink;
		this.mouseVector = Vector.copy(x.mouseVector);
		this.places = x.places.map(Vector.copy);
		this.avLocation = x.avLocation;
	}
}

Player.prototype.kinkiness = function(){

	var kinkiness = 0;
	for(var x = 3; x < this.places.length-3; x++){

		var pointing = this.places[x].sub(this.places[x+3]).toUnit();
		var otherPoint = this.places[x-3].sub(this.places[x]).toUnit();
		var diff = pointing.dist(otherPoint);
		kinkiness = kinkiness + diff
	}
	return kinkiness

}

Player.prototype.setMove = function(mv) {
	this.mouseVector = mv.aim;
};

Player.prototype.eatFood = function(amount){
	var ret = new Player(this);
	ret.amountToGrow = ret.amountToGrow + amount;
	return ret;
}

Player.prototype.step = function(mousePos){ 

		var ret = new Player(this);

		ret.kink = ret.kinkiness();
		ret.speed = ret.kink / Math.sqrt(ret.places.length) + 1;

		ret.avLocation = ret.places.reduce(function(build, stuff){
			return build.add(stuff); 
		}, new Vector(0,0)).scale(1/ret.places.length);

		if (ret.amountToGrow > 0){
			var last = ret.places[ret.places.length-1];
			var penu = ret.places[ret.places.length-2];
			ret.places.push(last.sub(penu.sub(last).scale(0.01)));
			ret.amountToGrow = ret.amountToGrow - 1;
		}


		var goal = ret.places[0].sub(ret.places[1]).toUnit().scale(3);
		var pointing = this.mouseVector.sub(ret.places[0]).toUnit();
		var directionScaled = goal.add(pointing).toUnit().scale(ret.speed);
		ret.places.unshift(ret.places[0].add(directionScaled));
		ret.places.pop();

		return ret;

}



module.exports = Player;