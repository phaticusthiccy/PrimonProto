/**
 * Adds a command to check if the bot is alive.
 *
 * @param {Object} command - The command object.
 * @param {string} command.pattern - The regex pattern to match the command.
 * @param {boolean} command.fromMe - Whether the command should be from the bot owner.
 * @param {string} command.desc - The description of the command.
 * @param {Function} callback - The callback function to execute when the command is matched.
 * @param {Object} msg - The message object.
 * @param {Object} msg.key - The key object of the message.
 * @param {string} msg.key.remoteJid - The remote JID of the group or user.
 * @param {Object} match - The match object.
 * @param {Object} sock - The socket object for sending messages.
 * @returns {Promise<void>} - A promise that resolves when the message is sent.
*/

const fs = require('fs');
const lang = require(`../language/${database.language}.json`).alive;
addCommand({ pattern: "^alive$", access: "all", desc: lang.desc }, async (msg, match, sock) => {
    const grupId = msg.key.remoteJid;
    const aliveMessage = global.database.aliveMessage;
    const mediaPath = `./alive.${aliveMessage.type}`;

    if (aliveMessage.type === "text") {
        if (msg.key.fromMe) {
            return await sock.sendMessage(grupId, {text: lang.aliveMessageContent, edit: msg.key});
        }
        else {
            return await sock.sendMessage(grupId, {text: aliveMessage.content}); // komutu başka birisi yazdığında düzenlemeyi deneyip hata fırlatmayacak.
        }
        
    }

    if (!fs.existsSync(mediaPath)) {
        fs.writeFileSync(mediaPath, aliveMessage.media, "base64");
    }

    const messageOptions = {
        [aliveMessage.type]: { url: mediaPath },
        caption: aliveMessage.content || undefined
    };

    return await sock.sendMessage(grupId, messageOptions);
});