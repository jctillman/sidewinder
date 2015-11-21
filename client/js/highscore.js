var HighScore = function(elementManager, ctx, playerId){

	var done = elementManager.elements.map(function(n){
		return n;
	}).filter(function(m){
		return m.type == 'player'
	}).sort(function(a,b){
		return b.places.length - a.places.length;
	}).slice(0,10);
	
	for(var x = 0; x < done.length; x++){
		var plyr = done[x];
		var length = plyr.places.length;
		var width = 16;
		var fromTop = 50 + x * 20;

		ctx.font = "16px Arial";
		if (playerId == plyr.id){
			ctx.fillStyle = "red";
			ctx.fillText(plyr.name,100,fromTop+5);
		}else{
			ctx.fillStyle = "black";
			ctx.fillText(plyr.name,100,fromTop+5);
		}

	 	for(var y = 0; y < plyr.colors.length; y++){
			var color = plyr.colors[y]
			var pth = new Path2D();
			pth.moveTo(y*width, fromTop)
			pth.lineTo((y+1)*width-2, fromTop)
			ctx.lineWidth = 7;
			ctx.strokeStyle = color;
			ctx.stroke(pth);
		}
	}
}

module.exports = HighScore;