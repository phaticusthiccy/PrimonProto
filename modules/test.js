addCommand({pattern: "^test$", access: "sudo"}, (async (msg, match, sock) => {
    let Id = msg.key.remoteJid;
    console.log("id", Id)
    sock.sendMessage(Id, {text: "test başarılı."})
}))