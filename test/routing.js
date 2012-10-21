var expect = require('expect.js');
var rewire = require('rewire');
var limanade = rewire('../index');
var events = require('events');
var path = require('path');
var server = new events.EventEmitter();
var io = {
    of: function () {
        return {
            on: function () {
            }
        };
    }
};
var mockfs = {};
limanade.__set__('fs', mockfs);

limanade(server, io, {specDir: '.'});

describe("Limanade routes", function () {
    describe("Url '/specrunner'", function () {
        it("Renders the specrunner.html page from the limanade directory", function (done) {
            var req = {
                url: '/specrunner'
            };

            var res = {
                end: function (body) {
                    expect(body.toString()).to.be('Specrunner File Contents');
                    done();
                }
            };

            mockfs.readFile = function (filename, callback) {
                var expectedFilename = path.join(process.cwd(), 'specrunner.html');
                expect(filename).to.be(expectedFilename);
                callback(null, 'Specrunner File Contents');
            };

            server.emit('request', req, res);
        });
    });

    describe("Url '/specrunner/modules/mocha.js'", function () {
        it("Returns mocha.js from node_modules directory", function (done) {
            var req = {
                url: '/specrunner/modules/mocha.js'
            };

            var res = {
                end: function (body) {
                    expect(body.toString()).to.be('MochaJSFile');
                    done();
                }
            };

            mockfs.readFile = function (filename, callback) {
                var expectedFilename = path.join(process.cwd(), 'node_modules/mocha/mocha.js');
                expect(filename).to.be(expectedFilename);
                callback(null, 'MochaJSFile');
            };


            server.emit('request', req, res);
        });
    });

    describe("Url '/specrunner/modules/mocha.css'", function () {
        it("Returns mocha.css from node_modules directory", function (done) {
            var req = {
                url: '/specrunner/modules/mocha.css'
            };

            var res = {
                end: function (body) {
                    expect(body.toString()).to.be('MochaCSSFile');
                    done();
                }
            };

            mockfs.readFile = function (filename, callback) {
                var expectedFilename = path.join(process.cwd(), 'node_modules/mocha/mocha.css');
                expect(filename).to.be(expectedFilename);
                callback(null, 'MochaCSSFile');
            };

            server.emit('request', req, res);
        });
    });

    describe("Url '/specrunner/modules/require.js'", function () {
        it("Returns require.js from the limanade directory", function (done) {
            var req = {
                url: '/specrunner/modules/require.js'
            };

            var res = {
                end: function (body) {
                    expect(body.toString()).to.be('RequireJSFile');
                    done();
                }
            };

            mockfs.readFile = function (filename, callback) {
                var expectedFilename = path.join(process.cwd(), 'require.js');
                expect(filename).to.be(expectedFilename);
                callback(null, 'RequireJSFile');
            };

            server.emit('request', req, res);
        });
    });
    describe("Url '/specrunner/modules/expect.js'", function () {
        it("Returns expect.js from the limanade directory", function (done) {
            var req = {
                url: '/specrunner/modules/expect.js'
            };

            var res = {
                end: function (body) {
                    expect(body.toString()).to.be('ExpectJSFile');
                    done();
                }
            };

            mockfs.readFile = function (filename, callback) {
                var expectedFilename = path.join(process.cwd(), 'expect.js');
                expect(filename).to.be(expectedFilename);
                callback(null, 'ExpectJSFile');
            };

            server.emit('request', req, res);
        });
    });


    describe("Requests for specs/", function () {
        it("Returns appropriate module from the client specs directory", function (done) {
            var req = {
                url: '/specs/featureone.js'
            };

            var res = {
                end: function (body) {
                    expect(res.statusCode).to.be(200);
                    expect(body.toString()).to.be('Dummy Spec One');
                    done();
                }
            };

            mockfs.readFile = function (filename, callback) {
                var expectedFilename = path.join('specs/featureone.js');
                expect(filename).to.be(expectedFilename);
                callback(null, 'Dummy Spec One');
            };

            server.emit('request', req, res);
        });
    });
});
