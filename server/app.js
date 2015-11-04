var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var realtime = require('./js/realtime.js');

//Handle things going through socket
realtime(io);

//Serve static resources
app.use(express.static(__dirname + '/../dist'));


server.listen(3000)