const fs = require('fs');

addCommand({ pattern: "^show$", access: "all", desc: "_It allows you to view the view once messages._" }, async (msg, match, sock, rawMessage) => {
    const grupId = msg.key.remoteJid;
    if (!msg.quotedMessage) {
        if (msg.key.fromMe) {
            return await sock.sendMessage(grupId, { text: "_Please reply to a view once message!_", edit: msg.key });
        } else {
            return await sock.sendMessage(grupId, { text: "_Please reply to a view once message!_"}, { quoted: rawMessage.messages[0] });
        }
    }

    if (msg.quotedMessage?.viewOnceMessage || msg.quotedMessage?.viewOnceMessageV2 || msg.quotedMessage?.viewOnceMessageV2Extension || msg.quotedMessage?.imageMessage) {
        var viewOnceMessage = msg.quotedMessage?.viewOnceMessage?.message?.imageMessage || msg.quotedMessage?.viewOnceMessage?.message?.videoMessage || msg.quotedMessage?.viewOnceMessageV2?.message?.imageMessage || msg.quotedMessage?.viewOnceMessageV2?.message?.videoMessage || msg.quotedMessage?.viewOnceMessageV2Extension?.message || msg.quotedMessage?.viewOnceMessageV2Extension?.message?.imageMessage || msg.quotedMessage?.viewOnceMessageV2Extension?.message?.videoMessage || msg.quotedMessage?.imageMessage || msg.quotedMessage?.videoMessage;
        if ((msg.quotedMessage?.imageMessage && msg.quotedMessage?.imageMessage?.viewOnce !== true) || (msg.quotedMessage?.videoMessage && msg.quotedMessage?.videoMessage?.viewOnce !== true)) {
            if (msg.key.fromMe) {
                return await sock.sendMessage(grupId, { text: "_Please reply to a view once message!_", edit: msg.key });
            } else {
                return await sock.sendMessage(grupId, { text: "_Please reply to a view once message!_"}, { quoted: rawMessage.messages[0] });
            }
        }
        const mediaPath = `./viewOnceMessage` + Math.floor(Math.random() * 1000) + (viewOnceMessage?.imageMessage ? ".png" : ".mp4");
        var configs = {
            _0: viewOnceMessage,
            _1: msg.quotedMessage?.imageMessage ? "image" : "video",
            _2: mediaPath
        };

        const downloadMessage = msg.key.fromMe 
            ? { text: "_⏳ Downloading.._", edit: msg.key } 
            : { text: "_⏳ Downloading.._", quoted: rawMessage.messages[0] };

        const sentMessage = await sock.sendMessage(grupId, downloadMessage);

        await global.downloadMedia(configs._0, configs._1, configs._2);

        const deleteMessage = { delete: msg.key.fromMe ? msg.key : sentMessage.key };
        const mediaMessage = { [configs._1]: { url: configs._2 }, caption: `_⏳ Downloaded!_` };
        const sendMediaMessage = msg.key.fromMe 
            ? mediaMessage 
            : { ...mediaMessage, quoted: rawMessage.messages[0] };

        await sock.sendMessage(grupId, deleteMessage);
        await sock.sendMessage(grupId, sendMediaMessage);

        if (fs.existsSync(configs._2)) fs.unlinkSync(configs._2);
        return;
    } else {
        if (msg.key.fromMe) {
            return await sock.sendMessage(grupId, { text: "_Please reply to a view once message!_", edit: msg.key });
        } else {
            return await sock.sendMessage(grupId, { text: "_Please reply to a view once message!_"}, { quoted: rawMessage.messages[0] });
        }
    }
})