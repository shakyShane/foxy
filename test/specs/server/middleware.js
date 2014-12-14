"use strict";
var foxy = require("../../../index");
var request = require("supertest");
var connect = require("connect");
var http = require("http");
var assert = require("chai").assert;
var output = "\n<!doctype html>\n<html lang=\"en-US\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title></title>\n</head>\n<body>\n    Hi there\n</body>\n</html>\n";
describe("Running middlewares + html mods", (function() {
  it("should log url and continue", (function(done) {
    var config,
        app,
        server,
        proxy;
    var path = "/templates/page1.html";
    config = {
      rules: [{
        match: /Hi there/g,
        fn: function() {
          return "BrowserSync";
        }
      }],
      middleware: (function(req, res, next) {
        assert.equal(req.url, path);
        next();
      })
    };
    app = connect();
    app.use(path, (function(req, res) {
      return res.end(output);
    }));
    server = http.createServer(app).listen();
    proxy = foxy(("http://localhost:" + server.address().port), config).listen();
    var options = {
      hostname: 'localhost',
      port: proxy.address().port,
      path: path,
      method: 'GET',
      headers: {"accept": "text/html"}
    };
    http.get(options, (function(res) {
      res.on("data", (function(chunk) {
        assert.include(chunk.toString(), "BrowserSync");
        done();
      }));
      server.close();
    }));
  }));
  it("should run middleware and then skip any others", (function(done) {
    var config,
        app,
        server,
        proxy;
    var path = "/templates/page1.html";
    config = {
      rules: [{
        match: /Hi there/g,
        fn: function() {
          return "BrowserSync";
        }
      }],
      middleware: (function(req, res, next) {
        res.end("FOXY IS KING");
        next(true);
      })
    };
    app = connect();
    app.use(path, (function(req, res) {
      return res.end(output);
    }));
    server = http.createServer(app).listen();
    proxy = foxy(("http://localhost:" + server.address().port), config).listen();
    var options = {
      hostname: 'localhost',
      port: proxy.address().port,
      path: path,
      method: 'GET',
      headers: {"accept": "text/html"}
    };
    http.get(options, (function(res) {
      res.on("data", (function(chunk) {
        assert.include(chunk.toString(), "FOXY IS KING");
        done();
      }));
      server.close();
    }));
  }));
}));
