var Vector = require('../../common/js/vector.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var View = function(bv, cnv, plyr){
	this.screenWidth = cnv.width;
	this.screenHeight = cnv.height;
	this.ctx = cnv.getContext('2d');
	this.box = bv;
}

View.prototype.drawPath = function(arrVector, width, color){
	var w = this.box.right - this.box.left;
	var h = this.box.bottom - this.box.top;
	var x = (arrVector[0].x-this.box.left) * this.screenWidth / w;
	var y = (arrVector[0].y-this.box.top) * this.screenHeight / h;
	var pth = new Path2D();
	this.ctx.strokeStyle = color;
	this.ctx.lineWidth = width;
	pth.moveTo(x,y)
	for(var a = 1; a < arrVector.length; a++){
		var x = (arrVector[a].x-this.box.left) * this.screenWidth / w;
		var y = (arrVector[a].y-this.box.top) * this.screenHeight / h;
		pth.lineTo(x,y);
	}
	this.ctx.stroke(pth);
}

View.prototype.drawCircle = function(center, width, thickness, color){
	var path = []
	for(var x = 0; x <= 2; x = x + 0.25){
		var pointX = center.x + width * Math.sin(x*Math.PI)
		var pointY = center.y + width * Math.cos(x*Math.PI)
		path.push(new Vector(pointX, pointY))
	}
	this.drawPath(path, thickness, color);
}


module.exports = View;