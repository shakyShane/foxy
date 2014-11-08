var foxy = require("./index");

var proxy = foxy.init("http://localhost/site1").listen(8002,function () {
    console.log("Foxy running at http://localhost:" + proxy.address().port);
});