var child_process = require("child_process");

var browserManager = {};

var localAppDataDirectory = process.env.LOCALAPPDATA;
var browserProcessHash = {
    "darwin": {
        "chrome": {
            "process": "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        }
    },
    "win32": {
        "chrome": {
            "process":  localAppDataDirectory + "\\google\\chrome\\application\\chrome.exe"
        }
    }
};

function getPlatform () {
    return process.platform;
}

browserManager.open = function (browserName) {
    var platform = getPlatform();
    var browserProcess = browserProcessHash[platform][browserName].process;
    child_process.spawn(browserProcess);
};

module.exports = browserManager;
