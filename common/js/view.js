var Vector = require('../../common/js/vector.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var View = function(cnv, plyr){
	//var center = plyr.location
	//var half = new Vector(cnv.width*0.5, cnv.height*0.5);
	this.screenWidth = cnv.width;
	this.screenHeight = cnv.height;
	this.ctx = cnv.getContext('2d');
	var screenRatio = this.screenWidth / this.screenHeight;
	console.log()
	//this.off = center.scale(-1).add(half);
	var temp = new BoundingBox(plyr.places);
	temp = temp.expanded(300)
	var boxRatio = (temp.right - temp.left) / (temp.bottom - temp.top) ;
	console.log(boxRatio / screenRatio)
	temp = temp.scaleVert( boxRatio / screenRatio )
	
	this.box = temp;

}

View.prototype.drawPath = function(arrVector, width, color){

	//draw from left of box to right
	//from top to bottom
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
	for(var x = 0; x < 2.1; x = x + 0.1){
		var pointX = center.x + width * Math.sin(x*Math.PI)
		var pointY = center.y + width * Math.cos(x*Math.PI)
		path.push(new Vector(pointX, pointY))
	}
	this.drawPath(path, thickness, color);

	// var w = this.box.right - this.box.left;
	// var h = this.box.bottom - this.box.top;
	// // var w = Math.max(w,h)
	// // var h = Math.max(w,h)
	// var x = (center.x-this.box.left) * this.screenWidth / w;
	// var y = (center.y-this.box.top) * this.screenHeight / h;
	// this.ctx.arc(x,y, width, 0, 2 * Math.PI, false);
	// this.ctx.lineWidth = 2; 
	// this.ctx.strokeStyle = color;
	// this.ctx.stroke();
}


module.exports = View;