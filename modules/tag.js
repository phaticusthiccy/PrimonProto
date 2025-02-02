addCommand({ pattern: "^tagall ?([\\s\\S]*)", desc: "_It allows you to tag all users in the group._", access: "all", onlyInGroups: true}, async (msg, match, sock, rawMessage) => {
    const groupId = msg.key.remoteJid;

    const groupMetadata = await sock.groupMetadata(groupId);
    const participants = groupMetadata.participants.map(p => p.id);
    if (match[1]) {
        var mentionText = match[1];
    }
    else {
        var mentionText =  participants.map(id => `• @${id.split("@")[0]}\n`).join("");
    }
    
    if (msg.key.fromMe) {
        return sock.sendMessage(groupId, { text: mentionText, mentions: participants, edit: msg.key});
    }
    else {
        return sock.sendMessage(groupId, { text: mentionText, mentions: participants }, { quoted: rawMessage.messages[0] });
    }
}); 

addCommand({ pattern: "^tagadmin ?([\\s\\S]*)", desc: "_It allows you to tag the admins in the group._", access: "all", onlyInGroups: true }, async (msg, match, sock, rawMessage) => {
    const groupId = msg.key.remoteJid;
    
    const groupMetadata = await sock.groupMetadata(groupId);
    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id);
    if (match[1]) {
        var mentionText = match[1];
    } else {
        var mentionText = admins.map(id => `• @${id.split("@")[0]}\n`).join("");
    }
    if (msg.key.fromMe) {
        return sock.sendMessage(groupId, { text: mentionText, mentions: admins, edit: msg.key });
    } else {
        return sock.sendMessage(groupId, { text: mentionText, mentions: admins }, { quoted: rawMessage.messages[0] });
    }
});
