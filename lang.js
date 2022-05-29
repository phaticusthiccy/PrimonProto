// Primon Proto
// Headless WebSocket, type-safe Whatsapp UserBot
//
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can ysable with mjs)
//
// Phaticusthiccy - 2022

const fs = require("fs");
const chalk = require("chalk");
const build = require("./build_lang");
var { get_db } = require("./add");
require("util").inspect.defaultOptions.depth = null;

var lang = get_db.language.toUpperCase();

if (lang == "TR") {
  var langname = "Türkçe Dili Yükleniyor..";
}
if (lang == "EN") {
  var langname = "Loading English Language..";
}

if (fs.existsSync(`./langs/${lang}.json`)) {
  console.log(chalk.green.bold(langname));

  var json = JSON.parse(fs.readFileSync(`./langs/${lang}.json`));
} else {
  console.log(
    chalk.red.bold(
      "Invalid Language Selected! Primon Will Rebuild The Language Data"
    )
  );
  var json = JSON.parse(fs.readFileSync("./langs/EN.json"));
  console.log(chalk.green.bold("Loaded EN Language!"));
}

function getString(file) {
  return json["STRINGS"][file];
}

module.exports = {
  language: json,
  getString: getString,
};
