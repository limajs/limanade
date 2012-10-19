var fs = require('fs');
var path = require('path');
var specFinder = require('./specFinder');

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

function socketHandler (socket) {
    specFinder(function (specs) {
        if(specs.length > 0){
            socket.send('speclist', specs);
        } else {
            socket.send('nospecs', null);
        }
    });
}

var limanade = function (server, io) {
    server.on('request', httpHandler);
    var specRunnerSocket = io.of('/specrunner');
    specRunnerSocket.on('connection', socketHandler);
};

module.exports = limanade;
