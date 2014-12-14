var utils  = require("../../lib/utils");
var url    = require("url");
var assert = require("chai").assert;

var ua = "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 1.1.4322)";

describe("Adding accept headers for old IE", () => {
    var req;
    beforeEach(function () {
        req = {
            url: "http://localhost:54321",
            headers: {
                "user-agent": ua
            }
        };
    });
    it("should add for homepage req", () => {
        var actual = utils.handleIe(req);
        assert.equal(actual.headers.accept, "text/html");
    });
    it("should not add for ignored files", () => {
        req.url = req.url + "/core.css";
        var actual = utils.handleIe(req);
        assert.isUndefined(actual.headers.accept);
    });
});