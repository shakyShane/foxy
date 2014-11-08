"use strict";

var getProxyUrl = require("../../lib/utils").getProxyUrl;

var assert = require("chai").assert;

describe("getProxyUrl(): ", function(){
    it("should return a full url", function () {
        var opts = {
            protocol: "http",
            hostname: "localhost",
            port: 80
        };
        var actual   = getProxyUrl(opts);
        var expected = "http://localhost";
        assert.equal(actual, expected);
    });
    it("should return a full url", function () {
        var opts = {
            protocol: "https",
            host: "local.dev",
            port: 8000
        };
        var actual   = getProxyUrl(opts);
        var expected = "https://local.dev:8000";
        assert.equal(actual, expected);
    });
});