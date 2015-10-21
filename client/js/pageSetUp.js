var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var ClientUtilities = require('../../client/js/clientutilities.js');

module.exports = function(options){
	
	var cnv = document.getElementById('cnv');
	var game = document.getElementById('game');
	var ctx = cnv.getContext('2d');
	var mousePos = ClientUtilities.mousePositionFinder(cnv);

	ClientUtilities.throttledResize(Settings.resizeRate, cnv);

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

	var goBack = function(){
		game.style.display="none";
		menu.style.display="block";
	}

	playbutton.onclick = function(){ 
		game.style.display="block";
		menu.style.display="none";
		options.playGame(state, goBack);
	}

	watchbutton.onclick = function(){
		options.watchGame(state, goBack);
	}

	loginbutton.onclick = function(){
		options.login(state, goBack);
	}
}