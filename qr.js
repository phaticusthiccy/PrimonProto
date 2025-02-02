const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, delay } = require('@whiskeysockets/baileys');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
genQR(true);
var openedSocket = false;
var chat_count = 0;

// ask question
/**
 * Prompts the user with a question and returns their answer as a Promise.
 * @param {string} question - The question to ask the user.
 * @returns {Promise<string>} - The user's answer.
 */
function askQuestion(question) {
  return new Promise((resolve) => {
    const rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function genQR(qr) {
  if (fs.existsSync('./session/')) {
    console.clear();
    let answer = await askQuestion("There is other active session! Old session will be deleted. Do you want to continue? (y/n): ");
    if (answer.toLowerCase() === 'y') {
      console.clear();
      let activeDevices = await askQuestion("Are there any active devices in WhatsApp? (y/n): ");
      if (activeDevices.toLowerCase() === 'y') {
        console.clear();
        console.log("Please log out from all devices before continuing.");
        process.exit(1);
      }
      fs.rmSync('./session/', { recursive: true, force: true });
    } else {
      process.exit(1);
    }
  }
  console.clear();
  let activeDevices2 = await askQuestion("Are there any active or inactive devices in WhatsApp? (y/n): ");
  if (activeDevices2.toLowerCase() === 'y') {
    console.clear();
    console.log("Please log out from all devices before continuing.");
    process.exit(1);
  }

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

let countdown = Math.max(150, chat_count * 1.875);
setInterval(async () => {
  
  if (openedSocket == false && chat_count <= 0) {
    return;
  }
  console.clear();
  console.log(`Bot is syncing messages... (${(countdown / 10).toFixed(2)}s left)`);
  countdown--;
  
  if (countdown < 0) {
    console.clear();
    console.log("Run `pm2 start index.js` to start the bot.");
    process.exit(1);
  }

}, 100);