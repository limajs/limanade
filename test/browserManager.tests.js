var expect = require("expect.js");
var rewire = require("rewire");
var sinon = require("sinon");
var browserManager = rewire("../browserManager");
var child_process = {
    spawn: function (){}
};

browserManager.__set__('child_process', child_process);
browserManager.__set__('getPlatform', function () {
    return 'darwin';
});

describe("Browser Manager", function () {
    describe("When open is called with a browser name", function () {
        it("Spawns the correct child process", function () {
            sinon.spy(child_process, "spawn");
            browserManager.open('chrome');

            sinon.assert.calledWith(child_process.spawn, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
        });
    });
});
