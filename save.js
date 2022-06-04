// Primon Proto 
// Headless WebSocket, type-safe Whatsapp UserBot
// 
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can usable with mjs)
//
// Phaticusthiccy - 2022

const fs = require("fs")
require('util').inspect.defaultOptions.depth = null

async function save2() {
  var sn = ""
  sn = Buffer.from(process.env.SESSION + process.env.SESSION2 + process.env.SESSION3 + process.env.SESSION4, "base64").toString()
  fs.writeFileSync("./session.json", sn)
  console.log("Primon Session Updated!")
  return true
}
save2()