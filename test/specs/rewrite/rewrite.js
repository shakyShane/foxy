var assert      = require("chai").assert;
var request     = require("supertest");
var connect     = require("connect");
var http        = require("http");
var multi       = require("multiline");
var foxy        = require("../../../");
var getUrl      = require("./helpers").getUrl;
var expectedUrl = require("./helpers").expectedUrl;

describe("rewrite links", function(){

    var base, app, server, serverUrl;

    before(function (done) {
        base = multi.stripIndent(function () {/*
         <html>
         <a href="URL"></a>
         </html>
         */});
        app       = connect();
        server    = http.createServer(app).listen();
        serverUrl = getUrl(server.address().port);
        app.use("/links.html", function (req, res) {
            res.end(base.replace("URL", serverUrl));
        });
        done();
    });
    after(function () {
        server.close();
    });
    it("http://localhost:", function (done) {
        request(foxy(serverUrl))
            .get("/links.html")
            .set("accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.equal(res.text, expectedUrl(base, res.req._headers.host));
                done();
            });
    });
});