var fs = require('fs');
var path = require('path');
var specFinder = require('./specFinder');
var options;
var events = require('events');

function httpHandler (req, res) {
    if (req.url === '/specrunner') {
        renderFile(__dirname, 'specrunner.html', res);
    } else if (req.url === '/specrunner/modules/mocha.js') {
        renderFile(__dirname, 'node_modules/mocha/mocha.js', res);
    } else if (req.url === '/specrunner/modules/mocha.css') {
        renderFile(__dirname, 'node_modules/mocha/mocha.css', res);
    } else if (req.url === '/specrunner/modules/require.js') {
        renderFile(__dirname, 'require.js', res);
    } else if (req.url === '/specrunner/modules/expect.js') {
        renderFile(__dirname, 'node_modules/expect.js/expect.js', res);
    } else if (req.url.substring(0,7) === '/specs/') {
        renderFile(options.specDir, req.url, res);
    }
}

function renderFile (dirName, filePath, res) {
    fs.readFile(path.join(dirName, filePath), function (err, data) {
        if (err) {
            console.log(err);
            res.statusCode = 404;
            res.end();
        }
        res.statusCode = 200;
        res.end(data);
    });
}

function getFromDto(dto) {
    dto.slow = function () {
        return this._slow;
    };
    dto.fullTitle = function () {
        return this.title;
    }
    return dto;
}

function socketHandler (socket) {
    var runner = new events.EventEmitter();

    var reporterType = require('./node_modules/mocha/lib/reporters/' + options.reporter);
    var reporter = new reporterType(runner);

    specFinder(options.specDir, function (specs) {
        if(specs.length > 0){
            socket.emit('speclist', specs );
        } else {
            socket.emit('nospecs', null);
        }
    });

    socket.on('start', function () {
        runner.emit('start');
    });

    socket.on('suite', function (suite) {
        runner.emit("suite", getFromDto(suite));
    });

    socket.on('test', function (test) {
        runner.emit('test', getFromDto(test));
    });

    socket.on('pass', function (test) {
        runner.emit('pass', getFromDto(test));
    });

    socket.on('pending', function (test) {
        runner.emit('pending', getFromDto(test));
    });

    socket.on('fail', function (test) {
        runner.emit('fail', getFromDto(test), test.errorObject);
    });

    socket.on('test end', function (test) {
        runner.emit("test end", getFromDto(test));
    });

    socket.on('suite end', function (suite) {
        runner.emit('suite end', getFromDto(suite));
    });

    socket.on('end', function (totalNumberOfTests) {
        runner.total = totalNumberOfTests;
        runner.emit('end');
    });
}

var limanade = function (server, io, opts) {
    //Needs Tests!!!!!
    options = opts || {};
    options.specDir = options.specDir || process.cwd();
    options.reporter = options.reporter || 'dot';
    server.on('request', httpHandler);
    var specRunnerSocket = io.of('/specrunner');
    specRunnerSocket.on('connection', socketHandler);
};

module.exports = limanade;
