var utils = require("../../lib/utils");

var assert = require("chai").assert;

describe("Removing Headers", () => {
    var headers;
    beforeEach(() => {
        headers = {
            "content-encoding": "gzip",
            "content-length":   "1202",
            "content-type":     "text/html"
        };
    });
    it("should delete a single header", () => {
        utils.removeExcludedHeaders({headers}, {}, {excludedHeaders:["content-encoding"]});
        var actual = headers.hasOwnProperty("content-encoding");
        assert.isFalse(actual);
    });
    it("should delete mulitple headers", () => {
        utils.removeExcludedHeaders({headers}, {}, {excludedHeaders:["content-encoding", "content-length"]});
        var actual = headers.hasOwnProperty("content-encoding") || headers.hasOwnProperty("content-length");
        assert.isFalse(actual);
    });
});
