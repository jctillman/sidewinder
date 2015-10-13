var Vector = require('../../common/js/vector.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var View = function(cnv, center){
	var center = new Vector( center.x, center.y);
	var half = new Vector(cnv.width*0.5, cnv.height*0.5);
	this.off = center.scale(-1).add(half);
	this.box = new BoundingBox([
	 	center.add(half),
	 	center.sub(half)
	]);
	//console.log(this.box);
}

module.exports = View;