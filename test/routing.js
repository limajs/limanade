var expect = require('expect.js');
var limanade = require('../index');
var events = require('events');
var server = new events.EventEmitter();
var io = {
    of: function () {
        return {
            on: function () {
            }
        };
    }
};

limanade(server, io, {specDir: '.'});

describe("Limanade routes", function () {
    describe("Url '/specrunner'", function () {
        it("Renders the specrunner.html page", function (done) {
            var req = {
                url: '/specrunner'
            };

            var res = {
                end: function (body) {
                    expect(body.toString()).to.contain('Limanade Spec Runner');
                    done();
                }
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
                    expect(body.toString()).to.contain('exports = module.exports = Mocha');
                    done();
                }
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
                    expect(body.toString()).to.contain('RequireJS');
                    done();
                }
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
                    expect(body.toString()).to.contain('Loaded Dummy Spec One');
                    done();
                }
            };

            server.emit('request', req, res);
        });
    });
});
