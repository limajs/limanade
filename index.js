var fs = require('fs');
var path = require('path');

function httpHandler (req, res) {
    if (req.url === '/specrunner') {
        renderFile('specrunner.html', res);
    } else if (req.url === '/specrunner/modules/mocha.js') {
        renderFile('node_modules/mocha/mocha.js', res);
    }
}

function renderFile (filePath, res) {
    fs.readFile(path.join(__dirname, filePath), function (err, data) {
        if (err) {
            console.log(err);
            res.statusCode = 404;
            res.end();
        }
        res.end(data);
    });
}

function findClientSpecs (callback) {
    callback (['specone', 'spectwo']);
}

function socketHandler (socket) {
    console.log('SpecRunner Socket Connection Recvd');
    findClientSpecs(function (specs) {
        socket.send('speclist', specs);
    });
}

var limanade = function (server, io) {
    server.on('request', httpHandler);
    var specRunnerSocket = io.of('/specrunner');
    specRunnerSocket.on('connection', socketHandler);
};

module.exports = limanade;
