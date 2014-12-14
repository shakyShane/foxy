var foxy      = require("./index");
var proxy     = foxy("http://magento.dev").listen(8181);

console.log("http://localhost:8181");