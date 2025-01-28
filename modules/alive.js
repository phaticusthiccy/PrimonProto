const fs = require('fs');

addCommand({ pattern: "^alive$", fromMe: true, desc: "Check if the bot is alive." }, async (msg, match, sock) => {
    const grupId = msg.key.remoteJid;
    var aliveMessage = global.database.aliveMessage
    if (aliveMessage.type == "text") {
        return await sock.sendMessage(grupId, {
            edit: msg.key,
            text: aliveMessage.content
        });
    } else if (aliveMessage.type == "image") {
        if (!fs.existsSync("./alive.png")) {
            fs.writeFileSync("./alive.png", aliveMessage.media, "base64");
        }
        await sock.sendMessage(grupId, {
            delete: msg.key
        });
        return await sock.sendMessage(grupId, {
            image: {
                url: "./alive.png"
            },
            caption: aliveMessage.content !== "" ? aliveMessage.content : undefined,
        });
    } else if (aliveMessage.type == "video") {
        if (!fs.existsSync("./alive.mp4")) {
            fs.writeFileSync("./alive.mp4", aliveMessage.media, "base64");
        }
        await sock.sendMessage(grupId, {
            delete: msg.key
        });
        return await sock.sendMessage(grupId, {
            video: {
                url: "./alive.mp4"
            },
            caption: aliveMessage.content !== "" ? aliveMessage.content : undefined,
        });
    }
});