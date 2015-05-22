/**
 *
 * Foxy - proxy with response moddin'
 * https://github.com/shakyShane/foxy
 *
 */

/**
 * @param {String} target - a url such as http://www.bbc.co.uk or http://localhost:8181
 * @param {Object} [userConfig]
 * @returns {http.Server}
 */
function create(target, userConfig) {
    "use strict";

    /**
     * Merge user config with defaults
     * @type {Immutable.Map}
     */
    var config = require("./lib/config")(target, userConfig);

    /**
     * Create a connect app
     */
    var Foxy    = require("./lib/server");

    var foxy    = new Foxy(config);

    return foxy.app;
}

module.exports      = create;
module.exports.init = create; // backwards compatibility
