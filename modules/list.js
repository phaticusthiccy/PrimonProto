const fs = require('fs');

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
    let menuText = "";

    const userId = msg.key.participant || msg.key.remoteJid;
    const isSudo = msg.key.fromMe || global.database.sudo.includes(userId.split("@")[0]);
    
    if (inputCommand) {
        var command = global.commands
        .filter(x => !x.commandInfo.dontAddCommandList &&
            (x.commandInfo.access !== "sudo" || isSudo) &&
            (!x.commandInfo.onlyInGroups || msg.key.remoteJid.endsWith('@g.us')) &&
            !(msg.key.remoteJid.split("@")[0] === sock.user.id.split("@")[0] && x.commandInfo.notAvaliablePersonelChat))
        .find(x => x.commandInfo.pattern.replace(/[\^\$\.\*\+\?\(\)\[\]\{\}\\\/]/g, '').replace("sS", "").replace(/ /gmi, "") === inputCommand.replace(/ /gmi, ""));

        if (fs.existsSync(`./modules/${inputCommand}.js`)) command = false
        if (command) {
            const { pattern, desc, usage, warn, access } = command.commandInfo;
            if (access === "sudo" && !isSudo) {
                menuText = `❌ Command not found: ${inputCommand}`;
            } else {
                menuText = `⌨️ \`\`\`${global.handlers[0]}${pattern.replace(/[\^\$\.\*\+\?\(\)\[\]\{\}\\\/]/g, '').replace("sS", "")}\`\`\`${desc ? `\nℹ️ ${desc}` : ''}${usage ? `\n💻 \`\`\`${usage}\`\`\`` : ''}${warn ? `\n⚠️ ${warn}` : ''}`;
            }
        } else {
            try {
                const fileContent = fs.readFileSync(`./modules/${inputCommand}.js`, "utf8");
                const patternValues = fileContent.match(/pattern:\s*"(.*?)"/g)?.map(match => match.split('"')[1].replace(/\\\\/g, "\\")) || [];
                
                patternValues.forEach(OGpattern => {
                    const command = global.commands
                    .filter(x => !x.commandInfo.dontAddCommandList &&
                        (x.commandInfo.access !== "sudo" || isSudo) &&
                        (!x.commandInfo.onlyInGroups || msg.key.remoteJid.endsWith('@g.us')) &&
                        !(msg.key.remoteJid.split("@")[0] === sock.user.id.split("@")[0] && x.commandInfo.notAvaliablePersonelChat))
                    .find(x => x.commandInfo.pattern === OGpattern);

                    if (command) {
                        const { pattern, desc, usage, warn, access } = command.commandInfo;
                        if (access === "sudo" && !isSudo) {
                            menuText = `❌ Command not found: ${inputCommand}`;
                        } else {
                            menuText += `⌨️ \`\`\`${global.handlers[0]}${pattern.replace(/[\^\$\.\*\+\?\(\)\[\]\{\}\\\/]/g, '').replace("sS", "")}\`\`\`${desc ? `\nℹ️ ${desc}` : ''}${usage ? `\n💻 \`\`\`${usage}\`\`\`` : ''}${warn ? `\n⚠️ ${warn}` : ''}\n\n`;
                        }
                    }
                });
            } catch {
                command = global.commands
                .filter(x => !x.commandInfo.dontAddCommandList &&
                    (x.commandInfo.access !== "sudo" || isSudo) &&
                    (!x.commandInfo.onlyInGroups || msg.key.remoteJid.endsWith('@g.us')) &&
                    !(msg.key.remoteJid.split("@")[0] === sock.user.id.split("@")[0] && x.commandInfo.notAvaliablePersonelChat))
                    
                var modules_means = []
                await command.forEach(async (x) => {
                    modules_means.push({
                        pattern: `${x.commandInfo.pattern.replace(/[\^\$\.\*\+\?\(\)\[\]\{\}\\\/]/g, '').replace("sS", "")}`,
                        similarity_score: await global.similarity.default.stringSimilarity(inputCommand, x.commandInfo.pattern.replace(/[\^\$\.\*\+\?\(\)\[\]\{\}\\\/]/g, '').replace("sS", "").replace(global.handlers[0], ""))
                    })
                })
                modules_means.sort((a, b) => b.similarity_score - a.similarity_score);
                menuText = `_❌ Command not found: ${inputCommand}_\n\n_Did you mean:_ ` + "```" + global.handlers[0] + modules_means[0].pattern + "```";
            }
        }
    } else {
        menuText = global.commands
            .filter(x => !x.commandInfo.dontAddCommandList &&
                (x.commandInfo.access !== "sudo" || isSudo) &&
                (!x.commandInfo.onlyInGroups || msg.key.remoteJid.endsWith('@g.us')) &&
                !(msg.key.remoteJid.split("@")[0] === sock.user.id.split("@")[0] && x.commandInfo.notAvaliablePersonelChat))
            .map((x, index, array) => {
                const { pattern, desc, usage, warn } = x.commandInfo;
                return `⌨️ \`\`\`${global.handlers[0]}${pattern.replace(/[\^\$\.\*\+\?\(\)\[\]\{\}\\\/]/g, '').replace("sS", "")}\`\`\`${desc ? `\nℹ️ ${desc}` : ''}${usage ? `\n💻 \`\`\`${usage}\`\`\`` : ''}${warn ? `\n⚠️ ${warn}` : ''}${index !== array.length - 1 ? '\n\n' : ''}`;
            })
            .join('');
    }

    const grupId = msg.key.remoteJid;
    if (msg.key.fromMe) {
        return await sock.sendMessage(grupId, { text: `📜 *Primon Menu*\n\n${menuText.trimEnd()}`, edit: msg.key });
    } else {
        return await sock.sendMessage(grupId, { text: `📜 *Primon Menu*\n\n${menuText.trimEnd()}`}, { quoted: rawMessage.messages[0]});
    }
})