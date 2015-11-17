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
	var singularButton = document.getElementById('singular');
	var multiplayerButton = document.getElementById('multiplayer');
	var watchButton = document.getElementById('watch');
	var loginButton = document.getElementById('login');

	var state = {
		game: {
			canvas: cnv,
			context: ctx,
			mousePosition: mousePos
		}, 
		menu: {
			all: menu, 
			singularButton: singularButton,
			multiplayerButton: multiplayerButton,
			watchButton: watchButton,
			loginButton: loginButton
		}
	}; 

	var goBack = function(){
		game.style.display="none";
		menu.style.display="block";
	}

	singularButton.onclick = function(){ 
		game.style.display="block";
		menu.style.display="none";
		options.singularGame(state, goBack);
	}

	multiplayerButton.onclick = function(){ 
		game.style.display="block";
		menu.style.display="none";
		options.multiplayerGame(state, goBack);
	}

	watchButton.onclick = function(){
		game.style.display="block";
		menu.style.display="none";
		options.watchGame(state, goBack);
	}

	loginButton.onclick = function(){
		options.login(state, goBack);
	}
}