var expect = require("expect.js");
var rewire = require("rewire");
var browserManager = rewire("../browserManager");
var child_process = {};
browserManager.__set__('child_process', child_process);

describe("Browser Manager", function () {
    describe("When open is called with an array of browser names", function () {

        it("Spawns the correct child processes");

    });
});
