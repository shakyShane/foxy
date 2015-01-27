var utils  = require("../../lib/utils");
var url    = require("url");
var foxy    = require("../../");
var connect   = require("connect");
var http      = require("http");
var assert = require("chai").assert;

var ua = "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 1.1.4322)";

describe("Adding accept headers for old IE", () => {
    var req;
    beforeEach(function () {
        req = {
            url: "http://localhost:54321",
            headers: {
                "user-agent": ua
            }
        };
    });
    it("should add for homepage req", () => {
        var actual = utils.handleIe(req, null, function () {});
        assert.equal(actual.headers.accept, "text/html");
    });

    it("should not add for ignored files", () => {
        req.url = req.url + "/core.css";
        var actual = utils.handleIe(req, null, function () {});
        assert.isUndefined(actual.headers.accept);
    });
    it("e2e IE", (done) => {

        var app, server, proxy;
        var path = "/templates/page1.html";
        app    = connect();
        app.use(path, (req, res) => res.end(`
        <html>
        <head>

        </head>
        <body>
            Hi there
        </body>
        </html>
        `));
        server = http.createServer(app).listen();
        proxy = foxy(`http://localhost:${server.address().port}`, {
            rules: {
                match: /Hi there/,
                fn: match => "Browser Sync " + match
            }
        }).listen();

        var options = {
            hostname: 'localhost',
            port: proxy.address().port,
            path: path,
            method: 'GET',
            headers: {
                "user-agent": ua
            }
        };

        http.get(options, (res) => {
            res.on("data", chunk => {
                assert.include(chunk.toString(), "Browser Sync");
                done();
            });
            server.close();
        });
    })
});