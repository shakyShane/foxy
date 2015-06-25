var url = require("url");
module.exports = {
    getUrl: (port) => {
        return url.format({
            protocol: "http",
            hostname: "localhost",
            port: port
        });
    },
    expectedUrl: (base, host) => {
        return base.replace("URL", `//${host}`);
    },
    stripSchema: (host) => {
        return `//${host}`;
    }
};