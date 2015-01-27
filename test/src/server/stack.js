var foxy      = require("../../../index");
var request   = require("supertest");
var connect   = require("connect");
var sinon     = require("sinon");
var http      = require("http");
var assert    = require("chai").assert;

var output = `Some content`;

describe("Accessing mw stack on the fly", () => {

    it("should return stack", done => {

        var app, server, proxy;
        var path = "/templates/page1.html";

        app    = connect();
        app.use(path, (req, res) => res.end(output));

        server = http.createServer(app).listen();

        proxy = foxy(`http://localhost:${server.address().port}`).listen();

        var options = {
            hostname: 'localhost',
            port: proxy.address().port,
            path: path,
            method: 'GET',
            headers: {
                "accept": "text/html"
            }
        };

        assert.equal(proxy.app.stack.length, 1);

        proxy.app.stack.push({route: "*", handle: function () {}, id: "foxy-mw"});

        assert.equal(proxy.app.stack.length, 2);

        proxy.app.stack = proxy.app.stack.filter(function (item) {
            return item.id !== "foxy-mw";
        });

        assert.equal(proxy.app.stack.length, 1);

        http.get(options, (res) => {
            res.on("data", chunk => {
                assert.include(chunk.toString(), "Some content");
                done();
            });
            server.close();
        });
    });
});

describe("Adding to mw stack on the fly", () => {

    it("should return stack", done => {

        var app, server, proxy;
        var path = "/templates/page1.html";

        app    = connect();
        app.use(path, (req, res) => res.end(output));

        server = http.createServer(app).listen();

        proxy = foxy(`http://localhost:${server.address().port}`).listen();

        var options = {
            hostname: 'localhost',
            port: proxy.address().port,
            path: path,
            method: 'GET',
            headers: {
                "accept": "text/html"
            }
        };

        var spy = sinon.spy();

        proxy.app.stack.push({route: "*", handle: function (req, res, next) {
            spy(req.url);
            next();
        }, id: "foxy-mw"});

        http.get(options, (res) => {
            res.on("data", chunk => {
                sinon.assert.calledWith(spy, path);
                done();
            });
            server.close();
        });
    });
});

describe("Adding to front of mw stack on the fly", () => {

    it("should return stack", done => {

        var app, server, proxy;
        var path = "/templates/page1.html";

        app    = connect();
        app.use(path, (req, res) => res.end(output));

        server = http.createServer(app).listen();

        proxy = foxy(`http://localhost:${server.address().port}`).listen();

        var options = {
            hostname: 'localhost',
            port: proxy.address().port,
            path: path,
            method: 'GET',
            headers: {
                "accept": "text/html"
            }
        };

        var spy = sinon.spy();


        proxy.app.stack.push({route: "*", handle: function (req, res, next) {
            spy(req.url);
            next();
        }, id: "foxy-mw"});

        proxy.app.stack.unshift({route: "*", handle: function (req, res, next) {
            res.end("SHANE");
        }});

        http.get(options, (res) => {
            res.on("data", chunk => {
                assert.include(chunk.toString(), "SHANE");
                sinon.assert.notCalled(spy);
                done();
            });
            server.close();
        });
    });
});

