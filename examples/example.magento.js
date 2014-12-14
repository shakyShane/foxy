var foxy = require("./../index");
var http = require("http");

var config = {
    rules: [
        {
            match: new RegExp("Home Page", "g"),
            fn: function () {
                return "This Home Page rocks"
            }
        }
    ]
};

var proxy     = foxy("http://magento.dev", config).listen(8181);


console.log("http://localhost:8181");

http.get("http://localhost:8181/customer/account", function (res) {
    console.log(res.headers["location"]);
    res.on("data", function (chunk) {
        console.log(chunk.toString());
    });
});