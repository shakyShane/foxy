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

describe("Ignoring certain paths", () => {
    var config, app, server, proxy, path;
    before(() => {
        config = {
            rules: [{
                match: /Hi there/,
                fn: match => "Browser Sync " + match
            }],
            blacklist: ["/templates/*.html"]
        };
        path = "/templates/page1.html";
        app  = connect();
        app.use(path, (req, res) => res.end(output));
        server = http.createServer(app).listen();
        proxy = foxy(`http://localhost:${server.address().port}`, config).app;
    });

    after(() => server.close());

    it("should replace some text", function (done) {
        request(proxy)
            .get(path)
            .set("accept", "text/html")
            .expect(200)
            .end((err, res) => {
                assert.notInclude(res.text, "Browser Sync");
                done();
            });
    });
});

