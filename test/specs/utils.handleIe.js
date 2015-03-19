"use strict";
var utils = require("../../lib/utils");
var foxy = require("../../");
var connect = require("connect");
var http = require("http");
var assert = require("chai").assert;
var ua = "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 1.1.4322)";
describe("Adding accept headers for old IE", (function() {
  var req;
  beforeEach(function() {
    req = {
      url: "http://localhost:54321",
      headers: {"user-agent": ua}
    };
  });
  it("should add for homepage req", (function() {
    var actual = utils.handleIe(req, null, function() {});
    assert.equal(actual.headers.accept, "text/html");
  }));
  it("should not add for ignored files", (function() {
    req.url = req.url + "/core.css";
    var actual = utils.handleIe(req, null, function() {});
    assert.isUndefined(actual.headers.accept);
  }));
  it("e2e IE", (function(done) {
    var app,
        server,
        proxy;
    var path = "/templates/page1.html";
    app = connect();
    app.use(path, (function(req, res) {
      return res.end("\n        <html>\n        <head>\n\n        </head>\n        <body>\n            Hi there\n        </body>\n        </html>\n        ");
    }));
    server = http.createServer(app).listen();
    proxy = foxy(("http://localhost:" + server.address().port), {rules: {
        match: /Hi there/,
        fn: (function(match) {
          return "Browser Sync " + match;
        })
      }}).listen();
    var options = {
      hostname: "localhost",
      port: proxy.address().port,
      path: path,
      method: "GET",
      headers: {"user-agent": ua}
    };
    http.get(options, (function(res) {
      res.on("data", (function(chunk) {
        assert.include(chunk.toString(), "Browser Sync");
        done();
      }));
      server.close();
    }));
  }));
}));
