"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
var process_1 = require("process");
try {
    (0, child_process_1.execFileSync)("./railway", process.argv.slice(2), {
        stdio: "inherit"
    });
}
catch (e) {
    (0, process_1.exit)(1);
}
