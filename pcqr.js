const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, delay } = require('@whiskeysockets/baileys');
const fs = require('fs');

genQR(true);

async function genQR(qr) {
  let { version } = await fetchLatestBaileysVersion();
  let { state, saveCreds } = await useMultiFileAuthState('./session/');
  let sock = makeWASocket({
    printQRInTerminal: qr,
    markOnlineOnConnect: false,
    auth: state,
    version: version,
    getMessage: async (key) => {
    },
  });

  if (!qr && !sock.authState.creds.registered) {
    console.log("You must use QR code to login.");
    process.exit(1);
  }

  sock.ev.on('connection.update', async (update) => {
    let { connection } = update;
    if (connection === "connecting") {
      console.log("Connecting to WhatsApp... Please wait.");
    } else if (connection === 'open') {
      await delay(3000);
      let credentials = JSON.stringify(sock.authState.creds, null, 2);
      let st = credentials; 
      fs.writeFileSync('.started', '1');
      console.clear();
      console.log("Run starts.js to start the bot.");
      process.exit(1);
    } else if (connection === 'close') {
      await genQR(qr);
    }
  });

  sock.ev.on('creds.update', saveCreds);
}
