var http = require("http");
var app  = require("./")("http://www.bbc.co.uk");

//app.use(function endOfStack(req, res, next) {
//    console.log("This mw will run last");
//    next();
//});
//
app.stack.unshift({route: "", handle: function frontOfStack(req, res, next) {
    next();
}});

var server = http.createServer(app);
server.listen(8002);