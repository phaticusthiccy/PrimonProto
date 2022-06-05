// Primon Proto
// Headless WebSocket, type-safe Whatsapp UserBot
//
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can usable with mjs)
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
const filterlang = Language.getString("filter");
const stoplang = Language.getString("stop_f")
const startlang = Language.getString("onStart");
const openapi = require("@phaticusthiccy/open-apis");
const config = require("./config_proto");
const { Octokit } = require("@octokit/core");
const shell = require('shelljs');

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
  var shs = await axios.get(
    "https://gitlab.com/phaticusthiccy/primon/-/raw/main/ret.db"
  )
  var shd = shs.data
  var gsg = require("./db.json")
  var nws = { ...shd, ...gsg }
  var payload = JSON.stringify(nws, null, 2)
  await octokit.request("PATCH /gists/{gist_id}", {
    gist_id: process.env.GITHUB_DB,
    description: "Primon Proto için Kalıcı Veritabanı",
    files: {
      key: {
        content: payload,
        filename: "primon.db.json",
      }
    }
  });
}, 60000)
// Act every 1 min

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
    level: "silent",
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

async function ytdl(link, downloadFolder) {
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
}

setInterval(() => {
  store.writeToFile("./baileys_store_multi.json");
}, 10000);

var command_list = ["textpro", "tagall", "ping", "welcome", "goodbye", "alive", "get", "set", "filter", "stop", "sticker", "update"],
  diff = [];

async function Primon() {

  var { version } = await fetchLatestBaileysVersion();
  const Proto = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    version
  });
  var message,
    isreplied,
    isimage,
    isvideo,
    issound,
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
    if (st.action == "remove") {
      re.goodbye.map(async (el) => {
        if (el.jid == jid) {
          var ismedia_Active = false
          var basemedia;
          var typemeida;
          re.goodbye_media.map((el2) => {
            if (el2.jid == jid) {
              ismedia_Active = true
              basemedia = el2.media
              typemeida = el2.type
            }
          })
          if (ismedia_Active == true) {
            if (typemeida == "image") {
              fs.writeFileSync("./GB.png", basemedia, "base64")
              await Proto.sendMessage(jid, {
                image: fs.readFileSync("./GB.png"),
                caption: el.message
              });
              return fs.unlinkSync("./GB.png")
            } else {
              fs.writeFileSync("./GB.mp4", basemedia, "base64")
              await Proto.sendMessage(jid, {
                video: fs.readFileSync("./GB.mp4"),
                caption: el.message
              });
              return fs.unlinkSync("./GB.mp4")
            }
          } else {
            return await Proto.sendMessage(jid, { text: el.message });
          }
        }
      })
    } else if (st.action == "add") {
      re.welcome.map(async (el) => {
        if (el.jid == jid) {
          var ismedia_Active = false
          var basemedia;
          var typemeida;
          re.welcome_media.map((el2) => {
            if (el2.jid == jid) {
              ismedia_Active = true
              basemedia = el2.media
              typemeida = el2.type
            }
          })
          if (ismedia_Active == true) {
            if (typemeida == "image") {
              fs.writeFileSync("./WC.png", basemedia, "base64")
              await Proto.sendMessage(jid, {
                image: fs.readFileSync("./WC.png"),
                caption: el.message
              });
              return fs.unlinkSync("./WC.png")
            } else {
              fs.writeFileSync("./WC.mp4", basemedia, "base64")
              await Proto.sendMessage(jid, {
                video: fs.readFileSync("./WC.mp4"),
                caption: el.message
              });
              return fs.unlinkSync("./WC.mp4")
            }
          } else {
            return await Proto.sendMessage(jid, { text: el.message });
          }
        }
      })
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
    if (!m.messages[0].message                                                                ) return;
    if (Object.keys(m.messages[0].message)[0] == "protocolMessage"                            ) return;
    if (Object.keys(m.messages[0].message)[0] == "reactionMessage"                            ) return;
    if (Object.keys(m.messages[0].message)[0] == "requestPaymentMessage"                      ) return;
    if (Object.keys(m.messages[0].message)[0] == "sendPaymentMessage"                         ) return;
    if (Object.keys(m.messages[0].message)[0] == "senderKeyDistributionMessage"               ) return;
    if (Object.keys(m.messages[0].message)[0] == "paymentInviteMessage"                       ) return;
    if (Object.keys(m.messages[0].message)[0] == "orderMessage"                               ) return;
    if (Object.keys(m.messages[0].message)[0] == "fastRatchetKeySenderKeyDistributionMessage" ) return;
    if (Object.keys(m.messages[0].message)[0] == "declinePaymentRequestMessage"               ) return;
    if (Object.keys(m.messages[0].message)[0] == "call"                                       ) return;
    if (Object.keys(m.messages[0].message)[0] == "cancelPaymentRequestMessage"                ) return;
    if (Object.keys(m.messages[0].message)[0] == "protocolMessage"                            ) return;
    if (Object.keys(m.messages[0].message)[0] == "pollUpdateMessage"                          ) return;
    if (m.messages[0].key.remoteJid == "status@broadcast"                                     ) return;
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
      console.log(m.messages[0].message)
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
        } else if (once_msg2.includes("imageMessage")) {
          if (m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.imageMessage.hasOwnProperty('caption')) {
            repliedmsg = m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.imageMessage.caption
          } else {
            repliedmsg = "";
          }
        } else if (once_msg2.includes("videoMessage")) {
          if (m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.hasOwnProperty('caption')) {
            repliedmsg = m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.caption
          } else {
            repliedmsg = "";
          }
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
      isimage = false;
      isvideo = false;
      issound = false;
    } else if (once_msg.includes("extendedTextMessage")) {
      isbutton = false;
      isimage = false;
      isvideo = false;
      issound = false;
      message = m.messages[0].message.extendedTextMessage.text;
    } else if (once_msg.includes("buttonsResponseMessage")) {
      message = m.messages[0].message.buttonsResponseMessage.selectedDisplayText;
      isbutton = true;
      isimage = false;
      isvideo = false;
      issound = false;
    } else if (once_msg.includes("imageMessage")) {
      try {
        message = m.messages[0].message.imageMessage.caption;
        isimage = true
        isvideo = false
        issound = false
      } catch {
        message = "";
        isimage = true;
        isvideo = false;
        issound = false;
      }
      isbutton = false;
    } else if (once_msg.includes("videoMessage")) {
      try {
        message = m.messages[0].message.videoMessage.caption;
        isimage = false
        isvideo = true
        issound = false
      } catch {
        message = "";
        isimage = false;
        isvideo = true;
        issound = false;
      }
      isbutton = false;
    } else if (once_msg.includes("audioMessage")) {
      isimage = false
      isvideo = false
      issound = true
      isbutton = false;
      message = ""
    } else {
      isbutton = false;
      message = undefined;
    }

    if ((isimage && isreplied) || (isvideo && isreplied) || (issound && isreplied)) {
      var reply_download_key = m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage
    }
    console.log(message)
    console.log(isreplied)
    console.log(isimage)
    console.log(repliedmsg)
    
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
    try {
      g_participant = g_participant.split("@")[0] + "@s.whatsapp.net"
    } catch {}
    // Buttons

    PrimonDB.filter.map(async (el) => {
      ;
      if (el.jid == jid && el.trigger == message) {
        if (m.messages[0].key.fromMe) {
          return;
        }
        return await Proto.sendMessage(jid, { text: el.message }, {quoted: m.messages[0]})
      }
    })
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

            cmdlang.command + "```" + cmd[0] + "update" + "```" + "\n" +
            cmdlang.info + modulelang.update3 + "\n\n\n" +

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
            cmdlang.example + "\n\n" + modulelang.set2.replace(/&/gi, cmd[0]) + "\n\n\n" +

            cmdlang.command + "```" + cmd[0] + "filter" + "```" + "\n" +
            cmdlang.info + modulelang.filter + "\n" +
            cmdlang.example + "\n\n" + modulelang.filter2.replace(/&/gi, cmd[0]) + "\n\n\n" +

            cmdlang.command + "```" + cmd[0] + "stop" + "```" + "\n" +
            cmdlang.info + modulelang.stop + "\n" +
            cmdlang.example + "\n\n" + modulelang.stop2.replace(/&/gi, cmd[0])

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
      await Proto.sendMessage(meid, { text: startlang.msg.replace("{c}", PrimonDB.db_url).replace("{c}", PrimonDB.token_key).replace("&", cmd[0]) });
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
                    args == "filter" ||
                    args == "Filter" ||
                    args == "FILTER"
                  ) {
                    return await Proto.sendMessage(
                      jid,
                      { text: cmds(modulelang.filter3, 3, cmd[0]) },
                      { quoted: m.messages[0] }
                    );
                  } else if (
                    args == "stop" ||
                    args == "Stop" ||
                    args == "STOP"
                  ) {
                    return await Proto.sendMessage(
                      jid,
                      { text: cmds(modulelang.stop3, 3, cmd[0]) },
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
                  } else if (
                    args == "welcome" ||
                    args == "Welcome" ||
                    args == "WELCOME"
                  ) {
                    return await Proto.sendMessage(
                      jid,
                      { text: cmds(modulelang.welcome, 3, cmd[0]) },
                      { quoted: m.messages[0] }
                    );
                  } else if (
                    args == "update" ||
                    args == "Updtae" ||
                    args == "UPDATE"
                  ) {
                    return await Proto.sendMessage(
                      jid,
                      { text: cmds(modulelang.update2, 2, cmd[0]) },
                      { quoted: m.messages[0] }
                    );
                  } else {
                    command_list.map((Element) => {
                      var similarity = test_diff(args, Element);
                      diff.push(similarity);
                    });
                    var filt = diff.filter((mum) => mum > 0.8);
                    if (filt[0] == undefined || filt[0] == "undefined") {
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
                      
                    });
                  }
                }
              }

              // Ping
              else if (attr == "ping") {
                await Proto.sendMessage(jid, { delete: msgkey });
                var d1 = new Date().getTime();
                var msg = await Proto.sendMessage(jid, {
                  text: "_Ping, Pong!_",
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
                      re.welcome.map((el) => {
                        ;
                        if (el.jid == jid) {
                          delete el.jid
                          delete el.message
                        }
                      });
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
                      re.welcome.map((el) => {
                        ;
                        if (el.jid == jid) {
                          delete el.jid
                          delete el.message
                        }
                      });
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
                      return await Proto.sendMessage(
                        jid,
                        { text: welcomelang.suc_set_welcome },
                        { quoted: m.messages[0] }
                      );
                    }
                  } else {
                    if (args == "delete") {
                      var re = PrimonDB;
                      re.welcome.map((el) => {
                        ;
                        if (el.jid == jid) {
                          delete el.jid
                          delete el.message
                        }
                      });
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
                      re.welcome.map((el) => {
                        ;
                        if (el.jid == jid) {
                          delete el.jid
                          delete el.message
                        }
                      });
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
                      re.goodbye.map((el) => {
                        ;
                        if (el.jid == jid) {
                          delete el.jid
                          delete el.message
                        }
                      });
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
                        { text: goodbyelang.suc_del_goodbye },
                        { quoted: m.messages[0] }
                      );
                    } else {
                      var re = PrimonDB;
                      var d = { jid: jid, message: repliedmsg };
                      re.goodbye.map((el) => {
                        ;
                        if (el.jid == jid) {
                          delete el.jid
                          delete el.message
                        }
                      });
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
                      return await Proto.sendMessage(
                        jid,
                        { text: goodbyelang.suc_set_goodbye },
                        { quoted: m.messages[0] }
                      );
                    }
                  } else {
                    if (args == "delete") {
                      var re = PrimonDB;
                      re.goodbye.map((el) => {
                        ;
                        if (el.jid == jid) {
                          delete el.jid
                          delete el.message
                        }
                      });
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
                        { text: goodbyelang.suc_del_goodbye },
                        { quoted: m.messages[0] }
                      );
                    } else if (args == "") {
                      var re = PrimonDB.goodbye;
                      var d = re.filter((id) => id.jid == jid);
                      if (d.length == 0) {
                        return await Proto.sendMessage(
                          jid,
                          { text: goodbyelang.not_set_goodbye },
                          { quoted: m.messages[0] }
                        );
                      } else {
                        return await Proto.sendMessage(
                          jid,
                          { text: goodbyelang.alr_set_goodbye + d[0].message },
                          { quoted: m.messages[0] }
                        );
                      }
                    } else {
                      var re = PrimonDB;
                      var d = { jid: jid, message: args };
                      re.goodbye.map((el) => {
                        ;
                        if (el.jid == jid) {
                          delete el.jid
                          delete el.message
                        }
                      });
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
                      return await Proto.sendMessage(
                        jid,
                        { text: goodbyelang.suc_set_goodbye },
                        { quoted: m.messages[0] }
                      );
                    }
                  }
                }
              }

              // Filter
              else if (attr == "filter") {
                await Proto.sendMessage(jid, { delete: msgkey });
                if (isreplied) {
                  if (args == "") {
                    return await Proto.sendMessage(
                      jid,
                      { text: filterlang.null.replace(/&/gi, cmd[0]) },
                      { quoted: m.messages[0] }
                    );
                  } else {
                    var re = PrimonDB;
                    re.filter.map((el) => {
                      ;
                      if (el.trigger == args && el.jid == jid) {
                        delete el.trigger
                        delete el.message
                        delete el.jid
                      }
                    });
                    var d = { jid: jid, trigger: args, message: repliedmsg }
                    re.filter.push(d)
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
                      { text: filterlang.succ.replace("&", args) }
                    );
                  }
                } else {
                  if (args == "") {
                    var re = PrimonDB;
                    var filter_list = "";
                    re.filter.map((el) => {
                      ;
                      if (el.jid == jid) {
                        filter_list += "🔎 ```" + el.trigger + "``` \n"
                      }
                    });
                    if (filter_list == "") {
                      return await Proto.sendMessage(
                        jid,
                        { text: filterlang.nolist }
                      );
                    }
                    return await Proto.sendMessage(
                      jid,
                      { text: filterlang.list + filter_list }
                    );
                  }
                  if (!args.includes('"')) {
                    return await Proto.sendMessage(
                      jid,
                      { text: filterlang.null2.replace(/&/gi, cmd[0]) }
                    );
                  } else {
                    try {
                      var trigger = args.split('"')[1]
                      var f_message = args.split('"')[3]
                    } catch {
                      return await Proto.sendMessage(
                        jid,
                        { text: filterlang.null2.replace(/&/gi, cmd[0]) }
                      );
                    }
                    var re = PrimonDB;
                    re.filter.map((el) => {
                      if (el.trigger == args && el.jid == jid) {
                        delete el.trigger
                        delete el.message
                        delete el.jid
                      }
                    });
                    var d = { jid: jid, trigger: trigger, message: f_message }
                    re.filter.push(d)
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
                      { text: filterlang.succ.replace("&", trigger) }
                    );
                  }
                }
              }


              // Stop Filter
              else if (attr == "stop") {
                await Proto.sendMessage(jid, { delete: msgkey });
                if (isreplied) {
                  var re = PrimonDB;
                  var rst = ""
                  re.filter.map((el) => {
                    
                    if (el.jid == jid && el.trigger == repliedmsg) {
                      delete el.jid
                      rst = "1"
                      delete el.trigger
                      delete el.message
                    }
                  })
                  if (rst == "") {
                    return await Proto.sendMessage(
                      jid,
                      { text: stoplang.null }
                    );
                  }
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
                    { text: stoplang.succ.replace("&", repliedmsg) }
                  );
                } else {
                  if (args == "") {
                    return await Proto.sendMessage(
                      jid,
                      { text: stoplang.null2.replace("&", cmd[0]) }
                    );
                  }
                  var re = PrimonDB;
                  var rst = ""
                  re.filter.map((el) => {
                    
                    if (el.jid == jid && el.trigger == args) {
                      delete el.jid
                      rst = "1"
                      delete el.trigger
                      delete el.message
                    }
                  })
                  if (rst == "") {
                    return await Proto.sendMessage(
                      jid,
                      { text: stoplang.null }
                    );
                  }
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
                    { text: stoplang.succ.replace("&", args) }
                  );
                }
              }

              // Update
              else if (attr == "update") {
                await Proto.sendMessage(jid, { delete: msgkey });
                var cmmts = await axios.get("https://api.github.com/users/phaticusthiccy/events/public")
                var news = [];
                var author_cmts = [];
                cmmts.data.map((Element) => {
                  if (Element.repo.name == "phaticusthiccy/PrimonProto") {
                    news.push(Element.payload.commits[0].message)
                    author_cmts.push(Element.payload.commits[0].author.name)
                  }
                })
                var msg = 
                "*◽ " + author_cmts[0] + "* :: _" + news[0] + "_" + "\n" +
                "*◽ " + author_cmts[1] + "* :: _" + news[1] + "_" + "\n" +
                "*◽ " + author_cmts[2] + "* :: _" + news[2] + "_"
                await Proto.sendMessage(jid, { text: modulelang.update + msg})
                shell.exec("npm start")
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
                      console.log(ppUrl)
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
                        caption: PrimonDB.alive_msg.replace("{vid: ", "").replace(img_link, "")
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
