"use strict";


var assert  = require("chai").assert;
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
    it("should serve socket.io script", function(done){
        request(proxy)
            .get("/socket.io/socket.io.js")
            .expect(200, done);
    });
});