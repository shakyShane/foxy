var foxy      = require("../../../index");
var request   = require("supertest");
var connect   = require("connect");
var sinon     = require("sinon");
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

describe("Running middlewares + html mods", () => {

    it("should log url and continue", done => {
        var config, app, server, proxy;
        var path = "/templates/page1.html";
        config = {
            rules: [{
                match: /Hi there/g,
                fn: function () {
                    return "BrowserSync";
                }
            }],
            middleware: [(req, res, next) => {
                assert.equal(req.url, path);
                next();
            }]
        };
        app    = connect();
        app.use(path, (req, res) => res.end(output));
        server = http.createServer(app).listen();
        proxy = foxy(`http://localhost:${server.address().port}`, config).listen();
        var options = {
            hostname: 'localhost',
            port: proxy.address().port,
            path: path,
            method: 'GET',
            headers: {
                "accept": "text/html"
            }
        };
        http.get(options, (res) => {
            res.on("data", chunk => {
                assert.include(chunk.toString(), "BrowserSync");
                done();
            });
            server.close();
        });
    });
    it("should run middleware and then skip any others", done => {
        var config, app, server, proxy;
        var path = "/templates/page1.html";
        var spy = sinon.spy();
        config = {
            rules: [{
                match: /Hi there/g,
                fn: function () {
                    return "BrowserSync";
                }
            }],
            middleware: (req, res, next) => {
                spy("called from mw");
                next();
            }
        };
        app    = connect();
        app.use(path, (req, res) => res.end(output));
        server = http.createServer(app).listen();
        proxy = foxy(`http://localhost:${server.address().port}`, config).listen();
        var options = {
            hostname: 'localhost',
            port: proxy.address().port,
            path: path,
            method: 'GET',
            headers: {
                "accept": "text/html"
            }
        };
        http.get(options, (res) => {
            res.on("data", chunk => {
                assert.include(chunk.toString(), "BrowserSync");
                sinon.assert.calledWith(spy, "called from mw");
                done();
            });
            server.close();
        });
    });
});

