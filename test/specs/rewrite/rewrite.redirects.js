"use strict";
var assert = require("chai").assert;
var connect = require("connect");
var http = require("http");
var foxy = require("../../../");
var getUrl = require("./helpers").getUrl;
describe("rewrite paths", (function() {
  var app,
      server,
      serverUrl,
      port,
      proxy;
  before((function(done) {
    app = connect();
    server = http.createServer(app).listen();
    serverUrl = getUrl(server.address().port);
    port = server.address().port;
    app.use("/redirect", (function(req, res, next) {
      res.writeHead(302, {"Location": "http://127.0.0.1:" + port + "/nope"});
      res.end();
      next();
    }));
    proxy = foxy("http://127.0.0.1:" + port).listen();
    done();
  }));
  after((function() {
    server.close();
    proxy.close();
  }));
  it("Should re-write redirect headers to stay on proxy", (function(done) {
    var proxyPort = proxy.address().port;
    http.get(("http://localhost:" + proxyPort + "/redirect"), (function(res) {
      assert.equal(res.statusCode, 302);
      assert.equal(res.headers["location"], ("http://localhost:" + proxyPort + "/nope"));
      done();
    }));
  }));
}));
