const { 
    default: makeWASocket, 
    DisconnectReason, 
    useSingleFileAuthState, 
    fetchLatestBaileysVersion, 
    delay, 
    BufferJSON,
    makeSocket,
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

const { state, saveState } = useSingleFileAuthState(JSON.parse(process.env.SESSION))


const connect = async () => {
    
    var connOptions = {
        printQRInTerminal: false,
        logger: pino({ level: "silent" }),
        auth: state,
        version: [2, 2210, 9]
    }
    
    const PrimonProto = makeSocket({auth: state})

    PrimonProto.ev.on("creds.update", saveState)
    
    PrimonProto.ev.on("connection.update", async (update) => {
        
        const { lastDisconnect, connection } = update
        if (connection) {
            console.info(`Connection Status : ${connection}`)
        }

        if (connection == "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); PrimonProto.logout(); }
            else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); connect(); }
            else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); connect(); }
            else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); PrimonProto.logout(); }
            else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Scan Again And Run.`); process.exit(); }
            else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); connect(); }
            else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); connect(); }
            else killua.end(`Unknown DisconnectReason: ${reason}|${connection}`)
        }
   })
    
    PrimonProto.ev.on("messages.upsert", async (chatUpdate) => {
        var msg = chatUpdate.messages[0]
        if (!msg.message) return
        if (msg.key && m.key.remoteJid == "status@broadcast") return
        if (msg.key.id.startsWith("BAE5") && m.key.id.length == 16) return
        console.log(msg)
     })
}

connect()
