var foxy      = require("../../../index");
var request   = require("supertest");
var connect   = require("connect");
var http      = require("http");
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

describe("giving custom regex rules", () => {
    var config, app, server, proxy, path;
    before(() => {
        config = {
            rules: [{
                match: /Hi there/,
                fn: match => "Browser Sync " + match
            }]
        };
        path = "/test";
        app    = connect();
        app.use(path, (req, res) => res.end(output));
        server = http.createServer(app).listen();
        proxy = foxy(`http://localhost:${server.address().port}`, config);
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
                assert.include(res.text, "Browser Sync");
                done();
            });
    });
});

