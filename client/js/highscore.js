var HighScore = function(elementManager){

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
	

	//Render the top
	var ul = document.createElement('ul');
	ul.className = "highScoreUL";
	for(var x = 0; x < done.length; x++){
		var li = document.createElement('li');
		li.className = "highScoreLI";
		var plyr = done[x]
		var length = done[x].places.length;
		for(var y = 0; y < plyr.colors.length; y++){
			var color = plyr.colors[y]
			var div = document.createElement('div');
			div.className = "displayColor";
			div.style.width = length / plyr.colors.length;
			div.style.backgroundColor = color;
			li.appendChild(div);
		}
		ul.appendChild(li);
	}
	var temp = document.getElementById('highscore');
	temp.innerHTML = "";
	temp.appendChild(ul);



}

module.exports = HighScore;