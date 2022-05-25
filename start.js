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

const { DataTypes } = require("sequelize");
const greetingDB = require("./sql/greetings"); // GreetingsDB, getMessage, deleteMessage, setMessage
const openapi = require("@phaticusthiccy/open-apis");
const config = require("./config_proto");

const {
  dictEmojis,
  textpro_links,
  argfinder,
  bademojis,
  afterarg,
  String,
  react,
} = require("./add");
const { getMessage } = require("./sql/greetings");

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
    level:
      String(process.env.DEBUG).toLowerCase() === "true" ? "trace" : "silent",
    stream: "store",
  }),
});

const PrimonDB = config.DATABASE.define("PrimonProto", {
  info: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
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

var command_list = ["textpro", "tagall", "ping"],
  diff = [];

async function Primon() {
  const Proto = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
  });

  Proto.ev.on("group-participants.update", async (st) => {
    console.log(st);
    if (st.action == "remove") {
      var gb = await getMessage(jid, "goodbye");
      if (gb !== false) {
        if (gb.message.includes("{gpp}")) {
          if (gb.message.includes("{img:")) {
            return await Proto.sendMessage(jid, {
              text: cmdlang.wrongwelcomePfp_gpp_img.replace(
                "{%c}",
                cmdlang.goodbye
              ),
            });
          } else if (gb.message.includes("{vid:")) {
            return await Proto.sendMessage(jid, {
              text: cmdlang.wrongwelcomePfp_gpp_vid.replace(
                "{%c}",
                cmdlang.goodbye
              ),
            });
          } else {
            var pfp = await Proto.profilePictureUrl(jid, "image");
            if (pfp == undefined || pfp == "") {
              return await Proto.sendMessage(jid, { text: modulelang.no_pfp });
            }
            var img = await axios.get(pfp, { responseType: "arraybuffer" });
            console.log(pfp);
            return await Proto.sendMessage(jid, {
              image: Buffer.from(img.data),
              caption: gb.message.replace("{gpp}", ""),
              mimetype: Mimetype.png,
            });
          }
        } else {
          if (gb.message.includes("{img:")) {
            if (gb.message.includes("{vid:")) {
              return await Proto.sendMessage(jid, {
                text: cmdlang.wrongwelcomePfp_img_vid.replace(
                  "{%c}",
                  cmdlang.goodbye
                ),
              });
            }
            try {
              var img_link = gb.message.split("{img: ")[1].split("}")[0] + "}";
              var img = await axios.get(
                gb.message.split("{img: ")[1].split("}")[0],
                { responseType: "arraybuffer" }
              );
            } catch {
              return await Proto.sendMessage(jid, {
                text: modulelang.error_img,
              });
            }
            console.log(pfp);
            try {
              return await Proto.sendMessage(jid, {
                image: Buffer.from(img.data),
                caption: gb.message.replace("{img: ", "").replace(img_link, ""),
                mimetype: Mimetype.png,
              });
            } catch {
              return await Proto.sendMessage(jid, {
                text: modulelang.error_img,
              });
            }
          } else if (gb.message.includes("{vid:")) {
            if (gb.message.includes("{img:")) {
              return await Proto.sendMessage(jid, {
                text: cmdlang.wrongwelcomePfp_img_vid.replace(
                  "{%c}",
                  cmdlang.goodbye
                ),
              });
            }
            try {
              var vid_link = gb.message.split("{vid: ")[1].split("}")[0] + "}";
              ytdl(
                gb.message.split("{vid: ")[1].split("}")[0],
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
                caption: gb.message.replace("{vid: ", "").replace(vid_link, ""),
                mimetype: Mimetype.mp4,
              });
            } catch {
              return await Proto.sendMessage(jid, {
                text: modulelang.error_vid,
              });
            }
          } else {
            return await Proto.sendMessage(jid, { text: gb.message });
          }
        }
      }
    } else if (st.action == "add") {
      var gb = await getMessage(jid);
      if (gb !== false) {
        if (gb.message.includes("{gpp}")) {
          if (gb.message.includes("{img:")) {
            return await Proto.sendMessage(jid, {
              text: cmdlang.wrongwelcomePfp_gpp_img.replace(
                "{%c}",
                cmdlang.welcome
              ),
            });
          } else if (gb.message.includes("{vid:")) {
            return await Proto.sendMessage(jid, {
              text: cmdlang.wrongwelcomePfp_gpp_vid.replace(
                "{%c}",
                cmdlang.welcome
              ),
            });
          } else {
            var pfp = await Proto.profilePictureUrl(jid, "image");
            if (pfp == undefined || pfp == "") {
              return await Proto.sendMessage(jid, { text: modulelang.no_pfp });
            }
            var img = await axios.get(pfp, { responseType: "arraybuffer" });
            console.log(pfp);
            return await Proto.sendMessage(jid, {
              image: Buffer.from(img.data),
              caption: gb.message.replace("{gpp}", ""),
              mimetype: Mimetype.png,
            });
          }
        } else {
          if (gb.message.includes("{img:")) {
            if (gb.message.includes("{vid:")) {
              return await Proto.sendMessage(jid, {
                text: cmdlang.wrongwelcomePfp_img_vid.replace(
                  "{%c}",
                  cmdlang.welcome
                ),
              });
            }
            try {
              var img_link = gb.message.split("{img: ")[1].split("}")[0] + "}";
              var img = await axios.get(
                gb.message.split("{img: ")[1].split("}")[0],
                { responseType: "arraybuffer" }
              );
            } catch {
              return await Proto.sendMessage(jid, {
                text: modulelang.error_img,
              });
            }
            console.log(pfp);
            try {
              return await Proto.sendMessage(jid, {
                image: Buffer.from(img.data),
                caption: gb.message.replace("{img: ", "").replace(img_link, ""),
                mimetype: Mimetype.png,
              });
            } catch {
              return await Proto.sendMessage(jid, {
                text: modulelang.error_img,
              });
            }
          } else if (gb.message.includes("{vid:")) {
            if (gb.message.includes("{img:")) {
              return await Proto.sendMessage(jid, {
                text: cmdlang.wrongwelcomePfp_img_vid.replace(
                  "{%c}",
                  cmdlang.welcome
                ),
              });
            }
            try {
              var vid_link = gb.message.split("{vid: ")[1].split("}")[0] + "}";
              ytdl(
                gb.message.split("{vid: ")[1].split("}")[0],
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
                caption: gb.message.replace("{vid: ", "").replace(vid_link, ""),
                mimetype: Mimetype.mp4,
              });
            } catch {
              return await Proto.sendMessage(jid, {
                text: modulelang.error_vid,
              });
            }
          } else {
            return await Proto.sendMessage(jid, { text: gb.message });
          }
        }
      }
    }
  });
  Proto.ev.on("creds.update", saveState);
  await config.DATABASE.sync();
  var message,
    isreplied,
    repliedmsg,
    jid,
    isbutton,
    msgkey,
    btnid,
    sudo1,
    sudo = [];

  if (process.env.SUDO !== false) {
    if (process.env.SUDO.includes(",")) {
      var sudo1 = process.env.SUDO.split(",");
      sudo1.map((Element) => {
        sudo.push(Element + "@s.whatsapp.net");
      });
    } else {
      sudo.push(process.env.SUDO);
    }
  }
  try {
    sudo.push(Proto.user.id.split(":")[0] + "@s.whatsapp.net");
  } catch {
    sudo.push(Proto.user.id.split("@")[0] + "@s.whatsapp.net");
  }
  Proto.ev.on("messages.upsert", async (m) => {
    console.log(m);
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
    console.log(message);
    console.log(isbutton);
    var cmd1 = process.env.HANDLER;
    var cmd;
    if (cmd1.length > 1) {
      cmd = cmd1.split("");
    } else {
      cmd = [cmd1];
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
      g_participant =
        m.messages[0].key.participant.split("@")[0] + "@s.whatsapp.net";
    }
    if (g_participant == "@s.whatsapp.net") {
      g_participant = "0";
    }

    // Buttons
    if (message == MenuLang.menu && isbutton) {
      if (sudo.includes(g_participant)) {
        return await Proto.sendMessage(
          jid,
          { text: "Test" },
          { quoted: m.messages[0] }
        );
      }
    }

    if (message !== undefined) {
      if (m.type == "notify") {
        if (sudo.includes(g_participant)) {
          if (process.env.SUDO !== false && sudo.length > 0) {
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
                    console.log(diff);
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
                          modulelang.pron + command_list[diff.indexOf(filt[0])],
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
                      caption: "By Primon Proto",
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
                    var img = await openapi.textpro(url, text);
                    var img2 = await axios.get(img, {
                      responseType: "arraybuffer",
                    });
                    return await Proto.sendMessage(jid, {
                      image: Buffer.from(img2.data),
                      caption: "By Primon Proto",
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
                        String(timestep) +
                        "ms" +
                        pinglang.badping,
                    },
                    { quoted: msg }
                  );
                } else {
                  return await Proto.sendMessage(jid, {
                    text: pinglang.ping + String(timestep) + "ms",
                  });
                }
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
                    await greetingDB.deleteMessage(jid, "welcome")
                    return await Proto.sendMessage(
                      jid,
                      { text: welcomelang.suc_del_welcome },
                      { quoted: m.messages[0] }
                    );
                  } else {
                    await greetingDB.setMessage(jid, "welcome", repliedmsg)
                    return await Proto.sendMessage(
                      jid,
                      { text: welcomelang.suc_set_welcome },
                      { quoted: m.messages[0] }
                    );
                  }
                } else {
                  if (args == "delete") {
                    await greetingDB.deleteMessage(jid, "welcome")
                    return await Proto.sendMessage(
                      jid,
                      { text: welcomelang.suc_del_welcome },
                      { quoted: m.messages[0] }
                    );
                  } else if (arg == "") {
                    var wmsg = await getMessage(jid, "welcome")
                    if (wmsg == false) {
                      return await Proto.sendMessage(
                        jid,
                        { text: welcomelang.not_set_welcome },
                        { quoted: m.messages[0] }
                      );
                    } else {
                      return await Proto.sendMessage(
                        jid,
                        { text: welcomelang.alr_set_welcome + wmsg.message},
                        { quoted: m.messages[0] }
                      );
                    }
                  } else {
                    await greetingDB.setMessage(jid, "welcome", args)
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
                    await greetingDB.deleteMessage(jid, "goodbye")
                    return await Proto.sendMessage(
                      jid,
                      { text: goodbyelang.suc_del_goodbye },
                      { quoted: m.messages[0] }
                    );
                  } else {
                    await greetingDB.setMessage(jid, "goodbye", repliedmsg)
                    return await Proto.sendMessage(
                      jid,
                      { text: goodbyelang.suc_set_goodbye },
                      { quoted: m.messages[0] }
                    );
                  }
                } else {
                  if (args == "delete") {
                    await greetingDB.deleteMessage(jid, "goodbye")
                    return await Proto.sendMessage(
                      jid,
                      { text: goodbyelang.suc_del_goodbye },
                      { quoted: m.messages[0] }
                    );
                  } else if (arg == "") {
                    var wmsg = await getMessage(jid, "goodbye")
                    if (wmsg == false) {
                      return await Proto.sendMessage(
                        jid,
                        { text: goodbyelang.not_set_goodbye },
                        { quoted: m.messages[0] }
                      );
                    } else {
                      return await Proto.sendMessage(
                        jid,
                        { text: goodbyelang.alr_set_goodbye + wmsg.message},
                        { quoted: m.messages[0] }
                      );
                    }
                  } else {
                    await greetingDB.setMessage(jid, "goodbye", args)
                    return await Proto.sendMessage(
                      jid,
                      { text: goodbyelang.suc_set_goodbye },
                      { quoted: m.messages[0] }
                    );
                  }
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
