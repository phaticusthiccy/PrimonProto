const fs = require("fs")
require('util').inspect.defaultOptions.depth = null

var SN = process.env.SESSION
async function save(st) {
  var sn = ""
  sn = Buffer.from(st, "base64").toString()
  fs.writeFileSync("session.json", sn)
  return true
}
save(SN)
