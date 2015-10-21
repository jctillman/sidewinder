var Vector = require('../../common/js/vector.js');

module.exports = {
    throttledResize: function(msbetween, cnv){
  	var resizer = function() {
  		cnv.width = document.body.clientWidth; //document.width is obsolete
  		cnv.height = document.body.clientHeight; //document.height is obsolete
  	}
  	resizer();
  	window.addEventListener("resize", resizeThrottler, false);
  	var resizeTimeout;
  	function resizeThrottler() {
      if (!resizeTimeout ) {
        resizeTimeout = setTimeout(function() { 
          resizeTimeout = null;
          resizer();
         }, msbetween);
      }
    }
  },
  mousePositionFinder: function(cnv){
    var ret = new Vector(0,0); 
    var getMousePosition = function(e){
      var rect = cnv.getBoundingClientRect();
      var newRet = new Vector(e.clientX - rect.left, e.clientY - rect.top)
      if (newRet.x != 0 && newRet.y != 0){
      	ret = newRet;
      }

    }
    cnv.addEventListener('mousemove', getMousePosition, false);
    return function(){
    	return ret;
    }
  }
}