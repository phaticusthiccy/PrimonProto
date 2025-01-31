async function replaceUserPosition(sock, groupJid, userJid, argm) {
	try {
	   /*
	  	* If argm = add, it adds a person to the group.
		* If argm = remove, it removes a person from the group.
		* If argm = promote, it makes a person an admin in the group.
		* If argm = demote, it removes a person from their admin role in the group.
		*/
		const result = await sock.groupParticipantsUpdate(
			groupJid,
			[userJid],
			`${argm}`
		);
	} catch (error) {
		console.error('possitions replace error: ', error);
	}
}

addCommand({pattern: "^ban ?(.*)", desc:"Allows you to ban a person from the group.", access: "sudo", onlyInGroups: true, adminOnly: "users"}, (async (msg, match, sock) => {
    const groupId = msg.key.remoteJid;
    if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        var quotedMessage = msg.message.extendedTextMessage.contextInfo.participant;
        await replaceUserPosition(sock, groupId, quotedMessage, "remove");
    } else if (match[1]) {
        await replaceUserPosition(sock, groupId, match[1].replace("@", "")+"@s.whatsapp.net", "remove")
    } else {
        if (msg.key.fromMe) {
            return await sock.sendMessage(groupId, {text: "Please reply to someone or mention them.", edit: msg.key});
        } else {
            return await sock.sendMessage(groupId, {text: "Please reply to someone or mention them."});
        }
    }
    if (msg.key.fromMe) {
        return await sock.sendMessage(groupId, {text: "The person has been successfully banned from the group ✅", edit: msg.key});
    } else {
        return await sock.sendMessage(groupId, {text: "The person has been successfully banned from the group ✅"});
    }
}));

addCommand({pattern: "^add ?(.*)", desc:"Allows you to add a person from the group.", access: "sudo", onlyInGroups: true, adminOnly: "users"}, (async (msg, match, sock) => {
    const groupId = msg.key.remoteJid;
    if (match[1]) {
        await replaceUserPosition(sock, groupId, match[1]+"@s.whatsapp.net", "add")
    } else {
        if (msg.key.fromMe) {
            return await sock.sendMessage(groupId, {text: "Please enter a number.", edit: msg.key})
        } else {
            return await sock.sendMessage(groupId, {text: "Please enter a number."})
        }
    }
    if (msg.key.fromMe) {
        return await sock.sendMessage(groupId, {text: "The person has been successfully banned from the group ✅", edit: msg.key});
    } else {
        return await sock.sendMessage(groupId, {text: "The person has been successfully banned from the group ✅"});
    }
}));

addCommand({pattern: "^promote ?(.*)", desc:"Allows you to make the user an admin in the group.", access: "sudo", onlyInGroups: true, adminOnly: "users"}, (async (msg, match, sock) => {
    const groupId = msg.key.remoteJid;
    if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        var quotedMessage = msg.message.extendedTextMessage.contextInfo.participant;
        await replaceUserPosition(sock, groupId, quotedMessage, "promote");
    } else if (match[1]) {
        await replaceUserPosition(sock, groupId, match[1].replace("@", "")+"@s.whatsapp.net", "promote")
    } else {
        if (msg.key.fromMe) {
            return await sock.sendMessage(groupId, {text: "Please reply to someone or mention them.", edit: msg.key});
        } else {
            return await sock.sendMessage(groupId, {text: "Please reply to someone or mention them."});
        }
    }
    if (msg.key.fromMe) {
        return await sock.sendMessage(groupId, {text: "The person has been successfully made an admin ✅", edit: msg.key});
    } else {
        return await sock.sendMessage(groupId, {text: "The person has been successfully made an admin ✅"});
    }
}));

addCommand({pattern: "^demote ?(.*)", desc:"Allows you to remove the user from admin in the group.", access: "sudo", onlyInGroups: true, adminOnly: "users"}, (async (msg, match, sock) => {
    const groupId = msg.key.remoteJid;
    if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        var quotedMessage = msg.message.extendedTextMessage.contextInfo.participant;
        await replaceUserPosition(sock, groupId, quotedMessage, "demote");
    } else if (match[1]) {
        await replaceUserPosition(sock, groupId, match[1].replace("@", "")+"@s.whatsapp.net", "demote")
    } else {
        if (msg.key.fromMe) {
            return await sock.sendMessage(groupId, {text: "Please reply to someone or mention them.", edit: msg.key});
        } else {
            return await sock.sendMessage(groupId, {text: "Please reply to someone or mention them."});
        }
    }
    if (msg.key.fromMe) {
        return await sock.sendMessage(groupId, {text: "The person's admin privileges have been successfully removed ✅.", edit: msg.key});
    } else {
        return await sock.sendMessage(groupId, {text: "The person's admin privileges have been successfully removed ✅."});
    }
}));