addCommand({pattern: "^blacklist$", desc:"Allows you to add and remove a user or group to the blacklist.", access: "sudo"}, (async (msg, match, sock, rawMessage) => {
    const groupId = msg.key.remoteJid;    
    if (global.database.blacklist.includes(groupId)) {
        global.database.blacklist.splice(global.database.blacklist.indexOf(groupId), 1);
        if (msg.key.fromMe) {
            return sock.sendMessage(groupId, { text: "_✅ This group has been removed from the blacklist._", edit: msg.key });
        } else {
            return sock.sendMessage(groupId, { text: "_✅ This group has been removed from the blacklist._"}, { quoted: rawMessage.messages[0] });
        }
    } else {
        global.database.blacklist.push(groupId);
        if (msg.key.fromMe) {
            return sock.sendMessage(groupId, { text: "_✅ This group has been added to the blacklist._", edit: msg.key });
        } else {
            return sock.sendMessage(groupId, { text: "_✅ This group has been added to the blacklist._"}, { quoted: rawMessage.messages[0] });
        }
    }
}))