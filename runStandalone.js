var limanade = require("./limanade");
var browserManager = require("./browserManager");

limanade.start(8000, function () {
    console.log("Limanade Standalone Started");

    browserManager.open('chrome', 8000);
});
