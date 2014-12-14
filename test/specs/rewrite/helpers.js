var url = require("url");
module.exports = {
    getUrl: function (port) {
        return url.format({
            protocol: "http",
            hostname: "localhost",
            port: port
        });
    },
    expectedUrl: function (base, host) {
        return base.replace("URL", "//" + host + "/");
    },
    stripSchema: function (host) {
        return "//" + host + "/";
    }
};