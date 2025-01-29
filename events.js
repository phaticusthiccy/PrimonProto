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
    for (const command2 of commands) {
      if (command2.commandInfo.pattern == "onMessage") {
        matchedPrefix = true;
      } 
    }
  }
  if (!matchedPrefix) return;

  // ! Command Extras
  // .fromMe - If the command can only be executed by the bot owner.
  // .notAvaliablePersonelChat - If the command is not available in personal chat.
  // .dontAddCommandList - If the command should not be added to the command list.
  // .onlyInGroups - If the command is only available in groups.
  // .pattern - The pattern to match the command.
  // .desc - The description of the command.
  // .usage - The usage of the command.
  // .warn - A warning message of the command.

  // callback {match} - Arguments of the command.
  // callback {sock} - Socket object.
  // callback {rawMessage} - Raw message object.
  // callback {msg} - Message object.

  for (const { commandInfo, callback } of commands) {

    const match = validText.match(new RegExp(commandInfo.pattern, "im"));
    console.log(match)
    if (match) {
      const groupCheck = msg.key.remoteJid.endsWith('@g.us');
      let userId = groupCheck ? msg.key.participant : msg.key.remoteJid;
      let permission = false;
      if (msg.key.fromMe) permission = true;
      else {
        for (var i of database.sudo) {
          if (i == userId) {
            permission = true
            break;
      }}};
      // bot private ise permission da false ise sonlandıracak
      if (!permission && database.worktype == "private") return;
      // addcommand değişkenlerinden fromMe kısmını silip access verisi ekledim, ve o veri eğerki sudo ise permission true dönmedikce kullanılamaz.
      else if (commandInfo.access == "sudo" && !permission) return;

      if (commandInfo.notAvaliablePersonelChat && msg.key.remoteJid == sock.user.id.split(':')[0] + `@s.whatsapp.net`) return;
      if (commandInfo.onlyInGroups && !groupCheck) return;
      return await callback(msg, match, sock, rawMessage);
    }
    
    if (commandInfo.pattern == "onMessage") {
      if (commandInfo.notAvaliablePersonelChat && msg.key.remoteJid == sock.user.id.split(':')[0] + `@s.whatsapp.net`) return;
      if (commandInfo.onlyInGroups && !msg.key.remoteJid.endsWith('@g.us')) return;
      msg.text = text;
      await callback(msg, match, sock, rawMessage);
    }
  }
}

global.addCommand = addCommand;
global.start_command = start_command;
global.commands = commands;
global.handlers = PREFIX;
global.database = database;
