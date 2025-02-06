const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, delay } = require('@whiskeysockets/baileys');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
var openedSocket = false;
var chat_count = 0;
try { fs.rmSync('./session', { recursive: true, force: true }); } catch {}
const logger = pino({
  level: "silent",
  customLevels: {
    trace: 10000,
    debug: 10000,
    info: 10000,
    warn: 10000,
    error: 10000,
    fatal: 10000,
  },
});

// ask and get answer if user have anaother active device. use rl.question

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
// THERE IS AN ERROR IN THE RL QUESTION PARAMETER 

// rl.question('Do you have another active device in whatsapp? (y/n) ', (answer) => {
//   if (answer.toLowerCase() === 'y') {
//     console.clear();
//     console.log("Please close any other active devices found in WhatsApp.");  } else {
//     process.exit(1);
//   }
//   console.clear();
//   rl.close();
// });

rl.question("Login with QR code (1) or Phone Number (2)\n\n⚠️ Logging with phone number is not recommend! :: ", async (answer) => {
  if (answer == "2") {
    rl.question("Enter your phone number. Example: 905123456789 ", async (number) => {
      await loginWithPhone(number);
    }); 
  } else if (answer == "1") {
    genQR(true);
  }
});

async function genQR(qr) {
  let { version } = await fetchLatestBaileysVersion();
  let { state, saveCreds } = await useMultiFileAuthState('./session/');
  let sock = makeWASocket({
    logger,
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
      console.log("connection close")
      await genQR(qr);
    }
  });
  sock.ev.on('creds.update', saveCreds);
}

async function loginWithPhone(phoneNumber) {
  let { version } = await fetchLatestBaileysVersion();
  let { state, saveCreds } = await useMultiFileAuthState('./session/');
  let sock = makeWASocket({
    logger,
    auth: state,
    version: version,
    getMessage: async (key) => {},
  });

  try {
    sock.ev.on('connection.update', async (update) => {
      let { connection } = update;
      if (connection === 'open') {
        console.log('Successfully logged in!');
        await delay(3000);
        fs.writeFileSync('.started', '1');
        openedSocket = true;
        try {
          const chats = await sock.groupFetchAllParticipating();
          chat_count = Object.keys(chats).length
        } catch {}
      } else if (connection === 'close') {
        await loginWithPhone(phoneNumber);
      } else if (!connection && !sock.authState.creds.registered) {
        const pairingCode = await sock.requestPairingCode(phoneNumber);
        console.log(`Your WhatsApp pairing code: ${pairingCode}`);
        console.log('Enter this code on your WhatsApp app under "Linked Devices".');
      }
    });

    sock.ev.on('creds.update', saveCreds);
  } catch (err) {
    console.error('Login failed:', err);
    process.exit(1);
  }
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
