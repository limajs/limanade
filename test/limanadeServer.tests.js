var expect = require("expect.js");
var limanade = require("../limanade");

describe("Limanade Server", function () {
    describe("Start a standalone server", function () {
        beforeEach(function (done) {
            var port = process.env.port || 7000;
            limanade.start(port, function () {
                done();
            });
        });

        afterEach(function (done) {
            limanade.stop(function () {
                done();
            });
        });

        it("Starts up an http server on the port provided", function () {
            expect(limanade.httpServer._connectionKey).to.be("4:0.0.0.0:7000");
        });

        it("Starts up a socket server attached to the http server", function () {
            expect(limanade.socketServer.server).to.be(limanade.httpServer);
        });
    });

    describe("Attach to an existing http server which isn't using socketio", function () {
        var mockHttpServer = require("http").createServer();

        beforeEach(function () {
            limanade.attach(mockHttpServer)
        });

        it("Attaches itself to the http server provided", function () {
            expect(limanade.httpServer).to.be(mockHttpServer);
        });

        it("Starts up a socket server and attaches it to the http server", function () {
            expect(limanade.socketServer.server).to.be(mockHttpServer);
        });
    });

    describe("Attach to an existing http server and an existing socketio server", function () {
        var testHttpServer = require("http").createServer();
        var testSocketIOServer = require("socket.io").listen(testHttpServer);

        beforeEach(function () {
            limanade.attach(testHttpServer, testSocketIOServer);
        });

        it("Attaches to the http server (including its socketio 'server')", function () {
            expect(limanade.httpServer).to.be(testHttpServer);
            expect(limanade.socketServer).to.be(testSocketIOServer);
        });
    });
});
