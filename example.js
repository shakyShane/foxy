var http = require("http");
var app  = require("./")("http://www.bbc.co.uk");

var server = app.listen(8001);

console.log(server.address().port);
