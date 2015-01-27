"use strict";
var foxy = require("../../../index");
var request = require("supertest");
var connect = require("connect");
var sinon = require("sinon");
var http = require("http");
var assert = require("chai").assert;
var output = "Some content";
describe("Running Serving static files", (function() {
  it("should allow the serving of static files AFTER init", (function(done) {
    var app,
        server,
        proxy;
    var path = "/templates/page1.html";
    app = connect();
    app.use(path, (function(req, res) {
      return res.end(output);
    }));
    server = http.createServer(app).listen();
    proxy = foxy(("http://localhost:" + server.address().port)).listen();
    var options = {
      hostname: 'localhost',
      port: proxy.address().port,
      path: "/shane",
      method: 'GET',
      headers: {"accept": "text/html"}
    };
    assert.isFunction(proxy.app.use);
    proxy.app.use("/shane", function(req, res) {
      res.setHeader("Content-Type", "text/css");
      res.end("Content from .use");
    });
    http.get(options, (function(res) {
      res.on("data", (function(chunk) {
        assert.include(chunk.toString(), "Content from .use");
        assert.equal(res.headers["content-type"], "text/css");
        done();
      }));
      server.close();
    }));
  }));
}));
describe("Running middleware and calling next", (function() {
  it("should allow the serving of static files AFTER init", (function(done) {
    var app,
        server,
        proxy;
    var path = "/templates/page1.html";
    app = connect();
    app.use(path, (function(req, res) {
      return res.end(output);
    }));
    server = http.createServer(app).listen();
    proxy = foxy(("http://localhost:" + server.address().port)).listen();
    var spy = sinon.spy();
    var options = {
      hostname: 'localhost',
      port: proxy.address().port,
      path: path,
      method: 'GET',
      headers: {"accept": "text/html"}
    };
    assert.isFunction(proxy.app.use);
    proxy.app.use(path, function(req, res, next) {
      spy(req.url);
      next();
    });
    http.get(options, (function(res) {
      res.on("data", (function(chunk) {
        sinon.assert.calledWith(spy, path);
        assert.include(chunk.toString(), "Some content");
        done();
      }));
      server.close();
    }));
  }));
}));
