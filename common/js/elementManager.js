var Settings = require('../../common/js/settings.js');
var BoundingBox = require('../../common/js/boundingbox.js');
var Grid = require('../../common/js/grid.js');

var members = {
	grid: require('../../common/js/elementGrid.js'),
	player: require('../../common/js/elementPlayer.js'),
	food: require('../../common/js/elementFood.js')
}

var ElementManager = function(){ 
	this.frameNumber = 0;
	this.elements = [];
}

ElementManager.copy = function(stuff){
	var ret = new ElementManager();
	for(var x = 0, len=stuff.elements.length; x < len; x++){
		var val = stuff.elements[x];
		var toAdd = members[val.type].copy(val);
		ret.elements.push(toAdd);
	}
	ret.frameNumber = stuff.frameNumber;
	return ret;

}

ElementManager.prototype.draw = function(view){
	view.clear();
	for(var x = 0, len = this.elements.length; x < len; x++){
		var el = this.elements[x];
		view.box.intersects(el.box) && this.elements[x].draw(view);
	}
};

ElementManager.prototype.getElement = function(id){
	for(var x = 0, len=this.elements.length; x < len; x++){
		if(this.elements[x].id.toString() == id.toString()){
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
	var filteredElements = [];

	for(var x = 0, len = this.elements.length; x < len; x++){
		var temp = this.elements[x].step();
		if (temp != undefined){
			filteredElements = filteredElements.concat(temp);
		}
	}

	for(var x = 0, len=filteredElements.length; x < len; x++){
		if(!filteredElements[x].inactive){
			for(var y = 0; y < len; y++){
				if(filteredElements[x].matters(filteredElements[y])){
					filteredElements[x].encounters(filteredElements[y])
				}
			}
		}
	}

	//Make new thing, and return it.
	var ret = new ElementManager();
	ret.elements = filteredElements;
	ret.frameNumber = this.frameNumber + 1;	
	mods = mods || [];
	for(var x = 0; x < mods.length; x++){
		mods[x](ret);
	}
	return ret;
}

module.exports = ElementManager
