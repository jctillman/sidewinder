var Settings = require('../../common/js/settings.js');
var Vector = require('../../common/js/vector.js');

var characterDraw = function(ctx, cnv, plyr, off){
  var pth = new Path2D(); 
  ctx.strokeStyle = "#ff0000";
  ctx.lineWidth = 3;
  pth.moveTo(plyr.places[0].x+off.x, plyr.places[0].y+off.y);
  for(var x = 0; x < plyr.places.length - 1; x++){
  	if (x % 25 == 0){
  		ctx.stroke(pth);
  		pth = new Path2D();
  		ctx.strokeStyle = ((ctx.strokeStyle.toString() == '#ff0000') ? "#000000" : "#ff0000");
  		pth.moveTo(plyr.places[x].x+off.x, plyr.places[x].y+off.y);
  	}
  	pth.lineTo(plyr.places[x].x+off.x,plyr.places[x].y+off.y)
  }
  ctx.stroke(pth);
}

var Draw = {

	clear: function(appState, gameState, playerIndex){

		//Setup
		var playSpot = gameState.players[playerIndex].avLocation;
		var off = new Vector( -playSpot.x+cnv.width*0.5, -playSpot.y+cnv.height*0.5);
		var path = new Path2D();

		//CLear everything
		appState.game.context.clearRect(0, 0, appState.game.canvas.width, appState.game.canvas.height);
		
	    //Draw the grid.
		for(var x = 0; x <= Settings.boardSize; x = x + Settings.gridSpace){
			path.moveTo(off.x, 						x+off.y);
			path.lineTo(off.x+Settings.boardSize, 	x+off.y);
			path.moveTo(off.x+x, 					off.y);
			path.lineTo(off.x+x, 					Settings.boardSize+off.y);
		}
		appState.game.context.strokeStyle = Settings.gridColor; 
		appState.game.context.lineWidth = 1;
		appState.game.context.stroke(path);
	}, 

	//Draw the character for the current player
	self: function(appState, gameState, playerIndex){

		//Setup
		var playSpot = gameState.players[playerIndex].avLocation;
		var off = new Vector( -playSpot.x+0.5*cnv.width, -playSpot.y+0.5*cnv.height);

		//Draw the self
		characterDraw(appState.game.context, appState.game.canvas, gameState.players[playerIndex], off);
	},

	//Draw the character for everyone else.
	others: function(appState, gameState, playerIndex){

		//Draw the other players.
		var ctx = appState.game.context
		var playSpot = gameState.players[playerIndex].avLocation;
		var off = new Vector( -playSpot.x+0.5*cnv.width, -playSpot.y+0.5*cnv.height);
		gameState.players.forEach(function(plyr, index){
			(playerIndex != index) && characterDraw(ctx, appState.game.canvas, plyr, off);
		}); 

		for (var x = 0; x < gameState.food.length; x++) {
			var f = gameState.food[x]
			if (f.location.dist(playSpot) < 1500){
				var fs = f.location.add(off)
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
}

module.exports = Draw;