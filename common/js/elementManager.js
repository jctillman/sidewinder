var Settings = require('../../common/js/settings.js');

var members = {
	grid: require('../../common/js/elementgrid.js'),
	player: require('../../common/js/elementplayer.js'),
	food: require('../../common/js/elementfood.js')
}


var ElementManager = function(){ 
	this.elements = [];
}

ElementManager.prototype.draw = function(context, view){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	for(var x = 0, len = this.elements.length; x < len; x++){
		this.elements[x].draw(context, view);
	}
};

ElementManager.prototype.getElement = function(id){
	return this.elements.filter(function(n){
		return n.id === id; 
	})[0]
}

ElementManager.prototype.addElement = function(name, location, options){
	var nw = new members[name.toLowerCase()](location, options);
	this.elements.push(nw);
	return nw.id;
}

ElementManager.prototype.step = function(mods){
	var self = this;
	//Grab elements, as stepped forward.
	var filteredElements = this.elements.reduce(function(building, element, outerIndex){
		var temp = element.step();
		if (temp !== undefined && temp.type !== element.type){
			throw new Error("After step, something returned something not an element of the same kind and not an undefined");
		}else{
			return (temp == undefined) ? building : building.concat(temp)
		}
	}, []);		
	//Alter them in accord with any, by which they need to be altered.
    var alteredElements = [];
	for(var x = 0; x < filteredElements.length; x++){
		var element = filteredElements[x].copy();
		if(element.nothingMatters === false){
			for(var y = 0; y < filteredElements.length; y++){
				var otherElement = filteredElements[y].copy();
				if( element.matters(otherElement) ){
					element = element.encounters(otherElement);
				}
			}
		}
		alteredElements.push(element);
	}
	//Make new thing, and return it.
	var ret = new ElementManager
();
	ret.elements = alteredElements;	
	mods = mods || [];
	for(var x = 0; x < mods.length; x++){
		mods[x](ret);
	}
	return ret;
}

module.exports = ElementManager
