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
	var optionsButton = document.getElementById('options');
	var multiplayerButton = document.getElementById('multiplayer');
	var advancedButton = document.getElementById('advanced');

	var advancedDisplay = document.getElementById('advancedDisplay');
	var optionsDisplay = document.getElementById('optionsDisplay')
	var optionGridSize = document.getElementById('gridSize');
	var optionPlayerDensity = document.getElementById('playerDensity');
	var optionFoodDensity = document.getElementById('foodDensity');

	var update = function(){
		var gridSize = optionGridSize.value;
		var playerDensity = optionPlayerDensity.value;
		var foodDensity = optionFoodDensity.value;
		Settings.alter('gridSize', Settings.gridSizes[gridSize])
		Settings.alter('playerDensity', Settings.playerDensities[playerDensity])
		Settings.alter('foodDensity', Settings.foodDensities[foodDensity])
	}

	optionGridSize.onchange = update;
	optionPlayerDensity.onchange = update;
	optionFoodDensity.onchange = update;
	update();



	var watchButton = document.getElementById('watch');
	var nameText = document.getElementById('name');

	var state = {
		game: {
			canvas: cnv,
			context: ctx,
			mousePosition: mousePos,
		}, 
		menu: {
			all: menu, 
			singularButton: singularButton,
			multiplayerButton: multiplayerButton,
			watchButton: watchButton,
			nameText: nameText
		}
	}; 

	var goBack = function(){
		update();
		game.style.display="none";
		menu.style.display="block";
	}

	optionsButton.onclick = function(){
		optionsDisplay.style.display = (optionsDisplay.style.display == "block") ? "none" : "block";
	}

	advancedButton.onclick = function(){
		advancedDisplay.style.display = (advancedDisplay.style.display == "block") ? "none" : "block";
	}

	singularButton.onclick = function(){ 
		game.style.display="block";
		menu.style.display="none";
		options.singularGame(state, goBack);
	}

	multiplayerButton.onclick = function(){ 
		Settings.alter('gridSize', Settings.gridSizes['medium'])
		Settings.alter('playerDensity', Settings.gridSizes['medium'])
		Settings.alter('foodDensity', Settings.gridSizes['medium'])
		game.style.display="block";
		menu.style.display="none";
		options.multiplayerGame(state, goBack);
	}

	watchButton.onclick = function(){
		game.style.display="block";
		menu.style.display="none";
		options.watchGame(state, goBack);
	}

}