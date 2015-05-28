var mtime = require("microtime");
var utils = require("./lib/utils");
var rewrite = utils.rewriteLinks({hostname: "localhost", port: 8181}, '192.168.0.9:3000');
regex = rewrite.match;

fn = rewrite.fn;

var input = require("fs").readFileSync("./test/fixtures/index2.html", "utf-8");

var start = mtime.now();
console.time('regex');
var output = input.replace(regex, fn);
var end = mtime.now();
console.timeEnd('regex');
console.log(end - start);
console.log(output.indexOf('localhost:8181'));




