const { WAConnection, MessageOptions, MessageType, Mimetype, Presence, ReconnectMode } = require('@adiwajshing/baileys');
const { GreetingsDB, getMessage, deleteMessage, setMessage } = require("./db/greetings");
const { deleteFilter, setFilter, getFilter, FiltersDB } = require("./db/filter");
const { AFKDB, setAFK, getAFK, deleteAFK } = require("./db/afk");
const openapis = require("@phaticusthiccy/open-apis");
const { DataTypes } = require('sequelize');
const ffmpeg = require('fluent-ffmpeg');
const config = require('./config');
const axios = require("axios");
const util = require('util');
const fs = require("fs");

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

const DB = config.DATABASE.define('userbot', {
    info: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});
util.inspect.defaultOptions.depth = null
async function bot () {
    const Bot = new WAConnection();
    const Session = process.env.SESSION
    Bot.version = [3, 3234, 9]
    Bot.setMaxListeners(0)
    Bot.autoReconnect = ReconnectMode.onConnectionLost
    await config.DATABASE.sync();
    Bot.on('credentials-updated', () => {
        const authInfo = Bot.base64EncodedAuthInfo()
        fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t'))
    })
    Bot.on('open', async () => {
        console.log("✅ Login Information Updated!")
    })
    Bot.on('connecting', async () => {
        console.log("🔁 Waiting For Connection..")
    })
    Bot.on('open', async () => {
        console.log("✅ Connected to WhatsApp!")
        await Bot.sendMessage(Bot.user.jid, "Whatsapp User Bot Working ✅", MessageType.text)
        await new Promise(r => setTimeout(r, 1300))
        await Bot.sendMessage(Bot.user.jid, "Start With ```.menu```")
    })
   
    fs.existsSync('./auth_info.json') && Bot.loadAuthInfo ('./auth_info.json')
    await Bot.connect();
    Bot.on("chat-update", async (message) => {
        if (message.key && message.key.remoteJid == 'status@broadcast') return;
        if (message.messageStubType === 32 || message.messageStubType === 28) {
            var gb = await getMessage(message.key.remoteJid, 'goodbye');
            if (gb !== false) {
                await Bot.sendMessage(message.key.remoteJid, gb.message, MessageType.text)
            }
        } else if (message.messageStubType === 27 || message.messageStubType === 31) {
            var gb = await getMessage(message.key.remoteJid);
            if (gb !== false) {
                await Bot.sendMessage(message.key.remoteJid, gb.message, MessageType.text)
            }
        }
        if (process.env.BLOCKCHAT !== false) {     
            var abc = process.env.BLOCKCHAT.split(',');                            
            if(message.key.remoteJid.includes('-') ? abc.includes(message.key.remoteJid.split('@')[0]) : abc.includes(message.participant ? message.participant.split('@')[0] : message.key.remoteJid.split('@')[0])) return ;
        }
        var chat = Bot.chats.get(message.key.remoteJid)
        console.log(message)
    })
}
bot()