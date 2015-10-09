module.exports = {

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