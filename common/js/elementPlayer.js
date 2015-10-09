var Element = require('../../common/js/element.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');


var ElementPlayer = Element({
	//Constructor actually ignores required things, because this is such a background.. thing.
	construct: function(location, options){
		//Mandatory
		this.type = 'player' 
		this.priority = 1;
		//Optional
		this.places = Vector.chain(location, {
			segments: Settings.startSegments,
			spacing: Settings.startSpacing
		});
		this.location = Vector.average(this.places);
		this.aim = new Vector(0,0);
		this.amountToGrow = 0;
		this.speed = 1;
		this.kink = 0; 

	},
	draw: function(context, view){
	  //console.log("!");
	  var off = view.off
	  for(var x = 0; x < this.places.length - 1; x++){
	  	if ( (Math.floor(x / 25)+1) % 2 == 0 ) {
	  		context.strokeStyle = '#000000'
	  	}else{
	  		context.strokeStyle = "#ff0000"
	  	}
  		var pth = new Path2D();
  		pth.moveTo(this.places[x].x+off.x, this.places[x].y+off.y);
  		pth.lineTo(this.places[x+1].x+off.x,this.places[x+1].y+off.y)
  		context.lineWidth = 3;
  		context.stroke(pth);
	  }
	},
	step: function(){

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
		return ret;
	},
	//needs to be fixed.
	matters: function(element){
		return false;
	},
	setMove: function(move){
		this.aim = move.aim;
	}
});

module.exports = ElementPlayer;