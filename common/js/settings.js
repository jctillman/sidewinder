module.exports = {

	resizeRate: 50,
	physicsRate: 25,
	sendMoveInterval: 2,
	sendBoardInterval: 4,
	latencyAdjustment: 0,

	port: process.env.PORT || 3000,
	socketaddress: 'damp-eyrie-6067.herokuapp.com'),

	gridSize: 100,
	gridSpace: 50,
	gridColor: '#CCC', 

	startSegments: 50,
	startSpacing: 2,
	startDistanceBack: 100,

	aiCheckFrequency: 1,
	aiMinimum: 0,

	maxColorLength: 5,
	maxStripeLength: 10,
	minStripeLength: 10,
	playerPossibleColors: [ 'black', '#444', '#50C878', '#FFD300', 'purple'],

	framesToViewAfterDeath: 50,

	roomCapacity: 2,

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