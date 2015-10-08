module.exports = {

	timed: function(verbose, func){

		return function(){
			var start = Date.now();
			func();
			var end = Date.now();
      		verbose && console.log("Took " + (end-start) + " miliseconds.");
		}

	}

}