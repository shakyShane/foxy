var foxy = require("../../index");
var request = require("supertest");
var connect = require("connect");
var http = require("http");
var cookie = require("cookie");
var assert = require("chai").assert;

describe("Stripping domain from cookies", () => {
    var config, app, server, proxy;
    before(() => {
        app = connect();
        app.use("/test", function (req, res) {
            res.setHeader("set-cookie", "frontend=2295c3ebc1862489fa68049c7402a5ba; expires=Sun, 14-Dec-2014 17:26:49 GMT; Max-Age=3600; path=/; domain=magento.dev; httponly");
            res.end("Some output");
        });
        server = http.createServer(app).listen();
        proxy = foxy(`http://localhost:${server.address().port}`, config);
    });
    after(function () {
        server.close();
    });
    it("should remove domain from cookies", done => {
        request(proxy)
            .get("/test")
            .set("accept", "text/html")
            .expect(200)
            .end((err, res) => {
                res.headers["set-cookie"].forEach((item) => {
                    assert.isUndefined(cookie.parse(item).domain);
                });
                done();
            });
    });
});

describe("NOT Stripping domain from cookies", () => {
    var app, server, proxy;
    before(() => {
        app = connect();
        app.use("/test", (req, res) => {
            res.setHeader("set-cookie", "frontend=2295c3ebc1862489fa68049c7402a5ba; expires=Sun, 14-Dec-2014 17:26:49 GMT; Max-Age=3600; path=/; domain=magento.dev; httponly");
            res.end("Some output");
        });
        server = http.createServer(app).listen();
        proxy = foxy(`http://localhost:${server.address().port}`, {cookies: {stripDomain: false}});
    });
    after(() => {
        server.close();
    });
    it("should remove domain from cookies", done => {
        request(proxy)
            .get("/test")
            .set("accept", "text/html")
            .expect(200)
            .end((err, res) => {
                res.headers["set-cookie"].forEach((item) => assert.equal(
                    cookie.parse(item).domain,
                    "magento.dev"
                ));
                done();
            });
    });
});

