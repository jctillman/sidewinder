
function Vector(x,y){
	if (typeof x != 'number' || typeof y != 'number'){
		throw new Error("Need to pass vector numbers!");
	}
	this.x = x;
	this.y = y;
} 

//Statics
Vector.copy = function(vector){
	var ret = new Vector(0,0);
	ret.x = vector.x;
	ret.y = vector.y;
	return ret;
}

Vector.chain = function(start, options){ //direction, length){
	var segments = options.segments || 10;
	var spacing = options.spacing || 1;
	var direction = options.direction || 0;
	var radians = (options.direction !== 0) ? (2 * direction / 360 * Math.PI) : 0;
	var components = new Vector( Math.sin(radians), Math.cos(radians));
 
	var chain = [];
	for(var i = 0; i < segments; i++){
		var factor = spacing * i;
		var addendum = start.add(new Vector(
  			factor*components.x+Math.random()/100,
  			factor*components.y+Math.random()/100
  		));
  		console.log(addendum)
  		chain.push(addendum);
  	}
  	return chain;
}; 

Vector.average = function(arr){
	return arr.reduce(function(build, stuff){return build.add(stuff);}, new Vector(0,0))
			  .scale(1/arr.length);
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