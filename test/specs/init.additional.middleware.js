"use strict";

var foxy  = require("../../index");

var assert  = require("chai").assert;
var request = require("supertest");
var http    = require("http");
var path    = require("path");
var connect = require("connect");

var opts = {
    protocol: "http://",
    host: "localhost",
    port: "8000",
    target: "http://localhost:8000"
};

var fixtures = path.resolve("test/fixtures");

describe("Init", function(){

    var proxy, server;

    beforeEach("init(): ", function(){

        var testApp = connect()
            .use(connect.static(fixtures));

        // Fake server
        server = http.createServer(testApp).listen(8000);

        proxy = foxy.init(opts, {host: "localhost", port: 3000}, null, function (req, res, next) {
            if (req.url.indexOf("test-url") > -1) {
                res.end("SHANE");
                next(true);
            } else {
                next(false);
            }
        });
    });

    afterEach(function () {
        server.close();
    });
    it("Should work with additional rules", function (done) {
        request(proxy)
            .get("/test-url")
            .set("accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.isTrue(res.text.indexOf("SHANE") === 0);
                done();
            })
    });
});