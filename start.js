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
const { state, saveState } = useSingleFileAuthState('./proto.json')

// fs.writeFileSync("db.json", JSON.parse(JSON.stringify(process.env.SESSION)));

async function connectPrimon()  {
    const PrimonProto = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: true,
            auth: state,
            browser: ['Primon Proto', 'Chrome', '1.0'],
    })
    PrimonProto.ev.on('messages.upsert', async m => {
            if (!m.messages) return
             console.log(m)
     })
    PrimonProto.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update
            if (connection === 'close') {
               
                lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? connectPrimon() : console.log('Connection Logged Out..')
            }
     })
    PrimonProto.ev.on('creds.update', () => saveState)
}

connectPrimon()
