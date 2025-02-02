var database = require("./database.json");  
var PREFIX = database.handlers;  
const fs = require("fs");  
var commands = [];   
const axios = require("axios");

fs.watch("./database.json", function () {
    try { delete require.cache[require.resolve("./database.json")]; } catch {}
    try { database = require("./database.json"); } catch {}
    try { PREFIX = database.handlers; } catch {}
    try { global.handlers = PREFIX; } catch {} 
    try { global.commands = commands; } catch {}  
    try { global.database = database; } catch {}
    commands = [];
    try { global.loadModules(__dirname + "/modules", false, true); } catch {}
});  
  
  
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
 * Handles the execution of a command received in a message.  
 *  
 * @param {Object} msg - The message object containing the command.  
 * @param {import('../index').Socket} sock  
 * @returns {Promise<void>} - A Promise that resolves when the command has been executed.  
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
  for (const { commandInfo } of commands) {  
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
  
  for (const { commandInfo, callback } of commands) {  
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
        
      if (commandInfo.pluginVersion && commandInfo.pluginId) {
        var getPluginUpdate = await axios.get("https://create.thena.workers.dev/pluginMarket?id=" + commandInfo.pluginId);
        if (getPluginUpdate.data.pluginVersion !== commandInfo.pluginVersion) {
          fs.writeFileSync("./modules/" + getPluginUpdate.data.pluginFileName, getPluginUpdate.data.context);
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