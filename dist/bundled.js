(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('../../client/js/pageSetUp.js')({
	playGame: require('../../client/js/clientGame.js'),
	watchGame: require('../../client/js/clientWatch.js'),
	login: require('../../client/js/clientLogin.js')
});

},{"../../client/js/clientGame.js":2,"../../client/js/clientLogin.js":3,"../../client/js/clientWatch.js":4,"../../client/js/pageSetUp.js":6}],2:[function(require,module,exports){
'use strict';

var ElementManager = require('../../common/js/ElementManager.js');
var Settings = require('../../common/js/settings.js');
var Utilities = require('../../common/js/utilities.js');
var Move = require('../../common/js/move.js');
var View = require('../../common/js/view.js');
var Vector = require('../../common/js/vector.js');
var HighScore = require('../../client/js/highscore.js');

var playGame = function playGame(gameState, appState, playerId, finished) {

	var tempView;
	var stepsAfterDeath = 0;

	var physicsLoops = setInterval(Utilities.timed(true, function () {

		//Grab player and make moves.
		var plyr = gameState.getElement(playerId);

		if (plyr == undefined) {
			stepsAfterDeath++;
			if (stepsAfterDeath > Settings.framesToViewAfterDeath) {
				window.clearInterval(physicsLoops);
				console.log(physicsLoops);
				finished();
			}
		} else {
			var movr = new Move({
				mousePosition: appState.game.mousePosition(),
				canvas: appState.game.canvas,
				player: plyr
			});
			plyr.setMove(movr);
			tempView = new View(appState.game.canvas, plyr);
		}

		//View is what is used in rendering.
		gameState.draw(appState.game.context, tempView);
		//Draw the high score HTML elements
		HighScore(gameState, appState.game.context);

		//set this shit
		gameState = gameState.step([require('../../common/js/elementManagerFood.js'), require('../../common/js/elementManagerAi.js')]);
	}), Settings.physicsRate);
};

module.exports = function (appState, finished) {
	var gameState = require('../../common/js/initialgamecreator.js')();
	var playerId = Utilities.addPlayer('human', gameState);
	playGame(gameState, appState, playerId, finished);
};

},{"../../client/js/highscore.js":5,"../../common/js/ElementManager.js":8,"../../common/js/elementManagerAi.js":13,"../../common/js/elementManagerFood.js":14,"../../common/js/initialgamecreator.js":19,"../../common/js/move.js":20,"../../common/js/settings.js":21,"../../common/js/utilities.js":22,"../../common/js/vector.js":23,"../../common/js/view.js":24}],3:[function(require,module,exports){
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

var HighScore = function HighScore(elementManager, ctx) {

	//Get top
	var top = [];

	var top = elementManager.elements.map(function (n) {
		return n.copy();
	}).filter(function (m) {
		return m.type == 'player';
	});

	top.sort(function (a, b) {
		return b.places.length - a.places.length;
	});

	var done = top.slice(0, 10);

	for (var x = 0; x < done.length; x++) {
		var plyr = done[x];
		var length = done[x].places.length;
		var width = length / plyr.colors.length;
		var fromTop = 50 + x * 7;
		for (var y = 0; y < plyr.colors.length; y++) {
			var color = plyr.colors[y];
			var pth = new Path2D();
			pth.moveTo(y * width, fromTop);
			pth.lineTo((y + 1) * width - 2, fromTop);
			ctx.lineWidth = 6;
			ctx.strokeStyle = color;
			ctx.stroke(pth);
		}
	}
};

module.exports = HighScore;

},{}],6:[function(require,module,exports){
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
	var game = document.getElementById('game');
	var ctx = cnv.getContext('2d');
	game.style.display = "none";
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

	var goBack = function goBack() {
		game.style.display = "none";
		menu.style.display = "block";
		console.log("Go Back Callback invoked.");
	};

	playbutton.onclick = function () {
		game.style.display = "block";
		menu.style.display = "none";
		console.log(options);
		options.playGame(state, goBack);
	};

	watchbutton.onclick = function () {
		console.log("This feature has not been added!");
		options.watchGame(state, goBack);
	};

	loginbutton.onclick = function () {
		options.login(state, goBack);
	};
};

},{"../../common/js/settings.js":21,"../../common/js/vector.js":23}],7:[function(require,module,exports){
'use strict';

var Vector = require('../../common/js/vector.js');

var BoundingBox = function BoundingBox(vectorArr) {
	var upperLeft = Vector.copy(vectorArr[0]);
	var lowerRight = Vector.copy(vectorArr[0]);
	for (var x = 1, len = vectorArr.length; x < len; x++) {
		upperLeft.x = Math.min(upperLeft.x, vectorArr[x].x);
		upperLeft.y = Math.min(upperLeft.y, vectorArr[x].y);
		lowerRight.x = Math.max(lowerRight.x, vectorArr[x].x);
		lowerRight.y = Math.max(lowerRight.y, vectorArr[x].y);
	}
	this.left = upperLeft.x;
	this.right = lowerRight.x;
	this.top = upperLeft.y;
	this.bottom = lowerRight.y;
};

BoundingBox.copy = function (cop) {
	var m = new BoundingBox([new Vector(0, 0)]);
	m.left = cop.left;
	m.right = cop.right;
	m.top = cop.top;
	m.bottom = cop.bottom;
	return m;
};

BoundingBox.prototype.expanded = function (amount) {
	var ret = BoundingBox.copy(this);
	ret.left = ret.left - amount;
	ret.right = ret.right + amount;
	ret.top = ret.top - amount;
	ret.bottom = ret.bottom + amount;
	return ret;
};

BoundingBox.prototype.scaleHoriz = function (amount) {
	var width = this.right - this.left;
	var additional = (width * amount - width) / 2;
	var ret = BoundingBox.copy(this);
	ret.left = ret.left - additional;
	ret.right = ret.right + additional;
	return ret;
};

BoundingBox.prototype.scaleVert = function (amount) {
	var height = this.bottom - this.top;
	var additional = (height * amount - height) / 2;
	var ret = BoundingBox.copy(this);
	ret.top = ret.top - additional;
	ret.bottom = ret.bottom + additional;
	return ret;
};

BoundingBox.prototype.getWidth = function () {
	return this.right - this.left;
};

BoundingBox.prototype.getHeight = function () {
	return this.bottom - this.top;
};

BoundingBox.prototype.intersects = function (otherBox) {
	return !(this.right < otherBox.left || this.left > otherBox.right || this.top > otherBox.bottom || this.bottom < otherBox.top);
};

module.exports = BoundingBox;

},{"../../common/js/vector.js":23}],8:[function(require,module,exports){
'use strict';

var Settings = require('../../common/js/settings.js');
var BoundingBox = require('../../common/js/boundingbox.js');
var Grid = require('../../common/js/grid.js');

var members = {
	grid: require('../../common/js/elementgrid.js'),
	player: require('../../common/js/elementplayer.js'),
	food: require('../../common/js/elementfood.js')
};

var ElementManager = function ElementManager() {
	this.elements = [];
};

ElementManager.prototype.draw = function (context, view) {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	for (var x = 0, len = this.elements.length; x < len; x++) {
		var el = this.elements[x];
		if (view.box.intersects(el.box)) {
			this.elements[x].draw(context, view);
		}
	}
};

ElementManager.prototype.getElement = function (id) {
	for (var x = 0, len = this.elements.length; x < len; x++) {
		if (this.elements[x].id === id) {
			return this.elements[x];
		}
	}
	return undefined;
};

ElementManager.prototype.addElement = function (name, location, options) {
	var temp = new (members[name.toLowerCase()])(location, options);
	this.elements.push(temp);
	return temp.id;
};

ElementManager.prototype.step = function (mods) {
	var self = this;
	var filteredElements = [];

	for (var x = 0, len = this.elements.length; x < len; x++) {
		var temp = this.elements[x].step();
		if (temp != undefined) {
			filteredElements = filteredElements.concat(temp);
		}
	}

	for (var x = 0, len = filteredElements.length; x < len; x++) {
		if (!filteredElements[x].inactive) {
			for (var y = 0, len = filteredElements.length; y < len; y++) {
				for (var y = 0; y < len; y++) {
					if (filteredElements[x].matters(filteredElements[y])) {
						filteredElements[x].encounters(filteredElements[y]);
					}
				}
			}
		}
	}

	//Make new thing, and return it.
	var ret = new ElementManager();
	ret.elements = filteredElements;
	mods = mods || [];
	for (var x = 0; x < mods.length; x++) {
		mods[x](ret);
	}
	return ret;

	// for(var x = 0, len=Grid.length; x < len; x++){
	// 	Grid[x].items = [];
	// 	for(var y = 0; y < filteredElements.length; y++){
	// 		if(Grid[x].box.intersects(filteredElements[y].box)){
	// 			filteredElements[y].visitedBy = [];
	// 			Grid[x].items.push(filteredElements[y]);
	// 		}
	// 	}
	// }

	// //Alter them in accord with any, by which they need to be altered.

	// for(var x = 0; x < Grid.length; x++){
	// 	var stuffHere = Grid[x].items;
	// 	for(var y =0; y < stuffHere.length; y++){
	// 		if (!stuffHere[y].inactive){
	// 			for(var z = 0; z < stuffHere.length; z++){
	// 				if(stuffHere[y].matters(stuffHere[z])) {
	// 					stuffHere[y].encounters(stuffHere[z])
	// 				}
	// 			}
	// 		}
	// 	}
	// }
};

module.exports = ElementManager;

},{"../../common/js/boundingbox.js":9,"../../common/js/elementfood.js":15,"../../common/js/elementgrid.js":16,"../../common/js/elementplayer.js":17,"../../common/js/grid.js":18,"../../common/js/settings.js":21}],9:[function(require,module,exports){
'use strict';

var Vector = require('../../common/js/vector.js');

var BoundingBox = function BoundingBox(vectorArr) {
	var upperLeft = Vector.copy(vectorArr[0]);
	var lowerRight = Vector.copy(vectorArr[0]);
	for (var x = 1, len = vectorArr.length; x < len; x++) {
		upperLeft.x = Math.min(upperLeft.x, vectorArr[x].x);
		upperLeft.y = Math.min(upperLeft.y, vectorArr[x].y);
		lowerRight.x = Math.max(lowerRight.x, vectorArr[x].x);
		lowerRight.y = Math.max(lowerRight.y, vectorArr[x].y);
	}
	this.left = upperLeft.x;
	this.right = lowerRight.x;
	this.top = upperLeft.y;
	this.bottom = lowerRight.y;
};

BoundingBox.copy = function (cop) {
	var m = new BoundingBox([new Vector(0, 0)]);
	m.left = cop.left;
	m.right = cop.right;
	m.top = cop.top;
	m.bottom = cop.bottom;
	return m;
};

BoundingBox.prototype.expanded = function (amount) {
	var ret = BoundingBox.copy(this);
	ret.left = ret.left - amount;
	ret.right = ret.right + amount;
	ret.top = ret.top - amount;
	ret.bottom = ret.bottom + amount;
	return ret;
};

BoundingBox.prototype.scaleHoriz = function (amount) {
	var width = this.right - this.left;
	var additional = (width * amount - width) / 2;
	var ret = BoundingBox.copy(this);
	ret.left = ret.left - additional;
	ret.right = ret.right + additional;
	return ret;
};

BoundingBox.prototype.scaleVert = function (amount) {
	var height = this.bottom - this.top;
	var additional = (height * amount - height) / 2;
	var ret = BoundingBox.copy(this);
	ret.top = ret.top - additional;
	ret.bottom = ret.bottom + additional;
	return ret;
};

BoundingBox.prototype.getWidth = function () {
	return this.right - this.left;
};

BoundingBox.prototype.getHeight = function () {
	return this.bottom - this.top;
};

BoundingBox.prototype.intersects = function (otherBox) {
	return !(this.right < otherBox.left || this.left > otherBox.right || this.top > otherBox.bottom || this.bottom < otherBox.top);
};

module.exports = BoundingBox;

},{"../../common/js/vector.js":23}],10:[function(require,module,exports){
'use strict';

var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
var Move = require('../../common/js/move.js');

module.exports = {
	setMove: function setMove(AI, Players, Feed) {
		var dist = Settings.gridSize * 10;
		var spot = undefined; //AI.places[0].sub(AI.location.sub(AI.places[0]));
		for (var y = 0; y < Feed.length; y++) {
			var newDist = Feed[y].location.dist(AI.places[0]);
			var collides = false;
			for (var z = 0; z < Players.length; z++) {
				var one = Players[z].box.expanded(50);
				var two = AI.box.expanded(50);
				if (one.intersects(two)) {
					for (var a = 0; a < Players[z].places.length - 5; a = a + 5) {
						var colis = Utilities.collision(AI.places[0], Feed[y].location, Players[z].places[a], Players[z].places[a + 5]);
						if (colis) {
							collides = true;
						}
					}
				}
			}
			if (newDist < dist && !collides) {
				spot = Vector.copy(Feed[y].location);
				dist = newDist;
			}
		}
		if (spot) {
			AI.setMove(new Move({ aim: spot }));
		} else {
			var Other = [];
			for (var x = 0; x < 30; x++) {
				var rand = AI.places[0].add(new Vector((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50));
				var collides = false;
				for (var z = 0; z < Players.length; z++) {
					var one = Players[z].box.expanded(50);
					var two = AI.box.expanded(50);
					if (one.intersects(two)) {
						for (var a = 0; a < Players[z].places.length - 5; a = a + 5) {
							var colis = Utilities.collision(AI.places[0], rand, Players[z].places[a], Players[z].places[a + 5]);
							if (colis) {
								collides = true;
							}
						}
					}
				}
				if (!collides) {
					var n = Vector.copy(rand);
					console.log(n);
					AI.setMove(new Move({ aim: n }));
					break;
				}
			}
		}
	}
};

},{"../../common/js/move.js":20,"../../common/js/settings.js":21,"../../common/js/utilities.js":22,"../../common/js/vector.js":23}],11:[function(require,module,exports){
'use strict';

var Vector = require('../../common/js/vector.js');
var View = require('../../common/js/view.js');
var Utilities = require('../../common/js/utilities.js');

var reqFunc = {
	construct: {
		checks: [function (a) {
			return a instanceof Vector;
		}, function (a) {
			return typeof a == 'object';
		}],
		explanations: ["Expected a vector, but no vector received.", "Expected an object, but something else received."]
	},
	draw: {
		checks: [function (a) {
			return a.beginPath != undefined;
		}, function (a) {
			return a instanceof View;
		}],
		explanations: ["Expected a context object as the first argument, but did not recieve one.", "Expected a View object as the second argument, but didn't get one."]
	},
	step: { checks: [], explanations: [] },
	copy: { checks: [], explanations: [] },
	matters: {
		checks: [function (a) {
			return a.isAnElement == true;
		}],
		explanations: ["Expected an object which was created by the element factory, but didn't get one."]
	},
	encounters: {
		checks: [function (a) {
			return a.isAnElement === true;
		}],
		explanations: ["Expected an object created by the element factory, but did not get one."]
	}
};

var Element = function Element(options) {

	//Make stub constructoor function.

	var ret = function ret() {
		//Mark it as belonging to this kind of prototype-like thing.
		this.isAnElement = true;
		this.id = Utilities.makeUniqueId();
		//Make sure that we are being passed legit arguments.
		var args = [];
		for (var x = 0; x < arguments.length; x++) {
			if (reqFunc.construct.checks[x](arguments[x])) {
				args.push(arguments[x]);
			} else {
				throw new Error("An incorrect value: " + reqFunc.construct.explanations[x]);
			}
		}
		options.construct.apply(this, args);
		//Internal type indicator for use with the 'matters' function.
		if (this.type == undefined) {
			throw new Error("Constructor function must add .type property to element.");
		}
		if (this.priority === undefined) {
			throw new Error("Constructor function must add .priority property for drawing purposes.");
		}
		if (this.nothingMatters !== true && this.nothingMatters !== false) {
			throw new Error("Constructor function must set .nothingMatters property to be true or false at some point during invocation.");
		}
		if (this.box === undefined) {
			throw new Error("Constructor function must set .box property to be an instance of BoundingBox.");
		}
		if (this.inactive === undefined) {
			throw new Error("Constructor function must set .inactive property to be true or false.");
		}
	};

	//Add the rest of the functions.
	var protFunc = ['draw', 'step', 'matters', 'copy', 'encounters'];
	protFunc.forEach(function (fn) {
		//Make sure that it has the function in question in the options.
		if (typeof options[fn] != 'function') {
			throw new Error("'options' object passed to element required an '" + fn + "'' function.");
		}
		//Make sure the arity of the function passed is what it should be.
		if (options[fn].length != reqFunc[fn].checks.length) {
			throw new Error("'" + fn + "' function in options requires an arity of " + reqFunc[fn].checks.length);
		}
		//Add the function, without error checking.
		ret.prototype[fn] = options[fn];
	});

	//Add the functions that are not required, with stuff.
	Object.keys(options).filter(function (func) {
		return protFunc.indexOf(func) == -1 && func != 'construct';
	}).forEach(function (fn) {
		ret.prototype[fn] = options[fn];
	});

	return ret;
};

module.exports = Element;

},{"../../common/js/utilities.js":22,"../../common/js/vector.js":23,"../../common/js/view.js":24}],12:[function(require,module,exports){
'use strict';

var Element = require('../../common/js/element.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var ElementFood = Element({
	construct: function construct(location, options) {
		//Mandatory
		this.type = 'food';
		this.nothingMatters = true;
		this.inactive = true;
		this.priority = 1;
		//Non-mandatory
		this.location = location;
		this.growing = options.growing || false;
		this.shrinking = false;
		this.size = options.growing ? 1 : Settings.foodMaxSize;
		this.color = Settings.foodPossibleColors[Math.floor(Math.random() * Settings.foodPossibleColors.length)];
		var rad = new Vector(Settings.foodMaxSize, Settings.foodMaxSize);
		this.box = new BoundingBox([this.location.add(rad), this.location.sub(rad)]);
	},
	draw: function draw(context, view) {
		var off = view.off;
		var fs = this.location;
		var size = this.size;
		// console.log(size);
		view.drawCircle(fs, size, 2, this.color);
	},
	step: function step() {
		var ret = this.copy();
		if (ret.shrinking) {
			ret.size = ret.size - Settings.foodGrowthRate;
		}
		if (ret.growing) {
			ret.size = ret.size + Settings.foodGrowthRate;
		}
		if (ret.size >= Settings.foodMaxSize) {
			ret.size = Settings.foodMaxSize;
			ret.growing = false;
		}
		return ret.size <= 0 ? undefined : ret;
	},
	copy: function copy() {
		var ret = Utilities.shallowCopy(this);
		ret.location = Vector.copy(this.location);
		ret.box = BoundingBox.copy(this.box);
		return ret;
	},
	relevantPoints: function relevantPoints() {
		return [Vector.copy(this.location)];
	},
	matters: function matters(element) {
		return false;
	},
	encounters: function encounters(element) {
		throw new Error("This shouldn't ever be called.");
	}
});

module.exports = ElementFood;

},{"../../common/js/boundingbox.js":9,"../../common/js/element.js":11,"../../common/js/settings.js":21,"../../common/js/utilities.js":22,"../../common/js/vector.js":23}],13:[function(require,module,exports){
'use strict';

var Food = require('../../common/js/elementFood.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
var Move = require('../../common/js/move.js');

var Brain = require('../../common/js/brain.js');

//This is passed into the step function.  The step function, for the
//state manager.
var time = 0;

//This needs to be made waaay cleaner than it is, and
//also needs to be made so that the AI doesn't suicide
//so easily.
var elementManagerAi = function elementManagerAi(elementManager) {
	time++;

	var Players = elementManager.elements.filter(function (ele) {
		return ele.type == 'player';
	});
	var AIs = elementManager.elements.filter(function (ele) {
		return ele.type == 'player' && ele.isHuman == false;
	});
	var Feed = elementManager.elements.filter(function (ele) {
		return ele.type == 'food' && ele.shrinking == false;
	});

	if (time % Settings.aiCheckFrequency == 0) {
		for (var x = 0, len = AIs.length; x < len; x++) {
			Brain.setMove(AIs[x], Players, Feed);
		}
	}

	if (AIs.length < Settings.aiMinimum) {
		Utilities.addPlayer('computer', elementManager);
	}
};

module.exports = elementManagerAi;

},{"../../common/js/brain.js":10,"../../common/js/elementFood.js":12,"../../common/js/move.js":20,"../../common/js/settings.js":21,"../../common/js/utilities.js":22,"../../common/js/vector.js":23}],14:[function(require,module,exports){
'use strict';

var Food = require('../../common/js/elementFood.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');

//This is passed into the step function.  The step function, for the
//state manager.
var elementFoodManager = function elementFoodManager(elementManager) {

	//Count how much food there is in the world, currently.
	var foodCount = 0;
	var len = elementManager.elements.length;
	for (var x = 0; x < len; x++) {
		foodCount = elementManager.elements[x].type == 'food' ? foodCount + 1 : foodCount;
	}

	//Create more until we're at the minimum, foodStartAmount
	var total = Settings.foodStartAmount;
	for (var x = foodCount; x < total; x++) {
		elementManager.addElement('food', new Vector(Math.random() * Settings.gridSize, Math.random() * Settings.gridSize), { growing: true });
	}
};

module.exports = elementFoodManager;

},{"../../common/js/elementFood.js":12,"../../common/js/settings.js":21,"../../common/js/vector.js":23}],15:[function(require,module,exports){
'use strict';

var Element = require('../../common/js/element.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var ElementFood = Element({
	construct: function construct(location, options) {
		//Mandatory
		this.type = 'food';
		this.nothingMatters = true;
		this.inactive = true;
		this.priority = 1;
		//Non-mandatory
		this.location = location;
		this.growing = options.growing || false;
		this.shrinking = false;
		this.size = options.growing ? 1 : Settings.foodMaxSize;
		this.color = Settings.foodPossibleColors[Math.floor(Math.random() * Settings.foodPossibleColors.length)];
		var rad = new Vector(Settings.foodMaxSize, Settings.foodMaxSize);
		this.box = new BoundingBox([this.location.add(rad), this.location.sub(rad)]);
	},
	draw: function draw(context, view) {
		var off = view.off;
		var fs = this.location;
		var size = this.size;
		// console.log(size);
		view.drawCircle(fs, size, 2, this.color);
	},
	step: function step() {
		var ret = this.copy();
		if (ret.shrinking) {
			ret.size = ret.size - Settings.foodGrowthRate;
		}
		if (ret.growing) {
			ret.size = ret.size + Settings.foodGrowthRate;
		}
		if (ret.size >= Settings.foodMaxSize) {
			ret.size = Settings.foodMaxSize;
			ret.growing = false;
		}
		return ret.size <= 0 ? undefined : ret;
	},
	copy: function copy() {
		var ret = Utilities.shallowCopy(this);
		ret.location = Vector.copy(this.location);
		ret.box = BoundingBox.copy(this.box);
		return ret;
	},
	relevantPoints: function relevantPoints() {
		return [Vector.copy(this.location)];
	},
	matters: function matters(element) {
		return false;
	},
	encounters: function encounters(element) {
		throw new Error("This shouldn't ever be called.");
	}
});

module.exports = ElementFood;

},{"../../common/js/boundingbox.js":9,"../../common/js/element.js":11,"../../common/js/settings.js":21,"../../common/js/utilities.js":22,"../../common/js/vector.js":23}],16:[function(require,module,exports){
'use strict';

var Element = require('../../common/js/element.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
var BoundingBox = require('../../common/js/BoundingBox.js');

var ElementGrid = Element({
	//Constructor actually ignores required things, because this is such a background.. thing.
	construct: function construct(location, options) {
		//mandatory
		this.type = 'grid';
		this.nothingMatters = true;
		this.inactive = true;
		this.priority = 0;
		//optional
		this.location = new Vector(0, 0);
		this.gridSize = Settings.gridSize;
		this.gridSpace = Settings.gridSpace;
		this.box = new BoundingBox([new Vector(0, 0), new Vector(this.gridSize, this.gridSize)]);
	},
	draw: function draw(context, view) {
		//Setup
		var gsi = this.gridSize;
		var gsp = this.gridSpace;
		var color = Settings.gridColor;
		//Draw the grid.
		for (var x = 0; x <= gsi; x = x + gsp) {
			var right = new Vector(0, x);
			var left = new Vector(gsi, x);
			var top = new Vector(x, 0);
			var bottom = new Vector(x, gsi);
			view.drawPath([left, right], 1, color);
			view.drawPath([top, bottom], 1, color);
		}
	},
	step: function step() {
		return this.copy();
	},
	copy: function copy() {
		var ret = Utilities.shallowCopy(this);
		ret.location = Vector.copy(this.location);
		ret.box = BoundingBox.copy(this.box);
		return ret;
	},
	relevantPoints: function relevantPoints() {
		return [new Vector(0, 0), new Vector(this.gridSize, this.gridSize)];
	},
	matters: function matters(element) {
		return false;
	},
	encounters: function encounters(element) {
		throw new Error('This should never be called, because .nothingMatters is set to be true.');
	}
});

module.exports = ElementGrid;

},{"../../common/js/BoundingBox.js":7,"../../common/js/element.js":11,"../../common/js/settings.js":21,"../../common/js/utilities.js":22,"../../common/js/vector.js":23}],17:[function(require,module,exports){
'use strict';

var Element = require('../../common/js/element.js');
var ElementFood = require('../../common/js/elementfood.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
var BoundingBox = require('../../common/js/BoundingBox.js');

var ElementPlayer = Element({
	//Constructor actually ignores required things, because this is such a background.. thing.
	construct: function construct(location, options) {
		//Optional
		this.isHuman = options.isHuman === undefined ? true : options.isHuman;
		this.places = Vector.chain(location, {
			segments: Settings.startSegments,
			spacing: Settings.startSpacing,
			direction: options.direction || 0
		});
		this.location = Vector.average(this.places);
		this.aim = new Vector(0, 0);
		this.amountToGrow = 0;
		this.speed = 1;
		this.kink = 0;

		this.dying = false;
		this.dead = undefined;

		//Set the particular colors for the snake.		
		this.colorLength = 1 + Math.floor(Math.random() * Settings.maxColorLength);
		this.colors = [];
		for (var x = 0; x < this.colorLength; x++) {
			this.colors.push(Settings.playerPossibleColors[Math.floor(Math.random() * Settings.playerPossibleColors.length)]);
		}
		this.stripeLength = Settings.minStripeLength + Math.random() * (Settings.maxStripeLength - Settings.minStripeLength);

		//Mandatory
		this.type = 'player';
		this.priority = 1;
		this.inactive = false;
		this.nothingMatters = false;
		this.box = new BoundingBox(this.places);
	},
	draw: function draw(context, view) {
		var off = view.off;
		var width = 2 + Math.sqrt((this.places.length - Settings.startSegments) / 100);
		for (var x = 0; x < this.places.length - 1; x++) {
			var color = this.colors[Math.floor(x / this.stripeLength) % this.colorLength];
			view.drawPath([this.places[x], this.places[x + 1]], width, color);
		}
	},
	step: function step() {

		if (this.dying == true) {
			var ret = [];
			var inc = Settings.foodSpacing;
			for (var x = 0; x < this.places.length; x = x + inc) {
				if (this.places[x].x > 0 && this.places[x].x < Settings.gridSize && this.places[x].y > 0 && this.places[x].y < Settings.gridSize) {
					ret.push(new ElementFood(Vector.copy(this.places[x]), { growing: true }));
				}
			}
			return ret;
		}

		var kinkiness = function kinkiness(v) {
			var kinkiness = 0;
			for (var x = 3; x < v.places.length - 3; x++) {
				var pointing = v.places[x].sub(v.places[x + 3]).toUnit();
				var otherPoint = v.places[x - 3].sub(v.places[x]).toUnit();
				var diff = pointing.dist(otherPoint);
				kinkiness = kinkiness + diff;
			}
			return kinkiness;
		};

		var ret = this.copy();
		ret.speed = ret.kink / Math.sqrt(ret.places.length) + 1;
		ret.location = Vector.average(ret.places);
		if (ret.amountToGrow > 0) {
			var last = ret.places[ret.places.length - 1];
			var penu = ret.places[ret.places.length - 2];
			ret.places.push(last.sub(penu.sub(last).scale(0.01)));
			ret.amountToGrow = ret.amountToGrow - 1;
		}
		var goal = ret.places[0].sub(ret.places[1]).toUnit().scale(3);
		var pointing = this.aim.sub(ret.places[0]).toUnit();
		var directionScaled = goal.add(pointing).toUnit().scale(ret.speed);
		var addendum = ret.places[0].add(directionScaled);
		ret.box = new BoundingBox(this.places);
		ret.places.unshift(addendum);
		ret.places.pop();
		ret.kink = kinkiness(ret);
		return ret;
	},
	copy: function copy() {
		var ret = Utilities.shallowCopy(this);
		ret.places = this.places.map(function (n) {
			return Vector.copy(n);
		});
		ret.aim = Vector.copy(this.aim);
		ret.location = Vector.average(ret.places);
		ret.box = BoundingBox.copy(this.box);
		return ret;
	},
	matters: function matters(element) {
		return Utilities.foodPlayerCollision(element, this) || Utilities.playerPlayer(element, this);
	},
	relevantPoints: function relevantPoints() {
		return this.places.map(function (n) {
			return Vector.copy(n);
		});
	},
	setMove: function setMove(move) {
		this.aim = move.aim;
	},
	encounters: function encounters(element) {
		if (element.type == 'food') {
			console.log("!");
			this.amountToGrow = this.amountToGrow + Settings.foodValue;
			element.shrinking = true;
		}
		if (element.type == 'player') {
			var p1 = this.places[0];
			var p2 = this.places[4];
			for (var x = 0; x < element.places.length - 5; x = x + 5) {
				if (Utilities.collision(p1, p2, element.places[x], element.places[x + 5])) {
					this.dying = true;
					x = element.places.length;
				}
			}
		}
	}
});

module.exports = ElementPlayer;

},{"../../common/js/BoundingBox.js":7,"../../common/js/element.js":11,"../../common/js/elementfood.js":15,"../../common/js/settings.js":21,"../../common/js/utilities.js":22,"../../common/js/vector.js":23}],18:[function(require,module,exports){
'use strict';

var BoundingBox = require('../../common/js/boundingbox.js');
var Vector = require('../../common/js/vector.js');
var Settings = require('../../common/js/settings.js');

var grids = [];
var gridSize = Settings.gridSize;
var inc = Settings.treeResolution;
for (var x = 0; x < gridSize; x = x + inc) {
	for (var y = 0; y < gridSize; y = y + inc) {
		grids.push({ box: new BoundingBox([new Vector(x, y), new Vector(x + inc, y + inc)]), items: [] });
	}
}

module.exports = grids;

},{"../../common/js/boundingbox.js":9,"../../common/js/settings.js":21,"../../common/js/vector.js":23}],19:[function(require,module,exports){
'use strict';

var ElementManager = require('../../common/js/ElementManager.js');
var Vector = require('../../common/js/vector.js');
var Settings = require('../../common/js/settings.js');

var maker = function maker() {
	var gameState = new ElementManager();
	var gridId = gameState.addElement('grid', new Vector(0, 0), {});
	for (var x = 0; x < Settings.foodStartAmount; x++) {
		gameState.addElement('food', new Vector(Math.random() * Settings.gridSize, Math.random() * Settings.gridSize), {});
	}
	return gameState;
};

module.exports = maker;

},{"../../common/js/ElementManager.js":8,"../../common/js/settings.js":21,"../../common/js/vector.js":23}],20:[function(require,module,exports){
'use strict';

var Vector = require('../../common/js/vector.js');
var Settings = require('../../common/js/settings.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var Move = function Move(options) {

	if (options.aim && options.mousePosition || !options.aim && !options.mousePosition) {
		throw new Error("Must either provide mouse position xor an exact location.");
	}

	if (options.mousePosition && !options.player) {
		throw new Error("If you provide a mouse position, you must provide a player.");
	}

	if (options.mousePosition && !options.canvas) {
		throw new Error("If you provide a mouse position, you must provide a canvas.");
	}

	if (options.mousePosition) {
		var temp = new BoundingBox(options.player.places);
		var screenWidth = options.canvas.width;
		var screenHeight = options.canvas.height;
		var screenRatio = screenWidth / screenHeight;
		temp = temp.expanded(300);
		var boxRatio = (temp.right - temp.left) / (temp.bottom - temp.top);
		console.log(boxRatio / screenRatio);
		temp = temp.scaleVert(boxRatio / screenRatio);
		var viewBox = temp;

		var w = viewBox.right - viewBox.left;
		var h = viewBox.bottom - viewBox.top;
		var actualX = options.mousePosition.x / (cnv.width / w) + viewBox.left;
		var actualY = options.mousePosition.y / (cnv.height / h) + viewBox.top;
		this.aim = new Vector(actualX, actualY);
	} else {
		if (!(options.aim instanceof Vector)) {
			throw new Error("Move must have valid location");
		} else {
			this.aim = options.aim;
		}
	}

	this.aim.x = Math.max(Math.min(Settings.gridSize, this.aim.x), 0);
	this.aim.y = Math.max(Math.min(Settings.gridSize, this.aim.y), 0);

	this.split = options.split || false;
};

module.exports = Move;

},{"../../common/js/boundingbox.js":9,"../../common/js/settings.js":21,"../../common/js/vector.js":23}],21:[function(require,module,exports){
'use strict';

module.exports = {

	resizeRate: 50,
	physicsRate: 25,

	gridSize: 2000,
	gridSpace: 50,
	gridColor: '#CCC',

	startSegments: 50,
	startSpacing: 2,
	startDistanceBack: 100,

	aiCheckFrequency: 1,
	aiMinimum: 15,

	maxColorLength: 5,
	maxStripeLength: 10,
	minStripeLength: 10,
	playerPossibleColors: ['black', '#444', '#50C878', '#FFD300', 'purple'],

	framesToViewAfterDeath: 150,

	treeResolution: 2500,

	foodSpacing: 20,
	foodStartAmount: 25,
	foodPossibleColors: ['#29AB87', '#A9BA9D', '#90EE90', '#8A9A5B', '#01796F', '#009E60', '#00FF00', '#009F6B', '#1B4D3E', '#000', '#ACE1AF'],
	foodCycleTime: 2500,
	foodGrowthRate: 0.5,
	foodValue: 5,
	foodMaxSize: 15,

	segmentSpacing: 2

};

},{}],22:[function(require,module,exports){
'use strict';

var Vector = require('../../common/js/vector.js');
var Settings = require('../../common/js/settings.js');
var Move = require('../../common/js/move.js');

module.exports = {

	addPlayer: function addPlayer(playerKind, elementManager) {

		var isHuman;
		if (playerKind == 'human') {
			isHuman = true;
		} else {
			isHuman = false;
		}

		var side = Math.floor(Math.random() * 4);
		var randSpot = Math.random() * Settings.gridSize;
		var distBack = -Settings.startDistanceBack;
		var id;

		if (side == 0) {
			id = elementManager.addElement('player', new Vector(distBack, randSpot), { isHuman: isHuman, direction: 270 });
		} else if (side == 1) {
			id = elementManager.addElement('player', new Vector(-distBack + Settings.gridSize, randSpot), { isHuman: isHuman, direction: 90 });
		} else if (side == 2) {
			id = elementManager.addElement('player', new Vector(randSpot, distBack), { isHuman: isHuman, direction: 180 });
		} else if (side == 3) {
			id = elementManager.addElement('player', new Vector(randSpot, -distBack + Settings.gridSize), { isHuman: isHuman, direction: 0 });
		}

		if (!isHuman) {
			elementManager.getElement(id).setMove(new Move({
				aim: new Vector(Math.random() * Settings.gridSize, Math.random() * Settings.gridSize)
			}));
		}

		return id;
	},

	collision: function collision(p0, p1, p2, p3) {
		var s1 = p1.sub(p0);
		var s2 = p3.sub(p2);
		var temp = -s2.x * s1.y + s1.x * s2.y;
		var s = (-s1.y * (p0.x - p2.x) + s1.x * (p0.y - p2.y)) / temp;
		var t = (s2.x * (p0.y - p2.y) - s2.y * (p0.x - p2.x)) / temp;
		return s > 0 && s < 1 && t > 0 && t < 1 ? true : false;
	},

	playerPlayer: function playerPlayer(one, two) {
		return one.type == 'player' && two.type == 'player' && one.box.intersects(two.box);
	},

	foodPlayerCollision: function foodPlayerCollision(food, player) {
		return food.type == 'food' && player.type == 'player' && food.box.intersects(player.box) && !food.growing && !food.shrinking && food.location.dist(player.places[0]) < food.size;
	},

	shallowCopy: function shallowCopy(obj) {
		var keys = Object.keys(obj);
		var ret = {};
		for (var x = 0; x < keys.length; x++) {
			if (obj.hasOwnProperty(keys[x])) {
				ret[keys[x]] = obj[keys[x]];
			}
		}
		ret.__proto__ = obj.__proto__;
		return ret;
	},

	makeUniqueId: function makeUniqueId() {
		var length = 24;
		var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
		var uniqueId = '';
		for (var x = 0; x < length; x++) {
			uniqueId = uniqueId + chars[Math.floor(Math.random() * chars.length)];
		}
		return uniqueId;
	},

	timed: function timed(verbose, func) {

		var num = 0;
		var ellapsed = 0;

		return function () {
			var start = Date.now();
			func();
			var end = Date.now();
			ellapsed = ellapsed + (end - start);
			num++;
			verbose && console.log("Average of " + ellapsed / num + " miliseconds.");
		};
	}

};

},{"../../common/js/move.js":20,"../../common/js/settings.js":21,"../../common/js/vector.js":23}],23:[function(require,module,exports){
'use strict';

function Vector(x, y) {
	if (typeof x != 'number' || typeof y != 'number') {
		throw new Error("Need to pass vector numbers!");
	}
	this.x = x;
	this.y = y;
}

//Statics
Vector.copy = function (vector) {
	var ret = new Vector(0, 0);
	ret.x = vector.x;
	ret.y = vector.y;
	return ret;
};

Vector.chain = function (start, options) {
	//direction, length){
	var segments = options.segments || 10;
	var spacing = options.spacing || 1;
	var direction = options.direction || 0;
	var radians = options.direction !== 0 ? 2 * direction / 360 * Math.PI : 0;
	var components = new Vector(Math.sin(radians), Math.cos(radians));
	var chain = [];
	for (var i = 0; i < segments; i++) {
		var factor = spacing * i;
		var addendum = start.add(new Vector(factor * components.x + Math.random() / 100, factor * components.y + Math.random() / 100));
		chain.push(addendum);
	}
	return chain;
};

Vector.average = function (arr) {
	return arr.reduce(function (build, stuff) {
		return build.add(stuff);
	}, new Vector(0, 0)).scale(1 / arr.length);
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

Vector.prototype.length = function () {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.toUnit = function () {
	return this.scale(1 / this.length());
};

module.exports = Vector;

},{}],24:[function(require,module,exports){
'use strict';

var Vector = require('../../common/js/vector.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var View = function View(cnv, plyr) {
	//var center = plyr.location
	//var half = new Vector(cnv.width*0.5, cnv.height*0.5);
	this.screenWidth = cnv.width;
	this.screenHeight = cnv.height;
	this.ctx = cnv.getContext('2d');
	var screenRatio = this.screenWidth / this.screenHeight;
	console.log();
	//this.off = center.scale(-1).add(half);
	var temp = new BoundingBox(plyr.places);
	temp = temp.expanded(300);
	var boxRatio = (temp.right - temp.left) / (temp.bottom - temp.top);
	console.log(boxRatio / screenRatio);
	temp = temp.scaleVert(boxRatio / screenRatio);

	this.box = temp;
};

View.prototype.drawPath = function (arrVector, width, color) {

	//draw from left of box to right
	//from top to bottom
	var w = this.box.right - this.box.left;
	var h = this.box.bottom - this.box.top;

	var x = (arrVector[0].x - this.box.left) * this.screenWidth / w;
	var y = (arrVector[0].y - this.box.top) * this.screenHeight / h;

	var pth = new Path2D();
	this.ctx.strokeStyle = color;
	this.ctx.lineWidth = width;
	pth.moveTo(x, y);
	for (var a = 1; a < arrVector.length; a++) {
		var x = (arrVector[a].x - this.box.left) * this.screenWidth / w;
		var y = (arrVector[a].y - this.box.top) * this.screenHeight / h;
		pth.lineTo(x, y);
	}
	this.ctx.stroke(pth);
};

View.prototype.drawCircle = function (center, width, thickness, color) {
	var path = [];
	for (var x = 0; x < 2.1; x = x + 0.1) {
		var pointX = center.x + width * Math.sin(x * Math.PI);
		var pointY = center.y + width * Math.cos(x * Math.PI);
		path.push(new Vector(pointX, pointY));
	}
	this.drawPath(path, thickness, color);

	// var w = this.box.right - this.box.left;
	// var h = this.box.bottom - this.box.top;
	// // var w = Math.max(w,h)
	// // var h = Math.max(w,h)
	// var x = (center.x-this.box.left) * this.screenWidth / w;
	// var y = (center.y-this.box.top) * this.screenHeight / h;
	// this.ctx.arc(x,y, width, 0, 2 * Math.PI, false);
	// this.ctx.lineWidth = 2;
	// this.ctx.strokeStyle = color;
	// this.ctx.stroke();
};

module.exports = View;

},{"../../common/js/boundingbox.js":9,"../../common/js/vector.js":23}]},{},[1]);
