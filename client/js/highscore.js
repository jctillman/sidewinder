var previousHighScore = 0;
var previouslyAlivePlayerId;

var HighScore = function(elementManager, ctx, playerId){

	var done = elementManager.elements.map(function(n){
		return n;
	}).filter(function(m){
		return m.type == 'player'
	}).sort(function(a,b){
		return b.places.length - a.places.length;
	}).slice(0,10);

	var playerAlive = false;
	
	for(var x = 0; x < done.length; x++){
		var plyr = done[x];
		var length = plyr.places.length;
		var width = 16;
		var fromTop = 50 + x * 20;
		var textFromTop = fromTop + 5;
		var offset = 50;

	    var pad = function(n, width, z) {
	      z = z || '0';
	      n = n + '';
	      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	    }

	    var name = (plyr.name == "") ? "Unnamed Snake" : plyr.name;

		ctx.font = "16px Arial";
		if (playerId == plyr.id){
			ctx.fillStyle = "red";
			ctx.fillText(name,100+offset,textFromTop);
			ctx.fillText(pad(plyr.places.length, 4), 10, textFromTop)
			playerAlive = true;
			previousHighScore = plyr.places.length || previousHighScore;
		}else{
			ctx.fillStyle = "black";
			ctx.fillText(name,100+offset,fromTop+5);
			ctx.fillText(pad(plyr.places.length, 4), 10, textFromTop)
		}

	 	for(var y = 0; y < plyr.colors.length; y++){
			var color = plyr.colors[y]
			var pth = new Path2D();
			pth.moveTo(offset+y*width, fromTop)
			pth.lineTo(offset+(y+1)*width-2, fromTop)
			ctx.lineWidth = 7;
			ctx.strokeStyle = color;
			ctx.stroke(pth);
		}
	}

	if(!playerAlive){
		var width = ctx.canvas.width;
		var height = ctx.canvas.height;
		ctx.font = "72px Arial";
		ctx.fillStyle = "red";
		ctx.fillText("Score: " + pad(previousHighScore, 4), width/2-150, height/2-100)
	}
}

module.exports = HighScore;