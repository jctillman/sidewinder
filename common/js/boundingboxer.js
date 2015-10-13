var Vector = require('../../common/js/vector.js');

var BoundingBoxer = {

	boxList: function(pointArr){
		var ret = [];
		for(var x = 0; x < pointArr.length; x++){
			var temp = Math.floor(pointArr[x].x * .01) + 's' + Math.floor(pointArr[x].y * 0.01) + 's'
			if (ret.indexOf(temp) == -1){
				ret.push(temp)
			}
		}
		return ret;
	},
	shareBoxes: function(oneBox, twoBox){
		for(var x = 0; x < oneBox.length; x++){
			for(var y = 0; y < twoBox.length; y++){
				if (oneBox[x] == twoBox[y]){
					return true;
				}
			}
		}
		return false;
	}

}

module.exports = BoundingBoxer;