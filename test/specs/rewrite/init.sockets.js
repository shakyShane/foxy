"use strict";


var request = require("supertest");
var http    = require("http");
var multi   = require("multiline");

var helper = require("./helper");

describe("Init", function(){

    var proxy, socketio, port, base;

    before(function (done) {
        base = multi.stripIndent(function () {/*
         <html>
         <a href="URL"></a>
         </html>
         */});
        helper.start(base, "/links.html", function (_port, _proxy, _socketio, _app) {
            port = _port;
            proxy = _proxy;
            socketio = _socketio;
            _app.use("/redirect", function (req, res, next) {
                res.writeHead(302, {'Location': 'http://127.0.0.1:' + port + "/nope"});
                res.end();
                next();
            });
            done();
        });
    });

    after(function () {
        helper.reset();
    });
    it("should serve socket.io script", function(done){
        request(proxy)
            .get("/socket.io/socket.io.js")
            .expect(200, done);
    });
    it("should handle redirects", function (done) {
        request(proxy)
            .get("/redirect")
            .expect(302)
            .end(function (err, res) {
                done();
            });
    });
});