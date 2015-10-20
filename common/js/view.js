var Vector = require('../../common/js/vector.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var View = function(cnv, plyr){
	var center = plyr.location
	var half = new Vector(cnv.width*0.5, cnv.height*0.5);
	this.ctx = cnv.getContext('2d');
	this.off = center.scale(-1).add(half);
	this.box = new BoundingBox([
	 	center.add(half),
	 	center.sub(half)
	]);
}

View.prototype.drawPath = function(arrVector, width, color){
	var pth = new Path2D();
	this.ctx.strokeStyle = color;
	this.ctx.lineWidth = width;
	pth.moveTo(arrVector[0].x+this.off.x, arrVector[0].y+this.off.y)
	for(var x = 1; x < arrVector.length; x++){
		pth.lineTo(arrVector[x].x+this.off.x, arrVector[x].y+this.off.y);
	}
	this.ctx.stroke(pth);
}

View.prototype.drawCircle = function(center, width, thickness, color){
	this.ctx.beginPath();
	this.ctx.arc(center.x+this.off.x, center.y+this.off.y, width, 0, 2 * Math.PI, false);
	this.ctx.lineWidth = 2; 
	this.ctx.strokeStyle = color;
	this.ctx.stroke();
}


module.exports = View;