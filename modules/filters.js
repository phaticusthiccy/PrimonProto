
/**
 * Adds a command that listens for incoming messages and responds based on predefined filters.
 * 
 * @param {Object} options - Command options.
 * @param {string} options.pattern - The pattern to match for the command.
 * @param {boolean} options.dontAddCommandList - Whether to add the command to the command list.
 * @param {boolean} options.fromMe - Whether the command is from the user.
 * @param {Function} callback - The callback function to execute when the command is matched.
 * @param {Object} msg - The message object.
 * @param {Array} match - The matched patterns.
 * @param {Object} sock - The socket object.
 * @param {Object} rawMessage - The raw message object.
 * 
 * @returns {Promise<void>}
 */

/**
 * Adds a command to manage filters that automatically respond to chats.
 * 
 * @param {Object} options - Command options.
 * @param {string} options.pattern - The pattern to match for the command.
 * @param {boolean} options.fromMe - Whether the command is from the user.
 * @param {string} options.desc - The description of the command.
 * @param {string} options.usage - The usage information for the command.
 * @param {Function} callback - The callback function to execute when the command is matched.
 * @param {Object} msg - The message object.
 * @param {Array} match - The matched patterns.
 * @param {Object} sock - The socket object.
 * 
 * @returns {Promise<void>}
*/

addCommand( {pattern: "onMessage", dontAddCommandList: true, access: "sudo"}, async (msg, match, sock, rawMessage) => {
    //! Warning! This type of commands are heavly resource intensive and can cause the bot to lag.
    const chatFilters = global.database.filters.find(filter => filter.chat === msg.key.remoteJid);
    if (chatFilters && chatFilters.filters.length > 0) {
        for (const filter of chatFilters.filters) {
            if (new RegExp(filter.incoming).test(msg.text)) {
                if (msg.text.startsWith(".filter add") || msg.text.startsWith(".filter delete")) return;
                return await sock.sendMessage(msg.key.remoteJid, { text: filter.outgoing }, { quoted: rawMessage.messages[0] });
            }
        }
    }
})

addCommand( {pattern: "^filter ?([\\s\\S]*)", access: "sudo", desc: "_Add filters that automatically respond to your chats. Supports regexp._", usage: global.handlers[0] + "filter - " + global.handlers[0] + "filter <add || delete>"}, async (msg, match, sock) => {
    const groupId = msg.key.remoteJid;
    if (!match[1].trim()) {
        const find = global.database.filters.find(x => x.chat === msg.key.remoteJid);
        if (find && find.filters.length > 0) {
            const text = "📜 _Filters In This Chat_\n" + find.filters.map((x, index) => `\n*${index + 1}.* \`\`\`${x.incoming.replace(/[\^\$\.\*\+\?\(\)\[\]\{\}\\\/]/g, '')}\`\`\``).join('');
            if (msg.key.fromMe) {
                return await sock.sendMessage(groupId, { text, edit: msg.key });
            }
            else {
                return await sock.sendMessage(groupId, { text });
            }
        } else {
            if (msg.key.fromMe) {
                return await sock.sendMessage(groupId, { text: "_❌ No filters found._", edit: msg.key });
            }
            else {
                return await sock.sendMessage(groupId, { text: "_❌ No filters found._"});
            }
        }
    }  

    if (match[1].startsWith("delete")) {
        const find = global.database.filters.find(x => x.chat === msg.key.remoteJid);
        if (!find || find.filters.length === 0) {
            if (msg.key.fromMe) {
                return await sock.sendMessage(groupId, { text: "_❌ No filters found._", edit: msg.key });
            }
            else {
                return await sock.sendMessage(groupId, { text: "_❌ No filters found._"});
            }
        }
        const filterToDelete = match[1].replace("delete", "").trim();
        if (!filterToDelete) {
            if (msg.key.fromMe) {
                return await sock.sendMessage(groupId, { text: "_❌ No filters found._", edit: msg.key });
            }
            else {
                return await sock.sendMessage(groupId, { text: "_❌ No filters found._"});
            }

        }
        const filterIndex = find.filters.findIndex(x => x.incoming.replace(/[\^\$\.\*\+\?\(\)\[\]\{\}\\\/]/g, '') === filterToDelete);
        if (filterIndex !== -1) {
            find.filters.splice(filterIndex, 1);
            if (msg.key.fromMe) {
                return await sock.sendMessage(groupId, { text: `_✅ Filter deleted successfully._\n_Deleted Filter ::_ \`\`\`${filterToDelete}\`\`\``, edit: msg.key });
            }
            else {
                return await sock.sendMessage(groupId, { text: `_✅ Filter deleted successfully._\n_Deleted Filter ::_ \`\`\`${filterToDelete}\`\`\``});
            }
        } else {
            if (msg.key.fromMe) {
                return await sock.sendMessage(groupId, { text: "_❌ No filters found._", edit: msg.key });
            }
            else {
                return await sock.sendMessage(groupId, { text: "_❌ No filters found._"});
            }
        }
    }
    
    if (match[1].startsWith("add")) {
        let find = global.database.filters.find(x => x.chat === msg.key.remoteJid);
        if (!find) {
            find = { chat: msg.key.remoteJid, filters: [] };
            global.database.filters.push(find);
        }
        const [incoming, ...outgoingParts] = match[1].replace("add", "").trim().split(" ");
        const outgoing = outgoingParts.join(" ").trim();
        if (!incoming || !outgoing) {
            if (msg.key.fromMe) {
                return await sock.sendMessage(groupId, { text: "_❌ Invalid filter format!_\n_Use_ ```.filter add <incoming> <outgoing>```", edit: msg.key });
            }
            else {
                return await sock.sendMessage(groupId, { text: "_❌ Invalid filter format!_\n_Use_ ```.filter add <incoming> <outgoing>```"});
            }
        }
        const filterIndex = find.filters.findIndex(x => x.incoming === incoming);
        if (filterIndex !== -1) {
            find.filters[filterIndex].outgoing = outgoing;
            if (msg.key.fromMe) {
                return await sock.sendMessage(groupId, { text: "_✅ Filter updated successfully._", edit: msg.key });
            }
            else {
                return await sock.sendMessage(groupId, { text: "_✅ Filter updated successfully._"});
            }
        }
        find.filters.push({ incoming, outgoing });
        if (msg.key.fromMe) {
            return await sock.sendMessage(groupId, { text: "_✅ Filter added successfully._", edit: msg.key });
        }
        else {
            return await sock.sendMessage(groupId, { text: "_✅ Filter added successfully._"});
        }
    }
    
})
