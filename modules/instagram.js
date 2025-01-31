const instaDownload = require("ic3zy-api").downloads;
const fs = require("fs");
addCommand({pattern: "^insta ?(.*)", desc: "Allows you to download videos/images from Instagram.", access: "all"}, async (msg, match, sock) => {
    const data = await instaDownload(match[1], __dirname+"/insta");
    if (data.type == "video") await sock.sendMessage(msg.key.remoteJid, {video: { url: data.path }, caption: data.info});
    else await sock.sendMessage(msg.key.remoteJid, {image: { url: data.path }, caption: data.info});
    fs.unlinkSync(data.path);
});