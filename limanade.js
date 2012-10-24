var limanade = {};

limanade.start = function (port, callback) {
    limanade.httpServer = require("http").createServer();
    limanade.httpServer.listen(port, function () {
        limanade.socketServer = require("socket.io").listen(limanade.httpServer);
        callback();
    });
};

limanade.attach = function (httpServer, socketIOServer) {
    limanade.httpServer = httpServer;
    if (socketIOServer) {
        limanade.socketServer = socketIOServer;
    } else {
        limanade.socketServer = require("socket.io").listen(limanade.httpServer);
    }
};

limanade.stop = function (callback) {
    limanade.httpServer.close(callback);
};

module.exports = limanade;
