"use strict";


var assert  = require("chai").assert;
var request = require("supertest");
var multi   = require("multiline");

var helper = require("./helper");

describe("Handling redirects", function(){

    var proxy, socketio, port, base;

    before(function (done) {
        base = multi.stripIndent(function () {/*
         <html>
         <a href="URL/some/long/path?hi=there"></a>
         </html>
         */});
        helper.start(base, "/links.html", function (_port, _proxy, _socketio, server) {
            port = _port;
            proxy = _proxy;
            proxy.listen();
            socketio = _socketio;
            server.use("/hello", function (req, res, next) {
                res.writeHead(301, {
                    "location" : "http://localhost:" + port + "/shane"
                });
                res.end();
                next();
            });
            done();
        });
    });

    after(function () {
        helper.reset();
    });
    it("Correctly rewrites headers following a redirect", function (done) {
        var proxyPort = proxy.address().port;
        request(proxy)
            .get("/hello")
            .set("accept", "text/html")
            .end(function (err, res) {
                assert.equal(res.headers.location, "http://127.0.0.1:"+proxyPort+"/shane");
                done();
            });
    });
});