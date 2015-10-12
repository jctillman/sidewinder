var Vector = require('../../common/js/vector.js');

module.exports = {

	collision: function(p0,p1,p2,p3){
		var s1 = p1.sub(p0);
		var s2 = p3.sub(p2);
		var temp = (-s2.x * s1.y + s1.x * s2.y) 
		var s = (-s1.y *  (p0.x - p2.x) + s1.x * (p0.y - p2.y) ) / (temp);
		var t = ( s2.x  * (p0.y - p2.y) - s2.y * (p0.x - p2.x) ) / (temp);
		return (s > 0 && s < 1 && t > 0 && t < 1) ? true : false;
	},

	playerPlayer: function(one, two){
		return one.type == 'player' && two.type == 'player';
	},

	foodPlayerCollision: function(food, player){
		return food.type == 'food' && !food.growing && !food.shrinking && player.type == 'player' && food.location.dist(player.places[0]) < food.size;
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

		return function(){
			var start = Date.now();
			func();
			var end = Date.now();
      		verbose && console.log("Took " + (end-start) + " miliseconds.");
		}

	}

}
