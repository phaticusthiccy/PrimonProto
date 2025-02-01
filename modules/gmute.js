addCommand({pattern: "^gmute$", desc: "Mutes a user from sending messages in the group.", access: "all", onlyInGroups: true}, async (msg, match, sock, rawMessage) => {
    const groupId = msg.key.remoteJid;

    if (!msg.quotedMessage) {
        if (msg.key.fromMe) {
            return await sock.sendMessage(groupId, { text: "_Please reply to a user!_", edit: msg.key });
        } else {
            return await sock.sendMessage(groupId, { text: "_Please reply to a user!_"}, { quoted: rawMessage.messages[0] });
        }
    }

    var quotedUser = rawMessage.messages[0]?.message?.extendedTextMessage?.contextInfo?.participant || rawMessage.messages[0]?.message?.conversation?.contextInfo?.participant
    if (quotedUser === sock.user.id.split(':')[0] + `@s.whatsapp.net`) {
        if (msg.key.fromMe) {
            return await sock.sendMessage(groupId, { text: "_❌ I can't mute myself!_", edit: msg.key });
        } else {
            return await sock.sendMessage(groupId, { text: "_❌ I can't mute myself!_"}, { quoted: rawMessage.messages[0] });
        }
    }
    
    const admins = await global.getAdmins(msg.key.remoteJid);
    if (!admins.includes(msg.key.participant)) {
        if (msg.key.fromMe) {
            return sock.sendMessage(groupId, { text: "_❌ You are not an admin in this group!_", edit: msg.key })
        } else {
            return sock.sendMessage(groupId, { text: "_❌ You are not an admin in this group!_"}, { quoted: rawMessage.messages[0] })
        }
    }

    if (!await global.checkAdmin(msg, sock, groupId)) {
        if (msg.key.fromMe) {
            return await sock.sendMessage(groupId, {text: "_❌ Sorry, I am not an admin in this group!_", edit: msg.key})
        } else {
            await sock.sendMessage(groupId, { delete: publicMessage.key });
            return await sock.sendMessage(groupId, {text: "_❌ Sorry, I am not an admin in this group!_"}, { quoted: rawMessage.messages[0] })
        }
    };

    const find = global.database.globalMutes.find(x => x.chat === msg.key.remoteJid);

    if (!find) {
        global.database.globalMutes.push({
            chat: msg.key.remoteJid,
            users: [quotedUser]
        });
        if (msg.key.fromMe) {
            return await sock.sendMessage(groupId, { text: "_✅ User has been muted in this group._", edit: msg.key });
        } else {
            return await sock.sendMessage(groupId, { text: "_✅ User has been muted in this group._"}, { quoted: rawMessage.messages[0] });
        }
    } else {
        if (find.users.includes(quotedUser)) {
            if (msg.key.fromMe) {
                return await sock.sendMessage(groupId, { text: "_❌ User is already muted in this group._", edit: msg.key });
            } else {
                return await sock.sendMessage(groupId, { text: "_❌ User is already muted in this group._"}, { quoted: rawMessage.messages[0] });
            }
        } else {
            global.database.globalMutes.find(x => x.chat === msg.key.remoteJid).users.push(quotedUser);
            if (msg.key.fromMe) {
                return await sock.sendMessage(groupId, { text: "_✅ User has been muted in this group._", edit: msg.key });
            } else {
                return await sock.sendMessage(groupId, { text: "_✅ User has been muted in this group._"}, { quoted: rawMessage.messages[0] });
            }
        }
    }
});

addCommand({pattern: "^ungmute$", desc: "Unmutes a user from sending messages in the group.", access: "all", onlyInGroups: true}, async (msg, match, sock, rawMessage) => {
    const groupId = msg.key.remoteJid;

    if (!msg.quotedMessage) {
        if (msg.key.fromMe) {
            return await sock.sendMessage(groupId, { text: "_Please reply to a user!_", edit: msg.key });
        } else {
            return await sock.sendMessage(groupId, { text: "_Please reply to a user!_"}, { quoted: rawMessage.messages[0] });
        }
    }

    var quotedUser = rawMessage.messages[0]?.message?.extendedTextMessage?.contextInfo?.participant || rawMessage.messages[0]?.message?.conversation?.contextInfo?.participant
    if (quotedUser === sock.user.id.split(':')[0] + `@s.whatsapp.net`) {
        if (msg.key.fromMe) {
            return await sock.sendMessage(groupId, { text: "_❌ I can't unmute myself!_", edit: msg.key });
        } else {
            return await sock.sendMessage(groupId, { text: "_❌ I can't unmute myself!_"}, { quoted: rawMessage.messages[0] });
        }
    }

    const admins = await global.getAdmins(msg.key.remoteJid);
    if (!admins.includes(msg.key.participant)) {
        if (msg.key.fromMe) {
            return sock.sendMessage(groupId, { text: "_❌ You are not an admin in this group!_", edit: msg.key })
        } else {
            return sock.sendMessage(groupId, { text: "_❌ You are not an admin in this group!_"}, { quoted: rawMessage.messages[0] })
        }
    }

    if (!await global.checkAdmin(msg, sock, groupId)) {
        if (msg.key.fromMe) {
            return await sock.sendMessage(groupId, {text: "_❌ Sorry, I am not an admin in this group!_", edit: msg.key})
        } else {
            await sock.sendMessage(groupId, { delete: publicMessage.key });
            return await sock.sendMessage(groupId, {text: "_❌ Sorry, I am not an admin in this group!_"}, { quoted: rawMessage.messages[0] })
        }
    };

    const find = global.database.globalMutes.find(x => x.chat === msg.key.remoteJid);

    if (!find) {
        global.database.globalMutes.push({
            chat: msg.key.remoteJid,
            users: []
        });
        if (msg.key.fromMe) {
            return await sock.sendMessage(groupId, { text: "_❌ User is already free to send messages in this group._", edit: msg.key });
        } else {
            return await sock.sendMessage(groupId, { text: "_❌ User is already free to send messages in this group._"}, { quoted: rawMessage.messages[0] });
        }
    } else {
        if (find.users.includes(quotedUser)) {
            global.database.globalMutes.find(x => x.chat === msg.key.remoteJid).users.splice(find.users.indexOf(quotedUser), 1);
            if (msg.key.fromMe) {
                return await sock.sendMessage(groupId, { text: "_✅ User has been unmuted in this group._", edit: msg.key });
            } else {
                return await sock.sendMessage(groupId, { text: "_✅ User has been unmuted in this group._"}, { quoted: rawMessage.messages[0] });
            }
        } else {
            if (msg.key.fromMe) {
                return await sock.sendMessage(groupId, { text: "_❌ User is already free to send messages in this group._", edit: msg.key });
            } else {
                return await sock.sendMessage(groupId, { text: "_❌ User is already free to send messages in this group._"}, { quoted: rawMessage.messages[0] });
            }
        }
    }
});

addCommand({ pattern: "onMessage", dontAddCommandList: true, access: "all" }, async (msg, match, sock) => {
    const mutes = global.database.globalMutes.find(x => x.chat === msg.key.remoteJid);
    if (mutes?.users?.includes(msg.key.participant)) {
        try {
            await sock.sendMessage(msg.key.remoteJid, { delete: msg.key});
        } catch {}
    }
})