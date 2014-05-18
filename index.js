var respMod   = require("resp-modifier");
var httpProxy = require("http-proxy");
var http      = require("http");

var utils     = require("./lib/utils");

/**
 * @param opts
 * @param proxyUrl
 * @param [additionalRules]
 * @returns {*}
 */
function init(opts, proxy, additionalRules) {

    var proxyHost = proxy.host + ":" + proxy.port;
    var proxyServer      = httpProxy.createProxyServer({ws: true, target: opts.target});
    var middleware = respMod({
        rules: getRules()
    });

    var server = http.createServer(function(req, res) {

        var next = function () {
            proxyServer.web(req, res, {
                headers: {
                    host: utils.getProxyHost(opts)
                }
            });
        };
        utils.handleIe(req);
        middleware(req, res, next);
    });

    // Remove headers
    proxyServer.on("proxyRes", function (res) {
        if (res.statusCode === 302) {
            res.headers.location = utils.handleRedirect(res.headers.location, opts, proxyHost);
        }
        utils.removeHeaders(res.headers, ["content-length", "content-encoding"]);
    });

    function getRules() {

        var rules = [utils.rewriteLinks(opts, proxyHost)];

        if (additionalRules) {
            if (Array.isArray(additionalRules)) {
                additionalRules.forEach(function (rule) {
                    rules.push(rule);
                })
            } else {
                rules.push(additionalRules);
            }
        }
        return rules;
    }

    return server;
}

module.exports = {
    init: init
};

