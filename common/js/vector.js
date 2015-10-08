
function Vector(x,y){
	this.x = x;
	this.y = y;
} 

Vector.copy = function(vector){
	var ret = new Vector();
	ret.x = vector.x;
	ret.y = vector.y;
	return ret;
}

Vector.prototype.add = function(vector){
	return new Vector(vector.x + this.x, vector.y + this.y);
}

Vector.prototype.sub = function(vector){
	return new Vector(-vector.x + this.x, -vector.y + this.y);
}

Vector.prototype.scale = function(scalar){
	return new Vector(this.x * scalar, this.y * scalar);
}

Vector.prototype.perp = function(){
	return new Vector(-this.y, this.x);
}

Vector.prototype.dist = function(other){
	return this.sub(other).length();
}

Vector.prototype.limit = function(min, max){
	return new Vector( Math.max( min, Math.min( this.x, max )), Math.max( min, Math.min( this.y, max )) )
}



// Vector.prototype.side = function(a,b){
// 	return (((b.x - a.x)*(this.y - a.y) - (b.y - a.y)*(this.x - a.x)) > 0) ? 1 : - 1;
// }

Vector.prototype.length = function(){
	return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vector.prototype.toUnit = function(){
	return this.scale(1 / this.length())
}




module.exports = Vector;