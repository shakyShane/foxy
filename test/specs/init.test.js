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

var getFile = function (file) {
    return fs.readFileSync(path.resolve("test/fixtures/"+file+"-result.html"), "utf-8");
};

var fixtures = path.resolve("test/fixtures");

describe("Init", function(){

    var proxy, server, socketio;

    beforeEach("init(): ", function(){

        var testApp = connect()
            .use(connect.static(fixtures));

        // Fake server
        server = http.createServer(testApp).listen(8000);

        proxy = foxy.init(opts, "localhost:3000");

        socketio = socket.listen(proxy, {log: false});

    });

    afterEach(function () {
        server.close();
    });

    it("should also proxy websockets", function(done){

        var clientSockets = client.connect("http://localhost:3000", {"force new connection": true});
        clientSockets.emit("shane", {name:"shane"});

        request(proxy)
            .get("/socket.io/socket.io.js")
            .expect(200)
            .end(function (err, res) {
                done();
            })
    });
    it("should serve the socket IO script", function(done){
        request(proxy)
            .get("/socket.io/socket.io.js")
            .expect(200)
            .end(function (err, res) {
                done();
            })
    });
    it("http://localhost:8000", function (done) {
        request(proxy)
            .get("/index1.html")
            .set("accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.isFalse(res.text.indexOf("http://localhost:8000") > 0);
                assert.isTrue(res.text.indexOf("http://localhost:3000") > 0);
                done();
            })
    });
    it("http://localhost:8000", function (done) {
        var result = getFile("index2");
        request(proxy)
            .get("/index2.html")
            .set("accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.deepEqual(result, res.text);
                done();
            })
    });
});