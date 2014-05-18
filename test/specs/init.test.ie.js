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

        proxy = foxy.init(opts, "localhost:3000");
    });

    afterEach(function () {
        server.close();
    });

    it("should work with old IE Headers", function(done){
        request(proxy)
            .get("/index1.html")
            .set("accept", "image/jpeg, application/x-ms-application, image/gif, application/xaml+xml, image/pjpeg, application/x-ms-xbap, */*")
            .set("user-agent", "Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; .NET CLR 1.1.4322; .NET CLR 2.0.50727)")
            .expect(200)
            .end(function (err, res) {
                assert.isTrue(res.text.indexOf("localhost:3000") > 0);
                done();
            });
    });
});