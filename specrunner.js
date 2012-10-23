#! /usr/bin/env node

var port = 8001;
var args = process.argv.slice(2);
var http = require("http");
var limanade = require("./index");
var server = http.createServer();
var io = require("socket.io").listen(server);
//io.set('log level', 2);

limanade(server, io, {
    reporter: 'spec'
});
server.listen(port);

var child_process = require("child_process");

var browserProcess;
var browserExePath;
if (process.platform === 'win32') {
    browserExePath = process.env.LOCALAPPDATA + "\\google\\chrome\\application\\chrome.exe";
    browserProcess = child_process.spawn(browserExePath, [
        'http://localhost:' + port + '/specrunner',
        '-incognito'
    ]);
} else {
    browserExePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    browserProcess = child_process.spawn(browserExePath, [
        'http://localhost:' + port + '/specrunner',
        '--no-default-browser-check',
        '--no-first-run',
        '--disable-default-apps',
        '--user-data-dir=' + __dirname + '/googletmp'
    ]);
    browserProcess.stdout.on('data', function (data) {
        console.log(data);
    });
    browserProcess.stderr.on('data', function (data) {
        console.log("Error:", data.toString());
    });
}
