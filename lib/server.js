var utils     = require("./utils");
var respMod   = require("resp-modifier");
var connect   = require("connect");
var httpProxy = require("http-proxy");

module.exports = function (config) {

    var target  = config.get("target");
    var url     = config.get("urlObj");

    /**
     * Connect app for middleware stacking.
     */
    var app = connect();

    /**
     * Proxy server for final requests
     */
    var proxy = httpProxy.createProxyServer({
        target:  target,
        headers: {
            "host":            url.host,
            "accept-encoding": "identity",
            "agent":           false
        }
    });

    /**
     * Proxy errors out to user errHandler
     */
    proxy.on("error", config.get("errHandler"));

    /**
     * Modify the proxy response
     */
    proxy.on("proxyRes", utils.proxyRes(config));

    /**
     * Push the final handler onto the mw stack
     */
    app.stack.push({route: '', id: "foxy-resp-mod", handle: finalhandler});

    /**
     * Intercept regular .use() calls to
     * ensure final handler is always called
     * @param path
     * @param fn
     * @param opts
     */
    var mwCount = 0;

    app.use = function (path, fn, opts) {

        opts = opts || {};

        if (!opts.id) {
            opts.id = "foxy-mw-" + (mwCount += 1);
        }

        if (!fn) {
            fn = path;
            path = "";
        }

        if (path === "*") {
            path = "";
        }

        // Never override final handler
        app.stack.splice(app.stack.length - 1, 0, {
            route: path,
            handle: fn,
            id: opts.id
        });
    };

    /**
     * Final handler - give the request to the proxy
     * and cope with link re-writing
     * @param req
     * @param res
     */
    function finalhandler (req, res) {
        respMod({
            rules: utils.getRules(config, req.headers.host),
            blacklist:  config.get("blacklist").toJS(),
            whitelist:  config.get("whitelist").toJS()
        })(req, res, function () {
            proxy.web(req, res);
        });
    }

    return app;
};