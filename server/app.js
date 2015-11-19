
var WebSocketServer = require("ws").Server

var express = require('express');
var app = express();
var server = require('http').Server(app);

var io = require('socket.io')(server)

var Settings = require("../common/js/settings.js");

var realtime = require('./js/realtime.js');


var wss = new WebSocketServer({server: server})

//Handle things going through socket
realtime(wss);

//Serve static resources
app.use(express.static(__dirname + '/../dist'));

server.listen(Settings.portNum)