// Primon Proto 
// Headless WebSocket, type-safe Whatsapp UserBot
// 
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can ysable with mjs)
//
// Phaticusthiccy - 2022

const fs = require("fs")
require('util').inspect.defaultOptions.depth = null

var SN = process.env.SESSION
async function save(st) {
  var sn = ""
  sn = Buffer.from(st, "base64").toString()
  fs.writeFileSync("session.json", sn)
  console.log("Primon Session Updated!")
  return true
}
save(SN)
