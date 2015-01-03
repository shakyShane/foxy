var assert      = require("chai").assert;
var connect     = require("connect");
var http        = require("http");
var foxy        = require("../../../");
var getUrl      = require("./helpers").getUrl;

describe("Rewrite redirect headers", () => {

    var app, server, serverUrl, port, proxy;

    before(done => {
        app       = connect();
        server    = http.createServer(app).listen();
        serverUrl = getUrl(server.address().port);
        port = server.address().port;
        app.use("/redirect", (req, res, next) => {
            res.writeHead(302, {"Location": "http://127.0.0.1:" + port + "/nope"});
            res.end();
            next();
        });
        app.use("/redirect-google", (req, res, next) => {
            res.writeHead(302, {"Location": "http://www.google.co.uk"});
            res.end();
            next();
        });
        proxy = foxy("http://127.0.0.1:" + port).listen();
        done();
    });

    after(() => {
        server.close();
        proxy.close();
    });

    it("Should re-write redirect headers to stay on proxy", done => {
        var proxyPort = proxy.address().port;
        http.get(`http://localhost:${proxyPort}/redirect`, res => {
            assert.equal(res.statusCode, 302);
            assert.equal(res.headers["location"], `http://localhost:${proxyPort}/nope`);
            done();
        });
    });
    it("Should NOT re-write redirect location if external", done => {
        var proxyPort = proxy.address().port;
        http.get(`http://localhost:${proxyPort}/redirect-google`, res => {
            assert.equal(res.statusCode, 302);
            assert.equal(res.headers["location"], `http://www.google.co.uk`);
            done();
        });
    });
});