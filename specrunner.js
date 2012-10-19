#! /usr/bin/env node

var args = process.argv.slice(2);

var http = require("http");
var limanade = require("./index");
var server = http.createServer();
var io = require("socket.io").listen(server);

limanade(server, io, {
    specDir: args[0]
});
server.listen(8000);
console.log("Limanade started");

var child_process = require("child_process");

var browserProcess;
var browserExePath = process.env['LOCALAPPDATA'] + "\\google\\chrome\\application\\chrome.exe";
child_process.spawn(browserExePath, ['http://localhost:8000/specrunner', '-incognito']);
