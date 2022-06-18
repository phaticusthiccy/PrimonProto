var fs = require("fs");
var shell = require("shelljs");

var modules = [];
Object.keys(require("./package.json").dependencies).forEach((Element) => {
    shell.exec("npm i" + Element)
})