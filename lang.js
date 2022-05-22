const fs = require("fs");
const chalk = require("chalk");

var lang = process.env.LANG.toUpperCase();
var langname =
  lang == "EN" ? "Loading English Language.." : "Türkçe Dili Yükleniyor..";

if (fs.existsSync(`./langs/${lang}.json`)) {
  console.log(chalk.green.bold(langname));

  var json = JSON.parse(fs.readFileSync(`./langs/${lang}.json`));
} else {
  console.log(
    chalk.red.bold(
      "You entered an invalid language. English language was chosen."
    )
  );

  var json = JSON.parse(fs.readFileSync("./langs/EN.json"));
}

function getString(file) {
  return json["STRINGS"][file];
}

module.exports = {
  language: json,
  getString: getString,
};
