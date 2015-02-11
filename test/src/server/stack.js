var foxy      = require("../../../index");
var request   = require("supertest");
var connect   = require("connect");
var sinon     = require("sinon");
var http      = require("http");
var assert    = require("chai").assert;

var output = `Some content`;
var html = require("fs").readFileSync(__dirname + "/../../../test/fixtures/index1.html");

describe("Accessing mw stack on the fly", () => {

    it("should return stack", done => {

        var app, server, proxy;
        var path = "/templates/page1.html";

        app    = connect();
        app.use(path, (req, res) => res.end(output));

        server = http.createServer(app).listen();

        proxy = foxy(`http://localhost:${server.address().port}`);
        var foxyserver = http.createServer(proxy).listen();


        var options = {
            hostname: 'localhost',
            port: foxyserver.address().port,
            path: path,
            method: 'GET',
            headers: {
                "accept": "text/html"
            }
        };

        assert.equal(proxy.stack.length, 2);

        proxy.stack.push({route: "", handle: function () {}, id: "foxy-mw"});

        assert.equal(proxy.stack.length, 3);

        proxy.stack = proxy.stack.filter(function (item) {
            return item.id !== "foxy-mw";
        });

        assert.equal(proxy.stack.length, 2);

        http.get(options, (res) => {
            res.on("data", chunk => {
                assert.include(chunk.toString(), "Some content");
                done();
            });
            foxyserver.close();
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

        proxy = foxy(`http://localhost:${server.address().port}`);
        var foxyserver = http.createServer(proxy).listen();


        var options = {
            hostname: 'localhost',
            port: foxyserver.address().port,
            path: path,
            method: 'GET',
            headers: {
                "accept": "text/html"
            }
        };

        var spy = sinon.spy();

        proxy.use(function shaneRoute(req, res, next) {
            spy(req.url);
            next();
        }, {id: "foxy-mw"});

        http.get(options, (res) => {
            res.on("data", chunk => {
                sinon.assert.calledWith(spy, path);
                foxyserver.close();
                done();
            });
        });
    });
});

describe("Adding to front of mw stack on the fly", () => {

    it("should call middleware at correct time", done => {

        var app, server, proxy;
        var path = "/templates/page1.html";

        app    = connect();
        app.use(path, (req, res) => res.end(html));

        server = http.createServer(app).listen();

        proxy = foxy(`http://localhost:${server.address().port}`, {
            rules: [
                {
                    match: /Link here/g,
                    fn: function (match) {
                        return match + " - Please";
                    }
                }
            ]
        });

        var foxyserver = http.createServer(proxy).listen();

        var options = {
            hostname: 'localhost',
            port: foxyserver.address().port,
            path: path,
            method: 'GET',
            headers: {
                "accept": "text/html"
            }
        };

        var spy = sinon.spy();

        proxy.use(function (req, res, next) {
            spy(req.url);
            next();
        }, {id: "foxy-test-mw"});

        proxy.stack.unshift({route: "/kittie", handle: function (req, res, next) {
            res.end("SHANE");
        }});

        http.get(options, (res) => {
            res.on("data", chunk => {
                assert.include(chunk.toString(), "Link here - Please");
                sinon.assert.calledWith(spy, path);
            });
        });

        options.path = "/kittie";

        http.get(options, (res) => {
            res.on("data", chunk => {
                assert.include(chunk.toString(), "SHANE");
                foxyserver.close();
                done();
            });
        });
    });
});

