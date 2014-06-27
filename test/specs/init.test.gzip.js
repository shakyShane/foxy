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
var gzip    = require("connect-gzip");

var opts = {
    protocol: "http://",
    host: "localhost",
    port: "8000",
    target: "http://localhost:8000"
};

var fixtures = path.resolve("test/fixtures");

describe("Handle Gzip", function(){

    var proxy, server, socketio;

    beforeEach("init(): ", function(){

        var testApp = connect()
            .use(gzip.gzip())
            .use(connect.static(fixtures));

        // Fake server
        server = http.createServer(testApp).listen(8000);

        proxy = foxy.init(opts, {host: "localhost", port: 3000});

        socketio = socket.listen(proxy, {log: false});

    });

    afterEach(function () {
        server.close();
    });

    it("should never allow a gzipped response", function (done) {
        var css = fs.readFileSync(path.resolve("test/fixtures/styles.css"), "utf-8");
        request(proxy)
            .get("/styles.css")
            .set("accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.equal(css, res.text);
                done();
            })
    });
});