const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, delay } = require('@whiskeysockets/baileys');
const fs = require('fs');

console.log("WhatsApp Bot");
console.log("QR Code Login");
whatsAsena(true);

/**
 * Initializes a WhatsApp session and generates a session string for the user.
 *
 * This function sets up a WhatsApp WebSocket connection, prints the QR code to the terminal,
 * and sends the generated session string to the user's WhatsApp chat.
 *
 * @param {boolean} qr - If true, QR code will be displayed in the terminal.
 * @returns {Promise<void>} - A Promise that resolves when the session is established
 * and the session string is sent.
 */
async function whatsAsena(qr) {
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

      console.log("Asena String Code: ", st);

      await sock.sendMessage(sock.user.id, {
        text: st,
      });
      await sock.sendMessage(sock.user.id, {
        text: "*Don't share this code with anyone!*",
      });

      console.log("If you are installing locally, you can start the bot with node bot.js.");
      process.exit(1);
    } else if (connection === 'close') {
      await whatsAsena(qr);
    }
  });

  sock.ev.on('creds.update', saveCreds);
}
