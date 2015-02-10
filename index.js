/**
 *
 * Foxy - proxy with response moddin'
 * https://github.com/shakyShane/foxy
 *
 */
var http       = require("http");
var utils      = require("./lib/utils");
var app        = require("connect");

/**
 * @param {String} target - a url such as http://www.bbc.co.uk or http://localhost:8181
 * @param {Object} [userConfig]
 * @returns {http.Server}
 */
function foxy(target, userConfig) {

    /**
     * Merge user config with defaults
     * @type {Immutable.Map}
     */
    var config = require("./lib/config")(target, userConfig);
    var app    = require("./lib/server")(config);

    /**
     * Add any user-provided/default middlewares
     */
    config.get("middleware").forEach(app.use);

    return app;
}

module.exports      = foxy;
module.exports.init = foxy; // backwards compatibility

