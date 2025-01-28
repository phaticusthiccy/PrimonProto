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

  if (!matchedPrefix) return;

  for (const { commandInfo, callback } of commands) {
    const match = validText.match(new RegExp(commandInfo.pattern, "i"));
    if (match) {
      if (commandInfo.fromMe && !msg.key.fromMe) return;
      if (commandInfo.notAvaliablePersonelChat && msg.key.remoteJid == sock.user.id.split(':')[0] + `@s.whatsapp.net`) return;
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
