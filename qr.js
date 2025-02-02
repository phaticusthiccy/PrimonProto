const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, delay } = require('@whiskeysockets/baileys');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
genQR(true);
var openedSocket = false;
var chat_count = 0;
try { fs.rmdirSync('./session', { recursive: true, force: true }); } catch {}

// ask and get answer if user have anaother active device. use rl.question

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Do you have another active device in whatsapp? (y/n) ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    console.clear();
    console.log("Please close any other active devices found in WhatsApp.");  } else {
    process.exit(1);
  }
  console.clear();
  rl.close();
});

async function genQR(qr) {
  let { version } = await fetchLatestBaileysVersion();
  let { state, saveCreds } = await useMultiFileAuthState('./session/');
  let sock = makeWASocket({
    auth: state,
    version: version,
    getMessage: async (key) => {},
  });

  if (!qr && !sock.authState.creds.registered) {
    console.log("You must use QR code to login.");
    process.exit(1);
  }

  sock.ev.on('connection.update', async (update) => {
    let { connection, qr: qrCode } = update;
    
    if (qrCode) {
      qrcode.generate(qrCode, { small: true });
    }
    if (connection === "connecting") {
      console.log("Connecting to WhatsApp... Please wait.");
    } else if (connection === 'open') {
      await delay(3000);
      fs.writeFileSync('.started', '1');
      console.clear();
      if (openedSocket == false) {
        openedSocket = true;
        try {
          const chats = await sock.groupFetchAllParticipating();
          chat_count = Object.keys(chats).length
        } catch {}
      }
      
    } else if (connection === 'close') {
      await genQR(qr);
    }
  });

  sock.ev.on('creds.update', saveCreds);
}

let countdown = Math.max(150, chat_count * 3.125);
setInterval(async () => {
  
  if (openedSocket == false && chat_count <= 0) {
    return;
  }
  console.clear();
  console.log(`Bot is syncing messages... (${(countdown / 10).toFixed(2)}s left)`);
  countdown--;
  
  if (countdown < 0) {
    console.clear();
    console.log("Run `pm2 start main.js` to start the bot.");
    process.exit(1);
  }

}, 100);
