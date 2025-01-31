var database = require("./database.json"); 
var PREFIX = database.handlers; 
const fs = require("fs"); 
 
fs.watch("./database.json", function () { 
    delete require.cache[require.resolve("./database.json")]; 
    database = require("./database.json"); 
    PREFIX = database.handlers; 
    global.handlers = PREFIX; 
    global.commands = commands; 
    global.database = database; 
}); 
 
var commands = [];  
 
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
    msg.message.conversation || msg.message.extendedTextMessage?.text; 
  let matchedPrefix = false; 
  let validText = text; 
 
  for (const prefix of PREFIX) { 
    if (text.startsWith(prefix)) { 
      matchedPrefix = true; 
      validText = text.slice(prefix.length).trim(); 
      break; 
    } 
  } 
 
  let isCommand = false; 
  for (const { commandInfo } of commands) { 
    if (validText.match(new RegExp(commandInfo.pattern, "im"))) { 
      isCommand = true; 
      break; 
    } 
  } 
 
  if (!isCommand) { 
    for (const { commandInfo, callback } of commands) { 
      if (commandInfo.pattern === "onMessage" && commandInfo.fromMe !== msg.key.fromMe) { 
        msg.text = text; 
        await callback(msg, null, sock, rawMessage); 
      } 
    } 
    return; 
  } 
 
  for (const { commandInfo, callback } of commands) { 
    const match = validText.match(new RegExp(commandInfo.pattern, "im")); 
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
      if (groupCheck && commandInfo.adminOnly && !await checkAdmin(msg, sock, msg.key.remoteJid, userId || groupCheck && commandInfo.adminOnly === "users" && !await checkAdmin(msg, sock, msg.key.remoteJid))) {
        if (msg.key.fromMe) {
          return sock.sendMessage(msg.key.remoteJid, { text: "_You are not an admin in this group!_", edit: msg.key })
        } else {
          return sock.sendMessage(msg.key.remoteJid, { text: "_You are not an admin in this group!_"}, { quoted: rawMessage.messages[0] })
        }
      }
      if (!commandInfo.access && commandInfo.fromMe !== msg.key.fromMe) return; 
      if (!permission && database.worktype === "private") return; 
      if (commandInfo.access === "sudo" && !permission) return; 
      if (commandInfo.notAvaliablePersonelChat && msg.key.remoteJid === sock.user.id.split(':')[0] + "@s.whatsapp.net") return; 
      if (commandInfo.onlyInGroups && !groupCheck) return; 
       
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
