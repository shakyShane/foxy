"use strict";


var assert  = require("chai").assert;
var request = require("supertest");
var client  = require("socket.io-client");
var http    = require("http");
var multi   = require("multiline");

var helper = require("./helper");

describe("Init", function(){

    var proxy, socketio, port, base;

    before(function (done) {
        base = multi.stripIndent(function () {/*
         <html>
         <a href="URL/some/long/path?hi=there"></a>
         </html>
         */});
        helper.start(base, "/links.html", function (_port, _proxy, _socketio) {
            port = _port;
            proxy = _proxy;
            socketio = _socketio;
            done();
        });
    });

    after(function () {
        helper.reset();
    });
    it("http://localhost:", function (done) {
        request(proxy)
            .get("/links.html")
            .set("accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                var expected = base.replace("URL", res.req._headers.host);
                assert.equal(res.text, expected);
                done();
            });
    });
});