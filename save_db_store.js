// Primon Proto
// Headless WebSocket, type-safe Whatsapp Bot
//
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES6 Module (can usable with mjs)
//
// Phaticusthiccy - 2022


const { Octokit } = require("@octokit/core");
const fs = require("fs");
const octokit = new Octokit({
  auth: process.env.GITHUB_AUTH
});
require("util").inspect.defaultOptions.depth = null;
async function save() {
  var db;
  var d = await octokit.request("GET /gists/{gist_id}", {
      gist_id: process.env.GITHUB_DB,
  })
  db = d.data.files["primon.db.json"].content;
  db = JSON.parse(db)
  return fs.writeFileSync("./db.json", JSON.stringify(db, null, 2));
}
save()