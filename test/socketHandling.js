var expect = require('expect.js');
var rewire = require('rewire');
var limanade = rewire('../index');
var events = require('events');
var server = new events.EventEmitter();
var specRunnerSocket = new events.EventEmitter();
var io = {
    of: function (name) {
        return specRunnerSocket;
    }
};

limanade(server, io);


describe("Socket Handling", function () {

    describe("On Connection", function () {

        describe("Given that there are client-side specs to run", function () {

            beforeEach(function () {
                limanade.__set__('specFinder', function (workingDir, callback) {
                    callback(['specone', 'spectwo']);
                });
            });

            it("responds with a socket message to the client providing a list of all specs to run", function (done) {
                var clientSocket = {
                    emit: function (msg, data) {
                        expect(msg).to.be('speclist');
                        expect(data[0]).to.be('specone');
                        expect(data[1]).to.be('spectwo');
                        done();
                    },
                    on: function () {}
                };

                specRunnerSocket.emit('connection', clientSocket);
            });
        });

        describe("Given no specs are found", function () {

            beforeEach(function () {
                limanade.__set__('specFinder', function (workingDir, callback) {
                    callback([]);
                });
            });

            it("responds with a 'no specs to run' socket message", function (done) {
                var clientSocket = {
                    emit: function (msg, data) {
                        expect(msg).to.be('nospecs');
                        expect(data).to.be(null);
                        done();
                    },
                    on: function () {}
                };

                specRunnerSocket.emit('connection', clientSocket);
            });
        });
    });
});
