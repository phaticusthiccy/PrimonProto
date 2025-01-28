addCommand( {pattern: "^men(u|ü)$", fromMe: true, dontAddCommandList: true}, async (msg, match, sock) => {

    var menuText = "📜 *Primon Menu*\n\n";
    global.commands.filter(x => !x.commandInfo.dontAddCommandList).map((x, index) => {
        x = x.commandInfo;
        menuText += "⌨️ ```" + global.handlers[0] + x.pattern.replace(/[\^\$\.\*\+\?\(\)\[\]\{\}\\\/]/g, '') + "```"
        menuText += x.desc ? "\nℹ️ " + x.desc : "";
        menuText += x.usage ? "\n💻 ```" + x.usage + "```" : "";
        menuText += x.warn ? "\n⚠️ " + x.warn : "";
        if (index !== global.commands.filter(x => !x.commandInfo.dontAddCommandList).length - 1) {
            menuText += "\n\n";
        }
    });
    const grupId = msg.key.remoteJid;
    return await sock.sendMessage(grupId, { text: menuText, edit: msg.key });
})