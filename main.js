const Module = require('module');
const originalRequire = Module.prototype.require;
const execSync = require('child_process').execSync;
const fs = require('fs');

const installedPackages = new Set();
Module.prototype.require = function (packageName) {
  try {
    return originalRequire.apply(this, arguments);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' && !packageName.startsWith('.')) {
      if (!installedPackages.has(packageName)) {
        console.log(`Package ${packageName} not found. Installing...`);

        const isTermux = process?.env?.PREFIX === '/data/data/com.termux/files/usr';

        try {
          execSync(`npm install ${packageName}`, { stdio: 'ignore' });
          installedPackages.add(packageName);

          return originalRequire.apply(this, arguments);
        } catch (installError) {
          if (isTermux) {
            console.log('⚠️ Termux detected. Skipping installation of unsupported ' + packageName + ' module. Some features may not work.');
          } else {
            console.error(`Package installation error: ${installError.message}`);
          }
        }
      }
    }
    throw err;
  }
};

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const axios = require('axios');
const pino = require('pino');
require('./events');
var currentVersion = "", versionCheckInterval = 180
var sock;


setInterval(async () => {
  fs.writeFileSync("./database.json", JSON.stringify(global.database, null, 2));
  versionCheckInterval--
  if (versionCheckInterval <= 0) {
    var getLatestCommit = await axios.get("https://api.github.com/repos/phaticusthiccy/PrimonProto/commits")

    if (currentVersion == "") {
      currentVersion = getLatestCommit.data[0].sha
    } else {
      if (getLatestCommit.data[0].sha != currentVersion) {
        currentVersion = getLatestCommit.data[0].sha
        await sock.sendMessage(sock.user.id, { image: { url: "./src/new_version.png" }, caption: "*🆕 New Version Available!*\n\n_Please update your bot via_ ```.update```" });
      }
    }
    versionCheckInterval = 180
  }
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
  const { state, saveCreds  } = await useMultiFileAuthState(__dirname + "/session/");

  sock = makeWASocket({
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
      if (!global.similarity) global.similarity = await import('string-similarity-js');
      await sock.sendMessage(mappedId, { text: "_Primon Online!_\n\n_Use_ ```" + global.handlers[0] + "menu``` _to see the list of commands._" });;
    }
  });

  sock.ev.on("messages.upsert", async (msg) => {
    try {
      if (!msg.hasOwnProperty("messages") || msg.messages.length === 0) return;

      for (let {pushName, key} of msg.messages) {
        if (pushName) {
          const sender = key.participant ||(key.fromMe? sock.user.id.split(":")[0] + "@s.whatsapp.net": key.remoteJid);
          global.database.users[sender] = pushName;
        }
      }

      const rawMessage = structuredClone(msg);
      msg = msg.messages[0];
      const quotedMessage = msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      msg.quotedMessage = quotedMessage;

      if ((msg.key && msg.key.remoteJid === "status@broadcast")) return;
      if (global.database.blacklist.includes(msg.key.remoteJid) && !msg.key.fromMe) return;

      if (msg.key.participant == undefined) {
        if (msg.key.fromMe == false) {
          msg.key.participant = msg.key.remoteJid
        } else {
          msg.key.participant = sock.user.id.split(':')[0] + `@s.whatsapp.net` 
        }
      }

      if (global.database.afkMessage.active && (!msg.key.fromMe && !global.database.sudo.includes(msg.key.participant.split('@')[0]))) {
        if (msg.key.remoteJid.includes("@s.whatsapp.net")) {
          if (global.database.afkMessage.type == "text") {
            await sock.sendMessage(msg.key.remoteJid, { text: global.database.afkMessage.content });
          } else {
            var mediaPath = `./src/afk.${global.database.afkMessage.type}`;
            fs.writeFileSync(mediaPath, global.database.afkMessage.media, "base64");
            if (global.database.afkMessage.type == "video") {
              await sock.sendMessage(msg.key.remoteJid, { video: { url: mediaPath }, caption: global.database.afkMessage.content == "" ? undefined : global.database.afkMessage.content }, { quoted: rawMessage.messages[0] });
            } else {
              await sock.sendMessage(msg.key.remoteJid, { image: { url: mediaPath }, caption: global.database.afkMessage.content == "" ? undefined : global.database.afkMessage.content }, { quoted: rawMessage.messages[0] });
            }
            try { fs.unlinkSync(mediaPath) } catch {}
            return;
          }
        } else {
          if (rawMessage.messages[0]?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(sock.user.id.split(':')[0] + `@s.whatsapp.net`)) {
            if (global.database.afkMessage.type == "text") {
              await sock.sendMessage(msg.key.remoteJid, { text: global.database.afkMessage.content }, { quoted: rawMessage.messages[0] });
            } else {
              var mediaPath = `./src/afk.${global.database.afkMessage.type}`;
              fs.writeFileSync(mediaPath, global.database.afkMessage.media, "base64");
              if (global.database.afkMessage.type == "video") {
                await sock.sendMessage(msg.key.remoteJid, { video: { url: mediaPath }, caption: global.database.afkMessage.content == "" ? undefined : global.database.afkMessage.content }, { quoted: rawMessage.messages[0] });
              } else {
                await sock.sendMessage(msg.key.remoteJid, { image: { url: mediaPath }, caption: global.database.afkMessage.content == "" ? undefined : global.database.afkMessage.content }, { quoted: rawMessage.messages[0] });
              }
              try { fs.unlinkSync(mediaPath) } catch {}
              return;
            }
          }
          if (rawMessage.messages[0]?.message?.extendedTextMessage?.contextInfo?.participant == sock.user.id.split(':')[0] + `@s.whatsapp.net`) {
            if (global.database.afkMessage.type == "text") {
              await sock.sendMessage(msg.key.remoteJid, { text: global.database.afkMessage.content });
            } else {
              var mediaPath = `./src/afk.${global.database.afkMessage.type}`;
              fs.writeFileSync(mediaPath, global.database.afkMessage.media, "base64");
              if (global.database.afkMessage.type == "video") {
                await sock.sendMessage(msg.key.remoteJid, { video: { url: mediaPath }, caption: global.database.afkMessage.content == "" ? undefined : global.database.afkMessage.content });
              } else {
                await sock.sendMessage(msg.key.remoteJid, { image: { url: mediaPath }, caption: global.database.afkMessage.content == "" ? undefined : global.database.afkMessage.content });
              }
              try { fs.unlinkSync(mediaPath) } catch {}
              return;
            }
          }
        }
        return;
      }

      await start_command(msg, sock, rawMessage);

    } catch (error) {
      console.log(error);
      await sock.sendMessage(sock.user.id, { text: `*⚠️ Primon Error:*\n${error}` });
    }
  });

  sock.ev.on("group-participants.update", async (participant) => {
    if (global.database.blacklist.includes(participant.id)) return;
    if (participant.action === 'add') {
      const welcomeMessage = global.database.welcomeMessage.find(welcome => welcome.chat === participant.id);
      if (welcomeMessage) {
        const mediaPath = `./welcome.${welcomeMessage.type}`;
        if (['image', 'video'].includes(welcomeMessage.type)) {
          fs.writeFileSync(mediaPath, welcomeMessage.media, "base64");
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
          fs.writeFileSync(mediaPath, goodbyeMessage.media, "base64");
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

  sock.ev.on('creds.update', saveCreds)

  loadModules(__dirname + "/modules");
}

/**
 * Loads and requires all JavaScript modules from the specified directory path.
 *
 * @param {string} modulePath - The directory path where the modules are located.
 */

function loadModules(modulePath, logger = true, refresh = false) {
  fs.readdirSync(modulePath).forEach((file) => {
    if (file.endsWith(".js")) {
      if (refresh) {
        delete require.cache[require.resolve(`${modulePath}/${file}`)];
        logger ? console.log(`Reloading plugin: ${file}`) : null;
        require(`${modulePath}/${file}`);
      } else {
        logger ? console.log(`Loading plugin: ${file}`) : null;
      }
    }
  });
}
global.loadModules = loadModules;
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
  const { pipeline } = require("stream/promises");
  await pipeline(stream, writeStream);
};/**
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

global.getAdmins = async function (groupId) {
  try {
    const groupMetadata = await sock.groupMetadata(groupId);
    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id);
    return admins
  } catch (error) {
    console.error("An error occurred while getting admin list: ", error);
    return [];
  }
};
/**
 * Downloads the contents of the given URL as an arraybuffer.
 *
 * @param {string} url - The URL to download.
 * @returns {Promise<ArrayBuffer>} - A Promise that resolves to the arraybuffer, or an empty string if the download fails.
 */
global.downloadarraybuffer = async function (url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return response.data;
  } catch (error) {
    return ""
  }
}

Object.defineProperty(global, "sock", {
  get: function () {
    return sock;
  },
  set: function (newSock) {
    sock = newSock;
  },
  configurable: true
});