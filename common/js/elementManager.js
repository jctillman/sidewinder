var Settings = require('../../common/js/settings.js');
var BoundingBox = require('../../common/js/boundingbox.js');
var Grid = require('../../common/js/grid.js');

var members = {
	grid: require('../../common/js/elementgrid.js'),
	player: require('../../common/js/elementplayer.js'),
	food: require('../../common/js/elementfood.js')
}

var ElementManager = function(){ 
	this.elements = [];
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
	mods = mods || [];
	for(var x = 0; x < mods.length; x++){
		mods[x](ret);
	}
	return ret;
}

module.exports = ElementManager
