var Settings = require('../../common/js/settings.js');
var BoundingBoxer = require('../../common/js/boundingboxer.js');

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
	for(var x = 0, len=this.elements.length; x < len; x++){
		if(this.elements[x].id === id){
			return this.elements[x];
		}
	}
	return undefined;
}

ElementManager.prototype.addElement = function(name, location, options){
	var temp = new members[name.toLowerCase()](location, options);
	this.elements.push(temp);
	return temp.id;
}

ElementManager.prototype.step = function(mods){
	var self = this;

	var filteredElements = [];
	for(var x = 0, len = this.elements.length; x < len; x++){
		var temp = this.elements[x].step();
		if (temp != undefined){
			temp.boxes = BoundingBoxer.boxList(temp.relevantPoints());
			filteredElements.push(temp);
		}
	}


	//Alter them in accord with any, by which they need to be altered.
 //    var alteredElements = [];
	// for(var x = 0; x < filteredElements.length; x++){
	// 	var element = filteredElements[x].copy();
	// 	if(element.nothingMatters == false){
	// 		for(var y = 0; y < filteredElements.length; y++){
	// 			var otherElement = filteredElements[y].copy();
	// 			var m = BoundingBoxer.shareBoxes(element.boxes, otherElement.boxes);
	// 			if( m && element.matters(otherElement) ){
	// 				element = element.encounters(otherElement);
	// 			}
	// 		}
	// 	}
	// 	alteredElements.push(element);
	// }
	//Make new thing, and return it.
	var ret = new ElementManager();
	ret.elements = filteredElements;//alteredElements;	
	mods = mods || [];
	for(var x = 0; x < mods.length; x++){
		mods[x](ret);
	}
	return ret;
}

module.exports = ElementManager
