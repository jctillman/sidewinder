(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('../../client/js/pageSetUp.js')({
	playGame: require('../../client/js/clientGame.js'),
	watchGame: require('../../client/js/clientWatch.js'),
	login: require('../../client/js/clientLogin.js')
});

},{"../../client/js/clientGame.js":3,"../../client/js/clientLogin.js":4,"../../client/js/clientWatch.js":5,"../../client/js/pageSetUp.js":8}],2:[function(require,module,exports){
'use strict';

var BoundingBox = require('../../common/js/boundingbox.js');

//This function returns the area which will be displayed on the screen--that is
//it displays the bounding box giving, in world-coordinates,
//the area which is to be projected on to the screen

//Should shift some stuff to here?
module.exports = function (player, canvas) {
	//Get the ratio for the screen
	var screenWidth = canvas.width;
	var screenHeight = canvas.height;
	var screenRatio = screenWidth / screenHeight;

	//Get initial ratio for bounding box
	var temp = new BoundingBox(player.places).expanded(300);
	var boxRatio = (temp.right - temp.left) / (temp.bottom - temp.top);
	var viewBoundingBox = temp.scaleVert(boxRatio / screenRatio);
	return viewBoundingBox;
};

},{"../../common/js/boundingbox.js":12}],3:[function(require,module,exports){
'use strict';

var ElementManager = require('../../common/js/ElementManager.js');
var Settings = require('../../common/js/settings.js');
var Utilities = require('../../common/js/utilities.js');
var Move = require('../../common/js/move.js');
var View = require('../../client/js/view.js');
var Vector = require('../../common/js/vector.js');
var HighScore = require('../../client/js/highscore.js');
var elementFoodManager = require('../../common/js/elementManagerFood.js');
var elementAIManager = require('../../common/js/elementManagerAi.js');
var BoundingView = require('../../client/js/boundingview.js');

var playGame = function playGame(gameState, appState, playerId, finished) {
	var tempView = null,
	    stepsAfterDeath = 0;

	var physicsLoops = setInterval(Utilities.timed(true, function () {
		//Grab player, if player is there.
		var plyr = gameState.getElement(playerId);
		if (plyr == undefined) {
			//If the player has died
			stepsAfterDeath++;
			if (stepsAfterDeath > Settings.framesToViewAfterDeath) {
				window.clearInterval(physicsLoops);
				finished();
			}
		} else {
			//Player lives!
			var bv = BoundingView(plyr, appState.game.canvas);
			var movr = new Move({
				mousePosition: appState.game.mousePosition(),
				boundingView: bv,
				canvas: appState.game.canvas
			});
			plyr.setMove(movr);
			tempView = new View(bv, appState.game.canvas);
		}

		//First draws board; second draws high score.
		gameState.draw(tempView);
		HighScore(gameState, appState.game.context, plyr && plyr.id);

		//step
		gameState = gameState.step([elementFoodManager, elementAIManager]);
	}), Settings.physicsRate);
};

module.exports = function (appState, finishedCallback) {
	var gameState = require('../../common/js/initialgamecreator.js')();
	var playerId = Utilities.addPlayer('human', gameState);
	playGame(gameState, appState, playerId, finishedCallback);
};

},{"../../client/js/boundingview.js":2,"../../client/js/highscore.js":7,"../../client/js/view.js":9,"../../common/js/ElementManager.js":11,"../../common/js/elementManagerAi.js":16,"../../common/js/elementManagerFood.js":17,"../../common/js/initialgamecreator.js":22,"../../common/js/move.js":23,"../../common/js/settings.js":24,"../../common/js/utilities.js":25,"../../common/js/vector.js":26}],4:[function(require,module,exports){
"use strict";

module.exports = function (state) {
	console.log("Not implemented!");
};

},{}],5:[function(require,module,exports){
"use strict";

module.exports = function (state) {
	console.log("Not implemented!");
};

},{}],6:[function(require,module,exports){
'use strict';

var Vector = require('../../common/js/vector.js');

module.exports = {
  throttledResize: function throttledResize(msbetween, cnv) {
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
  },
  mousePositionFinder: function mousePositionFinder(cnv) {
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
  }
};

},{"../../common/js/vector.js":26}],7:[function(require,module,exports){
'use strict';

var HighScore = function HighScore(elementManager, ctx, playerId) {

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
		var fromTop = 50 + x * 10;
		if (playerId == plyr.id) {
			var pth = new Path2D();
			pth.moveTo(length + 2, fromTop);
			pth.lineTo(length + 5, fromTop);
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#444';
			ctx.stroke(pth);
		}

		for (var y = 0; y < plyr.colors.length; y++) {
			var color = plyr.colors[y];
			var pth = new Path2D();
			pth.moveTo(y * width, fromTop);
			pth.lineTo((y + 1) * width - 2, fromTop);
			ctx.lineWidth = 5;
			ctx.strokeStyle = color;
			ctx.stroke(pth);
		}
	}
};

module.exports = HighScore;

},{}],8:[function(require,module,exports){
'use strict';

var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var ClientUtilities = require('../../client/js/clientutilities.js');

module.exports = function (options) {

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

	var goBack = function goBack() {
		game.style.display = "none";
		menu.style.display = "block";
	};

	playbutton.onclick = function () {
		game.style.display = "block";
		menu.style.display = "none";
		options.playGame(state, goBack);
	};

	watchbutton.onclick = function () {
		options.watchGame(state, goBack);
	};

	loginbutton.onclick = function () {
		options.login(state, goBack);
	};
};

},{"../../client/js/clientutilities.js":6,"../../common/js/settings.js":24,"../../common/js/vector.js":26}],9:[function(require,module,exports){
'use strict';

var Vector = require('../../common/js/vector.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var View = function View(bv, cnv) {
	this.screenWidth = cnv.width;
	this.screenHeight = cnv.height;
	this.ctx = cnv.getContext('2d');
	this.box = bv;
};

View.prototype.clear = function () {
	this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
};

View.prototype.drawPath = function (arrVector, width, color) {
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
	for (var x = 0; x <= 2; x = x + 0.25) {
		var pointX = center.x + width * Math.sin(x * Math.PI);
		var pointY = center.y + width * Math.cos(x * Math.PI);
		path.push(new Vector(pointX, pointY));
	}
	this.drawPath(path, thickness, color);
};

module.exports = View;

},{"../../common/js/boundingbox.js":12,"../../common/js/vector.js":26}],10:[function(require,module,exports){
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

BoundingBox.prototype.width = function () {
	return this.right - this.left;
};

BoundingBox.prototype.height = function () {
	return this.bottom - this.top;
};

BoundingBox.prototype.intersects = function (otherBox) {
	return !(this.right < otherBox.left || this.left > otherBox.right || this.top > otherBox.bottom || this.bottom < otherBox.top);
};

module.exports = BoundingBox;

},{"../../common/js/vector.js":26}],11:[function(require,module,exports){
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

ElementManager.prototype.draw = function (view) {
	view.clear();
	for (var x = 0, len = this.elements.length; x < len; x++) {
		var el = this.elements[x];
		view.box.intersects(el.box) && this.elements[x].draw(view);
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
	var filteredElements = [];

	for (var x = 0, len = this.elements.length; x < len; x++) {
		var temp = this.elements[x].step();
		if (temp != undefined) {
			filteredElements = filteredElements.concat(temp);
		}
	}

	for (var x = 0, len = filteredElements.length; x < len; x++) {
		if (!filteredElements[x].inactive) {
			for (var y = 0; y < len; y++) {
				if (filteredElements[x].matters(filteredElements[y])) {
					filteredElements[x].encounters(filteredElements[y]);
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
};

module.exports = ElementManager;

},{"../../common/js/boundingbox.js":12,"../../common/js/elementfood.js":18,"../../common/js/elementgrid.js":19,"../../common/js/elementplayer.js":20,"../../common/js/grid.js":21,"../../common/js/settings.js":24}],12:[function(require,module,exports){
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

BoundingBox.prototype.width = function () {
	return this.right - this.left;
};

BoundingBox.prototype.height = function () {
	return this.bottom - this.top;
};

BoundingBox.prototype.intersects = function (otherBox) {
	return !(this.right < otherBox.left || this.left > otherBox.right || this.top > otherBox.bottom || this.bottom < otherBox.top);
};

module.exports = BoundingBox;

},{"../../common/js/vector.js":26}],13:[function(require,module,exports){
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

},{"../../common/js/move.js":23,"../../common/js/settings.js":24,"../../common/js/utilities.js":25,"../../common/js/vector.js":26}],14:[function(require,module,exports){
'use strict';

var Vector = require('../../common/js/vector.js');
var View = require('../../client/js/view.js');
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
			return a instanceof View;
		}],
		explanations: ["Expected a View object as the second argument, but didn't get one."]
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

		//Add the function, with error checking.
		ret.prototype[fn] = function () {
			var args = [];
			for (var y = 0; y < arguments.length; y++) {
				if (reqFunc[fn].checks[y](arguments[y])) {
					args.push(arguments[y]);
				} else {
					throw new Error("An incorrect value: " + reqFunc[fn].explanations[y]);
				}
			}
			var rtrn = options[fn].apply(this, args);
			return rtrn;
		};
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

},{"../../client/js/view.js":9,"../../common/js/utilities.js":25,"../../common/js/vector.js":26}],15:[function(require,module,exports){
'use strict';

var Element = require('../../common/js/element.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var ElementFood = Element({
	construct: function construct(location, options) {
		//Non-mandatory
		this.location = location;
		this.growing = options.growing || false;
		this.shrinking = false;
		this.size = options.growing ? 1 : Settings.foodMaxSize;
		this.color = Settings.foodPossibleColors[Math.floor(Math.random() * Settings.foodPossibleColors.length)];
		//Mandatory
		this.type = 'food';
		this.nothingMatters = true;
		this.inactive = true;
		this.priority = 1;
		var rad = new Vector(Settings.foodMaxSize, Settings.foodMaxSize);
		this.box = new BoundingBox([this.location.add(rad), this.location.sub(rad)]);
	},
	draw: function draw(view) {
		view.drawCircle(this.location, this.size, 2, this.color);
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
	matters: function matters(element) {
		return false;
	},
	encounters: function encounters(element) {
		throw new Error("This shouldn't ever be called.");
	}
});

module.exports = ElementFood;

},{"../../common/js/boundingbox.js":12,"../../common/js/element.js":14,"../../common/js/settings.js":24,"../../common/js/utilities.js":25,"../../common/js/vector.js":26}],16:[function(require,module,exports){
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

},{"../../common/js/brain.js":13,"../../common/js/elementFood.js":15,"../../common/js/move.js":23,"../../common/js/settings.js":24,"../../common/js/utilities.js":25,"../../common/js/vector.js":26}],17:[function(require,module,exports){
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

},{"../../common/js/elementFood.js":15,"../../common/js/settings.js":24,"../../common/js/vector.js":26}],18:[function(require,module,exports){
'use strict';

var Element = require('../../common/js/element.js');
var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');
var Utilities = require('../../common/js/utilities.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var ElementFood = Element({
	construct: function construct(location, options) {
		//Non-mandatory
		this.location = location;
		this.growing = options.growing || false;
		this.shrinking = false;
		this.size = options.growing ? 1 : Settings.foodMaxSize;
		this.color = Settings.foodPossibleColors[Math.floor(Math.random() * Settings.foodPossibleColors.length)];
		//Mandatory
		this.type = 'food';
		this.nothingMatters = true;
		this.inactive = true;
		this.priority = 1;
		var rad = new Vector(Settings.foodMaxSize, Settings.foodMaxSize);
		this.box = new BoundingBox([this.location.add(rad), this.location.sub(rad)]);
	},
	draw: function draw(view) {
		view.drawCircle(this.location, this.size, 2, this.color);
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
	matters: function matters(element) {
		return false;
	},
	encounters: function encounters(element) {
		throw new Error("This shouldn't ever be called.");
	}
});

module.exports = ElementFood;

},{"../../common/js/boundingbox.js":12,"../../common/js/element.js":14,"../../common/js/settings.js":24,"../../common/js/utilities.js":25,"../../common/js/vector.js":26}],19:[function(require,module,exports){
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
	draw: function draw(view) {
		var gsi = this.gridSize;
		var gsp = this.gridSpace;
		var color = Settings.gridColor;
		for (var x = 0; x <= gsi; x = x + gsp) {
			var right = new Vector(0, x);
			var left = new Vector(gsi, x);
			var top = new Vector(x, 0);
			var bottom = new Vector(x, gsi);
			view.drawPath([left, right], 0.5, color);
			view.drawPath([top, bottom], 0.5, color);
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
	matters: function matters(element) {
		return false;
	},
	encounters: function encounters(element) {
		throw new Error('This should never be called, because .nothingMatters is set to be true.');
	}
});

module.exports = ElementGrid;

},{"../../common/js/BoundingBox.js":10,"../../common/js/element.js":14,"../../common/js/settings.js":24,"../../common/js/utilities.js":25,"../../common/js/vector.js":26}],20:[function(require,module,exports){
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
		//Optional--game elements
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

		//Optional--display elements.	
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
	draw: function draw(view) {
		var width = 2 + Math.sqrt((this.places.length - Settings.startSegments) / 100);
		for (var x = 0, len = this.places.length; x < len - 1; x++) {
			var color = this.colors[Math.floor(x / this.stripeLength) % this.colorLength];
			view.drawPath(this.places.slice(x, x + 2), width, color);
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
	encounters: function encounters(element) {
		if (element.type == 'food') {
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
	},
	setMove: function setMove(move) {
		this.aim = move.aim;
	}
});

module.exports = ElementPlayer;

},{"../../common/js/BoundingBox.js":10,"../../common/js/element.js":14,"../../common/js/elementfood.js":18,"../../common/js/settings.js":24,"../../common/js/utilities.js":25,"../../common/js/vector.js":26}],21:[function(require,module,exports){
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

},{"../../common/js/boundingbox.js":12,"../../common/js/settings.js":24,"../../common/js/vector.js":26}],22:[function(require,module,exports){
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

},{"../../common/js/ElementManager.js":11,"../../common/js/settings.js":24,"../../common/js/vector.js":26}],23:[function(require,module,exports){
'use strict';

var Vector = require('../../common/js/vector.js');
var Settings = require('../../common/js/settings.js');
var BoundingBox = require('../../common/js/boundingbox.js');

var Move = function Move(options) {

	if (options.aim && options.mousePosition || !options.aim && !options.mousePosition) {
		throw new Error("Must either provide mouse position xor an exact location.");
	}

	if (options.mousePosition && !options.canvas) {
		throw new Error("If you provide a mouse position, you must provide a canvas.");
	}

	if (options.mousePosition && !options.boundingView) {
		throw new Error("If you provide a mouse position, you must provide a bounding view.");
	}

	if (options.mousePosition) {
		var viewBox = options.boundingView;
		var w = viewBox.right - viewBox.left;
		var h = viewBox.bottom - viewBox.top;
		var actualX = options.mousePosition.x / (options.canvas.width / w) + viewBox.left;
		var actualY = options.mousePosition.y / (options.canvas.height / h) + viewBox.top;
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

},{"../../common/js/boundingbox.js":12,"../../common/js/settings.js":24,"../../common/js/vector.js":26}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{"../../common/js/move.js":23,"../../common/js/settings.js":24,"../../common/js/vector.js":26}],26:[function(require,module,exports){
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

},{}]},{},[1]);
