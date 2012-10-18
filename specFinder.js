var glob = require('glob');
var specFinder = function (pattern, callback) {
    var options = {};
    glob(pattern, options, function (err, files) {
        var modulePaths = files.map(function (file) {
            return file.slice(0, -3);
        })
        callback(modulePaths);
    });
};

module.exports = specFinder;
