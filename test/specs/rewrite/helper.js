var http    = require("http");
var connect = require("connect");
var ports   = require("portscanner-plus");
var socket  = require("socket.io");
var foxy    = require("../../../index");

var string;
var port;
var server;
var url;

module.exports.start = function (_string, _url, done) {
    string = _string;
    url = _url;
    ports.getPorts(1).then(function (ports) {
        port = ports[0];
        var servers = proxy();
        done(ports[0], servers.proxy, servers.socketio, servers.app);
    }).catch(function () {
        //console.log(err);
    });
};

function proxy () {

    var testApp = connect();

    testApp.use(url, function (req, res) {
        res.end(string.replace(/URL/g, "localhost:" + port));
    });

    // Fake server
    server = http.createServer(testApp).listen(port);

    var pproxy = foxy("http://localhost:" + port);

    var socketio = socket.listen(pproxy, {log: false});

    return {
        proxy: pproxy,
        socketio: socketio,
        server: server,
        app: testApp
    };
}

module.exports.reset = function () {
    string = null;
    port   = null;
    url    = null;
    server.close();
    server = null;
};
