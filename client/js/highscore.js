var HighScore = function(elementManager, ctx, playerId){

	//Get top
	var top = [];

	var top = elementManager.elements.map(function(n){
		return n.copy();
	}).filter(function(m){
		return m.type == 'player'
	});

	top.sort(function(a,b){
		return b.places.length - a.places.length;
	});

	var done = top.slice(0,10);
	
	for(var x = 0; x < done.length; x++){
		var plyr = done[x]
		var length = done[x].places.length;
		var width = length / plyr.colors.length;
		var fromTop = 50 + x * 10;
		if (playerId == plyr.id){
			var pth = new Path2D();
			pth.moveTo(length+2, fromTop);
			pth.lineTo(length+5, fromTop)
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#444';
			ctx.stroke(pth);
		}

	 	for(var y = 0; y < plyr.colors.length; y++){
			var color = plyr.colors[y]
			var pth = new Path2D();
			pth.moveTo(y*width, fromTop)
			pth.lineTo((y+1)*width - 2, fromTop)
			ctx.lineWidth = 5;
			ctx.strokeStyle = color;
			ctx.stroke(pth);
		}
	}


}

module.exports = HighScore;