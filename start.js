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

const { state, saveState } = useSingleFileAuthState(proccess.env.SESSION)

async function imageToWebp (media) {

    const tmpFileOut = path.join(__dirname, `../tmp/${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileIn = path.join(__dirname, `../tmp/${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`)

    fs.writeFileSync(tmpFileIn, media)

    await new Promise((resolve, reject) => {
        ff(tmpFileIn)
            .on("error", reject)
            .on("end", () => resolve(true))
            .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale=512:512:force_original_aspect_ratio=increase,fps=15,crop=512:512`]).toFormat('webp').save(tmpFileOut)
            //.addOutputOptions([
            //    "-vcodec",
            //    "libwebp",
            //    "-vf",
            //    "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
            //])
            //.toFormat("webp")
            //.save(tmpFileOut)
    })

    const buff = fs.readFileSync(tmpFileOut)
    fs.unlinkSync(tmpFileOut)
    fs.unlinkSync(tmpFileIn)
    return buff
}

async function videoToWebp (media) {

    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`)

    fs.writeFileSync(tmpFileIn, media)

    await new Promise((resolve, reject) => {
        ff(tmpFileIn)
            .on("error", reject)
            .on("end", () => resolve(true))
            .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale=512:512:force_original_aspect_ratio=increase,fps=15,crop=512:512`]).toFormat('webp').save(tmpFileOut)
            //.addOutputOptions([
            //    "-vcodec",
            //    "libwebp",
            //    "-vf",
            //    "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
            //    "-loop",
            //    "0",
            //    "-ss",
            //    "00:00:00",
            //    "-t",
            //    "00:00:05",
            //    "-preset",
            //    "default",
            //    "-an",
            //    "-vsync",
            //    "0"
            //])
            //.toFormat("webp")
            //.save(tmpFileOut)
    })

    const buff = fs.readFileSync(tmpFileOut)
    fs.unlinkSync(tmpFileOut)
    fs.unlinkSync(tmpFileIn)
    return buff
}

async function writeExifImg (media, metadata) {
    let wMedia = await imageToWebp(media)
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    fs.writeFileSync(tmpFileIn, wMedia)

    if (metadata.packname || metadata.author) {
        const img = new webp.Image()
        const json = { "sticker-pack-id": `https://zenzapi.xyz`, "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] }
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuff])
        exif.writeUIntLE(jsonBuff.length, 14, 4)
        await img.load(tmpFileIn)
        fs.unlinkSync(tmpFileIn)
        img.exif = exif
        await img.save(tmpFileOut)
        return tmpFileOut
    }
}

async function writeExifVid (media, metadata) {
    let wMedia = await videoToWebp(media)
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    fs.writeFileSync(tmpFileIn, wMedia)

    if (metadata.packname || metadata.author) {
        const img = new webp.Image()
        const json = { "sticker-pack-id": `https://zenzapi.xyz`, "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] }
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuff])
        exif.writeUIntLE(jsonBuff.length, 14, 4)
        await img.load(tmpFileIn)
        fs.unlinkSync(tmpFileIn)
        img.exif = exif
        await img.save(tmpFileOut)
        return tmpFileOut
    }
}

async function writeExif (media, metadata) {
    let wMedia = /webp/.test(media.mimetype) ? media.data : /image/.test(media.mimetype) ? await imageToWebp(media.data) : /video/.test(media.mimetype) ? await videoToWebp(media.data) : ""
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    fs.writeFileSync(tmpFileIn, wMedia)

    if (metadata.packname || metadata.author) {
        const img = new webp.Image()
        const json = { "sticker-pack-id": `https://zenzapi.xyz`, "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] }
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuff])
        exif.writeUIntLE(jsonBuff.length, 14, 4)
        await img.load(tmpFileIn)
        fs.unlinkSync(tmpFileIn)
        img.exif = exif
        await img.save(tmpFileOut)
        return tmpFileOut
    }
}

class WAConnection {
    constructor(conn) {
        for (let v in conn) {
            this[v] = conn[v]
        }
    }
	
    /**
     * 
     * @param {*} text 
     * @returns 
     */
    async parseMention(text) {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }

    /**
     * 
     * @param {*} id 
     * @param {*} text 
     * @param {*} quoted 
     * @param {*} options 
     */
    async sendText(id, text, quoted = {}, options = {}) {
        this.sendMessage(id, { text, ...options }, { quoted, ...options })
    }

    /**
     * 
     * @param {*} message 
     * @param {*} fileName 
     * @returns 
     */
    async downloadMediaMessage(message, fileName) {
        message = message?.msg ? message?.msg : message
        let mimetype = (message.msg || message).mimetype || ''
        let mtype = message.type ? message.type.replace(/Message/gi, "") : mimetype.split("/")[0]
        const stream = await downloadContentFromMessage(message, mtype)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        if (fileName) {
            let ftype = await FileType.fromBuffer(buffer)
            let trueFileName = fileName ? (fileName + "." + ftype.ext || mimetype.split("/")[1]) : getRandom(ftype.ext || mimetype.split("/")[1])
            return fs.writeFileSync(trueFileName, buffer)
        } else {
            return buffer
        }
    }

    /**
     * 
     * @param {*} PATH 
     * @param {*} save 
     * @returns 
     */
    async getFile(PATH, save) {
        let filename
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await fetchBuffer(PATH) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename, data)
        return {
            filename,
	        size: await Buffer.byteLength(data),
            ...type,
            data
        }
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} PATH 
     * @param {*} fileName 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    async sendFile(jid, PATH, fileName, quoted = {}, options = {}) {
        let types = await this.getFile(PATH, true)
        let { filename, size, ext, mime, data } = types
        let type = '', mimetype = mime, pathFile = filename
        if (options.asDocument) type = 'document'
        if (options.asSticker || /webp/.test(mime)) {
            let media = { mimetype: mime, data }
            pathFile = await writeExif(media, { packname: "PrimonProto", author: "Eva", categories: [] })
            await fs.promises.unlink(filename)
            type = 'sticker'
            mimetype = 'image/webp'
        }
        else if (/image/.test(mime)) type = 'image'
        else if (/video/.test(mime)) type = 'video'
        else if (/audio/.test(mime)) type = 'audio'
        else type = 'document'
        await this.sendMessage(jid, { [type]: { url: pathFile }, mimetype, fileName, ...options }, { quoted, ...options })
        return fs.promises.unlink(pathFile)
    }
}


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
