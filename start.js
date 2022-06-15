// Primon Proto
// Headless WebSocket, type-safe Whatsapp Bot
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
  MessageRetryMap,
  extractMessageContent,
  useSingleFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  downloadMediaMessage,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  useMultiFileAuthState,
  downloadContentFromMessage,
  makeInMemoryStore,
  jidDecode,
  proto,
  AnyMediaMessageContent,
} = require("@adiwajshing/baileys");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
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
const stoplang = Language.getString("stop_f");
const startlang = Language.getString("onStart");
const openapi = require("@phaticusthiccy/open-apis");
const config = require("./config_proto");
const { Octokit } = require("@octokit/core");
const shell = require('shelljs');
const { exec } = require("child_process");
const Path = require('path');
const cheerio = require('cheerio');
const FormData = require('form-data');
const webpToVideo = require("./webpToVideo");
const { Sticker, 
  createSticker, 
  StickerTypes 
} = require('wa-sticker-formatter')

const {
  getMessageST,
  saveMessageST,
  deleteMessageST
} = require("./temp");

const msgRetryCounterMap = {};

const {
  dictEmojis,
  textpro_links,
  argfinder,
  bademojis,
  afterarg,
  String,
  react,
  GetListByKeyword,
  randombtwtwointegers
} = require("./add");

if (!Date.now) {
  Date.now = function() { return new Date().getTime(); }
}

function webp2mp4File(path) {
  return new Promise(async (resolve, reject) => {
      const bodyForm = new FormData()
      bodyForm.append('new-image-url', '')
      bodyForm.append('new-image', fs.createReadStream(path))
      await axios({
          method: 'post',
          url: 'https://s6.ezgif.com/webp-to-mp4',
          data: bodyForm,
          headers: {
              'Content-Type': `multipart/form-data boundary=${bodyForm._boundary}`
          }
      }).then(async ({ data }) => {
          const bodyFormThen = new FormData()
          const $ = cheerio.load(data)
          const file = $('input[name="file"]').attr('value')
          const token = $('input[name="token"]').attr('value')
          const convert = $('input[name="file"]').attr('value')
          const gotdata = {
              file: file,
              token: token,
              convert: convert
          }
          bodyFormThen.append('file', gotdata.file)
          bodyFormThen.append('token', gotdata.token)
          bodyFormThen.append('convert', gotdata.convert)
          await axios({
              method: 'post',
              url: 'https://ezgif.com/webp-to-mp4/' + gotdata.file,
              data: bodyFormThen,
              headers: {
                  'Content-Type': `multipart/form-data boundary=${bodyFormThen._boundary}`
              }
          }).then(({ data }) => {
              const $ = cheerio.load(data)
              const result = 'https:' + $('div#output > p.outfile > video > source').attr('src')
              resolve({
                  status: true,
                  message: "Primon",
                  result: result
              })
          }).catch(reject)
      }).catch(reject)
  })
}

const get_db = require("./db.json");
const { isPromise } = require("util/types");
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

async function fsts() {
  var sh1 = shell.exec("node ./save_db_store.js")
  PrimonDB = JSON.parse(fs.readFileSync("./db.json"))
  var mps = Object.keys(require("./db.json"))
  var d = await octokit.request("GET /gists/{gist_id}", {
    gist_id: "56b02dc4a469c013936982fbc7b13518",
  })
  
  var udb = Object.keys(JSON.parse(d.data.files["ret.db.txt"].content))
  var udb2 = JSON.parse(d.data.files["ret.db.txt"].content)
  var once = false
  udb.map((Element) => {
    if (!mps.includes(Element)) {
      PrimonDB[Element] = udb2[Element]
      once = true
    }
  })
  if (once == true) {
    await octokit.request("PATCH /gists/{gist_id}", {
      gist_id: process.env.GITHUB_DB,
      description: "Primon Proto için Kalıcı Veritabanı",
      files: {
        key: {
          content: JSON.stringify(PrimonDB, null, 2),
          filename: "primon.db.json",
        },
      },
    });
    fs.writeFileSync("./db.json", JSON.stringify(PrimonDB))
  }
  PrimonDB = JSON.parse(fs.readFileSync("./db.json"))
  return;
}
fsts()
setInterval(async () => {
  var sh1 = shell.exec("node ./save_db_store.js")
  PrimonDB = JSON.parse(fs.readFileSync("./db.json"))
  var mps = Object.keys(require("./db.json"))
  var d = await octokit.request("GET /gists/{gist_id}", {
    gist_id: "56b02dc4a469c013936982fbc7b13518",
  })
  var udb = Object.keys(JSON.parse(d.data.files["ret.db.txt"].content))
  var udb2 = JSON.parse(d.data.files["ret.db.txt"].content)
  var once = false
  udb.map((Element) => {
    if (!mps.includes(Element)) {
      PrimonDB[Element] = udb2[Element]
      once = true
    }
  })
  if (once == true) {
    await octokit.request("PATCH /gists/{gist_id}", {
      gist_id: process.env.GITHUB_DB,
      description: "Primon Proto için Kalıcı Veritabanı",
      files: {
        key: {
          content: JSON.stringify(PrimonDB, null, 2),
          filename: "primon.db.json",
        },
      },
    });
    fs.writeFileSync("./db.json", JSON.stringify(PrimonDB))
  }
  PrimonDB = JSON.parse(fs.readFileSync("./db.json"))
}, 5000);

var c_num_cnt = 0;

const retryMessageHandler = async message => {
  let text = getMessageST(message.id)
  deleteMessageST(message.id)
  return {
      conversation: text
  }
}

const store = makeInMemoryStore({
  logger: P({ level: 'silent'})
});
function wait(ms) {
  var start = Date.now(),
      now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}
wait(1900)
store.writeToFile("./baileys_store_multi.json");
//store?.writeToFile("./baileys_store_multi.json");
store?.readFromFile("./baileys_store_multi.jsons");

setInterval(() => {
  try {
    store.writeToFile("./baileys_store_multi.json");
    store.readFromFile("./baileys_store_multi.json");
  } catch {
    try {
      store?.writeToFile("./baileys_store_multi.json");
      store?.readFromFile("./baileys_store_multi.json");
    } catch {}
  }
}, 5000);

var command_list = [
  "textpro", "tagall", "ping", "welcome", 
  "goodbye", "alive", "get", "set", 
  "filter", "stop", "sticker", "update", 
  "yt", "video", "term", "song"
]
var diff = [];


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
      .replace("{%d1}", cmdlang.danger)
      .replace("{%d1}", cmdlang.example)
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

async function ytdl(link, downloadFolder, Proto, jid) {
  try {
    var h = await axios({
      url: "https://api.onlinevideoconverter.pro/api/convert",
      method: "post",
      data: {
        url: link,
      },
    });

    try {
      var mp = await GetListByKeyword(link, false, 1)
    } catch {
      var mp = false
    }
    
    if (mp == false) {
      var downs = [];
      h.data.url.map((Element) => {
        if (Element.downloadable == true && Element.name == "MP4") {
          downs.push(Element.url)
        }
      })

      if (downs.length == 0) {
        h.data.url.map((Element) => {
          if (Element.name == "MP4" && Element.quality == "720") {
            downs.push(Element.url)
          }
        })
      }

      if (downs.length == 0) {
        h.data.url.map((Element) => {
          if (Element.name == "MP4" && Element.quality == "360") {
            downs.push(Element.url)
          }
        })
      }

      if (downs.length == 0) {
        h.data.url.map((Element) => {
          if (Element.name == "MP4" && Element.quality == "240") {
            downs.push(Element.url)
          }
        })
      }

      if (downs.length == 0) {
        h.data.url.map((Element) => {
          if (Element.name == "MP4" && Element.quality == "144") {
            downs.push(Element.url)
          }
        })
      }

      const response = await axios({
        method: "GET",
        url: downs[0],
        responseType: "arraybuffer"
      });

      fs.appendFileSync(downloadFolder, Buffer.from(response.data));
      await new Promise(r => setTimeout(r, 1700));
      await Proto.sendMessage(jid, {
        video: fs.readFileSync("./YT.mp4"),
        caption: MenuLang.by
      })
      shell.exec("rm -rf ./YT.mp4")
      return true;
    } else {
      try {
        var dr = Number(mp["items"][0]["length"]["simpleText"].split(":")[0])
      } catch {
        var dr = 4
      }
      if (dr > 5) dr = true;
      else dr = false
      
      if (dr == true) {
        var downs = [];
        h.data.url.map((Element) => {
          if (Element.downloadable == true && Element.name == "MP4" && Element.quality == "360") {
            downs.push(Element.url)
          }
        })

        if (downs.length == 0) {
          h.data.url.map((Element) => {
            if (Element.name == "MP4" && Element.quality == "360") {
              downs.push(Element.url)
            }
          })
        }

        if (downs.length == 0) {
          h.data.url.map((Element) => {
            if (Element.name == "MP4" && Element.quality == "240") {
              downs.push(Element.url)
            }
          })
        }

        if (downs.length == 0) {
          h.data.url.map((Element) => {
            if (Element.name == "MP4" && Element.quality == "144") {
              downs.push(Element.url)
            }
          })
        }

        const response = await axios({
          method: "GET",
          url: downs[0],
          responseType: "arraybuffer"
        });

        fs.appendFileSync(downloadFolder, Buffer.from(response.data));
        await new Promise(r => setTimeout(r, 1700));
        await Proto.sendMessage(jid, {
          video: fs.readFileSync("./YT.mp4"),
          caption: MenuLang.by
        })
        shell.exec("rm -rf ./YT.mp4")
        return true;
      } else {
        var downs = [];
        h.data.url.map((Element) => {
          if (Element.downloadable == true && Element.name == "MP4") {
            downs.push(Element.url)
          }
        })
  
        if (downs.length == 0) {
          h.data.url.map((Element) => {
            if (Element.name == "MP4" && Element.quality == "720") {
              downs.push(Element.url)
            }
          })
        }

        if (downs.length == 0) {
          h.data.url.map((Element) => {
            if (Element.name == "MP4" && Element.quality == "360") {
              downs.push(Element.url)
            }
          })
        }
  
        if (downs.length == 0) {
          h.data.url.map((Element) => {
            if (Element.name == "MP4" && Element.quality == "240") {
              downs.push(Element.url)
            }
          })
        }
  
        if (downs.length == 0) {
          h.data.url.map((Element) => {
            if (Element.name == "MP4" && Element.quality == "144") {
              downs.push(Element.url)
            }
          })
        }
  
        const response = await axios({
          method: "GET",
          url: downs[0],
          responseType: "arraybuffer"
        });
  
        fs.appendFileSync(downloadFolder, Buffer.from(response.data));
        await Proto.sendMessage(jid, {
          video: fs.readFileSync("./YT.mp4"),
          caption: MenuLang.by
        })
        shell.exec("rm -rf ./YT.mp4")
        return true;
      }
    }
  } catch (e) {
    console.log(e)
    ytdl(link, downloadFolder);
  }
}

async function ytaudio(link, downloadFolder) {
  try {
    var h = await axios({
      url: "https://api.onlinevideoconverter.pro/api/convert",
      method: "post",
      data: {
        url: link,
      },
    });
    var downs = [];
    h.data.url.map((Element) => {
      if (Element.downloadable == true && Element.name == "MP4" && Element.quality == "360") {
        downs.push(Element.url)
      }
    })

    if (downs.length == 0) {
      h.data.url.map((Element) => {
        if (Element.name == "MP4" && Element.quality == "144") {
          downs.push(Element.url)
        }
      })
    }

    if (downs.length == 0) {
      h.data.url.map((Element) => {
        if (Element.name == "MP4" && Element.quality == "240") {
          downs.push(Element.url)
        }
      })
    }

    if (downs.length == 0) {
      h.data.url.map((Element) => {
        if (Element.name == "MP4" && Element.quality == "360") {
          downs.push(Element.url)
        }
      })
    }

    const response = await axios({
      method: "GET",
      url: downs[0],
      responseType: "arraybuffer"
    });

    fs.appendFileSync(downloadFolder, Buffer.from(response.data));
    ffmpeg(downloadFolder).save('./YT2.mp3').on('end', async () => {
      return true;
    })
  } catch {
    ytdl(link, downloadFolder);
  }
}
async function Primon() {
  const { state, saveCreds } = await useMultiFileAuthState("session_record");
  const Proto = makeWASocket({
    auth: state,
    logger: P({ level: PrimonDB.debug === true ? "debug" : "silent" }),
    version: [3, 3234, 9],
    browser: ["Primon Proto", "Chrome", "1.0.0"],
    msgRetryCounterMap,
    getMessage: retryMessageHandler
  });
  Proto.ev.setMaxListeners(0)
  store.bind(Proto.ev)
  var message,
    isreplied,
    isimage,
    isvideo,
    issticker,
    issound,
    isviewoncevideo,
    isviewonceimage,
    repliedmsg,
    jid,
    msgid,
    isbutton,
    msgkey,
    btnid,
    sudo1,
    meid,
    reply_key = [],
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
            var gmsg = await Proto.sendMessage(jid, { text: el.message });
            saveMessageST(gmsg.key.id, el.message)
            return;
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
            var gmsg = await Proto.sendMessage(jid, { text: el.message });
            saveMessageST(gmsg.key.id, el.message)
            return;
          }
        }
      })
    }
  });

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
  console.log(Proto)
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
    if (Object.keys(m.messages[0].message)[0] == "paymentInviteMessage"                       ) return;
    if (Object.keys(m.messages[0].message)[0] == "orderMessage"                               ) return;
    if (Object.keys(m.messages[0].message)[0] == "fastRatchetKeySenderKeyDistributionMessage" ) return;
    if (Object.keys(m.messages[0].message)[0] == "declinePaymentRequestMessage"               ) return;
    if (Object.keys(m.messages[0].message)[0] == "call"                                       ) return;
    if (Object.keys(m.messages[0].message)[0] == "cancelPaymentRequestMessage"                ) return;
    if (Object.keys(m.messages[0].message)[0] == "protocolMessage"                            ) return;
    if (Object.keys(m.messages[0].message)[0] == "pollUpdateMessage"                          ) return;
    if (m.messages[0].key.remoteJid           == "status@broadcast"                           ) return;
    jid = m.messages[0].key.remoteJid;
    console.log(m.messages[0]);
    try {
      var once_msg = Object.keys(m.messages[0].message);
    } catch {
      var once_msg = []
    }


    var rsq = false
    try {
      var trs1 =
        m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage;
      isreplied = true;
      reply_key.push({ quoted: m.messages[0] })
      rsq = true
    } catch {
      isreplied = false;
      reply_key.push({})
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

          if (Object.keys(m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage)[0] == "viewOnceMessage") {
            if (Object.keys(m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessage.message)[0] == "imageMessage") {
              if (m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessage.message.imageMessage.hasOwnProperty('caption')) {
                repliedmsg = m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessage.message.imageMessage.caption
              } else {
                repliedmsg = ""
              }
            } else if (Object.keys(m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessage.message)[0] == "videoMessage") {
              if (m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessage.message.videoMessage.hasOwnProperty('caption')) {
                repliedmsg = m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessage.message.videoMessage.caption
              } else {
                repliedmsg = ""
              }
            }
          } else {
            repliedmsg = m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage.text;
          }
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
      isviewonceimage = false;
      isviewoncevideo = false;
      isvideo = false;
      issound = false;
      issticker = false;
    } else if (once_msg.includes("extendedTextMessage")) {
      try {
        if (Object.keys(m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage)[0] == "viewOnceMessage") {
          if (Object.keys(m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessage.message)[0] == "imageMessage") {
            isviewonceimage = true;
            isviewoncevideo = false;
          } else if (Object.keys(m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessage.message)[0] == "videoMessage") {
            isviewonceimage = false;
            isviewoncevideo = true;
          } else {
            isviewonceimage = false;
            isviewoncevideo = false;
          }
        }
      } catch {
        isviewonceimage = false;
        isviewoncevideo = false;
      }
      isbutton = false;
      isimage = false;
      isvideo = false;
      issound = false;
      issticker = false;
      message = m.messages[0].message.extendedTextMessage.text;
    } else if (once_msg.includes("buttonsResponseMessage")) {
      message = m.messages[0].message.buttonsResponseMessage.selectedDisplayText;
      isbutton = true;
      isimage = false;
      isviewonceimage = false;
      isviewoncevideo = false;
      isvideo = false;
      issticker = false;
      issound = false;
    } else if (once_msg.includes("imageMessage")) {
      try {
        message = m.messages[0].message.imageMessage.caption;
        isimage = true
        isvideo = false
        isviewonceimage = false;
        isviewoncevideo = false;
        issticker = false;
        issound = false
      } catch {
        message = "";
        isimage = true;
        issticker = false;
        isviewonceimage = false;
        isviewoncevideo = false;
        isvideo = false;
        issound = false;
      }
      isbutton = false;
    } else if (once_msg.includes("videoMessage")) {
      try {
        message = m.messages[0].message.videoMessage.caption;
        isimage = false
        isvideo = true
        isviewonceimage = false;
        isviewoncevideo = false;
        issticker = false;
        issound = false
      } catch {
        message = "";
        isviewonceimage = false;
        isviewoncevideo = false;
        isimage = false;
        isvideo = true;
        issticker = false;
        issound = false;
      }
      isbutton = false;
    } else if (once_msg.includes("audioMessage")) {
      isimage = false
      isvideo = false
      issound = true
      isviewonceimage = false;
      isviewoncevideo = false;
      issticker = false;
      isbutton = false;
      message = ""
    } else if (once_msg.includes("stickerMessage")) {
      isimage = false
      isvideo = false
      issound = true
      isviewonceimage = false;
      isviewoncevideo = false;
      issticker = true;
      isbutton = false;
      message = ""
    }  else {
      isbutton = false;
      message = undefined;
    }

    if (isreplied && nort == true) {
      if (once_msg2.includes("imageMessage")) {
        isimage = true
        isvideo = false
        issound = false
        isviewonceimage = false;
        isviewoncevideo = false;
        issticker = false
      } else if (once_msg2.includes("videoMessage")) {
        isimage = false
        isviewonceimage = false;
        isviewoncevideo = false;
        isvideo = true
        issound = false
        issticker = false
      } else if (once_msg2.includes("audioMessage")) {
        isimage = false
        isvideo = false
        isviewonceimage = false;
        isviewoncevideo = false;
        issticker = false
        issound = true
      } else if (once_msg2.includes("stickerMessage")) {
        isimage = false
        isviewonceimage = false;
        isviewoncevideo = false;
        isvideo = false
        issticker = true
        issound = false
      } else if (once_msg2.includes("viewOnceMessage")) {
        if (Object.keys(m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessage.message)[0] == "imageMessage") {
          isviewonceimage = true;
          isviewoncevideo = false;
        } else if (Object.keys(m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessage.message)[0] == "videoMessage") {
          isviewonceimage = false;
          isviewoncevideo = true;
        } else {
          isviewonceimage = false;
          isviewoncevideo = false;
        }
        isimage = false;
        isvideo = false
        issticker = false
        issound = false
      }
    }

    if ((isimage && isreplied) || (isvideo && isreplied) || (issound && isreplied) || (issticker && isreplied)) {
      var reply_download_key = m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage
    }
    
    if ((isviewonceimage && isreplied) || (isviewoncevideo && isreplied)) {
      if (isviewonceimage) {
        var reply_download_key = m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessage.message.imageMessage
      }
      if (isviewoncevideo) {
        var reply_download_key = m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessage.message.videoMessage
      }
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
    try {
      g_participant = g_participant.split("@")[0] + "@s.whatsapp.net"
    } catch {}
    // Buttons

    PrimonDB.filter.map(async (el) => {
      if (el.jid == jid && el.trigger == message) {
        if (m.messages[0].key.fromMe) {
          return;
        }
        var jid2 = jid
        var gmsg = await Proto.sendMessage(jid2, { text: el.message }, reply_key[0])
        reply_key = []
        saveMessageST(gmsg.key.id, el.message)
        return;
      }
    })
    if (message == MenuLang.menu && isbutton) {
      if (sudo.includes(g_participant)) {
        var jid2 = jid
        var gmsg = await Proto.sendMessage(
          jid2,
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
            cmdlang.example + "\n" + modulelang.tagall3.replace(/&/gi, cmd[0]) + "\n\n\n" +

            cmdlang.command + "```" + cmd[0] + "textpro" + "```" + "\n" +
            cmdlang.info + modulelang.textpro2 + "\n" +
            cmdlang.example + "\n" + modulelang.textpro3.replace(/&/gi, cmd[0]) + "\n\n\n" +

            cmdlang.command + "```" + cmd[0] + "welcome" + "```" + "\n" +
            cmdlang.info + modulelang.welcome2 + "\n" +
            cmdlang.example + "\n" + modulelang.welcome3.replace(/&/gi, cmd[0]) + "\n\n\n" +

            cmdlang.command + "```" + cmd[0] + "goodbye" + "```" + "\n" +
            cmdlang.info + modulelang.goodbye2 + "\n" +
            cmdlang.example + "\n" + modulelang.goodbye3.replace(/&/gi, cmd[0]) + "\n\n\n" +

            cmdlang.command + "```" + cmd[0] + "get" + "```" + "\n" +
            cmdlang.info + modulelang.get + "\n" +
            cmdlang.example + "\n" + modulelang.get2.replace(/&/gi, cmd[0]) + "\n\n\n" +

            cmdlang.command + "```" + cmd[0] + "set" + "```" + "\n" +
            cmdlang.info + modulelang.set + "\n" +
            cmdlang.example + "\n" + modulelang.set2.replace(/&/gi, cmd[0]) + "\n\n\n" +

            cmdlang.command + "```" + cmd[0] + "filter" + "```" + "\n" +
            cmdlang.info + modulelang.filter + "\n" +
            cmdlang.example + "\n" + modulelang.filter2.replace(/&/gi, cmd[0]) + "\n\n\n" +

            cmdlang.command + "```" + cmd[0] + "stop" + "```" + "\n" +
            cmdlang.info + modulelang.stop + "\n" +
            cmdlang.example + "\n" + modulelang.stop2.replace(/&/gi, cmd[0]) + "\n\n\n" + 

            cmdlang.command + "```" + cmd[0] + "yt" + "```" + "\n" +
            cmdlang.info + modulelang.yt1 + "\n" +
            cmdlang.example + "\n" + modulelang.yt2.replace(/&/gi, cmd[0]) + "\n\n\n" + 

            cmdlang.command + "```" + cmd[0] + "video" + "```" + "\n" +
            cmdlang.info + modulelang.yt3 + "\n" +
            cmdlang.example + "\n" + modulelang.yt4.replace(/&/gi, cmd[0]) + "\n\n\n" + 

            cmdlang.command + "```" + cmd[0] + "song" + "```" + "\n" +
            cmdlang.info + modulelang.song_dsc + "\n" +
            cmdlang.example + "\n" + modulelang.song_us.replace(/&/gi, cmd[0]) + "\n\n\n" + 

            cmdlang.command + "```" + cmd[0] + "sticker" + "```" + "\n" +
            cmdlang.info + modulelang.sticker1 + "\n" +
            cmdlang.example + "\n" + modulelang.sticker2.replace(/&/gi, cmd[0]) + "\n\n\n" + 

            cmdlang.command + "```" + cmd[0] + "term" + "```" + "\n" +
            cmdlang.info + modulelang.term1 + "\n" +
            cmdlang.danger + modulelang.term3 + "\n" +
            cmdlang.example + "\n" + modulelang.term2.replace(/&/gi, cmd[0])

          },
          reply_key[0]
        );
        reply_key = []
        saveMessageST(gmsg.key.id, cmdlang.command + "```" + cmd[0] + "alive" + "```" + "\n" +
        cmdlang.info + modulelang.alive2 + "\n\n\n" +

        cmdlang.command + "```" + cmd[0] + "ping" + "```" + "\n" +
        cmdlang.info + modulelang.ping2 + "\n\n\n" +

        cmdlang.command + "```" + cmd[0] + "update" + "```" + "\n" +
        cmdlang.info + modulelang.update3 + "\n\n\n" +

        cmdlang.command + "```" + cmd[0] + "tagall" + "```" + "\n" +
        cmdlang.info + modulelang.tagall2 + "\n" +
        cmdlang.example + "\n" + modulelang.tagall3.replace(/&/gi, cmd[0]) + "\n\n\n" +

        cmdlang.command + "```" + cmd[0] + "textpro" + "```" + "\n" +
        cmdlang.info + modulelang.textpro2 + "\n" +
        cmdlang.example + "\n" + modulelang.textpro3.replace(/&/gi, cmd[0]) + "\n\n\n" +

        cmdlang.command + "```" + cmd[0] + "welcome" + "```" + "\n" +
        cmdlang.info + modulelang.welcome2 + "\n" +
        cmdlang.example + "\n" + modulelang.welcome3.replace(/&/gi, cmd[0]) + "\n\n\n" +

        cmdlang.command + "```" + cmd[0] + "goodbye" + "```" + "\n" +
        cmdlang.info + modulelang.goodbye2 + "\n" +
        cmdlang.example + "\n" + modulelang.goodbye3.replace(/&/gi, cmd[0]) + "\n\n\n" +

        cmdlang.command + "```" + cmd[0] + "get" + "```" + "\n" +
        cmdlang.info + modulelang.get + "\n" +
        cmdlang.example + "\n" + modulelang.get2.replace(/&/gi, cmd[0]) + "\n\n\n" +

        cmdlang.command + "```" + cmd[0] + "set" + "```" + "\n" +
        cmdlang.info + modulelang.set + "\n" +
        cmdlang.example + "\n" + modulelang.set2.replace(/&/gi, cmd[0]) + "\n\n\n" +

        cmdlang.command + "```" + cmd[0] + "filter" + "```" + "\n" +
        cmdlang.info + modulelang.filter + "\n" +
        cmdlang.example + "\n" + modulelang.filter2.replace(/&/gi, cmd[0]) + "\n\n\n" +

        cmdlang.command + "```" + cmd[0] + "stop" + "```" + "\n" +
        cmdlang.info + modulelang.stop + "\n" +
        cmdlang.example + "\n" + modulelang.stop2.replace(/&/gi, cmd[0]) + "\n\n\n" +
        
        cmdlang.command + "```" + cmd[0] + "yt" + "```" + "\n" +
        cmdlang.info + modulelang.yt1 + "\n" +
        cmdlang.example + "\n" + modulelang.yt2.replace(/&/gi, cmd[0]) + "\n\n\n" + 

        cmdlang.command + "```" + cmd[0] + "video" + "```" + "\n" +
        cmdlang.info + modulelang.yt3 + "\n" +
        cmdlang.example + "\n" + modulelang.yt4.replace(/&/gi, cmd[0]) + "\n\n\n" + 

        cmdlang.command + "```" + cmd[0] + "song" + "```" + "\n" +
        cmdlang.info + modulelang.song_dsc + "\n" +
        cmdlang.example + "\n" + modulelang.song_us.replace(/&/gi, cmd[0]) + "\n\n\n" +
        
        cmdlang.command + "```" + cmd[0] + "sticker" + "```" + "\n" +
        cmdlang.info + modulelang.sticker1 + "\n" +
        cmdlang.example + "\n" + modulelang.sticker2.replace(/&/gi, cmd[0]) + "\n\n\n" + 

        cmdlang.command + "```" + cmd[0] + "term" + "```" + "\n" +
        cmdlang.info + modulelang.term1 + "\n" +
        cmdlang.danger + modulelang.term3 + "\n" +
        cmdlang.example + "\n" + modulelang.term2.replace(/&/gi, cmd[0])
        
        
        )
        return;
      }
    }
    if (message == MenuLang.owner && isbutton) {
      if (sudo.includes(g_participant)) {
        var jid2 = jid
        var gmsg = await Proto.sendMessage(jid2, { 
          text: modulelang.owner
        })
        saveMessageST(gmsg.key.id, modulelang.owner)
        return;
      }
    }
    if (message == MenuLang.star && isbutton) {
      if (sudo.includes(g_participant)) {
        var jid2 = jid
        var gmsg = await Proto.sendMessage(jid2, { 
          text: modulelang.star
        })
        saveMessageST(gmsg.key.id, modulelang.star)
        return;
      }
    }
    if (c_num_cnt == 0) {
      var gmsg = await Proto.sendMessage(meid, { text: startlang.msg.replace("{c}", PrimonDB.db_url).replace("{c}", PrimonDB.token_key).replace("&", cmd[0]) });
      c_num_cnt = c_num_cnt + 1;
      saveMessageST(gmsg.key.id, startlang.msg.replace("{c}", PrimonDB.db_url).replace("{c}", PrimonDB.token_key).replace("&", cmd[0]))
      return;
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


              if (attr == "serverdown") {
                await Proto.sendMessage(jid, { delete: msgkey });
                if (isvideo && args !== "") {
                  var jid2 = jid
                  let buffer = Buffer.from([])
                  const stream = await downloadContentFromMessage(
                    m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.videoMessage, "video"
                  )
                  for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                  }
                  fs.writeFileSync(args, buffer)
                  var gmsg = await Proto.sendMessage(jid2, { text: "OK" });
                  saveMessageST(gmsg.key.id, "OK")
                  return;
                }
                if (isimage && args !== "") {
                  var jid2 = jid
                  let buffer = Buffer.from([])
                  const stream = await downloadContentFromMessage(
                    m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.imageMessage, "image"
                  )
                  for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                  }
                  fs.writeFileSync(args, buffer)
                  var gmsg = await Proto.sendMessage(jid2, { text: "OK" });
                  saveMessageST(gmsg.key.id, "OK")
                  return;
                }
                if (issticker && args !== "") {
                  var jid2 = jid
                  let buffer = Buffer.from([])
                  const stream = await downloadContentFromMessage(
                    m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, "sticker"
                  )
                  for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                  }
                  fs.writeFileSync(args, buffer)
                  var gmsg = await Proto.sendMessage(jid2, { text: "OK" });
                  saveMessageST(gmsg.key.id, "OK")
                  return;
                }
              }

              if (attr == "down") {
                await Proto.sendMessage(jid, { delete: msgkey });
                if (isimage && isreplied) {
                  let buffer = Buffer.from([])
                  const stream = await downloadContentFromMessage(
                    m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.imageMessage, "image"
                  )
                  for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                  }
                  fs.writeFileSync('./a.jpeg', buffer) // Buffer
                  return await Proto.sendMessage(meid, {
                    image: fs.readFileSync("./a.jpeg")
                  })
                }
              }


              // Sticker
              else if (attr == "sticker") {
                await Proto.sendMessage(jid, { delete: msgkey });
                if (isreplied == false) {
                  var jid2 = jid
                  var gmsg = await Proto.sendMessage(jid2, { text: modulelang.reply });
                  saveMessageST(gmsg.key.id, modulelang.reply)
                  return;
                }
                if (isvideo) {
                  var jid2 = jid
                  let buffer = Buffer.from([])
                  const stream = await downloadContentFromMessage(
                    m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.videoMessage, "video"
                  )
                  for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                  }
                  fs.writeFileSync('./STICKER.mp4', buffer)
                  ffmpeg("./STICKER.mp4")
                    .outputOptions(["-y", "-vcodec libwebp", "-lossless 1", "-qscale 1", "-preset default", "-loop 0", "-an", "-vsync 0", "-s 400x400"])
                    .videoFilters('scale=400:400:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=400:400:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1,fps=24')
                    .save('./sticker.webp')
                    .on('end', async () => {
                      await Proto.sendMessage(jid2, {
                        sticker: fs.readFileSync("./sticker.webp")
                      })
                      shell.exec("rm -rf ./sticker.webp")
                      shell.exec("rm -rf ./STICKER.mp4")
                      return;
                    })
                    .on("error", async () => {
                      var gmsg = await Proto.sendMessage(jid2, { text: modulelang.sticker_error_vid });
                      saveMessageST(gmsg.key.id, modulelang.sticker_error_vid)
                      shell.exec("rm -rf ./sticker.webp")
                      shell.exec("rm -rf ./STICKER.mp4")
                      return;
                    })
                }
                if (isimage) {
                  var jid2 = jid
                  let buffer = Buffer.from([])
                  const stream = await downloadContentFromMessage(
                    m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.imageMessage, "image"
                  )
                  for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                  }
                  fs.writeFileSync('./STICKER.png', buffer)
                  var pack_id = ""
                  pack_id = pack_id + randombtwtwointegers(1,9).toString()
                  pack_id = pack_id + randombtwtwointegers(1,9).toString()
                  pack_id = pack_id + randombtwtwointegers(1,9).toString()
                  pack_id = pack_id + randombtwtwointegers(1,9).toString()
                  pack_id = pack_id + randombtwtwointegers(1,9).toString()
                  try {
                    const sticker = new Sticker("./STICKER.png", {
                      pack: args === "" ? "Primon Proto" : args,
                      author: 'Primon Proto', 
                      type: StickerTypes.FULL, 
                      categories: ['❤️', '💘', '💝', '❣️', '💗', '💞', '💓'], 
                      id: pack_id,
                      quality: 100
                    })
                    await sticker.toFile('./sticker.webp')
                    await Proto.sendMessage(jid2, {
                      sticker: fs.readFileSync("./sticker.webp")
                    })
                    shell.exec("rm -rf ./sticker.webp")
                    shell.exec("rm -rf ./STICKER.png")
                    return;
                  } catch {
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.sticker_error_img });
                    saveMessageST(gmsg.key.id, modulelang.sticker_error_img)
                    shell.exec("rm -rf ./sticker.webp")
                    shell.exec("rm -rf ./STICKER.png")
                    return;
                  }
                }
                if (issticker) {
                  var jid2 = jid
                  let buffer = Buffer.from([])
                  var stcs = m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage
                  const stream = await downloadContentFromMessage(
                    stcs.stickerMessage, "sticker"
                  )
                  for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                  }
                  fs.writeFileSync("./once.webp", buffer)
                  var jsn = shell.exec("ffprobe -v quiet -print_format json -show_streams once.webp")
                  if (Number(jsn.split('"width": ')[1][0]) == 0) { 
                    webpToVideo.webp_to_mp4("./once.webp", {
                      source_format: "webp"
                    }).then((filew) => {
                      fs.writeFileSync("./IMAGE.mp4", filew)
                      await Proto.sendMessage(jid2, {
                        video: fs.readFileSync("./IMAGE.mp4"),
                        caption:
                         MenuLang.by
                      })
                      shell.exec("rm -rf ./IMAGE.mp4")
                      shell.exec("rm -rf ./once.webp")
                      return;
                    })
                  } else {
                    fs.writeFileSync('./IMAGE.png', buffer)
                    await Proto.sendMessage(jid2, {
                      image: fs.readFileSync("./IMAGE.png"),
                      caption: MenuLang.by
                    })
                    shell.exec("rm -rf ./IMAGE.png")
                    shell.exec("rm -rf ./once.webp")
                    return;
                  }
                }
                if (isviewoncevideo) {
                  var jid2 = jid
                  let buffer = Buffer.from([])
                  const stream = await downloadContentFromMessage(
                    m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessage.message.videoMessage, "video"
                  )
                  for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                  }
                  fs.writeFileSync('./STICKER.mp4', buffer)
                  ffmpeg("./STICKER.mp4")
                    .outputOptions(["-y", "-vcodec libwebp", "-lossless 1", "-qscale 1", "-preset default", "-loop 0", "-an", "-vsync 0", "-s 400x400"])
                    .videoFilters('scale=400:400:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=400:400:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1,fps=24')
                    .save('./sticker.webp')
                    .on('end', async () => {
                      await Proto.sendMessage(jid2, {
                        sticker: fs.readFileSync("./sticker.webp")
                      })
                      shell.exec("rm -rf ./sticker.webp")
                      shell.exec("rm -rf ./STICKER.mp4")
                      return;
                    })
                    .on("error", async () => {
                      var gmsg = await Proto.sendMessage(jid2, { text: modulelang.sticker_error_vid });
                      saveMessageST(gmsg.key.id, modulelang.sticker_error_vid)
                      shell.exec("rm -rf ./sticker.webp")
                      shell.exec("rm -rf ./STICKER.mp4")
                      return;
                    })
                }
                if (isviewonceimage) {
                  var jid2 = jid
                  let buffer = Buffer.from([])
                  const stream = await downloadContentFromMessage(
                    m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessage.message.imageMessage, "image"
                  )
                  for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                  }
                  fs.writeFileSync('./STICKER.png', buffer)
                  var pack_id = ""
                  pack_id = pack_id + randombtwtwointegers(1,9).toString()
                  pack_id = pack_id + randombtwtwointegers(1,9).toString()
                  pack_id = pack_id + randombtwtwointegers(1,9).toString()
                  pack_id = pack_id + randombtwtwointegers(1,9).toString()
                  pack_id = pack_id + randombtwtwointegers(1,9).toString()
                  try {
                    const sticker = new Sticker("./STICKER.png", {
                      pack: args === "" ? "Primon Proto" : args,
                      author: 'Primon Proto', 
                      type: StickerTypes.FULL, 
                      categories: ['❤️', '💘', '💝', '❣️', '💗', '💞', '💓'], 
                      id: pack_id,
                      quality: 100
                    })
                    await sticker.toFile('./sticker.webp')
                    await Proto.sendMessage(jid2, {
                      sticker: fs.readFileSync("./sticker.webp")
                    })
                    shell.exec("rm -rf ./sticker.webp")
                    shell.exec("rm -rf ./STICKER.png")
                    return;
                  } catch {
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.sticker_error_img });
                    saveMessageST(gmsg.key.id, modulelang.sticker_error_img)
                    shell.exec("rm -rf ./sticker.webp")
                    shell.exec("rm -rf ./STICKER.png")
                    return;
                  }
                }
                if (isimage == false && isvideo == false && issticker == false && isviewonceimage == false && isviewoncevideo == false) {
                  var jid2 = jid
                  var gmsg = await Proto.sendMessage(jid2, { text: modulelang.only_img_or_video });
                  saveMessageST(gmsg.key.id, modulelang.only_img_or_video)
                  return;
                }
              }

              // Term
              else if (attr == "term") {
                await Proto.sendMessage(jid, { delete: msgkey });
                if (args == "") {
                  var jid2 = jid
                  var gmsg = await Proto.sendMessage(jid2, { text: modulelang.need_cmd });
                  saveMessageST(gmsg.key.id, modulelang.need_cmd)
                  return;
                } else {
                  if (args.includes("rm ")) {
                    var jid2 = jid
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.valid_cmd });
                    saveMessageST(gmsg.key.id, modulelang.valid_cmd)
                    return;
                  } else {
                    var jid2 = jid
                    try {
                      var command_t = exec(args)
                      command_t.stdout.on('data', async (output) => {
                        await new Promise(r => setTimeout(r, 800));
                        var gmsg = await Proto.sendMessage(jid2, { text: output.toString() });
                        saveMessageST(gmsg.key.id, output.toString())
                        await new Promise(r => setTimeout(r, 800));
                        
                      })

                      command_t.stderr.on('data', async (output2) => {
                        var gmsg = await Proto.sendMessage(jid2, { text: output2.toString() });
                        saveMessageST(gmsg.key.id, output2.toString())
                        return;
                      })

                      command_t.stdout.on('end', async () => {
                        var gmsg = await Proto.sendMessage(jid2, { text: modulelang.done_cmd + args});
                        saveMessageST(gmsg.key.id, modulelang.done_cmd)
                        return;
                      })
                    } catch {
                      var gmsg = await Proto.sendMessage(jid2, { text: modulelang.bad_cmd });
                      saveMessageST(gmsg.key.id, modulelang.bad_cmd)
                      return;
                    }
                  }
                }
              }

              // YouTube Download
              else if (attr == "video") {
                await Proto.sendMessage(jid, { delete: msgkey });
                var jid2 = jid
                if (args == "") {
                  var gmsg = await Proto.sendMessage(jid2, { text: modulelang.need_yt });
                  saveMessageST(gmsg.key.id, modulelang.need_yt)
                  return;
                } else {
                  var valid_url = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/gm
                  if (valid_url.test(args)) {
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.yt_down });
                    saveMessageST(gmsg.key.id, modulelang.yt_down)
                    try {
                      await ytdl(args, "./YT.mp4", Proto, jid2);
                      return;
                    } catch (e) {
                      var gmsg = await Proto.sendMessage(jid2, { text: modulelang.yt_not_found });
                      saveMessageST(gmsg.key.id, modulelang.yt_not_found)
                      try {
                        fs.unlinkSync("./YT.mp4")
                      } catch {}
                      return;
                    }
                  } else {
                    try {
                      fs.unlinkSync("./YT.mp4")
                    } catch {}
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.need_yt });
                    saveMessageST(gmsg.key.id, modulelang.need_yt)
                    return;
                  }
                }
              }

              // YouTube Search
              else if (attr == "yt") {
                await Proto.sendMessage(jid, { delete: msgkey });
                var jid2 = jid
                if (args == "") {
                  var gmsg = await Proto.sendMessage(jid2, { text: modulelang.need_q });
                  saveMessageST(gmsg.key.id, modulelang.need_q)
                  return;
                } else {
                  var mp = await GetListByKeyword(args, false, 10)
                  var msgs = "";
                  mp.items.map((Element) => {
                    if (Element.type == "video") {
                      msgs += modulelang.yt_title + Element.title + modulelang.yt_duration + Element["length"].simpleText + modulelang.yt_author + Element.channelTitle + modulelang.yt_link + "https://www.youtube.com/watch?v=" + Element.id + "\n\n"
                    }
                  })
                  var gmsg = await Proto.sendMessage(jid2, { text: msgs });
                  saveMessageST(gmsg.key.id, msgs)
                  return;
                }
              }

              // YT Music
              else if (attr == "song") {
                var jid2 = jid
                await Proto.sendMessage(jid, { delete: msgkey });
                if (args == "") {
                  var gmsg = await Proto.sendMessage(jid2, { text: modulelang.need_qs });
                  saveMessageST(gmsg.key.id, modulelang.need_qs)
                  return;
                } else {
                  try {
                    fs.unlinkSync("./YT2.mp4")
                  } catch {}
                  try {
                    fs.unlinkSync("./YT2.mp3")
                  } catch {}
                  try {
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.song_down });
                    saveMessageST(gmsg.key.id, modulelang.song_down)


                    var uri = await GetListByKeyword(args,false,5)
                    var gts = [];
                    uri.items.map((Element) => {
                      if (Element.type == "video") {
                        gts.push(Element.id)
                      }
                    })
                    uri = "https://www.youtube.com/watch?v=" + gts[0]
                    var h = await axios({
                      url: "https://api.onlinevideoconverter.pro/api/convert",
                      method: "post",
                      data: {
                        url: uri,
                      },
                    });
                    var downs = [];
                    h.data.url.map((Element) => {
                      if (Element.downloadable == true && Element.name == "MP4" && Element.quality == "360") {
                        downs.push(Element.url)
                      }
                    })
                
                    if (downs.length == 0) {
                      h.data.url.map((Element) => {
                        if (Element.name == "MP4" && Element.quality == "144") {
                          downs.push(Element.url)
                        }
                      })
                    }
                
                    if (downs.length == 0) {
                      h.data.url.map((Element) => {
                        if (Element.name == "MP4" && Element.quality == "240") {
                          downs.push(Element.url)
                        }
                      })
                    }
                
                    if (downs.length == 0) {
                      h.data.url.map((Element) => {
                        if (Element.name == "MP4" && Element.quality == "360") {
                          downs.push(Element.url)
                        }
                      })
                    }
                    const response = await axios({
                      method: "GET",
                      url: downs[0],
                      responseType: "arraybuffer"
                    });
                
                    fs.appendFileSync("./YT2.mp4", Buffer.from(response.data));
                    ffmpeg("./YT2.mp4").audioBitrate('128k').save('./YT2.mp3').on('end', async () => {
                      return await Proto.sendMessage(jid2, {
                        audio: fs.readFileSync("./YT2.mp3"),
                        mimetype: "audio/mp4"
                      })
                    })
                  } catch (e) {
                    console.log(e)
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.song_not_found });
                    saveMessageST(gmsg.key.id, modulelang.song_not_found)
                    return;
                  }
                }
              }
              // Menu
              else if (attr == "menu") {
                await Proto.sendMessage(jid, { delete: msgkey });
                var jid2 = jid
                if (args == "") {
                  var gmsg = await Proto.sendMessage(jid2, config.TEXTS.MENU[0]);
                  saveMessageST(gmsg.key.id, config.TEXTS.MENU[0])
                  return await Proto.sendMessage(jid2, react(gmsg, "love"));
                } else {
                  if (
                    args == "textpro" ||
                    args == "TEXTPRO" ||
                    args == "Textpro"
                  ) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: cmds(modulelang.textpro, 3, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, cmds(modulelang.textpro, 3, cmd[0]))
                    return;
                  } else if (
                    args == "tagall" ||
                    args == "TAGALL" ||
                    args == "Tagall"
                  ) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: cmds(modulelang.tagall, 3, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, cmds(modulelang.tagall, 3, cmd[0]))
                    return;
                  } else if (
                    args == "ping" ||
                    args == "Ping" ||
                    args == "PING"
                  ) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: cmds(modulelang.ping, 2, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, cmds(modulelang.ping, 2, cmd[0]))
                    return;
                  } else if (
                    args == "sticker" ||
                    args == "Sticker" ||
                    args == "STICKER"
                  ) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: cmds(modulelang.sticker3, 3, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, cmds(modulelang.sticker3, 3, cmd[0]))
                    return;
                  } else if (
                    args == "goodbye" ||
                    args == "Goodbye" ||
                    args == "GOODBYE"
                  ) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: cmds(modulelang.goodbye, 3, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, cmds(modulelang.goodbye, 3, cmd[0]))
                    return;
                  } else if (
                    args == "filter" ||
                    args == "Filter" ||
                    args == "FILTER"
                  ) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: cmds(modulelang.filter3, 3, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, cmds(modulelang.filter3, 3, cmd[0]))
                    return;
                  } else if (
                    args == "stop" ||
                    args == "Stop" ||
                    args == "STOP"
                  ) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: cmds(modulelang.stop3, 3, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, cmds(modulelang.stop3, 3, cmd[0]))
                    return;
                  } else if (
                    args == "alive" ||
                    args == "Alive" ||
                    args == "ALIVE"
                  ) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: cmds(modulelang.alive, 2, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, cmds(modulelang.alive, 2, cmd[0]))
                    return;
                  } else if (
                    args == "get" ||
                    args == "Get" ||
                    args == "GET"
                  ) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: cmds(modulelang.get3, 3, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, cmds(modulelang.get3, 3, cmd[0]))
                    return;
                  } else if (
                    args == "set" ||
                    args == "Set" ||
                    args == "SET"
                  ) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: cmds(modulelang.set3, 3, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, cmds(modulelang.set3, 3, cmd[0]))
                    return;
                  } else if (
                    args == "welcome" ||
                    args == "Welcome" ||
                    args == "WELCOME"
                  ) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: cmds(modulelang.welcome, 3, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, cmds(modulelang.welcome, 3, cmd[0]))
                    return;
                  } else if (
                    args == "update" ||
                    args == "Updtae" ||
                    args == "UPDATE"
                  ) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: cmds(modulelang.update2, 2, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, cmds(modulelang.update2, 2, cmd[0]))
                    return;
                  } else if (
                    args == "yt" ||
                    args == "Yt" ||
                    args == "YT"
                  ) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: cmds(modulelang.yt_src, 3, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, cmds(modulelang.yt_src, 3, cmd[0]))
                    return;
                  } else if (
                    args == "song" ||
                    args == "Song" ||
                    args == "SONG"
                  ) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: cmds(modulelang.song_fl, 3, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, cmds(modulelang.song_fl, 3, cmd[0]))
                    return;
                  } else if (
                    args == "video" ||
                    args == "Video" ||
                    args == "VIDEO"
                  ) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: cmds(modulelang.yt_video, 3, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, cmds(modulelang.yt_video, 3, cmd[0]))
                    return;
                  } else if (
                    args == "term" ||
                    args == "Term" ||
                    args == "TERM"
                  ) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: cmds(modulelang.term4, 4, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, cmds(modulelang.term4, 4, cmd[0]))
                    return;
                  } else {
                    command_list.map((Element) => {
                      var similarity = test_diff(args, Element);
                      diff.push(similarity);
                    });
                    var filt = diff.filter((mum) => mum > 0.8);
                    if (filt[0] == undefined || filt[0] == "undefined") {
                      var gmsg = await Proto.sendMessage(
                        jid2,
                        { text: modulelang.null }
                      );
                      saveMessageST(gmsg.key.id, modulelang.null)
                      return;
                    } else {
                      var msg = await Proto.sendMessage(
                        jid2,
                        { text: modulelang.null }
                      );
                      await Proto.sendMessage(jid2, react(msg, "bad"));
                      saveMessageST(msg.key.id, modulelang.null)
                      var msg2 = await Proto.sendMessage(jid2, {
                        text:
                          modulelang.pron.replace("&", cmd[0]) + command_list[diff.indexOf(filt[0])] + "```",
                      });
                      saveMessageST(msg2.key.id, modulelang.pron.replace("&", cmd[0]) + command_list[diff.indexOf(filt[0])] + "```",)
                      diff = [];
                      return 0;
                    }
                  }
                }
              }

              // Tagall
              else if (attr == "tagall") {
                var jid2 = jid
                if (ispm) {
                  await Proto.sendMessage(jid, { delete: msgkey });
                  var gmsg = await Proto.sendMessage(
                    jid2,
                    { text: cmdlang.onlyGroup }
                  );
                  saveMessageST(gmsg.key.id, cmdlang.onlyGroup)
                  return;
                }
                if (isreplied) {
                  await Proto.sendMessage(jid, { delete: msgkey });
                  const metadata = await Proto.groupMetadata(jid2);
                  var users = [];
                  metadata.participants.map((user) => {
                    users.push(user.id);
                  });
                  var gmsg = await Proto.sendMessage(jid2, {
                    text: repliedmsg,
                    mentions: users,
                  });
                  saveMessageST(gmsg.key.id, repliedmsg)
                  return;
                } else {
                  await Proto.sendMessage(jid, { delete: msgkey });
                  if (args == "") {
                    const metadata = await Proto.groupMetadata(jid2);
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
                    var gmsg = await Proto.sendMessage(jid2, {
                      text: defaultMsg,
                      mentions: users,
                    });
                    saveMessageST(gmsg.key.id, defaultMsg)
                    return;
                  } else {
                    const metadata = await Proto.groupMetadata(jid2);
                    var users = [];
                    metadata.participants.map((user) => {
                      users.push(user.id);
                    });
                    var gmsg = await Proto.sendMessage(jid2, {
                      text: args,
                      mentions: users,
                    });
                    saveMessageST(gmsg.key.id, args)
                    return;
                  }
                }
              }

              // Set
              else if (attr == "set") {
                var jid2 = jid
                await Proto.sendMessage(jid, { delete: msgkey });
                if (!isreplied) {
                  var gmsg = await Proto.sendMessage(jid2, {text: modulelang.reply})
                  saveMessageST(gmsg.key.id, modulelang.reply)
                  return;
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
                  var gmsg = await Proto.sendMessage(jid2, { text: modulelang.setted})
                  saveMessageST(gmsg.key.id, modulelang.setted)
                  return;
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
                  var gmsg = await Proto.sendMessage(jid2, { text: modulelang.setted})
                  saveMessageST(gmsg.key.id, modulelang.setted)
                  return;
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
                  var gmsg = await Proto.sendMessage(jid2, { text: modulelang.setted})
                  saveMessageST(gmsg.key.id, modulelang.setted)
                  return;
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
                  var gmsg = await Proto.sendMessage(jid2, { text: modulelang.setted})
                  saveMessageST(gmsg.key.id, modulelang.setted)
                  return;
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
                  var gmsg = await Proto.sendMessage(jid2, { text: modulelang.setted})
                  saveMessageST(gmsg.key.id, modulelang.setted)
                  return;
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
                  var gmsg = await Proto.sendMessage(jid2, { text: modulelang.setted})
                  saveMessageST(gmsg.key.id, modulelang.setted)
                  return;
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
                  var gmsg = await Proto.sendMessage(jid2, { text: modulelang.setted})
                  saveMessageST(gmsg.key.id, modulelang.setted)
                  return;
                } else {
                  var gmsg = await Proto.sendMessage(jid2, { text: modulelang.set_null.replace("&", cmd[0])})
                  saveMessageST(gmsg.key.id, modulelang.set_null.replace("&", cmd[0]))
                  return;
                }
              }


              // Get
              else if (attr == "get") {
                var jid2 = jid
                await Proto.sendMessage(jid, { delete: msgkey });
                if (isreplied) {
                  if (repliedmsg == "alive") {
                    var re = PrimonDB;
                    re = re.alive_msg
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.get_alive + re})
                    saveMessageST(gmsg.key.id, modulelang.get_alive + re)
                    return;
                  } else if (repliedmsg == "afk") {
                    var re = PrimonDB;
                    re = re.afk.message
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.get_afk + re})
                    saveMessageST(gmsg.key.id, modulelang.get_afk + re)
                    return;
                  } else if (repliedmsg == "ban") {
                    var re = PrimonDB;
                    re = re.ban_msg
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.get_ban + re})
                    saveMessageST(gmsg.key.id, modulelang.get_ban + re)
                    return;
                  } else if (repliedmsg == "mute") {
                    var re = PrimonDB;
                    re = re.mute_msg 
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.get_mute + re})
                    saveMessageST(gmsg.key.id, modulelang.get_mute + re)
                    return;
                  } else if (repliedmsg == "unmute") {
                    var re = PrimonDB;
                    re = re.unmute_msg
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.get_unmute + re})
                    saveMessageST(gmsg.key.id, modulelang.get_unmute + re)
                    return;
                  } else if (repliedmsg == "block") {
                    var re = PrimonDB;
                    re = re.block_msg
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.get_block + re})
                    saveMessageST(gmsg.key.id, modulelang.get_block + re)
                    return;
                  } else if (repliedmsg == "unblock") {
                    var re = PrimonDB;
                    re = re.unblock_msg
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.get_unblock + re})
                    saveMessageST(gmsg.key.id, modulelang.get_unblock + re)
                    return;
                  } else {
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.get_null.replace("&", cmd[0])})
                    saveMessageST(gmsg.key.id, modulelang.get_null.replace("&", cmd[0]))
                    return;
                  }
                } else {
                  if (args == "alive") {
                    var re = PrimonDB;
                    re = re.alive_msg
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.get_alive + re})
                    saveMessageST(gmsg.key.id, modulelang.get_alive + re)
                    return;
                  } else if (args == "afk") {
                    var re = PrimonDB;
                    re = re.afk.message
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.get_afk + re})
                    saveMessageST(gmsg.key.id, modulelang.get_afk + re)
                    return;
                  } else if (args == "ban") {
                    var re = PrimonDB;
                    re = re.ban_msg
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.get_ban + re})
                    saveMessageST(gmsg.key.id, modulelang.get_ban + re)
                    return;
                  } else if (args == "mute") {
                    var re = PrimonDB;
                    re = re.mute_msg 
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.get_mute + re})
                    saveMessageST(gmsg.key.id, modulelang.get_mute + re)
                    return;
                  } else if (args == "unmute") {
                    var re = PrimonDB;
                    re = re.unmute_msg
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.get_unmute + re})
                    saveMessageST(gmsg.key.id, modulelang.get_unmute + re)
                    return;
                  } else if (args == "block") {
                    var re = PrimonDB;
                    re = re.block_msg
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.get_block + re})
                    saveMessageST(gmsg.key.id, modulelang.get_block + re)
                    return;
                  } else if (args == "unblock") {
                    var re = PrimonDB;
                    re = re.unblock_msg
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.get_unblock + re})
                    saveMessageST(gmsg.key.id, modulelang.get_unblock + re)
                    return;
                  } else {
                    var gmsg = await Proto.sendMessage(jid2, { text: modulelang.get_null.replace("&", cmd[0])})
                    saveMessageST(gmsg.key.id, modulelang.get_null.replace("&", cmd[0]))
                    return;
                  }
                }
              }

              // Textpro
              else if (attr == "textpro") {
                var jid2 = jid
                if (isreplied) {
                  await Proto.sendMessage(jid, { delete: msgkey });
                  var style = textpro_links(args);
                  if (style !== "") {
                    var img = await openapi.textpro(style, repliedmsg);
                    var img2 = await axios.get(img, {
                      responseType: "arraybuffer",
                    });
                    return await Proto.sendMessage(jid2, {
                      image: Buffer.from(img2.data),
                      caption: modulelang.by,
                      
                    });
                  } else {
                    var msg = await Proto.sendMessage(
                      jid,
                      {
                        text: modulelang.textpro_null,
                      }
                    );
                    await Proto.sendMessage(jid2, react(msg, "bad"));
                    saveMessageST(msg.key.id, modulelang.textpro_null)
                    return;
                  }
                } else {
                  await Proto.sendMessage(jid2, { delete: msgkey });
                  try {
                    var type = argfinder(args);
                  } catch {
                    var msg = await Proto.sendMessage(
                      jid,
                      {
                        text: modulelang.textpro_null,
                      }
                    );
                    await Proto.sendMessage(jid2, react(msg, "bad"));
                    saveMessageST(msg.key.id, modulelang.textpro_null)
                    return;
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
                    await Proto.sendMessage(jid2, react(msg, "bad"));
                    saveMessageST(msg.key.id, modulelang.textpro_null)
                    return;
                  } else {
                    var type = argfinder(args);
                    var url = textpro_links(type);
                    var text = afterarg(args);
                    if (text == "" || text == " ") {
                      var gmsg = await Proto.sendMessage(
                        jid2,
                        {
                          text: modulelang.textpro_null,
                        }
                      );
                      saveMessageST(gmsg.key.id, modulelang.textpro_null)
                      return;
                    }
                    var img = await openapi.textpro(url, text);
                    var img2 = await axios.get(img, {
                      responseType: "arraybuffer",
                    });
                    return await Proto.sendMessage(jid2, {
                      image: Buffer.from(img2.data),
                      caption: modulelang.by,
                      
                    });
                  }
                }
              }

              // Ping
              else if (attr == "ping") {
                var jid2 = jid
                await Proto.sendMessage(jid2, { delete: msgkey });
                var d1 = new Date().getTime();
                var msg = await Proto.sendMessage(jid2, {
                  text: "_Ping, Pong!_",
                });
                saveMessageST(msg.key.id, "_Ping, Pong!_")
                var d2 = new Date().getTime();
                var timestep = Number(d2) - Number(d1);
                if (timestep > 600) {
                  var gmsg = await Proto.sendMessage(
                    jid2,
                    {
                      text:
                        pinglang.ping +
                        timestep.toString() +
                        "ms" +
                        pinglang.badping,
                    },
                    { quoted: msg }
                  );
                  saveMessageST(gmsg.key.id, pinglang.ping +
                    timestep.toString() +
                    "ms" +
                    pinglang.badping
                  )
                  return;
                } else {
                  var gmsg = await Proto.sendMessage(jid2, {
                    text: pinglang.ping + timestep.toString() + "ms",
                  }, { quoted: msg });
                  saveMessageST(gmsg.key.id, pinglang.ping + timestep.toString() + "ms")
                  return;
                }
              }

              // Welcome
              else if (attr == "welcome") {
                 var jid2 = jid
                await Proto.sendMessage(jid2, { delete: msgkey });
                if (ispm) {
                  var gmsg = await Proto.sendMessage(
                    jid2,
                    { text: cmdlang.onlyGroup }
                  );
                  saveMessageST(gmsg.key.id, cmdlang.onlyGroup)
                  return;
                } else {
                  if (isreplied) {
                    if (repliedmsg == "delete") {
                      var re = PrimonDB;
                      re.welcome.map((el) => {
                        ;
                        if (el.jid == jid2) {
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
                      var gmsg = await Proto.sendMessage(
                        jid2,
                        { text: welcomelang.suc_del_welcome }
                      );
                      saveMessageST(gmsg.key.id, welcomelang.suc_del_welcome)
                      return;
                    } else {
                      var re = PrimonDB;
                      var d = { jid: jid2, message: repliedmsg };
                      re.welcome.map((el) => {
                        ;
                        if (el.jid == jid2) {
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
                      var gmsg = await Proto.sendMessage(
                        jid2,
                        { text: welcomelang.suc_set_welcome }
                      );
                      saveMessageST(gmsg.key.id, welcomelang.suc_set_welcome)
                      return;
                    }
                  } else {
                    if (args == "delete") {
                      var re = PrimonDB;
                      re.welcome.map((el) => {
                        ;
                        if (el.jid == jid2) {
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
                      var gmsg = await Proto.sendMessage(
                        jid2,
                        { text: welcomelang.suc_del_welcome }
                      );
                      saveMessageST(gmsg.key.id, welcomelang.suc_del_welcome)
                      return;
                    } else if (args == "") {
                      var re = PrimonDB.welcome;
                      var d = re.filter((id) => id.jid == jid2);
                      if (d.length == 0) {
                        var gmsg = await Proto.sendMessage(
                          jid2,
                          { text: welcomelang.not_set_welcome }
                        );
                        saveMessageST(gmsg.key.id, welcomelang.not_set_welcome)
                        return;
                      } else {
                        var gmsg = await Proto.sendMessage(
                          jid2,
                          { text: welcomelang.alr_set_welcome + d[0].message }
                        );
                        saveMessageST(gmsg.key.id, welcomelang.alr_set_welcome + d[0].message)
                        return;
                      }
                    } else {
                      var re = PrimonDB;
                      var d = { jid: jid2, message: args };
                      re.welcome.map((el) => {
                        ;
                        if (el.jid == jid2) {
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
                      var gmsg = await Proto.sendMessage(
                        jid2,
                        { text: welcomelang.suc_set_welcome }
                      );
                      saveMessageST(gmsg.key.id, welcomelang.suc_set_welcome)
                      return;
                    }
                  }
                }
              }

              // Goodbye
              else if (attr == "goodbye") {
                var jid2 = jid
                await Proto.sendMessage(jid2, { delete: msgkey });
                if (ispm) {
                  var gmsg = await Proto.sendMessage(
                    jid2,
                    { text: cmdlang.onlyGroup }
                  );
                  saveMessageST(gmsg.key.id, cmdlang.onlyGroup)
                  return;
                } else {
                  if (isreplied) {
                    if (repliedmsg == "delete") {
                      var re = PrimonDB;
                      re.goodbye.map((el) => {
                        ;
                        if (el.jid == jid2) {
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
                      var gmsg = await Proto.sendMessage(
                        jid2,
                        { text: goodbyelang.suc_del_goodbye }
                      );
                      saveMessageST(gmsg.key.id, goodbyelang.suc_del_goodbye)
                      return;
                    } else {
                      var re = PrimonDB;
                      var d = { jid: jid2, message: repliedmsg };
                      re.goodbye.map((el) => {
                        ;
                        if (el.jid == jid2) {
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
                      var gmsg = await Proto.sendMessage(
                        jid2,
                        { text: goodbyelang.suc_set_goodbye }
                      );
                      saveMessageST(gmsg.key.id, goodbyelang.suc_set_goodbye)
                      return;
                    }
                  } else {
                    if (args == "delete") {
                      var re = PrimonDB;
                      re.goodbye.map((el) => {
                        ;
                        if (el.jid == jid2) {
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
                      var gmsg = await Proto.sendMessage(
                        jid2,
                        { text: goodbyelang.suc_del_goodbye }
                      );
                      saveMessageST(gmsg.key.id, goodbyelang.suc_del_goodbye)
                      return;
                    } else if (args == "") {
                      var re = PrimonDB.goodbye;
                      var d = re.filter((id) => id.jid == jid2);
                      if (d.length == 0) {
                        var gmsg = await Proto.sendMessage(
                          jid2,
                          { text: goodbyelang.not_set_goodbye }
                        );
                        saveMessageST(gmsg.key.id, goodbyelang.not_set_goodbye)
                        return;
                      } else {
                        var gmsg = await Proto.sendMessage(
                          jid2,
                          { text: goodbyelang.alr_set_goodbye + d[0].message }
                        );
                        saveMessageST(gmsg.key.id, goodbyelang.alr_set_goodbye + d[0].message)
                        return;
                      }
                    } else {
                      var re = PrimonDB;
                      var d = { jid: jid2, message: args };
                      re.goodbye.map((el) => {
                        ;
                        if (el.jid == jid2) {
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
                      var gmsg = await Proto.sendMessage(
                        jid2,
                        { text: goodbyelang.suc_set_goodbye }
                      );
                      saveMessageST(gmsg.key.id, goodbyelang.suc_set_goodbye)
                      return;
                    }
                  }
                }
              }

              // Filter
              else if (attr == "filter") {
                var jid2 = jid
                await Proto.sendMessage(jid2, { delete: msgkey });
                if (isreplied) {
                  if (args == "") {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: filterlang.null.replace(/&/gi, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, filterlang.null.replace(/&/gi, cmd[0]))
                    return;
                  } else {
                    var re = PrimonDB;
                    re.filter.map((el) => {
                      ;
                      if (el.trigger == args && el.jid == jid2) {
                        delete el.trigger
                        delete el.message
                        delete el.jid
                      }
                    });
                    var d = { jid: jid2, trigger: args, message: repliedmsg }
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
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: filterlang.succ.replace("&", args) }
                    );
                    saveMessageST(gmsg.key.id, filterlang.succ.replace("&", args))
                    return;
                  }
                } else {
                  if (args == "") {
                    var re = PrimonDB;
                    var filter_list = "";
                    re.filter.map((el) => {
                      ;
                      if (el.jid == jid2) {
                        filter_list += "🔎 ```" + el.trigger + "``` \n"
                      }
                    });
                    if (filter_list == "") {
                      var gmsg = await Proto.sendMessage(
                        jid2,
                        { text: filterlang.nolist }
                      );
                      saveMessageST(gmsg.key.id, filterlang.nolist)
                      return;
                    }
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: filterlang.list + filter_list }
                    );
                    saveMessageST(gmsg.key.id, filterlang.list + filter_list)
                    return;
                  }
                  if (!args.includes('"')) {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: filterlang.null2.replace(/&/gi, cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, filterlang.null2.replace(/&/gi, cmd[0]))
                    return;
                  } else {
                    try {
                      var trigger = args.split('"')[1]
                      var f_message = args.split('"')[3]
                    } catch {
                      var gmsg = await Proto.sendMessage(
                        jid2,
                        { text: filterlang.null2.replace(/&/gi, cmd[0]) }
                      );
                      saveMessageST(gmsg.key.id, filterlang.null2.replace(/&/gi, cmd[0]))
                      return;
                    }
                    var re = PrimonDB;
                    re.filter.map((el) => {
                      if (el.trigger == args && el.jid == jid2) {
                        delete el.trigger
                        delete el.message
                        delete el.jid
                      }
                    });
                    var d = { jid: jid2, trigger: trigger, message: f_message }
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
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: filterlang.succ.replace("&", trigger) }
                    );
                    saveMessageST(gmsg.key.id, filterlang.succ.replace("&", trigger))
                    return;
                  }
                }
              }


              // Stop Filter
              else if (attr == "stop") {
                var jid2 = jid
                await Proto.sendMessage(jid2, { delete: msgkey });
                if (isreplied) {
                  var re = PrimonDB;
                  var rst = ""
                  re.filter.map((el) => {
                    
                    if (el.jid == jid2 && el.trigger == repliedmsg) {
                      delete el.jid
                      rst = "1"
                      delete el.trigger
                      delete el.message
                    }
                  })
                  if (rst == "") {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: stoplang.null }
                    );
                    saveMessageST(gmsg.key.id, stoplang.null)
                    return;
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
                  var gmsg = await Proto.sendMessage(
                    jid2,
                    { text: stoplang.succ.replace("&", repliedmsg) }
                  );
                  saveMessageST(gmsg.key.id, stoplang.succ.replace("&", repliedmsg))
                  return;
                } else {
                  if (args == "") {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: stoplang.null2.replace("&", cmd[0]) }
                    );
                    saveMessageST(gmsg.key.id, stoplang.null2.replace("&", cmd[0]))
                    return;
                  }
                  var re = PrimonDB;
                  var rst = ""
                  re.filter.map((el) => {
                    
                    if (el.jid == jid2 && el.trigger == args) {
                      delete el.jid
                      rst = "1"
                      delete el.trigger
                      delete el.message
                    }
                  })
                  if (rst == "") {
                    var gmsg = await Proto.sendMessage(
                      jid2,
                      { text: stoplang.null }
                    );
                    saveMessageST(gmsg.key.id, stoplang.null)
                    return;
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
                  var gmsg = await Proto.sendMessage(
                    jid2,
                    { text: stoplang.succ.replace("&", args) }
                  );
                  saveMessageST(gmsg.key.id, stoplang.succ.replace("&", args))
                  return;
                }
              }

              // Update
              else if (attr == "update") {
                var jid2 = jid
                await Proto.sendMessage(jid2, { delete: msgkey });
                var cmmts = await axios.get("https://api.github.com/users/phaticusthiccy/events/public")
                cmmts = cmmts.data
                var news = [];
                var author_cmts = [];
                cmmts.map((Element) => {
                  if (Element.repo.name == "phaticusthiccy/PrimonProto") {
                    try {
                      news.push(Element.payload.commits[0].message)
                      author_cmts.push(Element.payload.commits[0].author.name)
                    } catch {
                      news.push("Protocol Update")
                      author_cmts.push("Primon Proto")
                    }
                  }
                })
                var msg = 
                "*◽ " + author_cmts[0] + "* :: _" + news[0] + "_" + "\n" +
                "*◽ " + author_cmts[1] + "* :: _" + news[1] + "_" + "\n" +
                "*◽ " + author_cmts[2] + "* :: _" + news[2] + "_"
                var gmsg = await Proto.sendMessage(jid2, { text: modulelang.update + msg})
                saveMessageST(gmsg.key.id, modulelang.update + msg)
                process.exit(1)
              }

              // Alive
              else if (attr == "alive") {
                var jid2 = jid
                await Proto.sendMessage(jid2, { delete: msgkey });
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
        Primon();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log(sessionlang.recon);
        Primon();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log(sessionlang.recon);
        Primon();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(sessionlang.out);
        shell.exec("rm ./session")
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
  Proto.ev.on("creds.update", saveCreds);
  return Proto;
}
try {
  Primon();
} catch {
  Primon();
}
