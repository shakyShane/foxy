var assert      = require("chai").assert;
var request     = require("supertest");
var connect     = require("connect");
var http        = require("http");
var foxy        = require("../../../");
var getUrl      = require("./helpers").getUrl;

var getbase = function (url) {
    return `
<html>
    <a href="${url}/some/long/path?hi=there"></a>
</html>
    `;
};

describe("rewrite paths", () => {

    var app, server, serverUrl;

    before(done => {
        app       = connect();
        server    = http.createServer(app).listen();
        serverUrl = getUrl(server.address().port);
        app.use("/links.html", (req, res) => res.end(getbase(serverUrl)));
        done();
    });

    after(() => server.close());

    it("http://localhost:", done => {
        request(foxy(serverUrl))
            .get("/links.html")
            .set("accept", "text/html")
            .expect(200)
            .end((err, res) => {
                assert.equal(res.text, getbase("//" + res.req._headers.host));
                done();
            });
    });
});
