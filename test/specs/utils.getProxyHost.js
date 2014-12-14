"use strict";
var utils = require("../../lib/utils");
var url = require("url");
var assert = require("chai").assert;
describe("Get proxy hostname", (function() {
  it("should return the correct host when no PORT", (function() {
    var actual = utils.getProxyHost({hostname: "magento.dev"});
    assert.equal(actual, "magento.dev");
  }));
  it("should return the correct host when a port exists", (function() {
    var actual = utils.getProxyHost(url.parse("http://localhost:54321"));
    assert.equal(actual, "localhost:54321");
  }));
}));
