const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const pino = require('pino');
require('./events'); // global olarak tanımlandığı için syntax vermiyoruz
const logger = pino({ level: 'debug' });

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
      const mappedId = usrId.split(':')[0] + `@s.whatsapp.net`;

      await sock.sendMessage(mappedId, { text: 'Primon Online!' });
    }
  });

  sock.ev.on("messages.upsert", async (msg) => {
    try {
      if (!msg.hasOwnProperty("messages")) return;
      if (msg.messages.length == 0) return;

      msg = msg.messages[0];
      const owenerId = sock.user.id;
      const grupId = msg.key.remoteJid;

      const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
      if ((msg.key && msg.key.remoteJid == "status@broadcast") || !text) return;

      await start_command(msg, sock);

    } catch (error) {
      console.log(error);
      const owenerId = sock.user.id;
      await sock.sendMessage(owenerId, { text: `Primon Error:\n${error}` });
    }
  });

  const modulePath = __dirname + "/modules";
  fs.readdirSync(modulePath).forEach((file) => {
    if (file.endsWith(".js")) {
      console.log(`Loading plugin: ${file}`);
      require(`${modulePath}/${file}`);
    }
  });
}

Primon();
