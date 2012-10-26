var child_process = require("child_process");
var path = require("path");

var browserManager = {};

var localAppDataDirectory = process.env.LOCALAPPDATA;
var browserProcessHash = {
    "darwin": {
        "chrome": {
            "process": function () {
                return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
            },
            "args": function () {
                return [
                    '--no-default-browser-check',
                    '--no-first-run',
                    '--disable-default-apps',
                    '--user-data-dir=' + getTempDirectory()
                ];
            }
        }
    },
    "win32": {
        "chrome": {
            "process":  function () {
                return localAppDataDirectory + "\\google\\chrome\\application\\chrome.exe";
            },
            "args": function () {
                return [];
            }
        }
    }
};

function getPlatform () {
    return process.platform;
}

function getTempDirectory () {
    return path.normalize((process.env.TMPDIR || '/tmp') + '/limanade');
}

browserManager.open = function (browserName, port) {
    var platform = getPlatform();
    var browserProcess = browserProcessHash[platform][browserName].process();
    var args = browserProcessHash[platform][browserName].args();
    args.push("http://localhost:" + port + "/specrunner");
        child_process.spawn(browserProcess, args);
};

module.exports = browserManager;
