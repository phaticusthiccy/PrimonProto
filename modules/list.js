/**
 * Handles the "menu" command, which allows users to view a list of available commands and their descriptions.
 *
 * The command can be invoked with or without an argument. If an argument is provided, it will search for a matching command and display its details. If no argument is provided, it will display a list of all available commands.
 *
 * @param {object} msg - The message object containing the command.
 * @param {string[]} match - An array containing the matched parts of the command pattern.
 * @param {object} sock - The WhatsApp socket connection.
 * @param {object} rawMessage - The raw message object.
 * @returns {Promise<void>} - A promise that resolves when the message has been sent.
 */

addCommand( {pattern: "^men(u|ü) ?(.*)", access: "all", dontAddCommandList: true}, async (msg, match, sock, rawMessage) => {
    const inputCommand = match[2].trim();
    let menuText;

    if (inputCommand) {
        const command = global.commands.find(x => x.commandInfo.pattern.replace(/[\^\$\.\*\+\?\(\)\[\]\{\}\\\/]/g, '').replace("sS", "").replace(/ /gmi, "") === inputCommand.replace(/ /gmi, ""));
        if (command) {
            const { pattern, desc, usage, warn } = command.commandInfo;
            menuText = `⌨️ \`\`\`${global.handlers[0]}${pattern.replace(/[\^\$\.\*\+\?\(\)\[\]\{\}\\\/]/g, '').replace("sS", "")}\`\`\`${desc ? `\nℹ️ ${desc}` : ''}${usage ? `\n💻 \`\`\`${usage}\`\`\`` : ''}${warn ? `\n⚠️ ${warn}` : ''}`;
        } else {
            menuText = `❌ Command not found: ${inputCommand}`
        }
    } else {
        menuText = global.commands
            .filter(x => !x.commandInfo.dontAddCommandList)
            .map((x, index, array) => {
                const { pattern, desc, usage, warn } = x.commandInfo;
                return `⌨️ \`\`\`${global.handlers[0]}${pattern.replace(/[\^\$\.\*\+\?\(\)\[\]\{\}\\\/]/g, '').replace("sS", "")}\`\`\`${desc ? `\nℹ️ ${desc}` : ''}${usage ? `\n💻 \`\`\`${usage}\`\`\`` : ''}${warn ? `\n⚠️ ${warn}` : ''}${index !== array.length - 1 ? '\n\n' : ''}`;
            })
            .join('');
    }

    const grupId = msg.key.remoteJid;
    if (msg.key.fromMe) {
        return await sock.sendMessage(grupId, { text: `📜 *Primon Menu*\n\n${menuText}`, edit: msg.key });
    }
    else {
        return await sock.sendMessage(grupId, { text: `📜 *Primon Menu*\n\n${menuText}`}, { quoted: rawMessage.messages[0]});
    }

})