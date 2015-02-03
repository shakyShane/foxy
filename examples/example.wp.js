var foxy      = require("./../index");
var request   = require("supertest");
var connect   = require("connect");
var http      = require("http");

var proxy = foxy("http://wordpress.dev", {
    whitelist: ["/wp-admin/admin-ajax.php"]
});

var server = proxy.listen(8181);
