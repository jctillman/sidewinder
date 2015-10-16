var Vector = require('../../common/js/vector.js');
var Settings = require('../../common/js/settings.js');
var Move = require('../../common/js/move.js');

module.exports = {

	addPlayer: function(playerKind, elementManager){

		var isHuman
		if(playerKind == 'human'){
			isHuman = true;
		}else{
			isHuman = false;
		}

		var side = Math.floor( Math.random() * 4 );
		var randSpot = Math.random()*Settings.gridSize
		var distBack = -Settings.startDistanceBack;
		var id;

		if(side == 0){
			id = elementManager.addElement(
				'player',
				new Vector(distBack, randSpot),
				{isHuman: isHuman, direction: 270}
			);
		}else if(side == 1){
			id = elementManager.addElement(
				'player',
				new Vector(-distBack+Settings.gridSize, randSpot),
				{isHuman: isHuman, direction: 90}
			);
		}else if(side == 2){
			id = elementManager.addElement(
				'player',
				new Vector(randSpot, distBack),
				{isHuman: isHuman, direction: 180}
			);
		}else if(side == 3){
			id = elementManager.addElement(
				'player',
				new Vector(randSpot, -distBack+Settings.gridSize),
				{isHuman: isHuman, direction: 0}
			);
		}

		if (!isHuman){
			elementManager.getElement(id).setMove(
				new Move(
					{
						aim: new Vector(Math.random()*Settings.gridSize, Math.random()*Settings.gridSize)
					}
				)
			);
		}



		return id

	},

	collision: function(p0,p1,p2,p3){
		var s1 = p1.sub(p0);
		var s2 = p3.sub(p2);
		var temp = (-s2.x * s1.y + s1.x * s2.y) 
		var s = (-s1.y *  (p0.x - p2.x) + s1.x * (p0.y - p2.y) ) / (temp);
		var t = ( s2.x  * (p0.y - p2.y) - s2.y * (p0.x - p2.x) ) / (temp);
		return (s > 0 && s < 1 && t > 0 && t < 1) ? true : false;
	},

	playerPlayer: function(one, two){
		return one.type == 'player' && two.type == 'player' && one.box.intersects(two.box);
	},

	foodPlayerCollision: function(food, player){
		return food.type == 'food' && player.type == 'player' && food.box.intersects(player.box) && !food.growing && !food.shrinking && food.location.dist(player.places[0]) < food.size;
	},

	shallowCopy: function(obj){
		var keys = Object.keys(obj);
		var ret = {};
		for(var x = 0; x < keys.length; x++){
			if (obj.hasOwnProperty(keys[x])){
				ret[keys[x]] = obj[keys[x]]
			}
		}
		ret.__proto__ = obj.__proto__;
		return ret
	},

	makeUniqueId: function(){
		var length = 24;
		var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
		var uniqueId = '';
		for(var x = 0; x < length; x++){
			uniqueId = uniqueId + chars[ Math.floor( Math.random() * chars.length ) ];
		}
		return uniqueId;
	},
 
	timed: function(verbose, func){

		var num = 0;
		var ellapsed = 0;

		return function(){
			var start = Date.now();
			func();
			var end = Date.now();
			ellapsed = ellapsed + (end-start);
			num++;
      		verbose && console.log("Average of " + (ellapsed / num) + " miliseconds.");
		}

	}

}
