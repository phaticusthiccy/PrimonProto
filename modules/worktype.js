addCommand({ pattern: "^worktype ?(.*)", access: "sudo", desc: "_Change the working type of the bot._", usage: global.handlers[0] + "worktype <public || private>" }, async (msg, match, sock, rawMessage) => {

    var worktype = match[1];
    if (!worktype) {
        return await sock.sendMessage(msg.key.remoteJid, { text: "_Please specify the working type of the bot._", edit: msg.key });
    }

    if (worktype == "public" || worktype == "private") {
        global.database.worktype = worktype;
        return await sock.sendMessage(msg.key.remoteJid, { text: "_The working type of the bot has been changed to " + worktype + "_", edit: msg.key });
    }
})