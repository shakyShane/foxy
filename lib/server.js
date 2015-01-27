var respMod   = require("resp-modifier");
var utils     = require("./utils");

/**
 * HTTP proxy server with resp modding
 * @param proxyServer
 * @param userConfig
 * @returns {Function}
 */
module.exports = function (proxyServer, userConfig) {

    return function (req, res) {

        var config = userConfig();

        /**
         * Create middleware on the fly to match the host
         */
        var middleware = respMod({
            rules:       utils.getRules(config, req.headers.host),
            ignorePaths: config.get("ignorePaths")
        });

        var next = function () {
            proxyServer.web(req, res, {
                target:      config.get("target"),
                headers:     {
                    "host":            config.get("hostHeader"),
                    "accept-encoding": "identity",
                    "agent":           false
                }
            });
        };

        if (config.get("middleware").size) {
            var mw = config.get("middleware");
            var size = mw.size;
            var count = 0;
            mw.forEach(function (item) {
                if (item.path) {
                    if (req.url === item.path) {
                        item.fn(req, res, function () {
                            if (count === (size - 1)) {
                                utils.handleIe(req);
                                return middleware(req, res, next);
                            }
                            count += 1;
                        });
                    }
                } else {
                    item.fn(req, res, function () {
                        if (count === (size - 1)) {
                            utils.handleIe(req);
                            return middleware(req, res, next);
                        }
                        count += 1;
                    });
                }
            });
        } else {
            utils.handleIe(req);
            middleware(req, res, next);
        }
    };
};