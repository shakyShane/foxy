var foxy      = require("../../../index");
var request   = require("supertest");
var connect   = require("connect");
var http      = require("http");
var sinon     = require("sinon");
var assert    = require("chai").assert;

var output = `
<!doctype html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
    Hi there
</body>
</html>
`;

describe("Error Logging", () => {
    it("should use custom error handler", done => {
        var proxy, path;
        var config = {
            errHandler: function () {
                proxy.close();
                done();
            }
        };
        path = "/";
        proxy = foxy(`http://localhost:9898989898`, config).listen();

        var options = {
            hostname: 'localhost',
            port: proxy.address().port,
            path: path,
            method: 'GET',
            headers: {
                "accept": "text/html"
            }
        };

        http.get(options);
    });
    it("default handler", done => {
        var stub = sinon.stub(console, "log");
        var errHandler = require("../../../lib/errors");
        errHandler(new Error("ECONN"));
        sinon.assert.called(stub);
        console.log.restore();
        done();
    });
});

