
var lrSnippet = require("resp-modifier");
var httpProxy = require("http-proxy");
var http      = require("http");

var utils     = require("./lib/utils");

function init(opts, proxyUrl) {

    var proxy      = httpProxy.createProxyServer();
    var middleware = lrSnippet({rules: [utils.rewriteLinks(opts, proxyUrl)]});

    var server = http.createServer(function(req, res) {

        req.headers["accept-encoding"] = "identity";

        var next = function () {
            proxy.web(req, res, {
                target: opts.target,
                headers: {
                    host: utils.getProxyHost(opts)
                }
            });
        };

        middleware(req, res, next);
    });

    return server;
}

module.exports = {
    init: init
};

