var Element = require('../../common/js/element.js');
var ElementFood = require('../../common/js/elementfood.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
var BoundingBox = require('../../common/js/BoundingBox.js');


var ElementPlayer = Element({
	//Constructor actually ignores required things, because this is such a background.. thing.
	construct: function(location, options){
		//Optional
		this.isHuman = (options.isHuman === undefined) ? true : options.isHuman;
		this.places = Vector.chain(location, {
			segments: Settings.startSegments,
			spacing: Settings.startSpacing,
			direction: options.direction || 0
		});
		this.location = Vector.average(this.places);
		this.aim = new Vector(0,0);
		this.amountToGrow = 0;
		this.speed = 1;
		this.kink = 0; 
		
		this.dying = false;
		this.dead = undefined;

		//Set the particular colors for the snake.		
		this.colorLength = 1 + Math.floor(Math.random() * Settings.maxColorLength);
		this.colors = [];
		for(var x = 0; x < this.colorLength; x++){
			this.colors.push( Settings.playerPossibleColors[Math.floor(Math.random() * Settings.playerPossibleColors.length)]);
		}
		this.stripeLength = Settings.minStripeLength + (Math.random() * (Settings.maxStripeLength-Settings.minStripeLength));

		//Mandatory
		this.type = 'player' 
		this.priority = 1;
		this.inactive = false;
		this.nothingMatters = false;
		this.box = new BoundingBox(this.places);
	},
	draw: function(context, view){
	  var off = view.off
	  var width = 2 + Math.sqrt( (this.places.length - Settings.startSegments) / 100);
	  for(var x = 0; x < this.places.length - 1; x++){
	  	var color = this.colors[Math.floor( x / this.stripeLength) % this.colorLength]
	  	view.drawPath([this.places[x], this.places[x+1]], width, color)
	  }
	},
	step: function(){

		if (this.dying == true){
			var ret = [];
			var inc = Settings.foodSpacing;
			for(var x = 0; x < this.places.length; x = x + inc){
				if(
					(this.places[x].x > 0) &&
					(this.places[x].x < Settings.gridSize) &&
					(this.places[x].y > 0) &&
					(this.places[x].y < Settings.gridSize) )
				{
					ret.push(new ElementFood(Vector.copy(this.places[x]), {growing: true}));
				}
			}
			return ret;
		}

		var kinkiness = function(v){ 
			var kinkiness = 0;
			for(var x = 3; x < v.places.length-3; x++){
				var pointing = v.places[x].sub(v.places[x+3]).toUnit();
				var otherPoint = v.places[x-3].sub(v.places[x]).toUnit();
				var diff = pointing.dist(otherPoint);
				kinkiness = kinkiness + diff;
			}
			return kinkiness;
		}

		var ret = this.copy();
		ret.speed = ret.kink / Math.sqrt(ret.places.length) + 1;
		ret.location = Vector.average(ret.places);
		if (ret.amountToGrow > 0){
			var last = ret.places[ret.places.length-1];
			var penu = ret.places[ret.places.length-2];
			ret.places.push(last.sub(penu.sub(last).scale(0.01)));
			ret.amountToGrow = ret.amountToGrow - 1;
		}
		var goal = ret.places[0].sub(ret.places[1]).toUnit().scale(3);
		var pointing = this.aim.sub(ret.places[0]).toUnit();
		var directionScaled = goal.add(pointing).toUnit().scale(ret.speed);
		var addendum = ret.places[0].add(directionScaled)
		ret.box = new BoundingBox(this.places);
		ret.places.unshift(addendum);
		ret.places.pop(); 
		ret.kink = kinkiness(ret);
		return ret;
	},
	copy: function(){
		var ret = Utilities.shallowCopy(this);
		ret.places = this.places.map(function(n){return Vector.copy(n);});
		ret.aim = Vector.copy(this.aim);
		ret.location = Vector.average(ret.places);
		ret.box = BoundingBox.copy(this.box);
		return ret;
	},
	matters: function(element){
		return Utilities.foodPlayerCollision(element, this) || Utilities.playerPlayer(element, this);
	},
	setMove: function(move){
		this.aim = move.aim;
	},
	encounters: function(element){
		if (element.type == 'food'){
			console.log("!")
			this.amountToGrow = this.amountToGrow + Settings.foodValue;
			element.shrinking = true;
		}
		if (element.type == 'player'){
			var p1 = this.places[0];
			var p2 = this.places[4];
			for(var x = 0; x < element.places.length-5; x=x+5){
				if (Utilities.collision(p1,p2, element.places[x], element.places[x+5])){
					this.dying = true;
					x = element.places.length;
				}
			}
		}
	}
});



module.exports = ElementPlayer;
