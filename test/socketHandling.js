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
        it("responds with a list of all specs to run", function (done) {
            var clientSocket = {
                send: function (msg, data) {
                    expect(msg).to.be('speclist');
                    expect(data[0]).to.be('specone');
                    expect(data[1]).to.be('spectwo');
                    done();
                }
            };

            limanade.__set__('findClientSpecs', function (callback) {
                callback(['specone', 'spectwo']);
            });

            specRunnerSocket.emit('connection', clientSocket);
        });
    });
});
