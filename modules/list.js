
/**
 * Adds a command to display the Primon menu.
 *
 * @param {Object} command - The command object.
 * @param {string} command.pattern - The regex pattern to match the command.
 * @param {boolean} command.fromMe - Indicates if the command is from the user.
 * @param {boolean} command.dontAddCommandList - Indicates if the command should be added to the command list.
 * @param {Function} callback - The callback function to execute when the command is matched.
 * @param {Object} msg - The message object.
 * @param {string} msg.key.remoteJid - The ID of the group or chat where the message was sent.
 * @param {Object} match - The matched pattern.
 * @param {Object} sock - The socket object for sending messages.
 * @returns {Promise<void>} - A promise that resolves when the message is sent.
*/
addCommand( {pattern: "^men(u|ü) ?(.*)", access: "all", dontAddCommandList: true}, async (msg, match, sock) => {
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
        await sock.sendMessage(grupId, { text: `📜 *Primon Menu*\n\n${menuText}`, edit: msg.key });
    }
    else {
        await sock.sendMessage(grupId, { text: `📜 *Primon Menu*\n\n${menuText}`});
    }

})