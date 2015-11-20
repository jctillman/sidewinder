var Vector = require('../../common/js/vector.js');
var BoundingView = require('../../client/js/boundingview.js');
var Move = require('../../common/js/move.js');
var View = require('../../client/js/view.js');
var HighScore = require('../../client/js/highscore.js');
var Settings = require('../../common/js/settings.js');

module.exports = {

    throttledResize: function(msbetween, cnv){
  	var resizer = function() {
  		cnv.width = document.body.clientWidth; //document.width is obsolete
  		cnv.height = document.body.clientHeight; //document.height is obsolete
  	}
  	resizer();
  	window.addEventListener("resize", resizeThrottler, false);
  	var resizeTimeout;
  	function resizeThrottler() {
      if (!resizeTimeout ) {
        resizeTimeout = setTimeout(function() { 
          resizeTimeout = null;
          resizer();
         }, msbetween);
      }
    }
  },

  mousePositionFinder: function(cnv){
    var ret = new Vector(0,0); 
    var getMousePosition = function(e){
      var rect = cnv.getBoundingClientRect();
      var newRet = new Vector(e.clientX - rect.left, e.clientY - rect.top)
      if (newRet.x != 0 && newRet.y != 0){
      	ret = newRet;
      }

    }
    cnv.addEventListener('mousemove', getMousePosition, false);
    return function(){
    	return ret;
    }
  },

  clientHandling: function(appState, playerId, finished, socket){
    var stepsAfterDeath = 0 
    var tempView;
    return function(gameState, frameNumber, self){
      var plyr = gameState.getElement(playerId);
      tempView && gameState.draw(tempView);
      HighScore(gameState, appState.game.context, plyr && plyr.id);
      if(plyr == undefined){ 
        stepsAfterDeath++;
        if (stepsAfterDeath > Settings.framesToViewAfterDeath){
          self.end();
          socket && socket.close(); //Disconnect, if there's a socket whence we can disconnect.
          finished();
          tempView.clear();
        }
      }else{  //Player lives!
        var bv = BoundingView(plyr, appState.game.canvas);
        var movr = new Move({
          mousePosition: appState.game.mousePosition(),
          boundingView: bv,
          canvas: appState.game.canvas
        });
        plyr.setMove(movr);
        tempView = new View(bv, appState.game.canvas);
      }
    };
  },

  watchHandling: function(appState, finished, socket){
      var stepsAfterDeath = 0 
      var tempView;
      var done = false;

      document.onkeydown = function(){
        done = true;
      }

      return function(gameState, frameNumber, self){
        tempView && gameState.draw(tempView);
        HighScore(gameState, appState.game.context);
        if(done){
          document.onkeydown = null;
          self.end();
          socket && socket.close(); //Disconnect, if there's a socket whence we can disconnect.
          finished();
          tempView.clear();
        }
        tempView = new View(
          new BoundingView({places: [new Vector(0,0), new Vector(Settings.gridSize, Settings.gridSize)]},
            appState.game.canvas),
        appState.game.canvas);
      };
    }


}