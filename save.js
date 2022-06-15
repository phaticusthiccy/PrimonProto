// Primon Proto
// Headless WebSocket, type-safe Whatsapp Bot
//
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can usable with mjs)
//
// Phaticusthiccy - 2022

const fs = require("fs");
require("util").inspect.defaultOptions.depth = null;
var shell = require("shelljs");
var sn = "";
var name = Buffer.from(process.env.SESSION5, "base64").toString();
var sn3 = name.split("&&&&&&&");
var sn4 = [];
sn3.map((Element) => {
  if (Element !== "" || Element !== " ") {
    sn4.push(Element);
  }
});

var sayac = 0;
sn = Buffer.from(
  process.env.SESSION +
    process.env.SESSION2 +
    process.env.SESSION3 +
    process.env.SESSION4,
  "base64"
).toString();
var sn2 = sn.split("&&&&&&&");
sn2.map((Element2) => {
  if (Element2 !== "" || Element2 !== " ") {
    var name = "session_record/" + sn4[sayac]
    if (name !== "session_record/" || name !== "session_record/ " || name !== "session_record/\n") {
      fs.writeFileSync(name, Element2);
    }
  }
  sayac += 1;
});
shell.exec("ls && cd session_record && ls")
console.log("Primon Session Updated!");
try {
  fs.unlinkSync("./session_record/test.txt");
} catch {}