const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const pino = require('pino');
const logger = pino({
  level: 'debug', 
});

async function Primon() {
  let { version } = await fetchLatestBaileysVersion();
  let { state, saveCreds } = await useMultiFileAuthState(__dirname + "/session/");

  const sock = makeWASocket({
    logger: logger,
    printQRInTerminal: true,
    markOnlineOnConnect: false,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    auth: state,
    version: version,
  });
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error.output.statusCode !== 401);
      if (shouldReconnect) {
        console.log('Disconnected, reconnecting...');
        Primon();
      } else {
        console.log('QR code was not scanned.');
      }
    } else if (connection === 'open') {
      console.log('The connection is opened.');
      const usrId = sock.user.id;
      const mappedId = usrId.split(':')[0]+`@s.whatsapp.net`;
      
      await sock.sendMessage(mappedId, {text: 'Primon Online!'});
    }

  });
  
  sock.ev.on("messages.upsert", async (msg) => {
    try {
      if (!msg.hasOwnProperty("messages")) return;
      if (msg.messages.length == 0) return;

      msg = msg.messages[0];
      var owenerId = sock.user.id;
      var grupId = msg.key.remoteJid;
      
      const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
      if ((msg.key && msg.key.remoteJid == "status@broadcast") || !text) return;
        
      if (text == ".ping") {
        return await sock.sendMessage(grupId, {text: "Pong!", edit: msg.key});
      }
      
    } catch (error) {
      console.log(error);
      var owenerId = sock.user.id;
      await sock.sendMessage(owenerId, {text: `Primon Error:\n${error}`});
    }
  })
  
}

Primon();
