"use strict";

/**
 * Remove Headers from a response
 * @param {Object} headers
 * @param {Array} items
 */
function removeHeaders(headers, items) {
    items.forEach(function (item) {
        if (headers.hasOwnProperty(item)) {
            delete headers[item];
        }
    });
}

/**
 * Get the proxy host with optional port
 */
function getProxyHost(opts) {
    if (opts.port && opts.port !== 80) {
        return opts.host + ":" + opts.port;
    }
    return opts.host;
}

/**
 * Handle redirect urls
 * @param {String} url
 * @param {Object} opts
 * @param {String} host
 * @param {Number} port
 * @returns {String}
 */
function handleRedirect(url, opts, host, port) {

    var fullHost  = opts.host + ":" + opts.port;
    var proxyHost = host + ":" + port;

    if (~url.indexOf(fullHost)) {
        return url.replace(fullHost, proxyHost);
    } else {
        return url.replace(opts.host, proxyHost);
    }
}

function getProxyUrl(opts) {
    return opts.protocol + "://" + getProxyHost(opts);
}

/**
 * @param userServer
 * @param proxyUrl
 * @returns {{match: RegExp, fn: Function}}
 */
function rewriteLinks(userServer, proxyUrl) {

    var string = "";
    var host = userServer.host;
    var port = userServer.port;

    if (host && port) {
        string = host;
        if (parseInt(port, 10) !== 80) {
            string = host + ":" + port;
        }
    } else {
        string = host;
    }

    return {
        match: new RegExp("['\"]([htps:/]+)?" + string + ".*?(?='|\")", "g"),
        fn: function (match) {
            return match.replace(new RegExp(string), proxyUrl);
        }
    };
}

module.exports = {
    rewriteLinks: rewriteLinks,
    handleRedirect: handleRedirect,
    getProxyHost: getProxyHost,
    getProxyUrl: getProxyUrl
};
