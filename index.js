const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const commands = require('./plugins/commands'); 
const fs = require('fs');
const path = require('path');

async function whatsAsena() {
  let { version } = await fetchLatestBaileysVersion();
  let { state, saveCreds } = await useMultiFileAuthState(__dirname + "/session/");

  const sock = makeWASocket({
    printQRInTerminal: true,
    markOnlineOnConnect: false,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    auth: state,
    version: version,
  });
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error.output.statusCode !== 401);
      if (shouldReconnect) {
        console.log('Bağlantı kesildi, yeniden bağlanılıyor...');
      } else {
        console.log('QR kodu taranmadı.');
      }
    } else if (connection === 'open') {
      console.log('Bağlantı açıldı.');
    }

  });

  sock.ev.on("messages.upsert", async (msg) => {
    msg = msg.messages[0];
    if (msg.key && msg.key.remoteJid == "status@broadcast") return;
    await commands.handleCommand(sock, msg);
  });
}

whatsAsena();
