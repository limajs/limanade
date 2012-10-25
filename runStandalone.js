var limanade = require("./limanade");
var browserManager = require("./browserManager");

limanade.start(8000, function () {
    console.log("Limanade Standalone Started");
    //will eventually be passed in as command-line args
    browserManager.open('chrome');
});
