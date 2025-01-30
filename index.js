const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const pino = require('pino');
require('./events');

/**
 * Saves the global database object to a file every 5 seconds.
 */
setInterval(() => {
  fs.writeFileSync("./database.json", JSON.stringify(global.database, null, 2));
}, 5000);

/**
 * Configures the logger with the specified options.
 */
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

async function Primon() {
  const { version } = await fetchLatestBaileysVersion();
  const { state } = await useMultiFileAuthState(__dirname + "/session/");

  const sock = makeWASocket({
    logger,
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
      if (!msg.hasOwnProperty("messages") || msg.messages.length === 0) return;

      const rawMessage = structuredClone(msg);
      msg = msg.messages[0];
      const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
      const quotedMessage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      msg.quotedMessage = quotedMessage;
      if ((msg.key && msg.key.remoteJid === "status@broadcast") || !text) return;
      
      await start_command(msg, sock, rawMessage);

    } catch (error) {
      console.log(error);
      await sock.sendMessage(sock.user.id, { text: `Primon Error:\n${error}` });
    }
  });

  sock.ev.on("group-participants.update", async (participant) => {
    if (participant.action === 'add') {
      const welcomeMessage = global.database.welcomeMessage.find(welcome => welcome.chat === participant.id);
      if (welcomeMessage) {
        const mediaPath = `./welcome.${welcomeMessage.type}`;
        if (['image', 'video'].includes(welcomeMessage.type)) {
          if (!fs.existsSync(mediaPath)) {
            fs.writeFileSync(mediaPath, welcomeMessage.media, "base64");
          }
          const messageOptions = {
            [welcomeMessage.type]: { url: mediaPath },
            caption: welcomeMessage.content || undefined,
            mentions: participant.participants
          };
          await sock.sendMessage(participant.id, messageOptions);
        } else {
          await sock.sendMessage(participant.id, { text: welcomeMessage.content, mentions: participant.participants });
        }
      }
    } else if (participant.action === 'remove') {
      const goodbyeMessage = global.database.goodbyeMessage.find(goodbye => goodbye.chat === participant.id);
      if (goodbyeMessage) {
        const mediaPath = `./goodbye.${goodbyeMessage.type}`;
        if (['image', 'video'].includes(goodbyeMessage.type)) {
          if (!fs.existsSync(mediaPath)) {
            fs.writeFileSync(mediaPath, goodbyeMessage.media, "base64");
          }
          const messageOptions = {
            [goodbyeMessage.type]: { url: mediaPath },
            caption: goodbyeMessage.content || undefined,
            mentions: participant.participants
          };
          await sock.sendMessage(participant.id, messageOptions);
        } else {
          await sock.sendMessage(participant.id, { text: goodbyeMessage.content, mentions: participant.participants });
        }
      }
    }
  })

  loadModules(__dirname + "/modules");
}

/**
 * Loads and requires all JavaScript modules from the specified directory path.
 *
 * @param {string} modulePath - The directory path where the modules are located.
 */

function loadModules(modulePath) {
  fs.readdirSync(modulePath).forEach((file) => {
    if (file.endsWith(".js")) {
      console.log(`Loading plugin: ${file}`);
      require(`${modulePath}/${file}`);
    }
  });
}

Primon();

/**
 * Downloads media from a WhatsApp message and saves it to the specified file path.
 *
 * @param {Object} message - The WhatsApp message object containing the media.
 * @param {string} type - The type of the media (e.g. "image", "video", "document").
 * @param {string} filepath - The file path to save the downloaded media.
 * @returns {Promise<void>} - A Promise that resolves when the media has been downloaded and saved.
 */
global.downloadMedia = async (message, type, filepath) => {
  const stream = await downloadContentFromMessage(
    {
      url: message.url,
      directPath: message.directPath,
      mediaKey: message.mediaKey,
    },
    type
  );

  const writeStream = fs.createWriteStream(filepath);
  await new Promise((resolve, reject) => {
    stream.pipe(writeStream);
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
};
/**
 * Checks if the number is an admin in the group.
 *
 * @param {Object} msg - The message object.
 * @param {Object} sock - The WhatsApp socket object.
 * @param {string} groupId - The ID of the group to check.
 * @param {string|boolean} number - Optional number. If false, the bot's own number is used.
 * @returns {Promise<boolean>} - Returns true if the bot is an admin, otherwise false.
 */

global.checkAdmin = async function (msg, sock, groupId, number = false) {
  try {
      const groupMetadata = await sock.groupMetadata(groupId);
      let Number = number ? number : sock.user.id.split(":")[0] + "@s.whatsapp.net";
      return groupMetadata.participants.some(participant => 
          participant.id === Number && participant.admin
      );
  } catch (error) {
      console.error("An error occurred while checking admin status: ", error);
      return false;
  }
};

