const fs = require('fs');

addCommand( {pattern: "^edit ?(.*)", fromMe: true, notAvaliablePersonelChat: true, desc: "Edit configurations."}, async (msg, match, sock) => {

    const grupId = msg.key.remoteJid;
    if (match[1] == "") {
        return await sock.sendMessage(grupId, { text: "Please enter the configuration to edit.\n\nAvaliable Configuration :: ```alive```", edit: msg.key});
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

    if (msg.quotedMessage == undefined) {
        return await sock.sendMessage(grupId, { text: "Please reply to a message to edit.", edit: msg.key});
    }

    if (match[1] == "alive") {
        if (msg.quotedMessage.imageMessage) {
            await global.downloadMedia(msg.quotedMessage.imageMessage, "image", "./alive.png");
            global.database.aliveMessage = { 
                type: "image", 
                media: fs.readFileSync("./alive.png", "base64").toString(), 
                content: msg.quotedMessage.imageMessage.caption ? msg.quotedMessage.imageMessage.caption : "" 
            };
            return await sock.sendMessage(grupId, { text: "Alive message updated successfully.", edit: msg.key});
        } else if (msg.quotedMessage.videoMessage) {
            await global.downloadMedia(msg.quotedMessage.videoMessage, "video", "./alive.mp4");
            global.database.aliveMessage = {
                type: "video",
                media: fs.readFileSync("./alive.mp4", "base64").toString(),
                content: msg.quotedMessage.videoMessage.caption ? msg.quotedMessage.videoMessage.caption : ""
            };
            return await sock.sendMessage(grupId, { text: "Alive message updated successfully.", edit: msg.key});
        } else if (msg.quotedMessage.extendedTextMessage) {
            global.database.aliveMessage = {
                type: "text",
                media: "",
                content: msg.quotedMessage.extendedTextMessage.text
            };
            return await sock.sendMessage(grupId, { text: "Alive message updated successfully.", edit: msg.key});
        } else {
            return await sock.sendMessage(grupId, { text: "Unsupported message type.", edit: msg.key});
        }
    }
    
})