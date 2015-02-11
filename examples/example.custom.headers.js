var http = require("http");
var app  = require("./")("http://homestead.app:8000", {
    reqHeaders: function (config) {
        return {
            "host":            "localhost:8002", // Set any headers you need here
            "accept-encoding": "identity",
            "agent":           false
        }
    }
});

var server = http.createServer(app);
server.listen(8002);