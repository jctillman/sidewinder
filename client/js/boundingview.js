var BoundingBox = require('../../common/js/boundingbox.js');

module.exports = function(player, canvas){
	
	//Get the ratio for the screen
	var screenWidth = canvas.width;
	var screenHeight = canvas.height;
	var screenRatio = screenWidth / screenHeight;

	//Get initial ratio for bounding box
	var temp = new BoundingBox(player.places);
	temp = temp.expanded(300);
	var boxRatio = (temp.right - temp.left) / (temp.bottom - temp.top) ;
	temp = temp.scaleVert( boxRatio / screenRatio )
	var viewBox = temp;

	return viewBox;
}