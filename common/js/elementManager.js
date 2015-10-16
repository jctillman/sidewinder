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

ElementManager.prototype.draw = function(context, view){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	for(var x = 0, len = this.elements.length; x < len; x++){
		var el = this.elements[x];
		if (view.box.intersects(el.box)){
			this.elements[x].draw(context, view);
		}
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
			filteredElements = filteredElements.concat(temp);
		}
	}

	for(var x = 0, len=filteredElements.length; x < len; x++){
		if(!filteredElements[x].inactive){
			for(var y = 0, len=filteredElements.length; y < len; y++){
				for(var y = 0; y < len; y++){
					if(filteredElements[x].matters(filteredElements[y])){
						filteredElements[x].encounters(filteredElements[y])
					}
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

	
	// for(var x = 0, len=Grid.length; x < len; x++){
	// 	Grid[x].items = [];
	// 	for(var y = 0; y < filteredElements.length; y++){
	// 		if(Grid[x].box.intersects(filteredElements[y].box)){
	// 			filteredElements[y].visitedBy = [];
	// 			Grid[x].items.push(filteredElements[y]);
	// 		}
	// 	}
	// }


	// //Alter them in accord with any, by which they need to be altered.

	// for(var x = 0; x < Grid.length; x++){
	// 	var stuffHere = Grid[x].items;
	// 	for(var y =0; y < stuffHere.length; y++){
	// 		if (!stuffHere[y].inactive){
	// 			for(var z = 0; z < stuffHere.length; z++){
	// 				if(stuffHere[y].matters(stuffHere[z])) {
	// 					stuffHere[y].encounters(stuffHere[z])
	// 				}
	// 			}
	// 		}
	// 	}
	// }


}

module.exports = ElementManager
