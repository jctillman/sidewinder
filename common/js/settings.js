module.exports = {

	alter: function(propName, propValue){
		if (propName in this && typeof propValue == typeof this[propName]){
			this[propName] = propValue
		}else{
			throw new Error("Something went wrong when trying to set the settings.");
		}

	},

	gridSizes: {
		verysmall: 200,
		small: 300,
		medium: 400,
		large: 500,
		verylarge: 600 
	},

	playerDensities: {
		verysmall: 0,
		small: 3,
		medium: 5,
		large: 7,
		verylarge: 11 
	},

	foodDensities: {
		verysmall: 0,
		small: 200,
		medium: 400,
		large: 600,
		verylarge: 800 
	},

	gridSize: 400,
	playerDensity: 5,
	foodDensity: 400,

	foodMinimum: function(){
		return ( this.gridSize ) * (this.gridSize ) * 0.0000002 * this.foodDensity;
	},

	playerNumber: function(){
		return ( this.gridSize ) * (this.gridSize ) * 0.000005 * this.playerDensity;
	},

	resizeRate: 50,
	physicsRate: 25,
	sendMoveInterval: 1,
	sendBoardInterval: 6,

	clientAheadDistance: 8, //steps
	clientAdjustAmount: 3, //ms

	viewBorder: 100, //border around window to character, in distance

	maxStateMemory: 35,

	portNum: (process.env.PORT || 3000),

	loseElementLimit: 5000,

	aiNames: ['Winalagalis','Egle','Coi Coi-Vilu','Naga','Ouroboros','Serpent','Ajatar','Ilomba','Quetzalcoatl','Cockatrice','Fafnir','Sisiutl','Bashe','Nammu','Madre de Aguas','Falak'],
	
	gridSpace: 50,
	gridColor: '#CCC', 

	startSegments: 50,
	startSpacing: 2,
	startDistanceBack: 100,

	aiCheckFrequency: 1,
	aiMinimum: 3,

	maxColorLength: 5,
	maxStripeLength: 10,
	minStripeLength: 10,
	playerPossibleColors: [ 'black', '#444', '#50C878', '#FFD300', 'purple'],

	framesToViewAfterDeath: 100,

	roomCapacity: 5,
	roomDeleteInterval: 5000,

	treeResolution: 2500,

	foodSpacing: 20,
	foodStartAmount: 20,
	foodPossibleColors: [ '#29AB87', '#A9BA9D', '#90EE90', '#8A9A5B', '#01796F', '#009E60', '#00FF00','#009F6B','#1B4D3E','#000','#ACE1AF'],
	foodCycleTime: 2500,
	foodGrowthRate: 0.5,
	foodValue: 5,
	foodMaxSize: 15,
	 
	
	segmentSpacing: 2

}