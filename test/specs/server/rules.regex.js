var foxy      = require("../../../index");
var request   = require("supertest");
var connect   = require("connect");
var http      = require("http");
var assert    = require("chai").assert;
var multi     = require("multiline");


var output = multi(function () {/*
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
*/});

describe("giving custom regex rules", function () {
    var config, app, server, proxy, path;
    before(function () {
        config = {
            rules: {
                match: /Hi there/,
                fn: function (match) {
                    return "Browser Sync " + match;
                }
            }
        };
        path = "/test";
        app    = connect();
        app.use(path, function (req, res) {
            res.end(output);
        });
        server = http.createServer(app).listen();
        proxy = foxy("http://localhost:" + server.address().port, config);
    });
    after(function () {
        server.close();
    });
    it("should replace some text", function (done) {
        request(proxy)
            .get(path)
            .set("accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "Browser Sync");
                done();
            });
    });
});

