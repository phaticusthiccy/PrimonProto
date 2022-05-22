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
const P = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
var axios = require("axios");
const { on } = require("events");
require("util").inspect.defaultOptions.depth = null;
const Language = require("../language");
const MenuLang = Language.getString("menu");

const { state, saveState } = useSingleFileAuthState("./session.json");

const store = makeInMemoryStore({
  logger: P().child({ level: "silent", stream: "store" }),
});

setInterval(() => {
  store.writeToFile("./baileys_store_multi.json");
}, 10000);

async function Primon() {
  const Proto = makeWASocket({
    auth: state,
    logger: P().child({
      level:
        process.env.DEBUG === undefined
          ? "silent"
          : process.env.DEBUG === true
          ? "trace"
          : "silent",
      stream: "store",
    }),
  });
  Proto.ev.on("creds.update", saveState);

  var message, isreplied, repliedmsg, jid;

  Proto.ev.on("messages.upsert", async (m) => {
    if (!m.messages[0].message) return;
    if (m.messages[0].key.remoteJid == "status@broadcast") return;
    jid = m.messages[0].key.remoteJid
    var once_msg = Object.keys(m.messages[0].message);
    try {
      var isreply = Object.keys(
        m.messages[0].message.extendedTextMessage.contextInfo
      );
    } catch {
      var isreply = [0];
    }
    if (once_msg.includes("conversation")) {
      message = m.messages[0].message.conversation;
    } else {
      message = m.messages[0].message.extendedTextMessage.text;
    }
    isreply.includes("quotedMessage") === true
      ? (isreplied = true)
      : (isreplied = false);
    // if (isreplied && m.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.conversation)
    var cmd = process.env.HANDLER;
    if (cmd.length > 1) {
      cmd = cmd[0];
    }
    if (message.startsWith(cmd)) {
      if (message.split("").shift().join("") == "menu") {
        const buttons = [
          {
            buttonId: "id1",
            buttonText: { displayText: MenuLang.menu },
            type: 1,
          },
          {
            buttonId: "id2",
            buttonText: { displayText: MenuLang.owner },
            type: 1,
          },
          {
            buttonId: "id3",
            buttonText: { displayText: MenuLang.star },
            type: 1,
          },
        ];

        const buttonMessage = {
          text: "Primon Proto",
          footer: "ES5 Lightweight Userbot",
          buttons: buttons,
          headerType: 1,
        };
        const sendMsg = await Proto.sendMessage(jid, buttonMessage);
      }
    }

    /*
    if (m.type == "notify") {
      console.log(message);
      console.log(isreplied);
      console.log(repliedmsg);
    }
    */
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
}
try {
  Primon();
} catch {
  Primon();
}
