addCommand({ pattern: "^tagall ?(.*)", desc: "_It allows you to tag all users in the group._", access: "sudo", onlyInGroups: true}, async (msg, match, sock) => {
    const groupId = msg.key.remoteJid;
    console.log(match[1])
    if (!await checkAdmin(msg, sock, groupId)) {
        if (msg.key.fromMe) {
            return sock.sendMessage(groupId, {text: "_Bot is not an admin in this group!_", edit: msg.key})
        }
        else {
            return sock.sendMessage(groupId, {text: "_Bot is not an admin in this group!_"})
        }
    }
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
        return sock.sendMessage(groupId, { text: mentionText, mentions: participants });
    }
}); 

addCommand({ pattern: "^tagadmin ?(.*)", desc: "_It allows you to tag the admins in the group._", access: "sudo", onlyInGroups: true }, async (msg, match, sock) => {
    const groupId = msg.key.remoteJid;
    
    if (!await checkAdmin(msg, sock, groupId)) {
        if (msg.key.fromMe) {
            return sock.sendMessage(groupId, { text: "_Bot is not an admin in this group!_", edit: msg.key });
        } else {
            return sock.sendMessage(groupId, { text: "_Bot is not an admin in this group!_", edit: msg.key });
        }
    }

    const groupMetadata = await sock.groupMetadata(groupId);
    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id);
    console.log(groupMetadata.participants)
    if (match[1]) {
        var mentionText = match[1];
    }
    else {
        var mentionText = admins.map(id => `• @${id.split("@")[0]}\n`).join("");
    }
    if (msg.key.fromMe) {
        return sock.sendMessage(groupId, { text: mentionText, mentions: admins, edit: msg.key });
    } else {
        return sock.sendMessage(groupId, { text: mentionText, mentions: admins });
    }
});
