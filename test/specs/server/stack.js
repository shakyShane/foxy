"use strict";
var foxy = require("../../../index");
var request = require("supertest");
var connect = require("connect");
var sinon = require("sinon");
var http = require("http");
var assert = require("chai").assert;
var output = "Some content";
var html = require("fs").readFileSync(__dirname + "/../../../test/fixtures/index1.html");
describe("Accessing mw stack on the fly", (function() {
  it("should return stack", (function(done) {
    var app,
        server,
        proxy;
    var path = "/templates/page1.html";
    app = connect();
    app.use(path, (function(req, res) {
      return res.end(output);
    }));
    server = http.createServer(app).listen();
    proxy = foxy(("http://localhost:" + server.address().port));
    var foxyserver = http.createServer(proxy).listen();
    var options = {
      hostname: 'localhost',
      port: foxyserver.address().port,
      path: path,
      method: 'GET',
      headers: {"accept": "text/html"}
    };
    assert.equal(proxy.stack.length, 2);
    proxy.stack.push({
      route: "",
      handle: function() {},
      id: "foxy-mw"
    });
    assert.equal(proxy.stack.length, 3);
    proxy.stack = proxy.stack.filter(function(item) {
      return item.id !== "foxy-mw";
    });
    assert.equal(proxy.stack.length, 2);
    http.get(options, (function(res) {
      res.on("data", (function(chunk) {
        assert.include(chunk.toString(), "Some content");
        done();
      }));
      server.close();
    }));
  }));
}));
describe("Adding to mw stack on the fly", (function() {
  it.only("should return stack", (function(done) {
    var app,
        server,
        proxy;
    var path = "/templates/page1.html";
    app = connect();
    app.use(path, (function(req, res) {
      return res.end(output);
    }));
    server = http.createServer(app).listen();
    proxy = foxy(("http://localhost:" + server.address().port));
    var foxyserver = http.createServer(proxy).listen();
    var options = {
      hostname: 'localhost',
      port: foxyserver.address().port,
      path: path,
      method: 'GET',
      headers: {"accept": "text/html"}
    };
    var spy = sinon.spy();
    proxy.app.stack.push({
      route: "",
      handle: function(req, res, next) {
        spy(req.url);
        next();
      },
      id: "foxy-mw"
    });
    http.get(options, (function(res) {
      res.on("data", (function(chunk) {
        sinon.assert.calledWith(spy, path);
        done();
      }));
      server.close();
    }));
  }));
}));
describe("Adding to front of mw stack on the fly", (function() {
  it("should return stack", (function(done) {
    var app,
        server,
        proxy;
    var path = "/templates/page1.html";
    app = connect();
    app.use(path, (function(req, res) {
      return res.end(html);
    }));
    server = http.createServer(app).listen();
    proxy = foxy(("http://localhost:" + server.address().port), {rules: [{
        match: /Link here/g,
        fn: function(match) {
          return match + " - Please";
        }
      }]}).listen();
    var options = {
      hostname: 'localhost',
      port: proxy.address().port,
      path: path,
      method: 'GET',
      headers: {"accept": "text/html"}
    };
    var spy = sinon.spy();
    proxy.app.stack.push({
      route: "",
      handle: function(req, res, next) {
        spy(req.url);
        next();
      },
      id: "foxy-test-mw"
    });
    proxy.app.stack.unshift({
      route: "/kittie",
      handle: function(req, res, next) {
        res.end("SHANE");
      }
    });
    http.get(options, (function(res) {
      res.on("data", (function(chunk) {
        assert.include(chunk.toString(), "Link here - Please");
        sinon.assert.calledWith(spy, path);
      }));
    }));
    options.path = "/kittie";
    http.get(options, (function(res) {
      res.on("data", (function(chunk) {
        assert.include(chunk.toString(), "SHANE");
        done();
      }));
    }));
  }));
}));
