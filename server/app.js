var express = require('express');
var app = express();

//Serve static resources
app.use(express.static(__dirname + '/../dist'))


app.listen(3000)