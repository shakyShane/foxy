"use strict";
var foxy = require("../../../index");
var request = require("supertest");
var connect = require("connect");
var http = require("http");
var assert = require("chai").assert;
var output = "\n<!doctype html>\n<html lang=\"en-US\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title></title>\n</head>\n<body>\n    Hi there\n</body>\n</html>\n";
describe("Whitelisting certain paths", (function() {
  var config,
      app,
      server,
      proxy,
      path;
  before((function() {
    config = {
      rules: [{
        match: /Hi there/,
        fn: (function(match) {
          return "Browser Sync " + match;
        })
      }],
      whitelist: ["/templates/*.html"]
    };
    path = "/templates/page1.html";
    app = connect();
    app.use(path, (function(req, res) {
      return res.end(output);
    }));
    server = http.createServer(app).listen();
    proxy = foxy(("http://localhost:" + server.address().port), config);
  }));
  after((function() {
    return server.close();
  }));
  it("should replace links even when no accept headers", function(done) {
    request(proxy).get(path).expect(200).end((function(err, res) {
      assert.include(res.text, "Browser Sync");
      done();
    }));
  });
}));
