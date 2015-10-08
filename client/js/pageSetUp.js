var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');

var throttledResize = function(msbetween, cnv){
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
}

var mousePositionFinder = function(cnv){
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

module.exports = function(opt){
	
	var options = opt;
	var cnv = document.getElementById('cnv');
	cnv.style.display = "none";
	var ctx = cnv.getContext('2d');
	throttledResize(Settings.resizeRate, cnv);
	var mousePos = mousePositionFinder(cnv);

	var menu = document.getElementById('menu');
	var playbutton = document.getElementById('play');
	var watchbutton = document.getElementById('watch');
	var loginbutton = document.getElementById('login');

	var state = {
		game: {
			canvas: cnv,
			context: ctx,
			mousePosition: mousePos
		}, 
		menu: {
			all: menu, 
			playbutton: playbutton,
			watchbutton: watchbutton,
			loginbutton: loginbutton
		}
	}; 

	playbutton.onclick = function(){ 
		cnv.style.display="block";
		menu.style.display="none";
		console.log(options)
		options.playGame(state);
	}

	watchbutton.onclick = function(){
		console.log("This feature has not been added!")
		options.watchGame(state);
	}

	loginbutton.onclick = function(){
		options.login(state);
	}

}