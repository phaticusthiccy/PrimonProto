const { 
    default: makeWASocket, 
    DisconnectReason, 
    useSingleFileAuthState, 
    fetchLatestBaileysVersion, 
    delay,
    BufferJSON,
    makeInMemoryStore,
    jidNormalizedUser, 
    makeWALegacySocket, 
    useSingleFileLegacyAuthState,
    DEFAULT_CONNECTION_CONFIG,
    DEFAULT_LEGACY_CONNECTION_CONFIG,
    extensionForMediaMessage,
    extractMessageContent, 
    getContentType, 
    normalizeMessageContent,
    proto, 
    downloadContentFromMessage
} = require("@adiwajshing/baileys")
const fs = require("fs")
const util = require("util")
const pino = require("pino")
const path = require("path")
const { Boom } = require("@hapi/boom")
const FileType = require("file-type")
const moment = require("moment-timezone")
const { tmpdir } = require("os")
const Crypto = require("crypto")
const ff = require('fluent-ffmpeg')
const webp = require("node-webpmux")

// fs.writeFileSync("db.json", JSON.parse(JSON.stringify(process.env.SESSION)));


const PrimonProto = makeWASocket({ printQRInTerminal: true }) 

const connect = async () => {
   
     PrimonProto.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            connect()
        } else {
            await PrimonProto.sendMessage(PrimonProto.user.id, { text: "Merhaba" })
        }
    })
    
    PrimonProto.ev.on("messages.upsert", async (msg) => {
        console.log(msg)
     })
}

connect()
