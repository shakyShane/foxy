var foxy = require("./index");

var opts = {
    protocol: "http://",
    host: "127.0.0.1",
    port: 5000,
    target: "http://127.0.0.1:5000"
};

var proxy = foxy.init(opts).listen(function () {
    console.log("Foxy running at http://localhost:" + proxy.address().port);
});