var utils = require("../../lib/utils");
var assert = require("chai").assert;

describe("Rewriting Domains", () => {

    var proxyUrl = "192.168.0.4:3002";

    describe("when rewriting 'example.com' links", () => {

        var regex, fn;
        var testRegex;
        before(() => {
            var rewrite = utils.rewriteLinks({hostname: "example.com", port: 80}, proxyUrl);
            regex = rewrite.match;
            fn = rewrite.fn;
            testRegex = function (string) {
                return string.replace(regex, fn);
            };
        });

        it("should not replace domains that are not inside attribute", () => {
            var actual = testRegex("<h1>example.com</h1>");
            var expected = "<h1>example.com</h1>";
            assert.equal(expected, actual);
        });
        it("should replace CSS LINK", () => {
            var actual = testRegex("<link href='http://example.com/css/styles'>example.com</link>");
            var expected = "<link href='//192.168.0.4:3002/css/styles'>example.com</link>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (2)", () => {
            var actual = testRegex("<a href='http://example.com'></a>");
            var expected = "<a href='//192.168.0.4:3002/'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (23)", () => {
            var actual = testRegex("<a href='http://example.com/sub/dir'></a>");
            var expected = "<a href='//192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (3)", () => {
            var actual = testRegex("<a href='http://example.com/sub/dir'></a>");
            var expected = "<a href='//192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (4)", () => {
            var actual = testRegex("<a href='https://example.com/sub/dir'></a>");
            var expected = "<a href='//192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (5)", () => {
            var actual = testRegex("<a href='/example.com/sub/dir'></a>");
            var expected = "<a href='/192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (6)", () => {
            var actual = testRegex("<a href='example.com/sub/dir'></a>");
            var expected = "<a href='192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (6)", () => {
            /*jshint ignore:start*/
            var actual = testRegex('<a href="http://example.com" class="active" title="Home">Home</a><a href="http://example.com/information" class="" title="Info">Info</a>');
            var expected = '<a href="//192.168.0.4:3002/" class="active" title="Home">Home</a><a href="//192.168.0.4:3002/information" class="" title="Info">Info</a>';
            assert.equal(actual, expected);
            /*jshint ignore:end*/
        });
        it("should use the regex to replace links (7)", () => {
            var actual = testRegex("<a href='http://example.com/sub/dir/example.com/css/styles.css'></a><a href='http://example.com/sub/dir/example.com/css/styles.css'></a>");
            var expected = "<a href='//192.168.0.4:3002/sub/dir/example.com/css/styles.css'></a><a href='//192.168.0.4:3002/sub/dir/example.com/css/styles.css'></a>";
            assert.equal(actual, expected);
        });
    });
    describe("when rewriting 'localhost:8000' links", () => {

        var regex, fn;
        var testRegex;
        before(() => {
            var rewrite = utils.rewriteLinks({hostname: "localhost:8000", port: 80}, proxyUrl);
            regex = rewrite.match;
            fn = rewrite.fn;
            testRegex = function (string) {
                return string.replace(regex, fn);
            };
        });
        it("should use the regex to replace links (1)", () => {
            var actual = testRegex("<a href='http://localhost:8000'></a>");
            var expected = "<a href='//192.168.0.4:3002/'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (1)", () => {
            var actual = testRegex("<a href='http://localhost:8000'></a>");
            var expected = "<a href='//192.168.0.4:3002/'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (2)", () => {
            var actual = testRegex("<a href='http://localhost:8000/sub/dir'></a>");
            var expected = "<a href='//192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (3)", () => {
            var actual = testRegex("<a href='http://localhost:8000/sub/dir'></a>");
            var expected = "<a href='//192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (4)", () => {
            var actual = testRegex("<a href='https://localhost:8000/sub/dir'></a>");
            var expected = "<a href='//192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (5)", () => {
            var actual = testRegex("<a href='/localhost:8000/sub/dir'></a>");
            var expected = "<a href='/192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links (6)", () => {
            var actual = testRegex("<a href='localhost:8000/sub/dir'></a>");
            var expected = "<a href='//192.168.0.4:3002/sub/dir'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links that contain hashes (1)", () => {
            var actual = testRegex("<a href='http://localhost:8000/sub/dir/?search=some#shane'></a>");
            var expected = "<a href='//192.168.0.4:3002/sub/dir/?search=some#shane'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links that contain hashes (2)", () => {
            var actual = testRegex("<a href='http://localhost:8000/sub/dir/#search'></a>");
            var expected = "<a href='//192.168.0.4:3002/sub/dir/#search'></a>";
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links that contain hashes (2)", () => {
            var getBase = function (host) {
                return `
<ul class="navigation__items">
    <li class="navigation__items__page">
        <a href="${host}/careers/?number=4">« Previous</a>
    </li>
    <li class="navigation__items__page">
        <a href="${host}/careers/#search">1</a>
    </li>
    <li class="navigation__items__page">
        <a href="${host}/careers/?number=2#search">2</a>
    </li>
    <li class="navigation__items__page">
        <a href="${host}/careers/?number=3#search">3</a>
    </li>
    <li class="navigation__items__page">
        <a href="${host}/careers/?number=4#search">4</a>
    </li>
    <li class="navigation__items__page navigation__items__page--active">
        <a href="${host}/careers/?number=5#search">5</a>
    </li>
</ul>
        `;
            };
            var original = getBase("http://www.example.local.colinr.com");
            var expected = getBase("//" + proxyUrl);
            var rewrite  = utils.rewriteLinks({hostname: "www.example.local.colinr.com", port: 80}, proxyUrl);
            var actual   = original.replace(rewrite.match, rewrite.fn);
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links that contain port + ", () => {
            var input = `
<!--//<a href="http://example.com:1234/foo">Link 1</a>-->
<a href="http://example.com.gov/foo">Link 1</a>
`;
            var expected = `
<!--//<a href="//${proxyUrl}/foo">Link 1</a>-->
<a href="http://example.com.gov/foo">Link 1</a>
`;

            var rewrite  = utils.rewriteLinks({hostname: "example.com", port: 1234}, proxyUrl);
            var actual   = input.replace(rewrite.match, rewrite.fn);

            assert.equal(actual, expected);
        });
        it("should use the regex to replace links that contain port + ", () => {
            var input = `
<!doctype html>
<html><body>
<p>This is an experiment.dev</p>
<p><img src="/images/experiment.dev/example.jpg"></p>
<!-- This experiment.dev should prove interesting -->
<p><a href="http://experiment.dev/example.html">Link</a></p>
</body></html>
`;
            var expected = `
<!doctype html>
<html><body>
<p>This is an experiment.dev</p>
<p><img src="/images/experiment.dev/example.jpg"></p>
<!-- This experiment.dev should prove interesting -->
<p><a href="//${proxyUrl}/example.html">Link</a></p>
</body></html>
`;

            var rewrite  = utils.rewriteLinks({hostname: "experiment.dev"}, proxyUrl);
            var actual   = input.replace(rewrite.match, rewrite.fn);
            assert.equal(actual, expected);
        });
        it("should use the regex to replace links that contain port + ", () => {
            var input = `
<link href="/sites/default/themes/mclinic/css/styles.css" media="screen" rel="stylesheet">
`;

            var rewrite  = utils.rewriteLinks({hostname: "mclinic"}, proxyUrl);
            var actual   = input.replace(rewrite.match, rewrite.fn);
            assert.equal(actual, input);
        });
        it("should not replace when host + subdomain ", () => {
            var input = `<a href="http://assets.cdn.example.com:1234/foo">Link 1</a>`;
            var rewrite  = utils.rewriteLinks({hostname: "example.com", port: 1234}, proxyUrl);
            var actual   = input.replace(rewrite.match, rewrite.fn);
            assert.equal(actual, input);
        });
        it("should not remove trailing slash", () => {
            var input    = `<a href="http://example.com:1234/foo/">Link 1</a>`;
            var expected = `<a href="//${proxyUrl}/foo/">Link 1</a>`;
            var rewrite  = utils.rewriteLinks({hostname: "example.com", port: 1234}, proxyUrl);
            var actual   = input.replace(rewrite.match, rewrite.fn);
            assert.equal(actual, expected);
        });
    });
});
