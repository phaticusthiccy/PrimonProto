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
const Language = require("./lang");
const MenuLang = Language.getString("menu");
const config = require("./config_proto");

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
    logger: P({ level: "silent" })
  });
  Proto.ev.on("creds.update", saveState);

  var message,
    isreplied,
    repliedmsg,
    jid,
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

  sudo.push(Proto.user.id.split(":")[0] + "@s.whatsapp.net");
  Proto.ev.on("messages.upsert", async (m) => {
    if (!m.messages[0].message) return;
    if (m.messages[0].key.remoteJid == "status@broadcast") return;
    jid = m.messages[0].key.remoteJid;
    var once_msg = Object.keys(m.messages[0].message);

    var message;
    if (once_msg.includes("conversation")) {
      message = m.messages[0].message.conversation;
    } else if (once_msg.includes("extendedTextMessage")) {
        var once_msg2 = Object.keys(m.messages[0].message.extendedTextMessage);
        console.log(once_msg2)
         message = m.messages[0].message.extendedTextMessage.text;
    } else {
      message = undefined;
    }
    var cmd1 = process.env.HANDLER;
    var cmd;
    if (cmd1.length > 1) {
      cmd = cmd1.split("");
    } else {
      cmd = [cmd1];
    }

    if (message !== undefined) {
      if (m.type == "notify") {
        if (cmd.includes(message[0])) {
          if (process.env.SUDO !== false && sudo.length > 0) {
            if (sudo.includes(m.messages[0].key.participant)) {
              var command = message.split("");
              var command2 = command.shift();
              var attr = command.join("");
              try {
                attr = attr.split(" ")[0];
              } catch {
                return;
              }
              if (attr == "menu") {
                return await Proto.sendMessage(jid, config.TEXTS.MENU[0]);
              }
              if (message == MenuLang.menu) {
                return await Proto.sendMessage(
                  jid,
                  { text: "Test" },
                  { quoted: m.messages[0] }
                );
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
  Proto.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update	    
    if (connection === 'close') {
    let reason = new Boom(lastDisconnect?.error)?.output.statusCode
        if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); Primon.logout(); }
        else if (reason === DisconnectReason.connectionClosed) { console.log("🐦Connection closed, reconnecting...."); Primon(); }
        else if (reason === DisconnectReason.connectionLost) { console.log("🐦Connection Lost from Server, reconnecting..."); Primon(); }
        else if (reason === DisconnectReason.connectionReplaced) { console.log("🐦Connection Replaced, Another New Session Opened, Please Close Current Session First"); Primon.logout(); }
        else if (reason === DisconnectReason.loggedOut) { console.log(`🐦Device Logged Out, Please Scan Again And Run.`); Primon.logout(); }
        else if (reason === DisconnectReason.restartRequired) { console.log("🐦Restart Required, Restarting..."); Primon(); }
        else if (reason === DisconnectReason.timedOut) { console.log("🐦Connection TimedOut, Reconnecting..."); Primon(); }
        else Primon.end(`🐦Unknown DisconnectReason: ${reason}|${connection}`)
    }
    console.log('Connected...', update)
})
}
try {
  Primon();
} catch {
  Primon();
}
