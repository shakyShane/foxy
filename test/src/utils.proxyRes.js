var utils = require("../../lib/utils");

var assert = require("chai").assert;

describe("configurable proxyRes", () => {
    var config = {
        urlObj: {
            host: ""
        }
    };
    var res = { headers: {} };
    var req = { headers: {} };

    beforeEach(() => {
        config.proxyRes = [
            function(res, req, config) {
                config.executed1 = true;
            },
            function(res, req, config) {
                config.executed2 = true;
            }
        ];
    });

    it("should execute proxyRes functions", () => {
        utils.proxyRes(config)(res, req, {});
        assert.isTrue(config.executed1);
        assert.isTrue(config.executed2);
    });
});
