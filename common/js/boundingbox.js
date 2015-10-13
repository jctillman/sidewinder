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

BoundingBox.prototype.intersects = function(otherBox){
	return !(
		this.right < otherBox.left ||
		this.left > otherBox.right ||
		this.top > otherBox.bottom ||
		this.bottom < otherBox.top
		);
};

module.exports = BoundingBox