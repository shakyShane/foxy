var foxy      = require("./../index");
var https     = require("https");
var fs        = require("fs");
var path      = require("path");

var key = fs.readFileSync(path.resolve(__dirname, "../test/fixtures/certs/server.key"));
var crt = fs.readFileSync(path.resolve(__dirname, "../test/fixtures/certs/server.cert"));

var server = https.createServer({
    key: key,
    cert: crt
}, foxy("https://github.com"));

server.listen(8001);

console.log("server running at https://localhost:" + server.address().port);