var assert      = require("chai").assert;
var request     = require("supertest");
var connect     = require("connect");
var http        = require("http");
var foxy        = require("../../../");
var getUrl      = require("./helpers").getUrl;

var getbase = function (url) {
    return `
<img class="feature-banner__img lazyload"
src="${url}/v2/wp-content/uploads/2013/11/banner-402x134.jpg"
data-sizes="auto"
data-srcset="${url}/v2/wp-content/uploads/2013/11/ride-banner-402x134.jpg 402w,
${url}/v2/wp-content/uploads/2013/11/ride-banner-960x320.jpg
${url}/v2/wp-content/uploads/2013/11/ride-banner-1920x640.jpg 1920w
" alt="">`;
};

describe("Responsive images solution", function(){

    var app, server, serverUrl;

    before(done => {

        app       = connect();
        server    = http.createServer(app).listen();
        serverUrl = getUrl(server.address().port);
        app.use("/links.html", (req, res) => res.end(getbase(serverUrl)));
        done();
    });

    after(() => server.close());

    it("should rewrite multiple sources", function (done) {
        request(foxy(serverUrl).app)
            .get("/links.html")
            .set("accept", "text/html")
            .expect(200)
            .end((err, res) => {
                assert.equal(res.text, getbase("//" + res.req._headers.host));
                done();
            });
    });
});
