addCommand({ pattern: "^sudo ?(.*)", access: "sudo", desc: "_Add or remove sudo users to the bot_", usage: global.handlers[0] + "sudo <add || delete> <number with country code>", warn: "_Users given sudo will have all bot permissions!_" }, async (msg, match, sock, rawMessage) => {
    
    var action = match[1];
    var number = action.split(" ")[1];
    if (!number) {
        return await sock.sendMessage(msg.key.remoteJid, { text: "_Please specify the action to be performed._\n\n_Usage:_ ```" + global.handlers[0] + "sudo <add || delete> <number with country code>```", edit: msg.key });
    }
    if (action.includes("add")) {
        global.database.sudo.push(number);
        if (msg.key.fromMe) {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_The number has been added to the sudoers list._", edit: msg.key });
        } else {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_The number has been added to the sudoers list._"}, { quoted: rawMessage.messages[0] });
        }
    } else if (action.includes("delete") || action.includes("del")) {
        global.database.sudo = global.database.sudo.filter(x => x !== number);
        if (msg.key.fromMe) {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_The number has been removed from the sudoers list._", edit: msg.key });
        } else {
            return await sock.sendMessage(msg.key.remoteJid, { text: "_The number has been removed from the sudoers list._"}, { quoted: rawMessage.messages[0] });
        }
    } else {
        return await sock.sendMessage(msg.key.remoteJid, { text: "_Please specify the action to be performed._\n\n_Usage:_ ```" + global.handlers[0] + "sudo <add || delete> <number with country code>```", edit: msg.key });
    }
})