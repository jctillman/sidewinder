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
var Draw = require('../../client/js/draw.js');
var Settings = require('../../common/js/settings.js');
var Utilities = require('../../common/js/utilities.js');
var Move = require('../../common/js/move.js');
var View = require('../../common/js/view.js');
var Vector = require('../../common/js/vector.js');

var playGame = function playGame(gameState, appState, playerId, finished) {

	var physicsLoops = setInterval(Utilities.timed(true, function () {

		//Grab the player, and set the players move.
		var plyr = gameState.getElement(playerId);

		var movr = new Move({
			mousePosition: appState.game.mousePosition(),
			player: plyr
		});
		plyr.setMove(movr);

		//View is what is used in rendering.
		var tempView = new View(appState.game.canvas, plyr.location);
		gameState.draw(appState.game.context, tempView);

		//set this shit
		gameState = gameState.step([require('../../common/js/elementManagerFood.js'), require('../../common/js/elementManagerAi.js')]);

		var plyr = gameState.getElement(playerId);
		if (plyr == undefined) {
			window.clearInterval(physicsLoops);
			console.log(physicsLoops);
			finished();
		}
	}), Settings.physicsRate);
};

module.exports = function (appState, finished) {

	var gameState = new ElementManager();
	var gridId = gameState.addElement('grid', new Vector(0, 0), {});
	for (var x = 0; x < Settings.foodStartAmount; x++) {
		gameState.addElement('food', new Vector(Math.random() * Settings.gridSize, Math.random() * Settings.gridSize), {});
	}
	var playerId = gameState.addElement('player', new Vector(55, 55), {});

	//gameState.addElement('player', new Vector(255,255), {isHuman: false});

	playGame(gameState, appState, playerId, finished);
};

},{"../../client/js/draw.js":5,"../../common/js/ElementManager.js":7,"../../common/js/elementManagerAi.js":11,"../../common/js/elementManagerFood.js":12,"../../common/js/move.js":16,"../../common/js/settings.js":17,"../../common/js/utilities.js":18,"../../common/js/vector.js":19,"../../common/js/view.js":20}],3:[function(require,module,exports){
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
	for (var x = 0; x < plyr.places.length - 1; x++) {
		if (x % 25 == 0) {
			ctx.stroke(pth);
			pth = new Path2D();
			ctx.strokeStyle = ctx.strokeStyle.toString() == '#ff0000' ? "#000000" : "#ff0000";
			pth.moveTo(plyr.places[x].x + off.x, plyr.places[x].y + off.y);
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
				var size = f.size;
				// console.log(size);
				ctx.beginPath();
				ctx.arc(fs.x, fs.y, size, 0, 2 * Math.PI, false);
				ctx.lineWidth = 1;
				ctx.strokeStyle = f.color;
				ctx.stroke();
			}
		}
	}
};

module.exports = Draw;

},{"../../common/js/settings.js":17,"../../common/js/vector.js":19}],6:[function(require,module,exports){
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

	var goBack = function goBack() {
		cnv.style.display = "none";
		menu.style.display = "block";
		console.log("Go Back Callback invoked.");
	};

	playbutton.onclick = function () {
		cnv.style.display = "block";
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

},{"../../common/js/settings.js":17,"../../common/js/vector.js":19}],7:[function(require,module,exports){
'use strict';

var Settings = require('../../common/js/settings.js');
var BoundingBox = require('../../common/js/boundingbox.js');

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
			//debugger;
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
	temp.box = new BoundingBox(temp.relevantPoints());
	this.elements.push(temp);
	return temp.id;
};

ElementManager.prototype.step = function (mods) {
	var self = this;

	var filteredElements = [];
	for (var x = 0, len = this.elements.length; x < len; x++) {
		var temp = this.elements[x].step();
		if (temp != undefined) {
			var a = temp.relevantPoints();
			var b = new BoundingBox(a);
			temp.box = b;
			filteredElements.push(temp);
		}
	}

	//Alter them in accord with any, by which they need to be altered.
	//    var alteredElements = [];
	// for(var x = 0; x < filteredElements.length; x++){
	// 	var element = filteredElements[x].copy();
	// 	if(element.nothingMatters == false){
	// 		for(var y = 0; y < filteredElements.length; y++){
	// 			var otherElement = filteredElements[y].copy();
	// 			var m = BoundingBoxer.shareBoxes(element.boxes, otherElement.boxes);
	// 			if( m && element.matters(otherElement) ){
	// 				element = element.encounters(otherElement);
	// 			}
	// 		}
	// 	}
	// 	alteredElements.push(element);
	// }
	//Make new thing, and return it.
	var ret = new ElementManager();
	ret.elements = filteredElements; //alteredElements;	
	mods = mods || [];
	for (var x = 0; x < mods.length; x++) {
		mods[x](ret);
	}
	return ret;
};

module.exports = ElementManager;

},{"../../common/js/boundingbox.js":8,"../../common/js/elementfood.js":13,"../../common/js/elementgrid.js":14,"../../common/js/elementplayer.js":15,"../../common/js/settings.js":17}],8:[function(require,module,exports){
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

BoundingBox.prototype.intersects = function (otherBox) {
	return !(this.right < otherBox.left || this.left > otherBox.right || this.top > otherBox.bottom || this.bottom < otherBox.top);
};

module.exports = BoundingBox;

},{"../../common/js/vector.js":19}],9:[function(require,module,exports){
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
	relevantPoints: { checks: [], explanations: [] },
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
	};

	//Add the rest of the functions.
	var protFunc = ['draw', 'step', 'matters', 'copy', 'encounters', 'relevantPoints'];
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

},{"../../common/js/utilities.js":18,"../../common/js/vector.js":19,"../../common/js/view.js":20}],10:[function(require,module,exports){
'use strict';

var Element = require('../../common/js/element.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');

var ElementFood = Element({
	construct: function construct(location, options) {
		//Mandatory
		this.type = 'food';
		this.nothingMatters = false;
		this.priority = 1;
		//Non-mandatory
		this.location = location;
		this.growing = options.growing || false;
		this.shrinking = false;
		this.size = options.growing ? 0 : Settings.foodMaxSize;
		this.color = Settings.foodPossibleColors[Math.floor(Math.random() * Settings.foodPossibleColors.length)];
	},
	draw: function draw(context, view) {
		var off = view.off;
		var fs = this.location.add(off);
		var size = this.size;
		// console.log(size);
		context.beginPath();
		context.arc(fs.x, fs.y, size, 0, 2 * Math.PI, false);
		context.lineWidth = 1;
		context.strokeStyle = this.color;
		context.stroke();
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
		return this;
		// var ret = Utilities.shallowCopy(this);
		// ret.location = Vector.copy(this.location);
		// return ret;
	},
	relevantPoints: function relevantPoints() {
		return [Vector.copy(this.location)];
	},
	matters: function matters(element) {
		return Utilities.foodPlayerCollision(this, element);
	},
	encounters: function encounters(element) {
		if (element.type == 'player') {
			var ret = this.copy();
			ret.shrinking = true;
			return ret;
		}
	}
});

module.exports = ElementFood;

},{"../../common/js/element.js":9,"../../common/js/settings.js":17,"../../common/js/utilities.js":18,"../../common/js/vector.js":19}],11:[function(require,module,exports){
'use strict';

var Food = require('../../common/js/elementFood.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/vector.js');
var Move = require('../../common/js/move.js');

//This is passed into the step function.  The step function, for the
//state manager.
var time = 0;

//This needs to be made waaay cleaner than it is, and
//also needs to be made so that the AI doesn't suicide
//so easily.
var elementManagerAi = function elementManagerAi(elementManager) {
	time++;
	var AIs = elementManager.elements.filter(function (ele) {
		return ele.type == 'player' && ele.isHuman == false;
	});

	var Feed = elementManager.elements.filter(function (ele) {
		return ele.type == 'food';
	});

	// if ( (time % Settings.aiCheckFrequency) == 0){
	// 	for(var x = 0, len = AIs.length; x < len; x++){

	// 		var dist = Settings.gridSize;
	// 		var index = 0;
	// 		var spot = new Vector(0,0);
	// 		for(var y = 0; y < Feed.length; y++){

	// 			var newDist = Feed[y].location.dist(AIs[x].location)
	// 			if (newDist < dist){
	// 				spot = Vector.copy(Feed[y].location);
	// 				dist = newDist;
	// 			}

	// 		}

	// 		AIs[x].setMove(new Move({aim: spot}));

	// 	}
	// }
	//console.log(AIs.length, Settings.aiMinimum)
	if (AIs.length < Settings.aiMinimum) {
		elementManager.addElement('player', new Vector(Math.random() * Settings.gridSize, Math.random() * Settings.gridSize), { isHuman: false });
	}
};

module.exports = elementManagerAi;

},{"../../common/js/elementFood.js":10,"../../common/js/move.js":16,"../../common/js/settings.js":17,"../../common/js/vector.js":19}],12:[function(require,module,exports){
'use strict';

var Food = require('../../common/js/elementFood.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');

//This is passed into the step function.  The step function, for the
//state manager.
var elementFoodManager = function elementFoodManager(elementManager) {

	var foodCount = 0;
	var len = elementManager.elements.length;
	for (var x = 0; x < len; x++) {
		foodCount = elementManager.elements[x].type == 'food' ? foodCount + 1 : foodCount;
	}

	var total = Settings.foodStartAmount;
	for (var x = foodCount; x < total; x++) {
		elementManager.addElement('food', new Vector(Math.random() * Settings.gridSize, Math.random() * Settings.gridSize), { growing: true });
	}
};

module.exports = elementFoodManager;

},{"../../common/js/elementFood.js":10,"../../common/js/settings.js":17,"../../common/js/vector.js":19}],13:[function(require,module,exports){
'use strict';

var Element = require('../../common/js/element.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');

var ElementFood = Element({
	construct: function construct(location, options) {
		//Mandatory
		this.type = 'food';
		this.nothingMatters = false;
		this.priority = 1;
		//Non-mandatory
		this.location = location;
		this.growing = options.growing || false;
		this.shrinking = false;
		this.size = options.growing ? 0 : Settings.foodMaxSize;
		this.color = Settings.foodPossibleColors[Math.floor(Math.random() * Settings.foodPossibleColors.length)];
	},
	draw: function draw(context, view) {
		var off = view.off;
		var fs = this.location.add(off);
		var size = this.size;
		// console.log(size);
		context.beginPath();
		context.arc(fs.x, fs.y, size, 0, 2 * Math.PI, false);
		context.lineWidth = 1;
		context.strokeStyle = this.color;
		context.stroke();
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
		return this;
		// var ret = Utilities.shallowCopy(this);
		// ret.location = Vector.copy(this.location);
		// return ret;
	},
	relevantPoints: function relevantPoints() {
		return [Vector.copy(this.location)];
	},
	matters: function matters(element) {
		return Utilities.foodPlayerCollision(this, element);
	},
	encounters: function encounters(element) {
		if (element.type == 'player') {
			var ret = this.copy();
			ret.shrinking = true;
			return ret;
		}
	}
});

module.exports = ElementFood;

},{"../../common/js/element.js":9,"../../common/js/settings.js":17,"../../common/js/utilities.js":18,"../../common/js/vector.js":19}],14:[function(require,module,exports){
'use strict';

var Element = require('../../common/js/element.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');

var ElementGrid = Element({
	//Constructor actually ignores required things, because this is such a background.. thing.
	construct: function construct(location, options) {
		//mandatory
		this.type = 'grid';
		this.nothingMatters = true;
		this.priority = 0;
		//optional
		this.location = new Vector(0, 0);
		this.gridSize = Settings.gridSize;
		this.gridSpace = Settings.gridSpace;
	},
	draw: function draw(context, view) {
		//Setup
		var path = new Path2D();
		var off = view.off;
		var gsi = this.gridSize;
		var gsp = this.gridSpace;
		//Draw the grid.
		for (var x = 0; x <= gsi; x = x + gsp) {
			path.moveTo(off.x, x + off.y);
			path.lineTo(off.x + gsi, x + off.y);
			path.moveTo(off.x + x, off.y);
			path.lineTo(off.x + x, gsi + off.y);
		}
		context.strokeStyle = Settings.gridColor;
		context.lineWidth = 1;
		context.stroke(path);
	},
	step: function step() {
		return this.copy();
	},
	copy: function copy() {
		var ret = Utilities.shallowCopy(this);
		ret.location = Vector.copy(this.location);
		return ret;
	},
	relevantPoints: function relevantPoints() {
		return [new Vector(0, 0)];
	},
	matters: function matters(element) {
		return false;
	},
	encounters: function encounters(element) {
		throw new Error('This should never be called, because .nothingMatters is set to be true.');
	}
});

module.exports = ElementGrid;

},{"../../common/js/element.js":9,"../../common/js/settings.js":17,"../../common/js/utilities.js":18,"../../common/js/vector.js":19}],15:[function(require,module,exports){
'use strict';

var Element = require('../../common/js/element.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');

var ElementPlayer = Element({
	//Constructor actually ignores required things, because this is such a background.. thing.
	construct: function construct(location, options) {
		//Mandatory
		this.type = 'player';
		this.priority = 1;
		this.nothingMatters = false;
		//Optional
		this.isHuman = options.isHuman === undefined ? true : options.isHuman;
		this.places = Vector.chain(location, {
			segments: Settings.startSegments,
			spacing: Settings.startSpacing
		});
		this.location = Vector.average(this.places);
		this.aim = new Vector(0, 0);
		this.amountToGrow = 0;
		this.speed = 1;
		this.kink = 0;
	},
	draw: function draw(context, view) {
		//console.log("!");
		var off = view.off;
		for (var x = 0; x < this.places.length - 1; x++) {
			if ((Math.floor(x / 1) + 1) % 2 == 0) {
				context.strokeStyle = '#000000';
			} else {
				context.strokeStyle = "#ff0000";
			}
			var pth = new Path2D();
			pth.moveTo(this.places[x].x + off.x, this.places[x].y + off.y);
			pth.lineTo(this.places[x + 1].x + off.x, this.places[x + 1].y + off.y);
			context.lineWidth = 3;
			context.stroke(pth);
		}
	},
	step: function step() {

		if (this.dying == true) {
			return undefined;
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
			var ret = this.copy();
			ret.amountToGrow = ret.amountToGrow + Settings.foodValue;
			return ret;
		}
		if (element.type == 'player') {
			var p1 = this.places[0];
			var p2 = this.places[1];
			for (var x = 2; x < element.places.length - 5; x = x + 5) {
				if (Utilities.collision(p1, p2, element.places[x], element.places[x + 5])) {
					var ret = this.copy();
					ret.dying = true;
					return ret;
				}
			}
			return this.copy();
		}
	}
});

module.exports = ElementPlayer;

},{"../../common/js/element.js":9,"../../common/js/settings.js":17,"../../common/js/utilities.js":18,"../../common/js/vector.js":19}],16:[function(require,module,exports){
'use strict';

var Vector = require('../../common/js/vector.js');
var Settings = require('../../common/js/settings.js');

var Move = function Move(options) {

	if (options.aim && options.mousePosition || !options.aim && !options.mousePosition) {
		throw new Error("Must either provide mouse position xor an exact location.");
	}

	if (options.mousePosition && !options.player) {
		throw new Error("If you provide a mouse position, you must provide a player.");
	}

	if (options.mousePosition) {

		var playSpot = options.player.location;
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

	this.aim.x = Math.max(Math.min(Settings.gridSize, this.aim.x), 0);
	this.aim.y = Math.max(Math.min(Settings.gridSize, this.aim.y), 0);

	this.split = options.split || false;
};

module.exports = Move;

},{"../../common/js/settings.js":17,"../../common/js/vector.js":19}],17:[function(require,module,exports){
'use strict';

module.exports = {

	resizeRate: 50,
	physicsRate: 25,

	gridSize: 2500,
	gridSpace: 20,
	gridColor: '#111',

	startSegments: 150,
	startSpacing: 1,

	aiCheckFrequency: 10,
	aiMinimum: 10,

	foodStartAmount: 2500,
	foodPossibleColors: ['red', 'orange', 'blue', 'green', 'gray', 'purple', 'maroon'],
	foodCycleTime: 2500,
	foodGrowthRate: 0.5,
	foodValue: 15,
	foodMaxSize: 15,

	segmentSpacing: 2

};

},{}],18:[function(require,module,exports){
'use strict';

var Vector = require('../../common/js/vector.js');

module.exports = {

	collision: function collision(p0, p1, p2, p3) {
		var s1 = p1.sub(p0);
		var s2 = p3.sub(p2);
		var temp = -s2.x * s1.y + s1.x * s2.y;
		var s = (-s1.y * (p0.x - p2.x) + s1.x * (p0.y - p2.y)) / temp;
		var t = (s2.x * (p0.y - p2.y) - s2.y * (p0.x - p2.x)) / temp;
		return s > 0 && s < 1 && t > 0 && t < 1 ? true : false;
	},

	playerPlayer: function playerPlayer(one, two) {
		return one.type == 'player' && two.type == 'player';
	},

	foodPlayerCollision: function foodPlayerCollision(food, player) {
		return food.type == 'food' && !food.growing && !food.shrinking && player.type == 'player' && food.location.dist(player.places[0]) < food.size;
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

},{"../../common/js/vector.js":19}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
'use strict';

var Vector = require('../../common/js/vector.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var View = function View(cnv, center) {
	var center = new Vector(center.x, center.y);
	var half = new Vector(cnv.width * 0.5, cnv.height * 0.5);
	this.off = center.scale(-1).add(half);
	this.box = new BoundingBox([center.add(half), center.sub(half)]);
	//console.log(this.box);
};

module.exports = View;

},{"../../common/js/boundingbox.js":8,"../../common/js/vector.js":19}]},{},[1]);
