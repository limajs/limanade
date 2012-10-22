var fs = require('fs');
var path = require('path');
var specFinder = require('./specFinder');
var specDir;
var reporter;

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
        renderFile(specDir, req.url, res);
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

function socketHandler (socket) {
    specFinder(specDir, function (specs) {
        if(specs.length > 0){
            socket.emit('speclist', specs );
        } else {
            socket.emit('nospecs', null);
        }
    });

    socket.on('specs_starting', function (data) {
        console.log("Execution of Specs is Starting");
    });

    socket.on('suite', function (suite) {
        console.log("Suite:", reporter);
        reporter.log("Suite", suite);
    });

    socket.on('test_end', function (test) {
        console.log("Test End", test);
    });
}

var limanade = function (server, io, opts) {
    console.log("Limanade Starting");
    //Needs Tests!!!!!
    var options = opts || {};
    specDir = options.specDir || process.cwd();
    reporter = options.reporter || require('./reporters/basicReporter');
    console.log("Using Reporter:", reporter);
    server.on('request', httpHandler);
    var specRunnerSocket = io.of('/specrunner');
    specRunnerSocket.on('connection', socketHandler);
};

module.exports = limanade;
