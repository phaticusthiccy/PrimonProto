// Primon Proto
// Headless WebSocket, type-safe Whatsapp UserBot
//
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can ysable with mjs)
//
// Phaticusthiccy - 2022

const {
  default: makeWASocket,
  MessageType,
  MessageOptions,
  Mimetype,
  useSingleFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  makeInMemoryStore,
  jidDecode,
  proto,
  AnyMediaMessageContent,
} = require("@adiwajshing/baileys");
const ffmpeg = require("fluent-ffmpeg");
const P = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
var axios = require("axios");
const { on } = require("events");
require("util").inspect.defaultOptions.depth = null;
const Language = require("./lang");
const MenuLang = Language.getString("menu");
const sessionlang = Language.getString("session");
const taglang = Language.getString("tagall");
const modulelang = Language.getString("module");
const cmdlang = Language.getString("cmd");
const pinglang = Language.getString("ping");
const goodbyelang = Language.getString("goodbye");
const welcomelang = Language.getString("welcome");
const startlang = Language.getString("onStart");
const openapi = require("@phaticusthiccy/open-apis");
const config = require("./config_proto");
const { Octokit } = require("@octokit/core");
const shell = require('shelljs');
const { MessageRetryHandler } = require("./ret");

const msgRetryCounterMap = {};

const handler = new MessageRetryHandler();

const {
  dictEmojis,
  textpro_links,
  argfinder,
  bademojis,
  afterarg,
  String,
  react,
} = require("./add");

const get_db = require("./db.json")
var GITHUB_DB = process.env.GITHUB_DB == false ? false : process.env.GITHUB_DB;
var GITHUB_AUTH =
  process.env.GITHUB_AUTH == false ? false : process.env.GITHUB_AUTH;

if (GITHUB_DB == false) {
  console.log("Please Set GITHUB_DB Token!");
  process.exit();
}

if (GITHUB_AUTH !== false) {
  var octokit = new Octokit({
    auth: GITHUB_AUTH,
  });
} else {
  console.log("Please Set GITHUB_AUTH Token!");
  process.exit();
}

var PrimonDB = get_db;

setInterval(async () => {
  var sh1 = shell.exec("node ./save_db_store.js")
  PrimonDB = JSON.parse(fs.readFileSync("./db.json"))
}, 5000);
// Save DB every 5 second
// 1min = 12 auth
// 10 min = 120 auth
// 1 hour = 720 auth // Reaming 4280 auth per hour

var c_num_cnt = 0;
function cmds(text, arguments = 3, cmd) {
  let payload;
  if (arguments == 3) {
    payload = text
      .replace("{%d1}", cmdlang.command)
      .replace("{%d1}", cmdlang.info)
      .replace("{%d1}", cmdlang.example)
      .replace(/{%c}/gi, cmd);
  } else if (arguments == 4) {
    payload = text
      .replace("{%d1}", cmdlang.command)
      .replace("{%d1}", cmdlang.info)
      .replace("{%d1}", cmdlang.example)
      .replace("{%d1}", cmdlang.danger)
      .replace(/{%c}/gi, cmd);
  } else {
    payload = text
      .replace("{%d1}", cmdlang.command)
      .replace("{%d1}", cmdlang.info)
      .replace("{%d1}", cmdlang.example)
      .replace(/{%c}/gi, cmd);
  }
  return payload;
}

const { state, saveState } = useSingleFileAuthState("./session.json");

const store = makeInMemoryStore({
  logger: P().child({
    level: PrimonDB.debug === true ? "trace" : "silent",
    stream: "store",
  }),
});

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function test_diff(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

const ytdl = async (link, downloadFolder) => {
  try {
    var h = await axios({
      url: "https://api.onlinevideoconverter.pro/api/convert",
      method: "post",
      data: {
        url: link,
      },
    });
    const response = await axios({
      method: "GET",
      url: h.data.url[0].url,
      responseType: "stream",
    });

    const w = response.data.pipe(fs.createWriteStream(downloadFolder));
    w.on("finish", () => {});
  } catch {
    ytdl(link, downloadFolder);
  }
};

setInterval(() => {
  store.writeToFile("./baileys_store_multi.json");
}, 10000);

var command_list = ["textpro", "tagall", "ping", "welcome", "goodbye", "alive", "get", "set"],
  diff = [];

async function Primon() {
  const Proto = makeWASocket({
    auth: state,
    version: ["Primon Proto", "Chrome", "1.0"],
    msgRetryCounterMap,
    getMessage: handler.messageRetryHandler,
    logger: P({ level: "silent" }),
  });
  var message,
    isreplied,
    repliedmsg,
    jid,
    msgid,
    isbutton,
    msgkey,
    btnid,
    sudo1,
    meid,
    sudo = [];
  Proto.ev.on("group-participants.update", async (st) => {
    var re = PrimonDB;
    re = re.goodbye.filter((id) => id.jid == jid);
    re2 = re.welcome.filter((id2) => id2.jid == jid);
    if (st.action == "remove") {
      if (re.length !== 0) {
        if (re[0].message.includes("{gpp}")) {
          if (re[0].message.includes("{img:")) {
            return await Proto.sendMessage(jid, {
              text: cmdlang.wrongwelcomePfp_gpp_img.replace(
                "{%c}",
                cmdlang.goodbye
              ),
            });
          } else if (re[0].message.includes("{vid:")) {
            return await Proto.sendMessage(jid, {
              text: cmdlang.wrongwelcomePfp_gpp_vid.replace(
                "{%c}",
                cmdlang.goodbye
              ),
            });
          } else {
            try {
              var pfp = await Proto.profilePictureUrl(jid, "image");
            } catch {
              pfp = undefined;
            }
            if (pfp == undefined || pfp == "") {
              return await Proto.sendMessage(jid, { text: modulelang.no_pfp });
            }
            var img = await axios.get(pfp, { responseType: "arraybuffer" });
            return await Proto.sendMessage(jid, {
              image: Buffer.from(img.data),
              caption: re[0].message.replace("{gpp}", ""),
              mimetype: Mimetype.png,
            });
          }
        } else {
          if (re[0].message.includes("{img: ")) {
            if (re[0].message.includes("{vid: ")) {
              return await Proto.sendMessage(jid, {
                text: cmdlang.wrongwelcomePfp_img_vid.replace(
                  "{%c}",
                  cmdlang.goodbye
                ),
              });
            }
            try {
              var img_link = re[0].message.split("{img: ")[1].split("}")[0] + "}";
              var img = await axios.get(
                re[0].message.split("{img: ")[1].split("}")[0],
                { responseType: "arraybuffer" }
              );
            } catch {
              return await Proto.sendMessage(jid, {
                text: modulelang.error_img,
              });
            }
            try {
              return await Proto.sendMessage(jid, {
                image: Buffer.from(img.data),
                caption: re[0].message.replace("{img: ", "").replace(img_link, ""),
                mimetype: Mimetype.png,
              });
            } catch {
              return await Proto.sendMessage(jid, {
                text: modulelang.error_img,
              });
            }
          } else if (re[0].message.includes("{vid:")) {
            if (re[0].message.includes("{img:")) {
              return await Proto.sendMessage(jid, {
                text: cmdlang.wrongwelcomePfp_img_vid.replace(
                  "{%c}",
                  cmdlang.goodbye
                ),
              });
            }
            try {
              var vid_link = re[0].message.split("{vid: ")[1].split("}")[0] + "}";
              ytdl(
                re[0].message.split("{vid: ")[1].split("}")[0],
                "./goodbye.mp4"
              );
            } catch {
              return await Proto.sendMessage(jid, {
                text: modulelang.error_vid,
              });
            }
            try {
              return await Proto.sendMessage(jid, {
                video: fs.readFileSync("./goodbye.mp4"),
                caption: re[0].message.replace("{vid: ", "").replace(vid_link, ""),
                mimetype: Mimetype.mp4,
              });
            } catch {
              return await Proto.sendMessage(jid, {
                text: modulelang.error_vid,
              });
            }
          } else {
            return await Proto.sendMessage(jid, { text: re[0].message });
          }
        }
      }
    } else if (st.action == "add") {
      if (re2.length !== 0) {
        if (re2[0].message.includes("{gpp}")) {
          if (re2[0].message.includes("{img:")) {
            return await Proto.sendMessage(jid, {
              text: cmdlang.wrongwelcomePfp_gpp_img.replace(
                "{%c}",
                cmdlang.welcome
              ),
            });
          } else if (re2[0].message.includes("{vid:")) {
            return await Proto.sendMessage(jid, {
              text: cmdlang.wrongwelcomePfp_gpp_vid.replace(
                "{%c}",
                cmdlang.welcome
              ),
            });
          } else {
            try {
              var pfp = await Proto.profilePictureUrl(jid, "image");
            } catch {
              pfp = undefined;
            }
            if (pfp == undefined || pfp == "") {
              return await Proto.sendMessage(jid, { text: modulelang.no_pfp });
            }
            var img = await axios.get(pfp, { responseType: "arraybuffer" });
            return await Proto.sendMessage(jid, {
              image: Buffer.from(img.data),
              caption: re2[0].message.replace("{gpp}", ""),
              mimetype: Mimetype.png,
            });
          }
        } else {
          if (re2[0].message.includes("{img:")) {
            if (re2[0].message.includes("{vid:")) {
              return await Proto.sendMessage(jid, {
                text: cmdlang.wrongwelcomePfp_img_vid.replace(
                  "{%c}",
                  cmdlang.welcome
                ),
              });
            }
            try {
              var img_link = re2[0].message.split("{img: ")[1].split("}")[0] + "}";
              var img = await axios.get(
                re2[0].message.split("{img: ")[1].split("}")[0],
                { responseType: "arraybuffer" }
              );
            } catch {
              return await Proto.sendMessage(jid, {
                text: modulelang.error_img,
              });
            }
            try {
              return await Proto.sendMessage(jid, {
                image: Buffer.from(img.data),
                caption: re2[0].message.replace("{img: ", "").replace(img_link, ""),
                mimetype: Mimetype.png,
              });
            } catch {
              return await Proto.sendMessage(jid, {
                text: modulelang.error_img,
              });
            }
          } else if (re2[0].message.includes("{vid:")) {
            if (re2[0].message.includes("{img:")) {
              return await Proto.sendMessage(jid, {
                text: cmdlang.wrongwelcomePfp_img_vid.replace(
                  "{%c}",
                  cmdlang.welcome
                ),
              });
            }
            try {
              var vid_link = re2[0].message.split("{vid: ")[1].split("}")[0] + "}";
              ytdl(
                re2[0].message.split("{vid: ")[1].split("}")[0],
                "./welcome.mp4"
              );
            } catch {
              return await Proto.sendMessage(jid, {
                text: modulelang.error_vid,
              });
            }
            try {
              return await Proto.sendMessage(jid, {
                video: fs.readFileSync("./welcome.mp4"),
                caption: re2[0].message.replace("{vid: ", "").replace(vid_link, ""),
                mimetype: Mimetype.mp4,
              });
            } catch {
              return await Proto.sendMessage(jid, {
                text: modulelang.error_vid,
              });
            }
          } else {
            return await Proto.sendMessage(jid, { text: re2[0].message });
          }
        }
      }
    }
  });
  Proto.ev.on("creds.update", saveState);

  if (PrimonDB.sudo !== false) {
    if (PrimonDB.sudo.includes(",")) {
      var sudo1 = PrimonDB.sudo.split(",");
      sudo1.map((Element) => {
        sudo.push(Element + "@s.whatsapp.net");
      });
    } else {
      sudo.push(PrimonDB.sudo);
    }
  }
  try {
    meid = Proto.user.id.split(":")[0] + "@s.whatsapp.net";
  } catch {
    meid = Proto.user.id.split("@")[0] + "@s.whatsapp.net";
  }
  Proto.ev.on("messages.upsert", async (m) => {
    if (!m.messages[0].message) return;
    if (m.messages[0].key.remoteJid == "status@broadcast") return;
    jid = m.messages[0].key.remoteJid;
    var once_msg = Object.keys(m.messages[0].message);

    try {
      var trs1 =
        m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage;
      isreplied = true;
    } catch {
      isreplied = false;
    }

    if (isreplied) {
      try {
        var once_msg2 = Object.keys(
          m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage
        );
        var nort = true;
      } catch {
        var nort = false;
      }
      if (nort) {
        if (once_msg2.includes("extendedTextMessage")) {
          repliedmsg =
            m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage
              .extendedTextMessage.text;
        } else if (once_msg2.includes("conversation")) {
          repliedmsg =
            m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage
              .conversation;
        } else {
          repliedmsg = undefined;
        }
      } else {
        repliedmsg = undefined;
      }
    } else {
      repliedmsg = undefined;
    }
    msgkey = m.messages[0].key;
    msgid = m.messages[0].key.id
    var message;
    if (once_msg.includes("conversation")) {
      message = m.messages[0].message.conversation;
      isbutton = false;
    } else if (once_msg.includes("extendedTextMessage")) {
      isbutton = false;
      message = m.messages[0].message.extendedTextMessage.text;
    } else if (once_msg.includes("buttonsResponseMessage")) {
      message =
        m.messages[0].message.buttonsResponseMessage.selectedDisplayText;
      isbutton = true;
    } else {
      console.log(m.messages[0].message);
      isbutton = false;
      message = undefined;
    }
    
    var cmd1 = PrimonDB.handler;
    var cmd;
    if (cmd1.length > 1) {
      cmd = cmd1.split("");
    } else {
      cmd = [cmd1];
    }
    if (cmd.length == 0) {
      console.log("Handler Cannot be Blank!");
      console.log("\n");
      console.log("Priom Will Renew The Hanlder Data: !./;");
      var re = PrimonDB;
      re = re.handler = "!/,;";
      re = JSON.stringify(re, null, 2);
      var renwe_handler = await octokit.request("PATCH /gists/{gist_id}", {
        gist_id: process.env.GITHUB_DB,
        description: "Primon Proto için Kalıcı Veritabanı",
        files: {
          key: {
            content: re,
            filename: "primon.db.json",
          },
        },
      });
      console.log("\n");
      console.log("Restarting Primon..");
      return Primon();
    }

    var ispm;
    if (m.messages[0].key.participant == undefined) {
      if (m.messages[0].key.remoteJid.includes("@s")) {
        ispm = true;
      } else {
        ispm = false;
      }
    } else {
      ispm = false;
    }
    var g_participant;
    if (ispm) {
      if (m.messages[0].key.fromMe) {
        try {
          g_participant = Proto.user.id.split(":")[0] + "@s.whatsapp.net";
        } catch {
          g_participant = Proto.user.id.split("@")[0] + "@s.whatsapp.net";
        }
      } else {
        g_participant =
          m.messages[0].key.remoteJid.split("@")[0] + "@s.whatsapp.net";
      }
    } else {
      try {
        g_participant = m.messages[0].key.participant.split(":")[0] + "@s.whatsapp.net";
      } catch {
        g_participant = m.messages[0].key.participant.split("@")[0] + "@s.whatsapp.net";
      }
    }
    if (g_participant == "@s.whatsapp.net") {
      g_participant = "0";
    }
    g_participant = g_participant.split("@")[0] + "@s.whatsapp.net"
    console.log(message)
    console.log(sudo)
    console.log(g_participant)
    // Buttons
    if (message == MenuLang.menu && isbutton) {
      if (sudo.includes(g_participant)) {
        return await Proto.sendMessage(
          jid,
          { 
            text: 
            cmdlang.command + "```" + cmd[0] + "alive" + "```" + "\n" +
            cmdlang.info + modulelang.alive2 + "\n\n\n" +

            cmdlang.command + "```" + cmd[0] + "ping" + "```" + "\n" +
            cmdlang.info + modulelang.ping2 + "\n\n\n" +

            cmdlang.command + "```" + cmd[0] + "tagall" + "```" + "\n" +
            cmdlang.info + modulelang.tagall2 + "\n" +
            cmdlang.example + "\n\n" + modulelang.tagall3.replace(/&/gi, cmd[0]) + "\n\n\n" +

            cmdlang.command + "```" + cmd[0] + "textpro" + "```" + "\n" +
            cmdlang.info + modulelang.textpro2 + "\n" +
            cmdlang.example + "\n\n" + modulelang.textpro3.replace(/&/gi, cmd[0]) + "\n\n\n" +

            cmdlang.command + "```" + cmd[0] + "welcome" + "```" + "\n" +
            cmdlang.info + modulelang.welcome2 + "\n" +
            cmdlang.example + "\n\n" + modulelang.welcome3.replace(/&/gi, cmd[0]) + "\n\n\n" +

            cmdlang.command + "```" + cmd[0] + "goodbye" + "```" + "\n" +
            cmdlang.info + modulelang.goodbye2 + "\n" +
            cmdlang.example + "\n\n" + modulelang.goodbye3.replace(/&/gi, cmd[0]) + "\n\n\n" +

            cmdlang.command + "```" + cmd[0] + "get" + "```" + "\n" +
            cmdlang.info + modulelang.get + "\n" +
            cmdlang.example + "\n\n" + modulelang.get2.replace(/&/gi, cmd[0]) + "\n\n\n" +

            cmdlang.command + "```" + cmd[0] + "set" + "```" + "\n" +
            cmdlang.info + modulelang.set + "\n" +
            cmdlang.example + "\n\n" + modulelang.set2.replace(/&/gi, cmd[0])
          },
          { quoted: m.messages[0] }
        );
      }
    }
    if (message == MenuLang.owner && isbutton) {
      if (sudo.includes(g_participant)) {
        return await Proto.sendMessage(jid, { 
          text: modulelang.owner
        })
      }
    }
    if (message == MenuLang.star && isbutton) {
      if (sudo.includes(g_participant)) {
        return await Proto.sendMessage(jid, { 
          text: modulelang.star
        })
      }
    }

    if (c_num_cnt == 0) {
      await Proto.sendMessage(meid, { text: startlang.msg.replace("{c}", PrimonDB.db_url).replace("{c}", PrimonDB.token_key) });
      c_num_cnt = c_num_cnt + 1;
    }
    if (message !== undefined) {
      if (m.type == "notify") {
        if (sudo.includes(g_participant)) {
          if (PrimonDB.sudo !== false && sudo.length > 0) {
            if (cmd.includes(message[0])) {
              var command = message.split("");
              var command2 = command.shift();
              if (message.length == 1) return;
              var attr = command.join("");
              var arg = { a: [], b: [], c: "" };
              var args = "";
              if (attr.includes(" ")) {
                attr = attr.split(" ")[0];
                arg.a = message.split(" ");
                arg.a.map((e) => {
                  arg.b.push(e);
                });
                arg.b.shift();
                arg.c = arg.b.join(" ");
                args = arg.c;
              } else {
                args = "";
              }
              // Menu
              if (attr == "menu") {
                await Proto.sendMessage(jid, { delete: msgkey });
                if (args == "") {
                  var msg = await Proto.sendMessage(jid, config.TEXTS.MENU[0]);
                  return await Proto.sendMessage(jid, react(msg, "love"));
                } else {
                  if (
                    args == "textpro" ||
                    args == "TEXTPRO" ||
                    args == "Textpro"
                  ) {
                    return await Proto.sendMessage(
                      jid,
                      { text: cmds(modulelang.textpro, 3, cmd[0]) },
                      { quoted: m.messages[0] }
                    );
                  } else if (
                    args == "tagall" ||
                    args == "TAGALL" ||
                    args == "Tagall"
                  ) {
                    return await Proto.sendMessage(
                      jid,
                      { text: cmds(modulelang.tagall, 3, cmd[0]) },
                      { quoted: m.messages[0] }
                    );
                  } else if (
                    args == "ping" ||
                    args == "Ping" ||
                    args == "PING"
                  ) {
                    return await Proto.sendMessage(
                      jid,
                      { text: cmds(modulelang.ping, 2, cmd[0]) },
                      { quoted: m.messages[0] }
                    );
                  } else if (
                    args == "goodbye" ||
                    args == "Goodbye" ||
                    args == "GOODBYE"
                  ) {
                    return await Proto.sendMessage(
                      jid,
                      { text: cmds(modulelang.goodbye, 3, cmd[0]) },
                      { quoted: m.messages[0] }
                    );
                  } else if (
                    args == "alive" ||
                    args == "Alive" ||
                    args == "ALIVE"
                  ) {
                    return await Proto.sendMessage(
                      jid,
                      { text: cmds(modulelang.alive, 2, cmd[0]) },
                      { quoted: m.messages[0] }
                    );
                  } else if (
                    args == "get" ||
                    args == "Get" ||
                    args == "GET"
                  ) {
                    return await Proto.sendMessage(
                      jid,
                      { text: cmds(modulelang.get3, 3, cmd[0]) },
                      { quoted: m.messages[0] }
                    );
                  } else if (
                    args == "set" ||
                    args == "Set" ||
                    args == "SET"
                  ) {
                    return await Proto.sendMessage(
                      jid,
                      { text: cmds(modulelang.set3, 3, cmd[0]) },
                      { quoted: m.messages[0] }
                    );
                  }else if (
                    args == "welcome" ||
                    args == "Welcome" ||
                    args == "WELCOME"
                  ) {
                    return await Proto.sendMessage(
                      jid,
                      { text: cmds(modulelang.welcome, 3, cmd[0]) },
                      { quoted: m.messages[0] }
                    );
                  } else {
                    command_list.map((Element) => {
                      var similarity = test_diff(args, Element);
                      diff.push(similarity);
                    });
                    var filt = diff.filter((mum) => mum > 0.8);
                    if (filt[0] == undefined) {
                      return await Proto.sendMessage(
                        jid,
                        { text: modulelang.null },
                        { quoted: m.messages[0] }
                      );
                    } else {
                      var msg = await Proto.sendMessage(
                        jid,
                        { text: modulelang.null },
                        { quoted: m.messages[0] }
                      );
                      await Proto.sendMessage(jid, react(msg, "bad"));
                      await Proto.sendMessage(jid, {
                        text:
                          modulelang.pron.replace("&", cmd[0]) + command_list[diff.indexOf(filt[0])] + "```",
                      });
                      diff = [];
                      return 0;
                    }
                  }
                }
              }

              // Tagall
              else if (attr == "tagall") {
                if (ispm) {
                  await Proto.sendMessage(jid, { delete: msgkey });
                  return await Proto.sendMessage(
                    jid,
                    { text: cmdlang.onlyGroup },
                    { quoted: m.messages[0] }
                  );
                }
                if (isreplied) {
                  await Proto.sendMessage(jid, { delete: msgkey });
                  const metadata = await Proto.groupMetadata(jid);
                  var users = [];
                  metadata.participants.map((user) => {
                    users.push(user.id);
                  });
                  return await Proto.sendMessage(jid, {
                    text: repliedmsg,
                    mentions: users,
                  });
                } else {
                  await Proto.sendMessage(jid, { delete: msgkey });
                  if (args == "") {
                    await Proto.sendMessage(jid, { delete: msgkey });
                    const metadata = await Proto.groupMetadata(jid);
                    var users = [];
                    var defaultMsg = taglang.msg.replace(
                      "{%c}",
                      metadata.subject
                    );
                    metadata.participants.map((user) => {
                      users.push(user.id);
                    });
                    users.forEach((Element) => {
                      defaultMsg += "🔹 @" + Element.split("@")[0] + "\n";
                    });
                    return await Proto.sendMessage(jid, {
                      text: defaultMsg,
                      mentions: users,
                    });
                  } else {
                    await Proto.sendMessage(jid, { delete: msgkey });
                    const metadata = await Proto.groupMetadata(jid);
                    var users = [];
                    metadata.participants.map((user) => {
                      users.push(user.id);
                    });
                    return await Proto.sendMessage(jid, {
                      text: args,
                      mentions: users,
                    });
                  }
                }
              }

              // Set
              else if (attr == "set") {
                await Proto.sendMessage(jid, { delete: msgkey });
                if (!isreplied) {
                  return await Proto.sendMessage(jid, {text: modulelang.reply})
                }
                if (args == "alive") {
                  var res = PrimonDB;
                  var res2 = res
                  res2.alive_msg = repliedmsg;
                  var renwe_handler = await octokit.request("PATCH /gists/{gist_id}", {
                    gist_id: process.env.GITHUB_DB,
                    description: "Primon Proto için Kalıcı Veritabanı",
                    files: {
                      key: {
                        content: JSON.stringify(res2, null, 2),
                        filename: "primon.db.json",
                      },
                    },
                  });
                  return await Proto.sendMessage(jid, { text: modulelang.setted})
                } else if (args == "afk") {
                  var res = PrimonDB;
                  var res2 = res
                  res2.afk.message = repliedmsg;
                  var renwe_handler = await octokit.request("PATCH /gists/{gist_id}", {
                    gist_id: process.env.GITHUB_DB,
                    description: "Primon Proto için Kalıcı Veritabanı",
                    files: {
                      key: {
                        content: JSON.stringify(res2, null, 2),
                        filename: "primon.db.json",
                      },
                    },
                  });
                  return await Proto.sendMessage(jid, { text: modulelang.setted})
                } else if (args == "ban") {
                  var res = PrimonDB;var res = PrimonDB;
                  var res2 = res
                  res2.ban_msg = repliedmsg;
                  var renwe_handler = await octokit.request("PATCH /gists/{gist_id}", {
                    gist_id: process.env.GITHUB_DB,
                    description: "Primon Proto için Kalıcı Veritabanı",
                    files: {
                      key: {
                        content: JSON.stringify(res2, null, 2),
                        filename: "primon.db.json",
                      },
                    },
                  });
                  return await Proto.sendMessage(jid, { text: modulelang.setted})
                } else if (args == "mute") {
                  var res = PrimonDB;
                  var res2 = res
                  res2.mute_msg = repliedmsg;
                  var renwe_handler = await octokit.request("PATCH /gists/{gist_id}", {
                    gist_id: process.env.GITHUB_DB,
                    description: "Primon Proto için Kalıcı Veritabanı",
                    files: {
                      key: {
                        content: JSON.stringify(res2, null, 2),
                        filename: "primon.db.json",
                      },
                    },
                  });
                  return await Proto.sendMessage(jid, { text: modulelang.setted})
                } else if (args == "unmute") {
                  var res = PrimonDB;
                  var res2 = res
                  res2.unmute_msg = repliedmsg;
                  var renwe_handler = await octokit.request("PATCH /gists/{gist_id}", {
                    gist_id: process.env.GITHUB_DB,
                    description: "Primon Proto için Kalıcı Veritabanı",
                    files: {
                      key: {
                        content: JSON.stringify(res2, null, 2),
                        filename: "primon.db.json",
                      },
                    },
                  });
                  return await Proto.sendMessage(jid, { text: modulelang.setted})
                } else if (args == "block") {
                  var res = PrimonDB;
                  var res2 = res
                  res2.block_msg = repliedmsg;
                  var renwe_handler = await octokit.request("PATCH /gists/{gist_id}", {
                    gist_id: process.env.GITHUB_DB,
                    description: "Primon Proto için Kalıcı Veritabanı",
                    files: {
                      key: {
                        content: JSON.stringify(res2, null, 2),
                        filename: "primon.db.json",
                      },
                    },
                  });
                  return await Proto.sendMessage(jid, { text: modulelang.setted})
                } else if (args == "unblock") {
                  var res = PrimonDB;
                  var res2 = res
                  res2.unblock_msg = repliedmsg;
                  var renwe_handler = await octokit.request("PATCH /gists/{gist_id}", {
                    gist_id: process.env.GITHUB_DB,
                    description: "Primon Proto için Kalıcı Veritabanı",
                    files: {
                      key: {
                        content: JSON.stringify(res2, null, 2),
                        filename: "primon.db.json",
                      },
                    },
                  });
                  return await Proto.sendMessage(jid, { text: modulelang.setted})
                } else {
                  return await Proto.sendMessage(jid, { text: modulelang.set_null.replace("&", cmd[0])})
                }
              }


              // Get
              else if (attr == "get") {
                await Proto.sendMessage(jid, { delete: msgkey });
                if (isreplied) {
                  if (repliedmsg == "alive") {
                    var re = PrimonDB;
                    re = re.alive_msg
                    return await Proto.sendMessage(jid, { text: modulelang.get_alive + re})
                  } else if (repliedmsg == "afk") {
                    var re = PrimonDB;
                    re = re.afk.message
                    return await Proto.sendMessage(jid, { text: modulelang.get_afk + re})
                  } else if (repliedmsg == "ban") {
                    var re = PrimonDB;
                    re = re.ban_msg
                    return await Proto.sendMessage(jid, { text: modulelang.get_ban + re})
                  } else if (repliedmsg == "mute") {
                    var re = PrimonDB;
                    re = re.mute_msg 
                    return await Proto.sendMessage(jid, { text: modulelang.get_mute + re})
                  } else if (repliedmsg == "unmute") {
                    var re = PrimonDB;
                    re = re.unmute_msg
                    return await Proto.sendMessage(jid, { text: modulelang.get_unmute + re})
                  } else if (repliedmsg == "block") {
                    var re = PrimonDB;
                    re = re.block_msg
                    return await Proto.sendMessage(jid, { text: modulelang.get_block + re})
                  } else if (repliedmsg == "unblock") {
                    var re = PrimonDB;
                    re = re.unblock_msg
                    return await Proto.sendMessage(jid, { text: modulelang.get_unblock + re})
                  } else {
                    return await Proto.sendMessage(jid, { text: modulelang.get_null.replace("&", cmd[0])})
                  }
                } else {
                  if (args == "alive") {
                    var re = PrimonDB;
                    re = re.alive_msg
                    return await Proto.sendMessage(jid, { text: modulelang.get_alive + re})
                  } else if (args == "afk") {
                    var re = PrimonDB;
                    re = re.afk.message
                    return await Proto.sendMessage(jid, { text: modulelang.get_afk + re})
                  } else if (args == "ban") {
                    var re = PrimonDB;
                    re = re.ban_msg
                    return await Proto.sendMessage(jid, { text: modulelang.get_ban + re})
                  } else if (args == "mute") {
                    var re = PrimonDB;
                    re = re.mute_msg 
                    return await Proto.sendMessage(jid, { text: modulelang.get_mute + re})
                  } else if (args == "unmute") {
                    var re = PrimonDB;
                    re = re.unmute_msg
                    return await Proto.sendMessage(jid, { text: modulelang.get_unmute + re})
                  } else if (args == "block") {
                    var re = PrimonDB;
                    re = re.block_msg
                    return await Proto.sendMessage(jid, { text: modulelang.get_block + re})
                  } else if (args == "unblock") {
                    var re = PrimonDB;
                    re = re.unblock_msg
                    return await Proto.sendMessage(jid, { text: modulelang.get_unblock + re})
                  } else {
                    return await Proto.sendMessage(jid, { text: modulelang.get_null.replace("&", cmd[0])})
                  }
                }
              }

              // Textpro
              else if (attr == "textpro") {
                if (isreplied) {
                  await Proto.sendMessage(jid, { delete: msgkey });
                  var style = textpro_links(args);
                  if (style !== "") {
                    var img = await openapi.textpro(style, repliedmsg);
                    var img2 = await axios.get(img, {
                      responseType: "arraybuffer",
                    });
                    return await Proto.sendMessage(jid, {
                      image: Buffer.from(img2.data),
                      caption: modulelang.by,
                      mimetype: Mimetype.png,
                    });
                  } else {
                    var msg = await Proto.sendMessage(
                      jid,
                      {
                        text: modulelang.textpro_null,
                      },
                      { quoted: m.messages[0] }
                    );
                    return await Proto.sendMessage(jid, react(msg, "bad"));
                  }
                } else {
                  await Proto.sendMessage(jid, { delete: msgkey });
                  try {
                    var type = argfinder(args);
                  } catch {
                    var msg = await Proto.sendMessage(
                      jid,
                      {
                        text: modulelang.textpro_null,
                      },
                      { quoted: m.messages[0] }
                    );
                    return await Proto.sendMessage(jid, react(msg, "bad"));
                  }
                  var url = textpro_links(type);
                  if (url == "") {
                    var msg = await Proto.sendMessage(
                      jid,
                      {
                        text: modulelang.textpro_null,
                      },
                      { quoted: m.messages[0] }
                    );
                    return await Proto.sendMessage(jid, react(msg, "bad"));
                  } else {
                    var type = argfinder(args);
                    var url = textpro_links(type);
                    var text = afterarg(args);
                    if (text == "" || text == " ") {
                      return await Proto.sendMessage(
                        jid,
                        {
                          text: modulelang.textpro_null,
                        },
                        { quoted: m.messages[0] }
                      );
                    }
                    var img = await openapi.textpro(url, text);
                    var img2 = await axios.get(img, {
                      responseType: "arraybuffer",
                    });
                    return await Proto.sendMessage(jid, {
                      image: Buffer.from(img2.data),
                      caption: modulelang.by,
                      mimetype: Mimetype.png,
                    });
                  }
                }
              }

              // Ping
              else if (attr == "ping") {
                await Proto.sendMessage(jid, { delete: msgkey });
                var d1 = new Date().getTime();
                var msg = await Proto.sendMessage(jid, {
                  text: "__Ping, Pong!__",
                });
                var d2 = new Date().getTime();
                var timestep = Number(d2) - Number(d1);
                if (timestep > 600) {
                  return await Proto.sendMessage(
                    jid,
                    {
                      text:
                        pinglang.ping +
                        timestep.toString() +
                        "ms" +
                        pinglang.badping,
                    },
                    { quoted: msg }
                  );
                } else {
                  return await Proto.sendMessage(jid, {
                    text: pinglang.ping + timestep.toString() + "ms",
                  });
                }
              }

              // Welcome
              else if (attr == "welcome") {
                await Proto.sendMessage(jid, { delete: msgkey });
                if (ispm) {
                  return await Proto.sendMessage(
                    jid,
                    { text: cmdlang.onlyGroup },
                    { quoted: m.messages[0] }
                  );
                } else {
                  if (isreplied) {
                    if (repliedmsg == "delete") {
                      var re = PrimonDB;
                      re = re.welcome.filter((id) => id.jid !== jid);
                      re = JSON.stringify(re, null, 2);
                      await octokit.request("PATCH /gists/{gist_id}", {
                        gist_id: process.env.GITHUB_DB,
                        description: "Primon Proto için Kalıcı Veritabanı",
                        files: {
                          key: {
                            content: re,
                            filename: "primon.db.json",
                          },
                        },
                      });
                      return await Proto.sendMessage(
                        jid,
                        { text: welcomelang.suc_del_welcome },
                        { quoted: m.messages[0] }
                      );
                    } else {
                      var re = PrimonDB;
                      var d = { jid: jid, message: repliedmsg };
                      var up = re.welcome.filter((id) => id.jid == jid);

                      if (up.length == 0) {
                        re.welcome.push(d);
                        re = JSON.stringify(re, null, 2);
                        await octokit.request("PATCH /gists/{gist_id}", {
                          gist_id: process.env.GITHUB_DB,
                          description: "Primon Proto için Kalıcı Veritabanı",
                          files: {
                            key: {
                              content: re,
                              filename: "primon.db.json",
                            },
                          },
                        });
                      } else {
                        var up2 = re.welcome.filter((id) => id.jid !== jid);
                        var d2 = up2.push(d);
                        var re2 = JSON.stringify(up2, null, 2);
                        await octokit.request("PATCH /gists/{gist_id}", {
                          gist_id: process.env.GITHUB_DB,
                          description: "Primon Proto için Kalıcı Veritabanı",
                          files: {
                            key: {
                              content: re2,
                              filename: "primon.db.json",
                            },
                          },
                        });
                      }
                      return await Proto.sendMessage(
                        jid,
                        { text: welcomelang.suc_set_welcome },
                        { quoted: m.messages[0] }
                      );
                    }
                  } else {
                    if (args == "delete") {
                      var re = PrimonDB;
                      re = re.welcome.filter((id) => id.jid !== jid);
                      re = JSON.stringify(re, null, 2);
                      await octokit.request("PATCH /gists/{gist_id}", {
                        gist_id: process.env.GITHUB_DB,
                        description: "Primon Proto için Kalıcı Veritabanı",
                        files: {
                          key: {
                            content: re,
                            filename: "primon.db.json",
                          },
                        },
                      });
                      return await Proto.sendMessage(
                        jid,
                        { text: welcomelang.suc_del_welcome },
                        { quoted: m.messages[0] }
                      );
                    } else if (args == "") {
                      var re = PrimonDB.welcome;
                      var d = re.filter((id) => id.jid == jid);
                      if (d.length == 0) {
                        return await Proto.sendMessage(
                          jid,
                          { text: welcomelang.not_set_welcome },
                          { quoted: m.messages[0] }
                        );
                      } else {
                        return await Proto.sendMessage(
                          jid,
                          { text: welcomelang.alr_set_welcome + d[0].message },
                          { quoted: m.messages[0] }
                        );
                      }
                    } else {
                      var re = PrimonDB;
                      var d = { jid: jid, message: args };
                      var up = re.welcome.filter((id) => id.jid == jid);

                      if (up.length == 0) {
                        re.welcome.push(d);
                        re = JSON.stringify(re, null, 2);
                        await octokit.request("PATCH /gists/{gist_id}", {
                          gist_id: process.env.GITHUB_DB,
                          description: "Primon Proto için Kalıcı Veritabanı",
                          files: {
                            key: {
                              content: re,
                              filename: "primon.db.json",
                            },
                          },
                        });
                      } else {
                        var up2 = re.welcome.filter((id) => id.jid !== jid);
                        var d2 = up2.push(d);
                        var re2 = JSON.stringify(up2, null, 2);
                        await octokit.request("PATCH /gists/{gist_id}", {
                          gist_id: process.env.GITHUB_DB,
                          description: "Primon Proto için Kalıcı Veritabanı",
                          files: {
                            key: {
                              content: re2,
                              filename: "primon.db.json",
                            },
                          },
                        });
                      }
                      return await Proto.sendMessage(
                        jid,
                        { text: welcomelang.suc_set_welcome },
                        { quoted: m.messages[0] }
                      );
                    }
                  }
                }
              }

              // Goodbye
              else if (attr == "goodbye") {
                await Proto.sendMessage(jid, { delete: msgkey });
                if (ispm) {
                  return await Proto.sendMessage(
                    jid,
                    { text: cmdlang.onlyGroup },
                    { quoted: m.messages[0] }
                  );
                } else {
                  if (isreplied) {
                    if (repliedmsg == "delete") {
                      var re = PrimonDB;
                      re = re.goodbye.filter((id) => id.jid !== jid);
                      re = JSON.stringify(re, null, 2);
                      await octokit.request("PATCH /gists/{gist_id}", {
                        gist_id: process.env.GITHUB_DB,
                        description: "Primon Proto için Kalıcı Veritabanı",
                        files: {
                          key: {
                            content: re,
                            filename: "primon.db.json",
                          },
                        },
                      });
                      return await Proto.sendMessage(
                        jid,
                        { text: welcomelang.suc_del_goodbye },
                        { quoted: m.messages[0] }
                      );
                    } else {
                      var re = PrimonDB;
                      var d = { jid: jid, message: repliedmsg };
                      var up = re.goodbye.filter((id) => id.jid == jid);

                      if (up.length == 0) {
                        re.goodbye.push(d);
                        re = JSON.stringify(re, null, 2);
                        await octokit.request("PATCH /gists/{gist_id}", {
                          gist_id: process.env.GITHUB_DB,
                          description: "Primon Proto için Kalıcı Veritabanı",
                          files: {
                            key: {
                              content: re,
                              filename: "primon.db.json",
                            },
                          },
                        });
                      } else {
                        var up2 = re.goodbye.filter((id) => id.jid !== jid);
                        var d2 = up2.push(d);
                        var re2 = JSON.stringify(up2, null, 2);
                        await octokit.request("PATCH /gists/{gist_id}", {
                          gist_id: process.env.GITHUB_DB,
                          description: "Primon Proto için Kalıcı Veritabanı",
                          files: {
                            key: {
                              content: re2,
                              filename: "primon.db.json",
                            },
                          },
                        });
                      }
                      return await Proto.sendMessage(
                        jid,
                        { text: welcomelang.suc_set_goodbye },
                        { quoted: m.messages[0] }
                      );
                    }
                  } else {
                    if (args == "delete") {
                      var re = PrimonDB;
                      re = re.goodbye.filter((id) => id.jid !== jid);
                      re = JSON.stringify(re, null, 2);
                      await octokit.request("PATCH /gists/{gist_id}", {
                        gist_id: process.env.GITHUB_DB,
                        description: "Primon Proto için Kalıcı Veritabanı",
                        files: {
                          key: {
                            content: re,
                            filename: "primon.db.json",
                          },
                        },
                      });
                      return await Proto.sendMessage(
                        jid,
                        { text: welcomelang.suc_del_goodbye },
                        { quoted: m.messages[0] }
                      );
                    } else if (args == "") {
                      var re = PrimonDB.goodbye;
                      var d = re.filter((id) => id.jid == jid);
                      if (d.length == 0) {
                        return await Proto.sendMessage(
                          jid,
                          { text: welcomelang.not_set_goodbye },
                          { quoted: m.messages[0] }
                        );
                      } else {
                        return await Proto.sendMessage(
                          jid,
                          { text: welcomelang.alr_set_goodbye + d[0].message },
                          { quoted: m.messages[0] }
                        );
                      }
                    } else {
                      var re = PrimonDB;
                      var d = { jid: jid, message: args };
                      var up = re.goodbye.filter((id) => id.jid == jid);

                      if (up.length == 0) {
                        re.goodbye.push(d);
                        re = JSON.stringify(re, null, 2);
                        await octokit.request("PATCH /gists/{gist_id}", {
                          gist_id: process.env.GITHUB_DB,
                          description: "Primon Proto için Kalıcı Veritabanı",
                          files: {
                            key: {
                              content: re,
                              filename: "primon.db.json",
                            },
                          },
                        });
                      } else {
                        var up2 = re.goodbye.filter((id) => id.jid !== jid);
                        var d2 = up2.push(d);
                        var re2 = JSON.stringify(up2, null, 2);
                        await octokit.request("PATCH /gists/{gist_id}", {
                          gist_id: process.env.GITHUB_DB,
                          description: "Primon Proto için Kalıcı Veritabanı",
                          files: {
                            key: {
                              content: re2,
                              filename: "primon.db.json",
                            },
                          },
                        });
                      }
                      return await Proto.sendMessage(
                        jid,
                        { text: welcomelang.suc_set_goodbye },
                        { quoted: m.messages[0] }
                      );
                    }
                  }
                }
              }

              // Alive
              else if (attr == "alive") {
                await Proto.sendMessage(jid, { delete: msgkey });
                if (PrimonDB.alive_msg.includes("{pp}")) {
                  if (PrimonDB.alive_msg.includes("{img: ")) {
                    return await Proto.sendMessage(jid, {
                      text: cmdlang.wrongalive_pp_img
                    })
                  } else if (PrimonDB.alive_msg.includes("{vid: ")) {
                    return await Proto.sendMessage(jid, {
                      text: cmdlang.wrongalive_pp_vid
                    })
                  } else {
                    try {
                      var ppUrl = await sock.profilePictureUrl(jid, 'image')
                    } catch {
                      return await Proto.sendMessage(jid, {
                        text: cmdlang.nopfp
                      })
                    }

                    if (ppUrl == undefined || ppUrl == "") {
                      return await Proto.sendMessage(jid, {
                        text: cmdlang.nopfp
                      })
                    } else {
                      var buff = await axios.get(ppUrl, { responseType: "arraybuffer"})
                      return await Proto.sendMessage(jid, {
                        image: Buffer.from(buff.data),
                        caption: PrimonDB.alive_msg.replace("{pp}", ""),
                        mimetype: Mimetype.png,
                      });
                    }
                  }
                } else if (PrimonDB.alive_msg.includes("{img: ")) {
                  if (PrimonDB.alive_msg.includes("{vid: ")) {
                    return await Proto.sendMessage(jid, {
                      text: cmdlang.wrongalive_img_vid
                    })
                  } else {
                    try {
                      var img_link = PrimonDB.alive_msg.split("{img: ")[1].split("}")[0] + "}";
                      var img = await axios.get(
                        PrimonDB.alive_msg.split("{img: ")[1].split("}")[0],
                        { responseType: "arraybuffer" }
                      );
                    } catch {
                      return await Proto.sendMessage(jid, {
                        text: modulelang.raw_error_img,
                      });
                    }
                    try {
                      return await Proto.sendMessage(jid, {
                        image: Buffer.from(img.data),
                        caption: re[0].message.replace("{img: ", "").replace(img_link, ""),
                        mimetype: Mimetype.png,
                      });
                    } catch {
                      return await Proto.sendMessage(jid, {
                        text: modulelang.raw_error_img
                      });
                    }
                  }
                } else if (PrimonDB.alive_msg.includes("{vid: ")) {
                  if (PrimonDB.alive_msg.includes("{img: ")) {
                    return await Proto.sendMessage(jid, {
                      text: cmdlang.wrongalive_img_vid
                    })
                  } else {
                    try {
                      var vid_link = re2[0].message.split("{vid: ")[1].split("}")[0] + "}";
                      ytdl(
                        PrimonDB.alive_msg.split("{vid: ")[1].split("}")[0],
                        "./alive.mp4"
                      );
                    } catch {
                      return await Proto.sendMessage(jid, {
                        text: modulelang.raw_error_vid,
                      });
                    }
                    try {
                      return await Proto.sendMessage(jid, {
                        video: fs.readFileSync("./alive.mp4"),
                        caption: PrimonDB.alive_msg.replace("{vid: ", "").replace(img_link, ""),
                        mimetype: Mimetype.mp4,
                      });
                    } catch {
                      return await Proto.sendMessage(jid, {
                        text: modulelang.raw_error_vid
                      });
                    }
                  }
                } else {
                  return await Proto.sendMessage(jid, {
                    text: PrimonDB.alive_msg
                  });
                }
              }



            }
          }
        }
      }
    }

    /*
      if (m.messages[0].key.fromMe) {
        if (m.messages[0].message.conversation.startsWith(".textpro")) {
	  await Proto.sendMessage(m.messages[0].key.remoteJid, { delete: m.messages[0].key })
          var args = m.messages[0].message.conversation.split(" ")
	  var api = await axios.get("https://open-apis-rest.up.railway.app/api/textpro?url=" +
	    args[1] + "&text1=" + args[2]
          ) 
	  var img = await axios.get(api.data.data, { responseType: "arraybuffer" })
          await Proto.sendMessage(m.messages[0].key.remoteJid, { image: Buffer.from(img.data), caption: "By Primon Proto" })
	}
      }
      */
  });
  Proto.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(sessionlang.bad);
        fs.unlinkSync("./session.json");
        fs.unlinkSync("./baileys_store_multi.json");
        Proto.logout();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log(sessionlang.recon);
        Primon();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log(sessionlang.recon);
        Primon();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(sessionlang.out);
        fs.unlinkSync("./session.json");
        fs.unlinkSync("./baileys_store_multi.json");
        Proto.logout();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log(sessionlang.recon);
        Primon();
      } else if (reason === DisconnectReason.timedOut) {
        console.log(sessionlang.recon);
        Primon();
      } else {
        // Proto.end(reason);
      }
    }
    return console.log(sessionlang.run);
  });
}
try {
  Primon();
} catch {
  Primon();
}
