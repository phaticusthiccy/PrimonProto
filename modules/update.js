const simpleGit = require('simple-git');
const git = simpleGit();
const exec = require('child_process').exec;

addCommand({ pattern: "^update$", access: "sudo", desc: "_Update the bot._" }, async (msg, match, sock, rawMessage) => {
    const groupId = msg.key.remoteJid;

    if (msg.key.fromMe) {
        await sock.sendMessage(groupId, { text: `🔄 Updating...`, edit: msg.key });
    } else {
        var publicMessage = await sock.sendMessage(groupId, { text: `🔄 Updating...` }, { quoted: rawMessage.messages[0] });
    }

    const branch = 'main';
    await git.fetch();
    var commits = await git.log([branch + '..origin/' + branch]);

    if (commits.total === 0) {
        if (msg.key.fromMe) {
            await sock.sendMessage(groupId, { text: `🔄 No updates available.`, edit: msg.key });
        } else {
            await sock.sendMessage(groupId, { text: `🔄 No updates available.`, edit: publicMessage.key });
        }
        return;
    }

    
    commits['all'].map(
        (commit) => {
            "🆕 New Updates\n\n" += '▫️ [' + commit.date.substring(0, 10) + ']: ' + commit.message + ' <' + commit.author_name + '>\n';
        }
    );

    git.pull((async (err, update) => {
        if (err) {
            if (msg.key.fromMe) {
                await sock.sendMessage(groupId, { text: `❌ Update failed.`, edit: msg.key });
            } else {
                await sock.sendMessage(groupId, { text: `❌ Update failed.`, edit: publicMessage.key });
            }
            return;
        }
        if(update && update.summary.changes) {
            if (msg.key.fromMe) {
                await sock.sendMessage(groupId, { text: `✅ Update successful.`, edit: msg.key });
            } else {
                await sock.sendMessage(groupId, { text: `✅ Update successful.`, edit: publicMessage.key });
            }
        }
        exec('npm install').stderr.pipe(process.stderr);
    }));
});