// Primon Proto 
// Headless WebSocket, type-safe Whatsapp Bot
// 
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can usable with mjs)
//
// Phaticusthiccy - 2022


const fs = require("fs")
require('util').inspect.defaultOptions.depth = null

async function save2() {
  var sn = ""
  var name = Buffer.from(process.env.SESSION5, "base64").toString()
  var sn3 = name.split("&&&&&&&")
  var sn4 = []
  sn3.map((Element) => {
    if (Element !== "" || Element !== " ") {
      sn4.push(Element)
    } 
  })
  var sayac = 0
  sn = Buffer.from(process.env.SESSION + process.env.SESSION2 + process.env.SESSION3 + process.env.SESSION4, "base64").toString()
  var sn2 = sn.split("&&&&&&&")
  sn2.map((Element) => {
    if (Element !== "" || Element !== " ") {
      fs.writeFileSync("session/" + sn4[sayac], Element)
    }
    sayac = sayac + 1
  })
  console.log("Primon Session Updated!")
  try {
    fs.unlinkSync("./session/test.txt")
  } catch {}
  return true
}
save2()