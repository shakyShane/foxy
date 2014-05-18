var respMod   = require("resp-modifier");
var httpProxy = require("http-proxy");
var http      = require("http");

var utils     = require("./lib/utils");

/**
 * @param opts
 * @param proxyUrl
 * @param [rules]
 * @returns {*}
 */
function init(opts, proxyUrl, additionalRules) {

    var proxy      = httpProxy.createProxyServer({ws: true, target: opts.target});
    var middleware = respMod({
        rules: getRules()
    });

    var server = http.createServer(function(req, res) {

        var next = function () {
            proxy.web(req, res, {
                headers: {
                    host: utils.getProxyHost(opts)
                }
            });
        };
        utils.handleIe(req);
        middleware(req, res, next);
    });

    function getRules() {

        var rules = [utils.rewriteLinks(opts, proxyUrl)];

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

