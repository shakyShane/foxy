var foxy = require("../../index");
var request = require("supertest");
var connect = require("connect");
var http = require("http");
var assert = require("chai").assert;

describe("rewriting cookies", () => {
    var config, app, server, proxy;
    before(() => {
        app = connect();
        app.use("/test", function (req, res) {
            res.setHeader("set-cookie", "pin-sha256=\"WoiWRyIOVNa9ihaBciRSC7XHjliYS9VwUGOIud4PB18=\"; domain=magento.dev; httponly");
            res.end("Some output");
        });
        server = http.createServer(app).listen();
        proxy = foxy(`http://localhost:${server.address().port}`, config);
    });
    after(function () {
        server.close();
    });
    it("does not strip quotes from cookies", done => {
        request(proxy)
            .get("/test")
            .set("accept", "text/html")
            .expect(200)
            .end((err, res) => {
                assert.equal(res.headers['set-cookie'][0], "pin-sha256=\"WoiWRyIOVNa9ihaBciRSC7XHjliYS9VwUGOIud4PB18=\"; HttpOnly")
                done();
            });
    });
});
