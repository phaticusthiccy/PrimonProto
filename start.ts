const { 
    default: makeWASocket, 
    DisconnectReason, 
    useSingleFileAuthState, 
    fetchLatestBaileysVersion, 
    delay, 
    jidNormalizedUser, 
    makeWALegacySocket, 
    useSingleFileLegacyAuthState,
    DEFAULT_CONNECTION_CONFIG,
    DEFAULT_LEGACY_CONNECTION_CONFIG 
} = require("@adiwajshing/baileys")
const fs = require("fs")
const util = require("util")
const pino = require("pino")
const path = require("path")
const { Boom } = require("@hapi/boom")

const { state, saveState } = useSingleFileAuthState("./db.json")

const connect = async () => {
    
    var connOptions = {
        printQRInTerminal: true,
        logger: pino({ level: "silent" }),
        auth: state,
        version: [2, 2210, 9]
    }
    
    const PrimonProto = new WAConnection(makeWASocket(connOptions))

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
