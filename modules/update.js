const axios = require('axios');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');

addCommand({ pattern: "^update$", access: "sudo", desc: "_Update the bot._" }, async (msg, match, sock, rawMessage) => {
    const groupId = msg.key.remoteJid;

    if (msg.key.fromMe) {
        await sock.sendMessage(groupId, { text: `🔄 Updating...`, edit: msg.key });
    } else {
        var publicMessage = await sock.sendMessage(groupId, { text: `🔄 Updating...` }, { quoted: rawMessage.messages[0] });
    }

    const repoOwner = 'phaticusthiccy';
    const repoName = 'PrimonProto';;
    const branch = 'main';
    const zipUrl = `https://github.com/${repoOwner}/${repoName}/archive/refs/heads/${branch}.zip`;

    try {
        const response = await axios({
            url: zipUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const zipPath = path.join(__dirname, `${repoName}.zip`);
        const writer = fs.createWriteStream(zipPath);

        response.data.pipe(writer);

        writer.on('finish', async () => {
            fs.createReadStream(zipPath)
                .pipe(unzipper.Extract({ path: __dirname }))
                .on('close', async () => {
                    fs.unlinkSync(zipPath);
                    if (msg.key.fromMe) {
                        await sock.sendMessage(groupId, { text: `✅ Update successful!`, edit: msg.key });
                    } else {
                        await sock.sendMessage(groupId, { text: `✅ Update successful!`, edit: publicMessage.key });
                    }
                    process.exit(0);
                });
        });

        writer.on('error', async (err) => {
            console.error(`Download error: ${err}`);
            if (msg.key.fromMe) {
                await sock.sendMessage(groupId, { text: `❌ Update failed: ${err.message}`, edit: msg.key });
            } else {
                await sock.sendMessage(groupId, { text: `❌ Update failed: ${err.message}`, edit: publicMessage.key });
            }
        });
    } catch (error) {
        console.error(`Update error: ${error}`);
        if (msg.key.fromMe) {
            await sock.sendMessage(groupId, { text: `❌ Update failed: ${error.message}`, edit: msg.key });
        } else {
            await sock.sendMessage(groupId, { text: `❌ Update failed: ${error.message}`, edit: publicMessage.key });
        }
    }
});