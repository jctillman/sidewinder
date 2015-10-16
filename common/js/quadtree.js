
var Settings = require('../../common/js/settings.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var maxObjects = Settings.quadMaxObjects;
var maxLevels = Settings.quadMaxLevels;

var Quadtree = function(level, boundingBox){
	this.level = level;
	this.objects = []
	this.box = boundingBox;
	this.nodes = [];
}

Quadtree.prototype.clear = function(){
	this.objects = [];
	for(var x = 0; x < this.nodes.length; x++){
		this.nodes[x].clear;
	}
	this.nodes = [];
}
// public void clear() {
//    objects.clear();
 
//    for (int i = 0; i < nodes.length; i++) {
//      if (nodes[i] != null) {
//        nodes[i].clear();
//        nodes[i] = null;
//      }
//    }
//  }

}

Quadtree.prototype.split = function(){
	
	var subWidth = this.box.getWidth() / 2;
	var subHeight = this.box.getHeight() / 2;

	nodes[1] = new Quadtree(this.level+2, new Bo)

 // private void split() {
 //   int subWidth = (int)(bounds.getWidth() / 2);
 //   int subHeight = (int)(bounds.getHeight() / 2);
 //   int x = (int)bounds.getX();
 //   int y = (int)bounds.getY();
 
 //   nodes[0] = new Quadtree(level+1, new Rectangle(x + subWidth, y, subWidth, subHeight));
 //   nodes[1] = new Quadtree(level+1, new Rectangle(x, y, subWidth, subHeight));
 //   nodes[2] = new Quadtree(level+1, new Rectangle(x, y + subHeight, subWidth, subHeight));
 //   nodes[3] = new Quadtree(level+1, new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight));
 // }


}

Quadtree.prototype.getIndex = function(){
	
}

Quadtree.prototype.insert = function(){
	
}

Quadtree.prototype.retrieve = function(){
	
}

module.exports = Quadtree;

