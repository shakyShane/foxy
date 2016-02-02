var foxy      = require("../../../index");
var connect   = require("connect");
var http      = require("http");
var assert    = require("chai").assert;

describe("Running proxyRes configuration", () => {

    it("should modify response content-type header", done => {
        var config, app, server, proxy;
        config = {
            proxyRes: [(res) => {
                res.headers["content-type"] = "some value";
            }]
        };
        app    = connect();
        server = http.createServer(app).listen();
        proxy = foxy(`http://localhost:${server.address().port}`, config).listen();
        var options = {
            hostname: "localhost",
            port: proxy.address().port,
            path: "/",
            method: "GET",
            headers: {
                accept: "text/html"
            }
        };
        http.get(options, (res) => {
            assert.equal(res.headers["content-type"], "some value");
            server.close();
            done();
        });
    });
});
