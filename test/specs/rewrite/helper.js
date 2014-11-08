var http    = require("http");
var connect = require("connect");
var ports   = require("portscanner-plus");
var socket  = require("socket.io");
var gzip    = require("connect-gzip");
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
    }).catch(function (err) {
        console.log(err);
    });
};

function proxy () {

    var testApp = connect();

    testApp.use(url, function (req, res, next) {
        res.end(string.replace(/URL/g, "localhost:" + port));
    });

    // Fake server
    server = http.createServer(testApp).listen(port);

    var proxy = foxy.init("http://localhost:" + port);

    var socketio = socket.listen(proxy, {log: false});

    return {
        proxy: proxy,
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
