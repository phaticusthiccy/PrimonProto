const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, downloadMediaMessage, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const pino = require('pino');
const axios = require('axios');
require('./events');

/**
 * Saves the global database object to a file every 5 seconds.
 */
setInterval(() => {
  fs.writeFileSync("./database.json", JSON.stringify(global.database, null, 2));
}, 5000);

/**
 * Configures the logger with the specified options.
 *
 * @param {Object} options - The logger configuration options.
 * @param {string} [options.level='silent'] - The minimum log level to record.
 * @param {Object} [options.customLevels] - Custom log levels and their corresponding numeric values.
 */
var logger = pino({
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

async function Primon() {
  let { version } = await fetchLatestBaileysVersion();
  let { state } = await useMultiFileAuthState(__dirname + "/session/");

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
      await sock.sendMessage(mappedId, { text: 'Primon Online!\n\nUse /menu to see the list of commands.' });
    }
  });

  sock.ev.on("messages.upsert", async (msg) => {
    try {
      if (!msg.hasOwnProperty("messages")) return;
      if (msg.messages.length == 0) return;

      var rawMessage = msg
      msg = msg.messages[0];
      const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
      const quotedMessage = msg.message.extendedTextMessage?.contextInfo?.quotedMessage || undefined;
      msg.quotedMessage = quotedMessage
      if ((msg.key && msg.key.remoteJid == "status@broadcast") || !text) return;
      await start_command(msg, sock, rawMessage);

    } catch (error) {
      console.log(error);
      await sock.sendMessage(sock.user.id, { text: `Primon Error:\n${error}` });
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


/**
 * Downloads an image from a WhatsApp message and saves it to the specified file path.
 *
 * @param {Object} message - The WhatsApp message object containing the image.
 * @param {string} type - The type of the image (e.g. "image", "video", "document").
 * @param {string} filepath - The file path to save the downloaded image.
 * @returns {Promise<void>} - A Promise that resolves when the image has been downloaded and saved.
*/
global.downloadMedia = async (message, type, filepath) => {
  var stream = await downloadContentFromMessage(
    {
      url: message.url,
      directPath: message.directPath,
      mediaKey: message.mediaKey,
    },
    type
  );

  var writeStream = fs.createWriteStream(filepath);
  await new Promise((resolve, reject) => {
    stream.pipe(writeStream);
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
};
