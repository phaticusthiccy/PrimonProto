const { Octokit } = require("@octokit/core");
const fs = require("fs");
const octokit = new Octokit({
  auth: process.env.GITHUB_AUTH,
});
require("util").inspect.defaultOptions.depth = null;
function save() {
  var db;
  octokit
    .request("GET /gists/{gist_id}", {
      gist_id: process.env.GITHUB_DB,
    })
    .then(async (d) => {
      db = d.data.files["primon.db.json"].content;
    });
}
save()