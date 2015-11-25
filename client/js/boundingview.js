var BoundingBox = require('../../common/js/boundingbox.js');
var Settings = require('../../common/js/settings.js');

//This function returns the area which will be displayed on the screen--that is
//it displays the bounding box giving, in world-coordinates,
//the area which is to be projected on to the screen

//Should shift some stuff to here?
module.exports = function(player, canvas){
	//Get the ratio for the screen
	var screenRatio = canvas.width / canvas.height;

	//Get the ratio for bounding box
	var temp = new BoundingBox(player.places).expanded(Settings.viewBorder);
	var boxRatio = (temp.right - temp.left) / (temp.bottom - temp.top) ;

	//Return altered bounding box ratio
	var vertScale = boxRatio / screenRatio;
	var horizScale = screenRatio / boxRatio;
	return (vertScale >= 1) ? temp.scaleVert( vertScale ) : temp.scaleHoriz( horizScale );
}