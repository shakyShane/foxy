"use strict";
var foxy = require("../../../index");
var http = require("http");
var sinon = require("sinon");
describe("Error Logging", (function() {
  it("should use custom error handler", (function(done) {
    var proxy,
        path;
    var config = {errHandler: function() {
        proxy.close();
        done();
      }};
    path = "/";
    proxy = foxy("http://localhost:9898", config).listen();
    var options = {
      hostname: "localhost",
      port: proxy.address().port,
      path: path,
      method: "GET",
      headers: {accept: "text/html"}
    };
    http.get(options);
  }));
  it("default handler", (function(done) {
    var stub = sinon.stub(console, "log");
    var errHandler = require("../../../lib/errors");
    errHandler(new Error("ECONN"));
    sinon.assert.called(stub);
    console.log.restore();
    done();
  }));
}));
