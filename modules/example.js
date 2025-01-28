addCommand({ pattern: '^ping$', fromMe: true }, async (msg, match, sock) => {
    const grupId = msg.key.remoteJid;
    await sock.sendMessage(grupId, { text: 'Pong!' });
});
addCommand({ pattern: '^hello$', fromMe: true }, async (msg, match, sock) => {
    const grupId = msg.key.remoteJid;
    await sock.sendMessage(grupId, { text: 'Hello World!' });
});
