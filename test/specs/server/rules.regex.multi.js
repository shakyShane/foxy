"use strict";

var foxy      = require("../../../index");
var request   = require("supertest");
var connect   = require("connect");
var http      = require("http");
var assert    = require("chai").assert;

var output = function (url) {
    return `
<!doctype html>
<html lang='en-US'>
<head>
    <meta charset='UTF-8'>
    <title></title>
    <link rel="stylesheet" href="${url}/skin/default/css/core.css"/>
</head>
<body>
    <script src="${url}/skin/default/js/app.js"></script>
</body>
</html>
`;
};

describe("giving custom regex rules", () => {
    var config, app, server, proxy, path;
    before(() => {
        path = "/test";
        app    = connect();
        server = http.createServer(app).listen();
        let url = `http://localhost:${server.address().port}`;
        config = {
            rules: [{
                match: new RegExp(`${url}/skin/default/(.+?)"`, "g"),
                fn: function () {
                    return "/assets/" + arguments[1] + "\"";
                }
            }]
        };
        proxy = foxy(url, config);
        app.use(path, (req, res) => res.end(output(url)));
    });
    after(function () {
        server.close();
    });
    it("should replace some text", done => {
        request(proxy)
            .get(path)
            .set("accept", "text/html")
            .expect(200)
            .end((err, res) => {
                console.log(res.text);
                assert.include(res.text, "href=\"/assets/css/core.css\"");
                assert.include(res.text, "src=\"/assets/js/app.js\"");
                done();
            });
    });
});

