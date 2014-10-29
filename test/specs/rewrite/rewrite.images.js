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
         <img class="feature-banner__img lazyload"
         src="URL/v2/wp-content/uploads/2013/11/banner-402x134.jpg"
         data-sizes="auto"
         data-srcset="URL/v2/wp-content/uploads/2013/11/ride-banner-402x134.jpg 402w,
         URL/v2/wp-content/uploads/2013/11/ride-banner-960x320.jpg 960w,
         URL/v2/wp-content/uploads/2013/11/ride-banner-1920x640.jpg 1920w
         " alt="">
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
    it("should rewrite multiple sources", function (done) {
        request(proxy)
            .get("/links.html")
            .set("accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                var expected = base.replace(/URL/g, res.req._headers.host);
                assert.equal(expected, res.text);
                done();
            });
    });
});