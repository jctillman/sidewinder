var BoundingBox = require('../../common/js/boundingbox.js');
var Vector = require('../../common/js/vector.js');
var Settings = require('../../common/js/settings.js');



var grids = []
var gridSize = Settings.gridSize;
var inc = Settings.treeResolution;
for(var x = 0; x < gridSize; x = x + inc){
	for(var y = 0; y < gridSize; y = y + inc){
		grids.push( {box: new BoundingBox([new Vector(x, y), new Vector(x+inc, y+inc)]), items: [] } );
	}
}

module.exports = grids;