module.exports = {

	makeUniqueId: function(){
		var length = 24;
		var chars = ['abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890']
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