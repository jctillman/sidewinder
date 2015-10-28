var BoundingBox = require('../../common/js/boundingbox.js');

//This function returns the area which will be displayed on the screen--that is
//it displays the bounding box giving, in world-coordinates,
//the area which is to be projected on to the screen

//Should shift some stuff to here?
module.exports = function(player, canvas){
	//Get the ratio for the screen
	var screenWidth = canvas.width;
	var screenHeight = canvas.height;
	var screenRatio = screenWidth / screenHeight;

	//Get initial ratio for bounding box
	var temp = new BoundingBox(player.places).expanded(200);
	var boxRatio = (temp.right - temp.left) / (temp.bottom - temp.top) ;
	var vertScale = boxRatio / screenRatio;
	var horizScale = screenRatio / boxRatio;
	if (vertScale >= 1){
		var viewBoundingBox = temp.scaleVert( vertScale )
	}else{
		var viewBoundingBox = temp.scaleHoriz( horizScale )
	}
	return viewBoundingBox;
}