var foxy    = require("./index");
var request = require("supertest");

var config = {
    rules: {
        match: /virtual host/,
        fn: function (match) {
            return "Browser Sync " + match
        }
    }
}

var proxy = foxy("http://localhost/site1", config);

request(proxy)
    .get("/")
    .set("accept", "text/html")
    .expect(200)
    .end(function (err, res) {
        console.log(res.text);
    });

