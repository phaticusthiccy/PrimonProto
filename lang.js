// Primon Proto 
// Headless WebSocket, type-safe Whatsapp UserBot
// 
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can ysable with mjs)
//
// Phaticusthiccy - 2022

const fs = require("fs");
const chalk = require("chalk");
const build = require("./build_lang")

var lang = process.env.LANG.toUpperCase();
var langname =
  lang == "EN" ? "Loading English Language.." : "Türkçe Dili Yükleniyor..";

if (fs.existsSync(`./langs/${lang}.json`)) {
  console.log(chalk.green.bold(langname));

  var json = JSON.parse(fs.readFileSync(`./langs/${lang}.json`));
} else {
  console.log(
    chalk.red.bold(
      "Invalid Language Selected! Primon Will Rebuild The Language Data"
    )
  );
  console.log(
    chalk.red.bold(
      "This May Take A While. Please Wait For The Finish Message!"
    )
  );
  new build(process.env.LANG.toLocaleLowerCase()).build_lang()
  var json = JSON.parse(fs.readFileSync("./langs/" + process.env.LANG.toLocaleLowerCase() + ".json"));
  console.log(chalk.green.bold("Loaded " + process.env.LANG.toLocaleLowerCase() + " Language!"))
}

function getString(file) {
  return json["STRINGS"][file];
}

module.exports = {
  language: json,
  getString: getString,
};
