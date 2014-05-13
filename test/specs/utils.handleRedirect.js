"use strict";

var utils = require("../../lib/utils");

var assert = require("chai").assert;

describe("Hnadle redirects", function () {
    var opts;
    beforeEach(function () {
        opts = {
            protocol: "http",
            host: "blossom.dev",
            port: 80
        };
    });
    it("should replace a 302 redirect link", function () {
        var host = "192.168.0.5";
        var port = 3002;
        var url = "http://blossom.dev/index.php/install/";
        var expected = "http://192.168.0.5:3002/index.php/install/";
        var actual   = utils.handleRedirect(url, opts, host, port);
        assert.equal(actual, expected);
    });
    it("should replace a 302 redirect link", function () {
        var host = "192.168.0.6";
        var port = 3003;
        var url = "http://blossom.dev/index.php/install/";
        var expected = "http://192.168.0.6:3003/index.php/install/";
        var actual   = utils.handleRedirect(url, opts, host, port);
        assert.equal(actual, expected);
    });
    it("should replace a 302 redirect link", function () {
        opts.port = 8000;
        var host = "192.168.0.6";
        var port = 3003;
        var url = "http://blossom.dev:8000/index.php/install/";
        var expected = "http://192.168.0.6:3003/index.php/install/";
        var actual   = utils.handleRedirect(url, opts, host, port);
        assert.equal(actual, expected);
    });
});