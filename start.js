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

class StringSession {
    constructor() {
    }

    deCrypt(string = undefined) {
        if ('SESSION' in process.env && string === undefined) {
            string = process.env.SESSION;
        } else if (string !== undefined) {
            if (fs.existsSync(string)) {
                string = fs.readFileSync(string, {encoding:'utf8', flag:'r'});
            }
        }
        return JSON.parse(Buffer.from(string, 'base64').toString('utf-8'));
    }
    createStringSession(dict) {
        return Buffer.from(JSON.stringify(dict)).toString('base64');
    }
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
    Bot.version = [3, 3234, 9]
    Bot.setMaxListeners(0)
    Bot.autoReconnect = ReconnectMode.onConnectionLost
    await config.DATABASE.sync();
    var strs = await DB.findAll({
        where: {
          info: 'Session'
        }
    });
    var g = new StringSession()
    var s = g.deCrypt(config.SESSION)
    Bot.loadAuthInfo(S); 

    bot.on('open', async () => {
        console.log("✅ Connected to WhatsApp!")
        const authInfo = Bot.base64EncodedAuthInfo();
        await DB.create({ info: "Session", value: g.createStringSession(authInfo) });
    })
    Bot.on('connecting', async () => {
        console.log("Connecting to Whatsapp..")
    })
    Bot.on("chat-update", async (message) => {
        
        await Bot.sendMessage(Bot.user.jid, "Whatsapp User Bot Working ✅", MessageType.text)
        await new Promise(r => setTimeout(r, 1300))
        await Bot.sendMessage(Bot.user.jid, "Start With ```.menu```")
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
        var chat = Bot.chats.get(message.key.remoteJid)
        console.log(message)
    })
}
bot()