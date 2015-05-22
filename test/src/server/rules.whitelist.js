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

describe("Whitelisting certain paths", () => {
    var config, app, server, proxy, path;
    before(() => {
        config = {
            rules: [{
                match: /Hi there/,
                fn: match => "Browser Sync " + match
            }],
            whitelist: ["/templates/*.html"]
        };

        path = "/templates/page1.html";
        app    = connect();
        app.use(path, (req, res) => res.end(output));

        server = http.createServer(app).listen();
        proxy = foxy(`http://localhost:${server.address().port}`, config);
    });

    after(() => server.close());

    it("should replace links even when no accept headers", function (done) {
        request(proxy)
            .get(path)
            .expect(200)
            .end((err, res) => {
                console.log(res.text);
                assert.include(res.text, "Browser Sync Hi there");
                done();
            });
    });
});

