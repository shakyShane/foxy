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

        var userConf = userConfig();
        var config   = userConf.config;
        var stack    = userConf.stack;

        var foxyNext = function () {
            proxyServer.web(req, res, {
                target:      config.get("target"),
                headers:     {
                    "host":            config.get("hostHeader"),
                    "accept-encoding": "identity",
                    "agent":           false
                }
            });
        };

        if (!stack.some(function (item) {
            return item.id === "resp-mod";
        })) {
            stack.push({
                route: "*",
                handle: getMw(config, req),
                id: "resp-mod"
            });
        } else {
            stack = stack.map(function (item) {
                if (item.id === "resp-mod") {
                    item.handle = getMw(config, req);
                }
                return item;
            });
        }

        if (!stack.some(function (item) {
                return item.id === "foxy-links";
            })) {
            stack.push({
                route: "*",
                handle: foxyNext,
                id: "foxy-links"
            });
        } else {
            stack = stack.map(function (item) {
                if (item.id === "foxy-links") {
                    item.handle = foxyNext;
                }
                return item;
            });
        }

        if (stack.length) {
            var canContinue = true;
            stack.forEach(function (item) {
                if (canContinue) {
                    canContinue = false;
                    if (item.route === "*" || item.route === "" || req.url === item.route) {
                        item.handle(req, res, function () {
                            canContinue = true;
                        });
                    }
                }
            });
        }
    };
};

/**
 * @param config
 * @param req
 * @returns {*}
 */
function getMw(config, req) {
    return respMod({
        rules:       utils.getRules(config, req.headers.host),
        ignorePaths: config.get("ignorePaths")
    });
}