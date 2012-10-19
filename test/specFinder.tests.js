var expect = require('expect.js');
var rewire = require('rewire');
var specFinder = rewire('../specFinder');

describe("Spec Finder", function () {
    describe("When called", function () {
        it("Returns an array of client-side spec module names", function (done) {
            var mockGlob = function (pattern, options, callback) {
                expect(pattern).to.be("specs/**/*.js");
                callback(null, ['specs/specone.js', 'specs/subdir/spectwo.js']);
            };
            specFinder.__set__('glob', mockGlob);
            var onComplete = function (specs) {
                expect(specs[0]).to.be('specs/specone');
                expect(specs[1]).to.be('specs/subdir/spectwo');
                done();
            };

            specFinder(onComplete);
        });
    });
});
