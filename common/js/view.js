var Vector = require('../../common/js/vector.js');

var View = function(cnv, center){
	this.off = new Vector( -center.x+cnv.width*0.5, -center.y+cnv.height*0.5);
}

module.exports = View;