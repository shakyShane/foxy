var foxy  = require("../../../index");
var http  = require("http");
var sinon = require("sinon");

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
        proxy = foxy("http://localhost:9898", config).app.listen();

        var options = {
            hostname: "localhost",
            port: proxy.address().port,
            path: path,
            method: "GET",
            headers: {
                accept: "text/html"
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

