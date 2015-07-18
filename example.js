"use strict";

var app  = require("./")("http://www.bbc.co.uk", {
    proxyRes: [function (res) {
        res.headers["awesome"] = "true";
    }]
});

var server = app.listen(8001);

console.log("http://localhost:" + server.address().port);
