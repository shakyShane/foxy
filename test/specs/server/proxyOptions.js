"use strict";

var foxy      = require("../../../index");
var connect   = require("connect");
var http      = require("http");
var assert    = require("chai").assert;

var output = `
<!doctype html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
    Hi there
</body>
</html>
`;

describe("Adding node-http-proxy options through configuration", () => {

    it("should add xfwd headers if true in options", done => {
        let config, app, server, proxyServer, port;
        let path = "/templates/page1.html";
        config = {
            proxyOptions: {
                xfwd: true
            }
        };
        app = connect();
        app.use(path, (req, res) => {
            assert.equal(req.headers["x-forwarded-port"], port);
            assert.ok(req.headers["x-forwarded-for"]);
            res.end(output);
        });
        server = http.createServer(app).listen();
        proxyServer = foxy(`http://localhost:${server.address().port}`, config).listen();
        port = proxyServer.address().port;
        let options = {
            hostname: "localhost",
            method: "GET",
            headers: {
                accept: "text/html"
            },
            port,
            path
        };
        http.get(options, (res) => {
            res.on("data", () => done());
            server.close();
        });
    });
});

