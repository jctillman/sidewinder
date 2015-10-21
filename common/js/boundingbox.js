var Vector = require('../../common/js/vector.js');


var BoundingBox = function(vectorArr){
	var upperLeft = Vector.copy( vectorArr[0] );
	var lowerRight = Vector.copy( vectorArr[0] );
	for(var x = 1, len=vectorArr.length; x < len; x++){
		upperLeft.x = Math.min( upperLeft.x, vectorArr[x].x );
		upperLeft.y = Math.min( upperLeft.y, vectorArr[x].y );
		lowerRight.x = Math.max( lowerRight.x, vectorArr[x].x );
		lowerRight.y = Math.max( lowerRight.y, vectorArr[x].y );
	}
	this.left = upperLeft.x;
	this.right = lowerRight.x;
	this.top = upperLeft.y;
	this.bottom = lowerRight.y;
}

BoundingBox.copy = function(cop){
	var m = new BoundingBox([new Vector(0,0)]);
	m.left = cop.left;
	m.right = cop.right;
	m.top = cop.top;
	m.bottom = cop.bottom;
	return m;
}

BoundingBox.prototype.expanded = function(amount){
	var ret = BoundingBox.copy(this);
	ret.left = ret.left - amount;
	ret.right = ret.right + amount;
	ret.top = ret.top - amount;
	ret.bottom = ret.bottom + amount;
	return ret;
}

BoundingBox.prototype.scaleHoriz = function(amount){
	var width = this.right - this.left;
	var additional = (width * amount - width) / 2;
	var ret = BoundingBox.copy(this);
	ret.left = ret.left - additional
	ret.right = ret.right + additional
	return ret;
}

BoundingBox.prototype.scaleVert = function(amount){
	var height = this.bottom - this.top;
	var additional = (height * amount - height) / 2;
	var ret = BoundingBox.copy(this);
	ret.top = ret.top - additional
	ret.bottom = ret.bottom + additional
	return ret;
}

BoundingBox.prototype.width = function(){
	return this.right - this.left;
}

BoundingBox.prototype.height = function(){
	return this.bottom - this.top;
}

BoundingBox.prototype.intersects = function(otherBox){
	return !(
		this.right < otherBox.left ||
		this.left > otherBox.right ||
		this.top > otherBox.bottom ||
		this.bottom < otherBox.top
		);
};

module.exports = BoundingBox