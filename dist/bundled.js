(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('../../client/js/pageSetUp.js')({
	playGame: require('../../client/js/clientGame.js'),
	watchGame: require('../../client/js/clientWatch.js'),
	login: require('../../client/js/clientLogin.js')
});

},{"../../client/js/clientGame.js":2,"../../client/js/clientLogin.js":3,"../../client/js/clientWatch.js":4,"../../client/js/pageSetUp.js":6}],2:[function(require,module,exports){
'use strict';

var EnvironmentState = require('../../common/js/environmentState.js');
var Draw = require('../../client/js/draw.js');
var Settings = require('../../common/js/settings.js');
var Utilities = require('../../common/js/utilities.js');
var Move = require('../../common/js/move.js');

var playGame = function playGame(gameState, appState, playerIndex) {

	//console.log("!")

	var graphicsLoop = setInterval(Utilities.timed(true, function () {

		//console.log("!");
		Draw.clear(appState, gameState, playerIndex);
		Draw.self(appState, gameState, playerIndex);
		Draw.others(appState, gameState, playerIndex);

		var move = new Move({
			mousePosition: appState.game.mousePosition(),
			player: gameState.players[playerIndex]
		});

		gameState.setMove(playerIndex, move);
		gameState = gameState.step();
	}), Settings.physicsRate);
};

module.exports = function (appState) {

	//Get game
	//For now, just as stop

	var gameState = new EnvironmentState();
	gameState.addPlayer(100, 100, 10, 10);
	gameState.addPlayer(100, 150, 10, 10);
	playGame(gameState, appState, 0);
};

},{"../../client/js/draw.js":5,"../../common/js/environmentState.js":7,"../../common/js/move.js":9,"../../common/js/settings.js":11,"../../common/js/utilities.js":12}],3:[function(require,module,exports){
"use strict";

module.exports = function (state) {
	console.log(state);
	console.log("Not implemented!");
};

},{}],4:[function(require,module,exports){
"use strict";

module.exports = function (state) {
	console.log(state);
	console.log("Not implemented!");
};

},{}],5:[function(require,module,exports){
'use strict';

var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');

var characterDraw = function characterDraw(ctx, cnv, plyr, off) {
	var pth = new Path2D();
	ctx.strokeStyle = "#ff0000";
	ctx.lineWidth = 3;
	pth.moveTo(plyr.places[0].x + off.x, plyr.places[0].y + off.y);
	for (var x = 1; x < plyr.places.length; x++) {
		if (x % 25 == 0) {
			ctx.strokeStyle = ctx.strokeStyle.toString() == '#ff0000' ? "#000" : "#f00";
			console.log(ctx.strokeStyle.toString());
			ctx.stroke(pth);
			var pth = new Path2D();
			pth.moveTo(plyr.places[x - 1].x + off.x, plyr.places[x - 1].y + off.y);
		}
		pth.lineTo(plyr.places[x].x + off.x, plyr.places[x].y + off.y);
	}
	ctx.stroke(pth);
};

var Draw = {

	clear: function clear(appState, gameState, playerIndex) {

		//Setup
		var playSpot = gameState.players[playerIndex].avLocation;
		var off = new Vector(-playSpot.x + cnv.width * 0.5, -playSpot.y + cnv.height * 0.5);
		var path = new Path2D();

		//CLear everything
		appState.game.context.clearRect(0, 0, appState.game.canvas.width, appState.game.canvas.height);

		//Draw the grid.
		for (var x = 0; x <= Settings.boardSize; x = x + Settings.gridSpace) {
			path.moveTo(off.x, x + off.y);
			path.lineTo(off.x + Settings.boardSize, x + off.y);
			path.moveTo(off.x + x, off.y);
			path.lineTo(off.x + x, Settings.boardSize + off.y);
		}
		appState.game.context.strokeStyle = Settings.gridColor;
		appState.game.context.lineWidth = 1;
		appState.game.context.stroke(path);
	},

	//Draw the character for the current player
	self: function self(appState, gameState, playerIndex) {

		//Setup
		var playSpot = gameState.players[playerIndex].avLocation;
		var off = new Vector(-playSpot.x + 0.5 * cnv.width, -playSpot.y + 0.5 * cnv.height);

		//Draw the self
		characterDraw(appState.game.context, appState.game.canvas, gameState.players[playerIndex], off);
	},

	//Draw the character for everyone else.
	others: function others(appState, gameState, playerIndex) {

		//Draw the other players.
		var ctx = appState.game.context;
		var playSpot = gameState.players[playerIndex].avLocation;
		var off = new Vector(-playSpot.x + 0.5 * cnv.width, -playSpot.y + 0.5 * cnv.height);
		gameState.players.forEach(function (plyr, index) {
			playerIndex != index && characterDraw(ctx, appState.game.canvas, plyr, off);
		});

		for (var x = 0; x < gameState.food.length; x++) {
			var f = gameState.food[x];
			if (f.location.dist(playSpot) < 1500) {
				var fs = f.location.add(off);
				var max = Settings.foodMaxSize;
				if (f.age > 0) {
					var size = 0.9 * max + 0.1 * max * Math.cos(f.age / Settings.foodCycleTime * 2 * Math.PI);
				} else {
					var size = max + f.age / Settings.foodCycleTime * max;
				}
				ctx.beginPath();
				ctx.arc(fs.x, fs.y, size, 0, 2 * Math.PI, false);
				ctx.lineWidth = 1;
				ctx.fillStyle = f.color;
				ctx.strokeStyle = f.color;
				ctx.fill();
			}
		}
	}
};

module.exports = Draw;

},{"../../common/js/settings.js":11,"../../common/js/vector.js":13}],6:[function(require,module,exports){
'use strict';

var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');

var throttledResize = function throttledResize(msbetween, cnv) {
	var resizer = function resizer() {
		cnv.width = document.body.clientWidth; //document.width is obsolete
		cnv.height = document.body.clientHeight; //document.height is obsolete
	};
	resizer();
	window.addEventListener("resize", resizeThrottler, false);
	var resizeTimeout;
	function resizeThrottler() {
		if (!resizeTimeout) {
			resizeTimeout = setTimeout(function () {
				resizeTimeout = null;
				resizer();
			}, msbetween);
		}
	}
};

var mousePositionFinder = function mousePositionFinder(cnv) {
	var ret = new Vector(0, 0);
	var getMousePosition = function getMousePosition(e) {
		var rect = cnv.getBoundingClientRect();
		var newRet = new Vector(e.clientX - rect.left, e.clientY - rect.top);
		if (newRet.x != 0 && newRet.y != 0) {
			ret = newRet;
		}
	};
	cnv.addEventListener('mousemove', getMousePosition, false);
	return function () {
		return ret;
	};
};

module.exports = function (opt) {

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

	playbutton.onclick = function () {
		cnv.style.display = "block";
		menu.style.display = "none";
		console.log(options);
		options.playGame(state);
	};

	watchbutton.onclick = function () {
		console.log("This feature has not been added!");
		options.watchGame(state);
	};

	loginbutton.onclick = function () {
		options.login(state);
	};
};

},{"../../common/js/settings.js":11,"../../common/js/vector.js":13}],7:[function(require,module,exports){
'use strict';

var Player = require('../../common/js/player.js');
var Food = require('../../common/js/food.js');
var Settings = require('../../common/js/settings.js');

var EnvironmentState = function EnvironmentState(toCopy) {
	if (!toCopy) {
		this.players = [];
		this.food = [];
		for (var x = 0; x < Settings.foodStartAmount; x++) {
			this.food.push(new Food());
		}
	} else {
		this.players = toCopy.players.map(function (n) {
			return new Player(n);
		});
		this.food = toCopy.food.slice();
	}
};

EnvironmentState.prototype.step = function () {

	var ret = new EnvironmentState();

	ret.players = [];
	for (var x = 0; x < this.players.length; x++) {
		ret.players.push(this.players[x].step());
	}

	ret.food = [];
	for (var x = 0; x < this.food.length; x++) {
		ret.food.push(this.food[x]);
	}

	for (var x = this.food.length; x < Settings.foodStartAmount; x++) {
		ret.food.push(new Food(true));
	}

	for (var x = 0; x < ret.players.length; x++) {
		for (var y = 0; y < ret.food.length; y++) {
			if (ret.players[x].places[0].dist(ret.food[y].location) < Settings.foodMaxSize) {
				console.log("!");
				ret.players[x] = ret.players[x].eatFood();
				ret.players[x] = ret.players[x].eatFood();
				ret.players[x] = ret.players[x].eatFood();
				ret.players[x] = ret.players[x].eatFood();
				ret.food.splice(y, 1);
			}
		}
	}

	return ret;
};

EnvironmentState.prototype.addPlayer = function (a, b, c, d) {
	this.players.push(new Player(a, b, c, d));
};

EnvironmentState.prototype.advance = function (num) {
	var ret = new EnvironmentState(this);
	for (var x = 0; x < num; x++) {
		ret = ret.step();
	}
	return ret;
};

EnvironmentState.prototype.setMove = function (playerIndex, move) {
	this.players[playerIndex].setMove(move);
};

module.exports = EnvironmentState;

},{"../../common/js/food.js":8,"../../common/js/player.js":10,"../../common/js/settings.js":11}],8:[function(require,module,exports){
'use strict';

var Vector = require('../../common/js/vector.js');
var Settings = require('../../common/js/settings.js');

var possibleColors = ['red', 'orange', 'blue', 'green', 'gray', 'purple', 'maroon'];

var Food = function Food(grow) {

	this.location = new Vector(Math.random() * Settings.boardSize, Math.random() * Settings.boardSize);
	if (grow === true) {
		this.age = -Settings.foodCycleTime;
	} else {
		this.age = Math.random() * Settings.foodCycleTime;
	}
	this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
};

Food.prototype.step = function () {
	var ret = new Food();
	ret.location = this.location;
	ret.color = this.color;
	ret.age = this.age + Settings.physicsRate;
	if (ret.age > Settings.foodCycleTime) {
		ret.age = ret.age - Settings.foodCycleTime;
	}
	return ret;
};

module.exports = Food;

},{"../../common/js/settings.js":11,"../../common/js/vector.js":13}],9:[function(require,module,exports){
"use strict";

var Vector = require('../../common/js/vector.js');

var Move = function Move(options) {

	if (options.aim && options.mousePosition || !options.aim && !options.mousePosition) {
		throw new Error("Must either provide mouse position xor an exact location.");
	}

	if (options.mousePosition && !options.player) {
		throw new Error("If you provide a mouse position, you must provide a player.");
	}

	if (options.mousePosition) {

		var playSpot = options.player.avLocation;
		var off = new Vector(-playSpot.x + cnv.width * 0.5, -playSpot.y + cnv.height * 0.5);
		//console.log(options.mousePosition)
		this.aim = options.mousePosition.sub(off);
	} else {
		if (!(options.aim instanceof Vector)) {
			throw new Error("Move must have valid location");
		} else {
			this.aim = options.aim;
		}
	}

	this.split = options.split || false;
};

module.exports = Move;

},{"../../common/js/vector.js":13}],10:[function(require,module,exports){
'use strict';

var Vector = require('../../common/js/vector.js');
var Settings = require('../../common/js/settings.js');
var averageSpot = function averageSpot(arr) {
	return arr.reduce(function (build, stuff) {
		return build.add(stuff);
	}, new Vector(0, 0)).scale(1 / arr.length);
};

var initializeLocation = function initializeLocation(x, y, direction, length) {
	var radians = 2 * direction / 360 * Math.PI;
	var distX = Math.sin(radians);
	var distY = Math.cos(radians);

	var places = [];
	for (var i = 0; i < length; i++) {
		places.push(new Vector(x + Settings.segmentSpacing * distX * i + Math.random() / 100, y + Settings.segmentSpacing * distY * i + Math.random() / 100));
	}
	return places;
};

function Player(x, y, direction, length) {
	if (typeof x == 'number') {
		this.mouseVector = new Vector(0, 0);
		this.speed = 1;
		this.segDist = 2;
		this.kink = 0;
		this.places = initializeLocation(x, y, direction, length);
		this.avLocation = averageSpot(this.places);
	} else {
		this.speed = x.speed;
		this.segDist = x.segDist;
		this.kink = x.kink;
		this.mouseVector = Vector.copy(x.mouseVector);
		this.places = x.places.map(Vector.copy);
		this.avLocation = x.avLocation;
	}
}

Player.prototype.kinkiness = function () {

	var kinkiness = 0;
	for (var x = 3; x < this.places.length - 3; x++) {

		var pointing = this.places[x].sub(this.places[x + 3]).toUnit();
		var otherPoint = this.places[x - 3].sub(this.places[x]).toUnit();
		var diff = pointing.dist(otherPoint);
		kinkiness = kinkiness + diff;
	}
	return kinkiness;
};

Player.prototype.setMove = function (mv) {
	this.mouseVector = mv.aim;
};

Player.prototype.eatFood = function () {
	var ret = new Player(this);
	var last = ret.places[this.places.length - 1];
	var penu = ret.places[this.places.length - 2];
	ret.places.push(last.add(penu.sub(last)));
	return ret;
};

Player.prototype.step = function (mousePos) {

	var ret = new Player(this);

	ret.kink = ret.kinkiness();
	ret.speed = ret.kink / Math.sqrt(ret.places.length) + 1;

	ret.avLocation = ret.places.reduce(function (build, stuff) {
		return build.add(stuff);
	}, new Vector(0, 0)).scale(1 / ret.places.length);

	var goal = ret.places[0].sub(ret.places[1]).toUnit().scale(3);
	var pointing = this.mouseVector.sub(ret.places[0]).toUnit();
	var directionScaled = goal.add(pointing).toUnit().scale(ret.speed);
	ret.places.unshift(ret.places[0].add(directionScaled));
	ret.places.pop();

	return ret;
};

module.exports = Player;

},{"../../common/js/settings.js":11,"../../common/js/vector.js":13}],11:[function(require,module,exports){
'use strict';

module.exports = {

	resizeRate: 50,
	physicsRate: 25,

	boardSize: 10000,
	foodStartAmount: 3000,
	foodSpawnRate: 100, //Per map, per second
	foodCycleTime: 2500,
	foodMaxSize: 5,
	gridSpace: 20,
	gridColor: '#BBB',

	segmentSpacing: 2

};

},{}],12:[function(require,module,exports){
"use strict";

module.exports = {

	timed: function timed(verbose, func) {

		return function () {
			var start = Date.now();
			func();
			var end = Date.now();
			verbose && console.log("Took " + (end - start) + " miliseconds.");
		};
	}

};

},{}],13:[function(require,module,exports){
"use strict";

function Vector(x, y) {
	this.x = x;
	this.y = y;
}

Vector.copy = function (vector) {
	var ret = new Vector();
	ret.x = vector.x;
	ret.y = vector.y;
	return ret;
};

Vector.prototype.add = function (vector) {
	return new Vector(vector.x + this.x, vector.y + this.y);
};

Vector.prototype.sub = function (vector) {
	return new Vector(-vector.x + this.x, -vector.y + this.y);
};

Vector.prototype.scale = function (scalar) {
	return new Vector(this.x * scalar, this.y * scalar);
};

Vector.prototype.perp = function () {
	return new Vector(-this.y, this.x);
};

Vector.prototype.dist = function (other) {
	return this.sub(other).length();
};

Vector.prototype.limit = function (min, max) {
	return new Vector(Math.max(min, Math.min(this.x, max)), Math.max(min, Math.min(this.y, max)));
};

// Vector.prototype.side = function(a,b){
// 	return (((b.x - a.x)*(this.y - a.y) - (b.y - a.y)*(this.x - a.x)) > 0) ? 1 : - 1;
// }

Vector.prototype.length = function () {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.toUnit = function () {
	return this.scale(1 / this.length());
};

module.exports = Vector;

},{}]},{},[1]);
