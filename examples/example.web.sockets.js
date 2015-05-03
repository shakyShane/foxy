var foxy      = require("./../index");
var http      = require("http");

var proxyApp = foxy("http://localhost:3000"); // some web-socket app

var proxyServer = http.createServer(proxyApp);

proxyServer.on('upgrade', proxyApp.handleUpgrade);

proxyServer.listen();

console.log(proxyServer.address().port);
