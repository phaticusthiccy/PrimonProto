// Primon Proto
// Headless WebSocket, type-safe Whatsapp Bot
//
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can usable with mjs)
//
// Phaticusthiccy - 2022

const fs = require("fs");
const chalk = require("chalk");
const build = require("./build_lang");
const axios = require("axios")
var get_db = require("./db.json");
const { Octokit } = require("@octokit/core");
const octokit = new Octokit({
  auth: process.env.GITHUB_AUTH,
});
require("util").inspect.defaultOptions.depth = null;

var lang = get_db.language
var cont = false
if (get_db.lang_json == false) {
  if (lang == "TR") {
    var langname = "Türkçe Dili Yükleniyor..";
    cont = false
  }
  if (lang == "EN") {
    var langname = "Loading English Language..";
    cont = false
  }
}
if (get_db.lang_json !== false && typeof get_db.lang_json == "string") {
  try {
    var tst = JSON.parse(get_db.lang_json)
    cont = true
  } catch {
    if (lang == "TR") {
      console.log(chalk.red("Kişiselleştirilmiş Dil Dosyası Okunabilir Değil veya JSON hatası var!"))
      console.log("\n")
      console.log("Varsayılan Olarak Türkçe Dili Tekrar Yükleniyor..")
      cont = false
    }
    if (lang == "EN") {
      console.log(chalk.red("Personalized Language File Is Not Readable or has JSON error!"))
      console.log("\n")
      console.log("English Language Reloading by Default..")
      cont = false
    }
  }
}

if (cont == false) {
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
} else {
  if (lang == "TR") {
    fs.wwriteFileSync("./langs/PrimomIOP.json", get_db.lang_json)
    console.log("Kişiselleştirilmiş Dil Dosyası Yükleniyor..")
    var json = JSON.parse(fs.readFileSync("./langs/PrimonIOP.json"))
    var old_keys = Object.keys(require("./langs/TR.json"))
    var old_alt_keys = [];
    if (old_keys[0] !== "PRIMON" && old_keys[1] !== "STRINGS") {
      console.log(chalk.red("Kişiselleştirilmiş Dil Dosyası Okunabilir Değil veya JSON hatası var!"))
      console.log("\n")
      console.log("Varsayılan Olarak Türkçe Dili Tekrar Yükleniyor..")
      (async () => {
        var re2 = JSON.stringify(get_db, null, 2);
        var re = JSON.parse(r2)
        re.lang_json = false
        var re3 = JSON.stringify(re, null, 2)
        await octokit.request("PATCH /gists/{gist_id}", {
          gist_id: process.env.GITHUB_DB,
          description: "Primon Proto için Kalıcı Veritabanı",
          files: {
            key: {
              content: re3,
              filename: "primon.db.json",
              },
          },
        });
      })();
      var json = JSON.parse(fs.readFileSync("./langs/TR.json"));
    } else {
      old_keys = require("./langs/TR.json").STRINGS
      var w2keys = require("./langs/PrimomIOP.json").STRINGS
      var cont2 = false
      var sayac = 0
      old_keys.map((Element) => {
        if (Element !== w2keys[sayac]) {
          cont2 = false
          sayac = 0
          return;
        }
        sayac = sayac + 1
      })
      sayac = 0
      if (cont2 == false) {
        console.log(chalk.red("Kişiselleştirilmiş Dil Dosyası Okunabilir Değil veya JSON hatası var!"))
        console.log("\n")
        console.log("Varsayılan Olarak Türkçe Dili Tekrar Yükleniyor..")
        (async () => {
          var re2 = JSON.stringify(get_db, null, 2);
          var re = JSON.parse(r2)
          re.lang_json = false
          var re3 = JSON.stringify(re, null, 2)
          await octokit.request("PATCH /gists/{gist_id}", {
            gist_id: process.env.GITHUB_DB,
            description: "Primon Proto için Kalıcı Veritabanı",
            files: {
              key: {
                content: re3,
                filename: "primon.db.json",
                },
            },
          });
        })();
        var json = JSON.parse(fs.readFileSync("./langs/TR.json"));
      } else {
        var cont3 = false
        if (require("./langs/PrimonIOP.json").PRIMON.github !== "https://www.github.com/phaticusthiccy/PrimonProto") {
          cont3 = false
        }
        if (require("./langs/PrimonIOP.json").PRIMON.author !== "https://www.github.com/phaticusthiccy") {
          cont3 = false
        }
        if (cont3 == false) {
          console.log(chalk.red("Lütfen PRIMON elementinin içindeki 'github' ve 'author' kısmını değiştirmeyin!"))
          console.log("\n")
          console.log("Varsayılan Olarak Türkçe Dili Tekrar Yükleniyor..")
          (async () => {
            var re2 = JSON.stringify(get_db, null, 2);
            var re = JSON.parse(r2)
            re.lang_json = false
            var re3 = JSON.stringify(re, null, 2)
            await octokit.request("PATCH /gists/{gist_id}", {
              gist_id: process.env.GITHUB_DB,
              description: "Primon Proto için Kalıcı Veritabanı",
              files: {
                key: {
                  content: re3,
                  filename: "primon.db.json",
                  },
              },
            });
          })();
          var json = JSON.parse(fs.readFileSync("./langs/TR.json"));
        } else {
          var obj2 = Object.keys(require("./langs/TR.json").STRINGS)
          // Array ["menu", "onStart", "stop_f" ...[]]
          // Default
          var s3 = []
          obj2.map((el) => {
            s3.push(Object.keys(require("./langs/TR.json").STRINGS[el]))
          })
          s3 = s3.flat()
          // Array [Array ["menu", "owner", "star", "pp", "by"], Array ["msg"] ...[[]]]
          // Default

          var obj3 = Object.keys(require("./langs/PrimomIOP.json").STRINGS)
          // Array ["menu", "onStart", "stop_f" ...[]]
          // Personalized
          var s4 = []
          obj3.map((el) => {
            s4.push(Object.keys(require("./langs/PrimomIOP.json").STRINGS[el]))
          })
          s4 = s4.flat()
          // Array [Array ["menu", "owner", "star", "pp", "by"], Array ["msg"] ...[[]]]
          // Personalized

          var sayac2 = 0
          var cont4 = false
          s3.map((el) => {
            if (el[sayac2] !== s4[sayac2]) {
              cont4 = false
              sayac = 0
              return;
            }
            sayac = sayac + 1
          })

          if (cont4 == false) {
            console.log(chalk.red("Kişiselleştirilmiş Dil Dosyası Okunabilir Değil veya JSON hatası var! Eğer güncelleme gelmiş ise lütfen yeniden ayarlayın."))
            console.log("\n")
            console.log("Varsayılan Olarak Türkçe Dili Tekrar Yükleniyor..")
            (async () => {
              var re2 = JSON.stringify(get_db, null, 2);
              var re = JSON.parse(r2)
              re.lang_json = false
              var re3 = JSON.stringify(re, null, 2)
              await octokit.request("PATCH /gists/{gist_id}", {
                gist_id: process.env.GITHUB_DB,
                description: "Primon Proto için Kalıcı Veritabanı",
                files: {
                  key: {
                    content: re3,
                    filename: "primon.db.json",
                    },
                },
              });
            })();
            var json = JSON.parse(fs.readFileSync("./langs/TR.json"));
          } else {
            var json = JSON.parse(fs.readFileSync("./langs/PrimomIOP.json"));
            console.log("Kişiselleştirilmiş Dil Dosyası Yüklendi!")
          }
        }
      }
    }
  } else {
    fs.wwriteFileSync("./langs/PrimomIOP.json", get_db.lang_json)
    console.log("Loading Personalized Language File..")
    var json = JSON.parse(fs.readFileSync("./langs/PrimonIOP.json"))
    var old_keys = Object.keys(require("./langs/EN.json"))
    var old_alt_keys = [];
    if (old_keys[0] !== "PRIMON" && old_keys[1] !== "STRINGS") {
      console.log(chalk.red("Personalized Language File Is Not Readable or has a JSON error!"))
      console.log("\n")
      console.log("English Language Reloading by Default..")
      (async () => {
        var re2 = JSON.stringify(get_db, null, 2);
        var re = JSON.parse(r2)
        re.lang_json = false
        var re3 = JSON.stringify(re, null, 2)
        await octokit.request("PATCH /gists/{gist_id}", {
          gist_id: process.env.GITHUB_DB,
          description: "Primon Proto için Kalıcı Veritabanı",
          files: {
            key: {
              content: re3,
              filename: "primon.db.json",
              },
          },
        });
      })();
      var json = JSON.parse(fs.readFileSync("./langs/EN.json"));
    } else {
      old_keys = require("./langs/EN.json").STRINGS
      var w2keys = require("./langs/PrimomIOP.json").STRINGS
      var cont2 = false
      var sayac = 0
      old_keys.map((Element) => {
        if (Element !== w2keys[sayac]) {
          cont2 = false
          sayac = 0
          return;
        }
        sayac = sayac + 1
      })
      sayac = 0
      if (cont2 == false) {
        console.log(chalk.red("Personalized Language File Is Not Readable or has a JSON error!"))
        console.log("\n")
        console.log("English Language Reloading by Default..")
        (async () => {
          var re2 = JSON.stringify(get_db, null, 2);
          var re = JSON.parse(r2)
          re.lang_json = false
          var re3 = JSON.stringify(re, null, 2)
          await octokit.request("PATCH /gists/{gist_id}", {
            gist_id: process.env.GITHUB_DB,
            description: "Primon Proto için Kalıcı Veritabanı",
            files: {
              key: {
                content: re3,
                filename: "primon.db.json",
                },
            },
          });
        })();
        var json = JSON.parse(fs.readFileSync("./langs/EN.json"));
      } else {
        var cont3 = false
        if (require("./langs/PrimonIOP.json").PRIMON.github !== "https://www.github.com/phaticusthiccy/PrimonProto") {
          cont3 = false
        }
        if (require("./langs/PrimonIOP.json").PRIMON.author !== "https://www.github.com/phaticusthiccy") {
          cont3 = false
        }
        if (cont3 == false) {
          console.log(chalk.red("Please do not change the 'github' and 'author' part of the PRIMON element!"))
          console.log("\n")
          console.log("English Language Reloading by Default..")(async () => {
            var re2 = JSON.stringify(get_db, null, 2);
            var re = JSON.parse(r2)
            re.lang_json = false
            var re3 = JSON.stringify(re, null, 2)
            await octokit.request("PATCH /gists/{gist_id}", {
              gist_id: process.env.GITHUB_DB,
              description: "Primon Proto için Kalıcı Veritabanı",
              files: {
                key: {
                  content: re3,
                  filename: "primon.db.json",
                  },
              },
            });
          })();
          var json = JSON.parse(fs.readFileSync("./langs/EN.json"));
        } else {
          var obj2 = Object.keys(require("./langs/EN.json").STRINGS)
          // Array ["menu", "onStart", "stop_f" ...[]]
          // Default
          var s3 = []
          obj2.map((el) => {
            s3.push(Object.keys(require("./langs/EN.json").STRINGS[el]))
          })
          s3 = s3.flat()
          // Array [Array ["menu", "owner", "star", "pp", "by"], Array ["msg"] ...[[]]]
          // Default

          var obj3 = Object.keys(require("./langs/PrimomIOP.json").STRINGS)
          // Array ["menu", "onStart", "stop_f" ...[]]
          // Personalized
          var s4 = []
          obj3.map((el) => {
            s4.push(Object.keys(require("./langs/PrimomIOP.json").STRINGS[el]))
          })
          s4 = s4.flat()
          // Array [Array ["menu", "owner", "star", "pp", "by"], Array ["msg"] ...[[]]]
          // Personalized

          var sayac2 = 0
          var cont4 = false
          s3.map((el) => {
            if (el[sayac2] !== s4[sayac2]) {
              cont4 = false
              sayac = 0
              return;
            }
            sayac = sayac + 1
          })

          if (cont4 == false) {
            console.log(chalk.red("Personalized Language File Is Not Readable or has JSON error! If there is an update, please reset."))
            console.log("\n")
            console.log("English Language Reloading by Default..")
            (async () => {
              var re2 = JSON.stringify(get_db, null, 2);
              var re = JSON.parse(r2)
              re.lang_json = false
              var re3 = JSON.stringify(re, null, 2)
              await octokit.request("PATCH /gists/{gist_id}", {
                gist_id: process.env.GITHUB_DB,
                description: "Primon Proto için Kalıcı Veritabanı",
                files: {
                  key: {
                    content: re3,
                    filename: "primon.db.json",
                    },
                },
              });
            })();
            var json = JSON.parse(fs.readFileSync("./langs/EN.json"));
          } else {
            var json = JSON.parse(fs.readFileSync("./langs/PrimomIOP.json"));
            console.log("Personalized Language File Uploaded!")
          }
        }
      }
    }
  }
}


function getString(file) {
  return json["STRINGS"][file];
}

module.exports = {
  language: json,
  getString: getString,
};
