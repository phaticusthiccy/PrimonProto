

/**
 * Adds a command to edit configurations.
 * 
 * @param {Object} command - The command object.
 * @param {string} command.pattern - The regex pattern to match the command.
 * @param {boolean} command.fromMe - Whether the command is from the user.
 * @param {boolean} command.notAvaliablePersonelChat - Whether the command is not available in personal chat.
 * @param {string} command.desc - The description of the command.
 * @param {string} command.usage - The usage of the command.
 * @param {Function} callback - The callback function to handle the command.
 * @param {Object} msg - The message object.
 * @param {Array} match - The matched patterns from the command.
 * @param {Object} sock - The socket object for sending messages.
 * 
 * @returns {Promise<void>}
*/
const fs = require('fs');

addCommand( {pattern: "^edit ?(.*)", access: "sudo", notAvaliablePersonelChat: true, desc: "_Edit configurations._", usage: global.handlers[0] + "edit <alive || afk || welcome || goodbye>"}, async (msg, match, sock, rawMessage) => {

    const grupId = msg.key.remoteJid;
    if (!match[1]) {
        if (msg.key.fromMe) {
            return await sock.sendMessage(grupId, { text: "_Please enter the configuration to edit._\n\n_Avaliable Configurations ::_ ```alive, welcome, goodbye, afk```", edit: msg.key });
        } else {
            return await sock.sendMessage(grupId, { text: "_Please enter the configuration to edit._\n\n_Avaliable Configurations ::_ ```alive, welcome, goodbye, afk```"}, { quoted: rawMessage.messages[0] });
        }
    }

    if (!msg.quotedMessage && !match[1].includes("del")) {
        if (msg.key.fromMe) {
            return await sock.sendMessage(grupId, { text: "_Please reply to a message or media to edit._", edit: msg.key });
        } else {
            return await sock.sendMessage(grupId, { text: "_Please reply to a message or media to edit._"}, { quoted: rawMessage.messages[0] });
        }
    }

    /*
        Text Messages = msg.quotedMessage.extendedTextMessage.text 
        Image Messages = msg.quotedMessage.imageMessage
        Video Messages = msg.quotedMessage.videoMessage
        Audio Messages = msg.quotedMessage.audioMessage
        Document Messages = msg.quotedMessage.documentMessage
        Sticker Messages = msg.quotedMessage.stickerMessage
        Location Messages = msg.quotedMessage.locationMessage
        Contact Messages = msg.quotedMessage.contactMessage
        Ptv Messages = msg.quotedMessage.ptvMessage (Video Note)
        View Once Messages = msg.quotedMessage.viewOnceMessage
        View Once V2 Messages = msg.quotedMessage.viewOnceMessageV2
        View Once Messages Extension = msg.quotedMessage.viewOnceMessageV2Extension
    */

    const updateMessage = async (type, mediaPath, content, configType) => {
        const configMap = {
            alive: 'aliveMessage',
            welcome: 'welcomeMessage',
            goodbye: 'goodbyeMessage',
            afk: 'afkMessage'
        };
        const configKey = configMap[configType];
        if (configType === 'alive') {
            global.database[configKey] = { type, media: mediaPath ? fs.readFileSync(mediaPath, "base64").toString() : "", content };
        } else if (configType === "afk") {
            global.database[configKey] = { type, media: mediaPath ? fs.readFileSync(mediaPath, "base64").toString() : "", content, active: false };
        } else {
            let config = global.database[configKey].find(x => x.chat === grupId);
            if (!config) {
                global.database[configKey].push({ chat: grupId, type, media: mediaPath ? fs.readFileSync(mediaPath, "base64").toString() : "", content });
            } else {
                config.type = type;
                config.media = mediaPath ? fs.readFileSync(mediaPath, "base64").toString() : "";
                config.content = content;
            }
        }

        let toDelMessage = ""
        if (configType == "welcome") toDelMessage = "\n\n_To delete welcome meessage, use_ ```" + global.handlers[0] + "edit del welcome```";
        if (configType == "goodbye") toDelMessage = "\n\n_To delete goodbye meessage, use_ ```" + global.handlers[0] + "edit del goodbye```";
        if (configType == "afk") toDelMessage = "\n\n_To delete afk meessage, use_ ```" + global.handlers[0] + "edit del afk```";

        if (msg.key.fromMe) {
            return await sock.sendMessage(grupId, { text: `_✅ ${configType.charAt(0).toUpperCase() + configType.slice(1)} message updated successfully._` + toDelMessage, edit: msg.key });
        } else {
            return await sock.sendMessage(grupId, { text: `_✅ ${configType.charAt(0).toUpperCase() + configType.slice(1)} message updated successfully._` + toDelMessage}, { quoted: rawMessage.messages[0] });
        }
    };

    const { imageMessage, videoMessage, extendedTextMessage, conversation } = msg.quotedMessage || {};
    const configType = match[1];

    if (configType === "alive" || configType === "welcome" || configType === "goodbye" || configType === "afk") {
        if (imageMessage) {
            const mediaPath = `./${configType}.png`;
            await global.downloadMedia(imageMessage, "image", mediaPath);
            return await updateMessage("image", mediaPath, imageMessage.caption || "", configType);
        } else if (videoMessage) {
            const mediaPath = `./${configType}.mp4`;
            await global.downloadMedia(videoMessage, "video", mediaPath);
            return await updateMessage("video", mediaPath, videoMessage.caption || "", configType);
        } else if (extendedTextMessage) {
            return await updateMessage("text", "", extendedTextMessage.text, configType);
        } else if (conversation) {
            return await updateMessage("text", "", conversation, configType);
        } else {
            if (msg.key.fromMe) {
                return await sock.sendMessage(grupId, { text: "_❌ Unsupported message type._", edit: msg.key });
            } else {
                return await sock.sendMessage(grupId, { text: "_❌ Unsupported message type._"}, { quoted: rawMessage.messages[0] });
            }
        }
    }

    if (configType == "del welcome" || configType == "del goodbye" || configType == "del afk") {
        let config = configType === "del welcome" ? global.database.welcomeMessage.find(x => x.chat === grupId) : configType === "del afk" ? (global.database.afkMessage.active == false ? false : global.database.afkMessage) : global.database.goodbyeMessage.find(x => x.chat === grupId);
        if (!config) {
            if (msg.key.fromMe) {
                return await sock.sendMessage(grupId, { text: "_❌ No " + (configType === "del welcome" ? "welcome" : configType === "del afk" ? "afk" : "goodbye") + " message found._", edit: msg.key });
            } else {
                return await sock.sendMessage(grupId, { text: "_❌ No " + (configType === "del welcome" ? "welcome" : configType === "del afk" ? "afk" : "goodbye") + " message found._"}, { quoted: rawMessage.messages[0] });
            }
        } else {
            if (configType === "del welcome") {
                global.database.welcomeMessage = global.database.welcomeMessage.filter(x => x.chat !== grupId);
            } else if (configType === "del afk") {
                global.database.afkMessage.active = false;
                global.database.afkMessage.content = "";
                global.database.afkMessage.media = "";
                global.database.afkMessage.type = "text";

                if (msg.key.fromMe) {
                    return await sock.sendMessage(grupId, { text: "_✅ AFK message deleted successfully._", edit: msg.key });
                } else {
                    return await sock.sendMessage(grupId, { text: "_✅ AFK message deleted successfully._"}, { quoted: rawMessage.messages[0] });
                }
            } else {
                global.database.goodbyeMessage = global.database.goodbyeMessage.filter(x => x.chat !== grupId);
            }
            if (msg.key.fromMe) {
                return await sock.sendMessage(grupId, { text: "_✅ " + (configType === "del welcome" ? "Goodbye" : "Welcome") + " message deleted successfully._", edit: msg.key });
            } else {
                return await sock.sendMessage(grupId, { text: "_✅ " + (configType === "del welcome" ? "Goodbye" : "Welcome") + " message deleted successfully._"}, { quoted: rawMessage.messages[0] });
            }
        }
    }
})