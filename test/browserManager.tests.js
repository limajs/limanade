var expect = require("expect.js");
var rewire = require("rewire");
var sinon = require("sinon");
var browserManager = rewire("../browserManager");
var child_process = {
    spawn: function (){}
};
sinon.spy(child_process, "spawn");
var currentPlatform;

browserManager.__set__('child_process', child_process);
browserManager.__set__('getPlatform', function () {
    return currentPlatform;
});
browserManager.__set__('localAppDataDirectory', "C:\\Windows\\MyAppDataDir");

describe("Browser Manager", function () {
    describe("On a Mac, when open is called with browsername 'chrome'", function () {
        afterEach(function () {
            child_process.spawn.reset();
        });

        it("Spawns the correct child process", function () {
            currentPlatform = 'darwin';
            browserManager.open('chrome');

            sinon.assert.calledWith(child_process.spawn, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
        });
    });
});
