addCommand({pattern: "^ping$", access: "all", desc: "_Meter the response time of the bot._"}, async (msg, match, sock, rawMessage) => {
    const startTime = Date.now();
    if (msg.key.fromMe) {
        await sock.sendMessage(msg.key.remoteJid, { text: "Pong", edit: msg.key });
    } else {
        var publicMessage = await sock.sendMessage(msg.key.remoteJid, { text: "Pong" }, { quoted: rawMessage.messages[0] });
    }
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    if (msg.key.fromMe) {
        const emoji = responseTime < 200 ? "⚡" : (responseTime < 400 ? "⏳" : "⚠️");
        await sock.sendMessage(msg.key.remoteJid, { text: `_${emoji} Pong!_\n\n_Response time: ${responseTime}ms_`, edit: msg.key });
    } else {
        await sock.sendMessage(msg.key.remoteJid, { text: `_${emoji} Pong!_\n\n_Response time: ${responseTime}ms_`, edit: publicMessage.key });
    }
    return;
})