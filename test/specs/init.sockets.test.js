"use strict";

var foxy  = require("../../index");
var utils = require("../../lib/utils");

var assert  = require("chai").assert;
var request = require("supertest");
var socket  = require("socket.io");
var client  = require("socket.io-client");
var http    = require("http");
var path    = require("path");
var fs      = require("fs");
var connect = require("connect");

var opts = {
    protocol: "http://",
    host: "localhost",
    port: "8000",
    target: "http://localhost:8000"
};

var fixtures = path.resolve("test/fixtures");

describe("Init", function() {

    var server, proxy, socketio;
    before(function () {

        var testApp = connect()
            .use(connect.static(fixtures));

        // Fake server
        server = http.createServer(testApp).listen(8000);

        proxy = foxy.init(opts, "localhost:5000");

        proxy.listen(5000);

        socketio = socket.listen(proxy, {log: false});
    });
    after(function () {
        server.close();
        proxy.close();
    });
    it("should proxy websockets", function(done) {

        socketio.sockets.on("connection", function (client) {
            done();
        });

        client.connect("http://localhost:5000", {"force new connection": true});
    });
    it("should serve socket.io script", function(done){
        request(proxy)
            .get("/socket.io/socket.io.js")
            .expect(200, done);
    });
});