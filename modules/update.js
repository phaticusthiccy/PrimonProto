const simpleGit = require('simple-git');
const git = simpleGit();
const { execSync } = require('child_process');

addCommand({ pattern: "^update$", access: "sudo", desc: "_Update the bot._" }, async (msg, match, sock, rawMessage) => {
    const groupId = msg.key.remoteJid;

    if (msg.key.fromMe) {
        await sock.sendMessage(groupId, { text: `_🔄 Updating..._`, edit: msg.key });
    } else {
        var publicMessage = await sock.sendMessage(groupId, { text: `_🔄 Updating..._` }, { quoted: rawMessage.messages[0] });
    }

    await git.fetch();
    var commits = await git.log(["main" + '..origin/' + "main"]);
    
    if (commits.total === 0) {
        if (msg.key.fromMe) {
            await sock.sendMessage(groupId, { text: `_🔄 No updates available._`, edit: msg.key });
        } else {
            await sock.sendMessage(groupId, { text: `_🔄 No updates available._`, edit: publicMessage.key });
        }
        return;
    }

    await git.stash();
    try {
        await git.pull();
        if (msg.key.fromMe) {
            await sock.sendMessage(groupId, { text: `_✅ Update successful._`, edit: msg.key });
        } else {
            await sock.sendMessage(groupId, { text: `_✅ Update successful._`, edit: publicMessage.key });
        }
    } catch (err) {
        if (msg.key.fromMe) {
            await sock.sendMessage(groupId, { text: `_❌ Update failed._\n\n_If you changed the local files that means you cant update automatically. Please rebuild the bot._`, edit: msg.key });
        } else {
            await sock.sendMessage(groupId, { text: `_❌ Update failed._\n\n_If you changed the local files that means you cant update automatically. Please rebuild the bot._`, edit: publicMessage.key });
        }
    }
    await git.stash(['pop']);
    process.exit(0);
});