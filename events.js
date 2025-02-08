var database = require("./database.json");  
var PREFIX = database.handlers;  
var fs = require("fs");  
var commands = [];   
const axios = require("axios");

/**
 * Watches the database.json file for changes and updates the global state accordingly.
 * This function is responsible for monitoring the database.json file for any changes,
 * and then updating the global state variables like `handlers`, `commands`, and `database`
 * to reflect the changes. It also attempts to reload the modules in the `./modules` directory.
 */
function watchDatabase() {
  try {
    fs.watch("./database.json", function (event, filename) {
      try { delete require.cache[require.resolve("./database.json")]; } catch {}
      try { database = require("./database.json"); } catch {}
      try { PREFIX = database.handlers; } catch {}
      try { global.handlers = PREFIX; } catch {} 
      try { global.commands = commands; } catch {}  
      try { global.database = database; } catch {}
      commands = [];
      try { global.loadModules(__dirname + "/modules", false, true); } catch {}
    });  
  } catch {
    return watchDatabase()
  }
}
watchDatabase()
  
/**  
 * Adds a new command to the list of commands.  
 *  
 * @param {Object} commandInfo - The information about the command to add.  
 * @param {Function} callback - The callback function to execute when the command is invoked.  
*/  
function addCommand(commandInfo, callback) {  
  commands.push({ commandInfo, callback });  
}  
  
 
/**
 * Processes a message to determine if it matches any registered command patterns,
 * and executes the corresponding callback if a match is found. The function first
 * checks whether the message starts with a valid prefix and then verifies if it 
 * matches any command patterns. It handles permission checks for commands based 
 * on the user's access level and the bot's operational mode (e.g., private, group).
 * If the command is associated with a plugin, it ensures the plugin is installed
 * and up-to-date before executing the callback.
 *
 * @param {object} msg - The message object received from the WhatsApp socket.
 * @param {object} sock - The WhatsApp socket connection.
 * @param {object} rawMessage - The raw message object.
 * @returns {Promise<void>} - A promise that resolves when the command has been processed.
 */

async function start_command(msg, sock, rawMessage) {  
  const text =  
    msg?.message?.conversation || msg?.message?.extendedTextMessage?.text;  
  
  let matchedPrefix = false;  
  let validText = text;  
  
  for (const prefix of PREFIX) {  
    if (text?.trimStart().startsWith(prefix)) {  
      matchedPrefix = true;  
      validText = text.slice(prefix.length).trim();  
      break;  
    }  
  }  
  
  let isCommand = false;
  var sortedCommands = commands.sort((a, b) => b.commandInfo.pattern.length - a.commandInfo.pattern.length);
  for (const { commandInfo } of sortedCommands) {  
    if (validText?.match(new RegExp(commandInfo.pattern, "im"))) {  
      isCommand = true;  
      break;  
    }  
  }  
  
  if (!isCommand) {  
    for (const { commandInfo, callback } of commands) {  
      if (commandInfo.pattern === "onMessage" && commandInfo.fromMe !== msg.key.fromMe) {  
        msg.text = text ? text : "";  
        await callback(msg, null, sock, rawMessage);  
      }  
    }  
    return;  
  }  
  
  for (const { commandInfo, callback } of sortedCommands) {  
    const match = validText?.match(new RegExp(commandInfo.pattern, "im"));  
    if (match && matchedPrefix) {  
      const groupCheck = msg.key.remoteJid.endsWith('@g.us');  
      let userId = groupCheck ? msg.key.participant : msg.key.remoteJid;  
      let permission = false;  
      if (msg.key.fromMe) permission = true;  
      else {  
        for (var i of database.sudo) {  
          if (i+"@s.whatsapp.net" == userId) {  
            permission = true  
            break;  
          } 
        } 
      }
      
      if (!commandInfo.access && commandInfo.fromMe !== msg.key.fromMe) return;  
      if (!permission && database.worktype === "private") return;  
      if (commandInfo.access === "sudo" && !permission) return;  
      if (commandInfo.notAvaliablePersonelChat && msg.key.remoteJid === sock.user.id.split(':')[0] + "@s.whatsapp.net") return;  
      if (commandInfo.onlyInGroups && !groupCheck) return;  
        
      if (commandInfo.pluginId && (global.database.plugins.findIndex(plugin => plugin.id === commandInfo.pluginId) === -1)) {
        global.loadModules(__dirname + "/modules", false, true);
        var getExitingPluginData = await axios.get("https://create.thena.workers.dev/pluginMarket?id=" + commandInfo.pluginId);
        getExitingPluginData = getExitingPluginData.data;
        global.database.plugins.push({
          name: getExitingPluginData.pluginName,
          version: commandInfo.pluginVersion,
          description: getExitingPluginData.description,
          author: getExitingPluginData.author,
          id: getExitingPluginData.pluginId,
          path: "./modules/" + getExitingPluginData.pluginFileName
        });
      }

      if (commandInfo.pluginVersion && commandInfo.pluginId) {
        var getPluginUpdate = await axios.get("https://create.thena.workers.dev/pluginMarket");
        getPluginUpdate = getPluginUpdate.data;
        getPluginUpdate = getPluginUpdate.find(plugin => plugin.pluginId === commandInfo.pluginId);
        if (!getPluginUpdate) {
          return; // Don't run if plugin not found.
        }
        getPluginUpdate = { data: getPluginUpdate };
        if (getPluginUpdate.data.pluginVersion !== commandInfo.pluginVersion) {
          const editedPl = {
            name: getPluginUpdate.data.pluginName,
            version: getPluginUpdate.data.pluginVersion,
            description: getPluginUpdate.data.description,
            author: getPluginUpdate.data.author,
            id: getPluginUpdate.data.pluginId,
            path: "./modules/" + getPluginUpdate.data.pluginFileName
          }
          global.database.plugins[global.database.plugins.findIndex(plugin => plugin.id === commandInfo.pluginId)] = editedPl;
          fs.writeFileSync("./modules/" + getPluginUpdate.data.pluginFileName, getPluginUpdate.data.context);
          global.loadModules(__dirname + "/modules", false, true);
          if (msg.key.fromMe) {
            await sock.sendMessage(msg.key.remoteJid, { text: "_🆕 " + getPluginUpdate.data.pluginName + " Plugin Updated To " + getPluginUpdate.data.pluginVersion + "._\n\n_Please try again._", edit: msg.key });
          } else {
            await sock.sendMessage(msg.key.remoteJid, { text: "_🆕 " + getPluginUpdate.data.pluginName + " Plugin Updated To " + getPluginUpdate.data.pluginVersion + "._\n\n_Please try again._" }, { quoted: rawMessage.messages[0]});
          }
          return;
        }
      }
      await callback(msg, match, sock, rawMessage);  
      return;  
    }  
  }  
}  
  
global.addCommand = addCommand;  
global.start_command = start_command;  
global.commands = commands;  
global.handlers = PREFIX;  
global.database = database;