var Vector = require('../../common/js/vector.js');
var View = require('../../client/js/view.js');
var Utilities = require('../../common/js/utilities.js');

var reqFunc = {
	construct: {
		checks: [
			function(a){ return (a instanceof Vector) },
			function(a){ return (typeof a == 'object')}],
		explanations: [
			"Expected a vector, but no vector received.",
			"Expected an object, but something else received."]
	},
	draw: 
	{
		checks: [
			function(a){ return a instanceof View; } ],
		explanations: [
			"Expected a View object as the second argument, but didn't get one."]
	},
	step: { checks: [], explanations: [] }, 
	copy: { checks: [], explanations: [] },
	matters: {
		checks:[
			function(a) { return (a.isAnElement == true)}],
		explanations:[
			"Expected an object which was created by the element factory, but didn't get one."]
	},
	encounters: {
		checks: [
			function(a) {return a.isAnElement === true}],
		explanations: [
			"Expected an object created by the element factory, but did not get one."]	
	 }
}

var Element = function(options){ 
	
	//Make stub constructoor function.

	var ret = function(){
		//Mark it as belonging to this kind of prototype-like thing.
		this.isAnElement = true;
		this.id = Utilities.makeUniqueId();
		//Make sure that we are being passed legit arguments.
		var args = [];
		for(var x = 0; x < arguments.length; x++){
			if (reqFunc.construct.checks[x](arguments[x])){
				args.push(arguments[x])
			}else{
				throw new Error("An incorrect value: " + reqFunc.construct.explanations[x])
			}
		}
		options.construct.apply(this, args);
		//Internal type indicator for use with the 'matters' function.
		if(this.type == undefined){
			throw new Error("Constructor function must add .type property to element.")
		}
		if(this.priority === undefined){
			throw new Error("Constructor function must add .priority property for drawing purposes.")
		}
		if( (this.nothingMatters !== true) && (this.nothingMatters !== false) ){
			throw new Error("Constructor function must set .nothingMatters property to be true or false at some point during invocation.");	
		}
		if( this.box === undefined){
			throw new Error("Constructor function must set .box property to be an instance of BoundingBox.")
		}
		if( this.inactive === undefined){
			throw new Error("Constructor function must set .inactive property to be true or false.")
		}
	}

	//Add the rest of the functions.
	var protFunc = ['draw', 'step', 'matters', 'copy', 'encounters'];
	protFunc.forEach(function(fn){
		//Make sure that it has the function in question in the options.
		if(typeof options[fn] != 'function'){
			throw new Error("'options' object passed to element required an '" + fn + "'' function.");
		}
		//Make sure the arity of the function passed is what it should be.
		if(options[fn].length != reqFunc[fn].checks.length){
			throw new Error("'" + fn + "' function in options requires an arity of " + reqFunc[fn].checks.length)
		}
		
		//Add the function, with error checking.
		ret.prototype[fn] = function(){
			var args = [];
			for(var y = 0; y < arguments.length; y++){
				if (reqFunc[fn].checks[y](arguments[y])){
					args.push(arguments[y])
				}else{
					throw new Error("An incorrect value: " + reqFunc[fn].explanations[y])
				}
			}
			var rtrn = options[fn].apply(this, args);
			return rtrn;
		}
	});

	//Add the functions that are not required, with stuff.
	Object.keys(options).filter(function(func){
		return protFunc.indexOf(func) == -1 && func != 'construct';
	}).forEach(function(fn){
		ret.prototype[fn] = options[fn]
	});

	return ret;
};

module.exports = Element
