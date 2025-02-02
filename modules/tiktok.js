const Tiktok = require("@tobyg74/tiktok-api-dl")
const fs = require('fs');

addCommand({ pattern: "^tiktok ?(.*)", access: "all", desc: "Download video from tiktok.", usage: global.handlers[0] + "tiktok <url>" }, async (msg, match, sock, rawMessage) => {
    const query = match[1];
    if (!query) {
        if (msg.key.fromMe) {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ Please provide a video link!_", edit: msg.key });
        } else {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ Please provide a video link!_"}, { quoted: rawMessage.messages[0] });
        }
    }

    if (query.match(/^(https?\:\/\/)?(www\.tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)\/.+$/)) {

        if (msg.key.fromMe) {
            await sock.sendMessage(msg.key.remoteJid, { text: "_⏳ Video Downloading.._", edit: msg.key });
        } else {
            var publicMessage = await sock.sendMessage(msg.key.remoteJid, { text: "_⏳ Video Downloading.._"}, { quoted: rawMessage.messages[0] });
        }

        var tk = await Tiktok.Downloader(query, { "version": "v1"})
        if (tk?.result?.type == "video") {
            var url = tk.result.video.downloadAddr[0] || tk.result.video.playAddr[0]
            if (msg.key.fromMe) {
                await sock.sendMessage(msg.key.remoteJid, { delete: msg.key });
            } else {
                await sock.sendMessage(msg.key.remoteJid, { delete: publicMessage.key });
            }
            
            return await sock.sendMessage(msg.key.remoteJid, { video: { url: url }, caption: tk.result?.description || undefined }, { quoted: rawMessage.messages[0] });
        } else {
            if (tk?.result?.type == "image") {
                if (msg.key.fromMe) {
                    await sock.sendMessage(msg.key.remoteJid, { delete: msg.key });
                } else {
                    await sock.sendMessage(msg.key.remoteJid, { delete: publicMessage.key });
                }

                for (let i = 0; i < tk.result.images.length; i++) {
                    var buffer = await global.downloadarraybuffer(tk.result.images[i]);
                    var mediaName = "src/tiktok" + i + ".jpg";
                    fs.writeFileSync(mediaName, buffer);
                    await sock.sendMessage(msg.key.remoteJid, { image: { url: mediaName}, caption: tk.result?.description || undefined }, { quoted: rawMessage.messages[0] });
                }
                return;
            } else {
                if (msg.key.fromMe) {
                    return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No results found for this url!_", edit: msg.key });
                } else {
                    return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No results found for this url!_", edit: publicMessage.key });
                }
            }
        }
    } else {
        if (msg.key.fromMe) {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No results found for this url!_", edit: msg.key });
        } else {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_❌ No results found for this url!_", edit: publicMessage.key });
        }
    }
})

