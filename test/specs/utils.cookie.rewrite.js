var utils = require("../../lib/utils");
var assert = require("chai").assert;

describe("rewriting cookies", () => {
    it("does not strip quotes from cookies", () => {
        assert.equal(
            utils.rewriteCookies("pin-sha256=\"WoiWRyIOVNa9ihaBciRSC7XHjliYS9VwUGOIud4PB18=\"; domain=magento.dev; httponly"),
            "pin-sha256=\"WoiWRyIOVNa9ihaBciRSC7XHjliYS9VwUGOIud4PB18=\"; HttpOnly"
        );
    });
});
