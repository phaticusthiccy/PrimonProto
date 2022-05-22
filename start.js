const { default: Baileys, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@adiwajshing/baileys")
const P = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
require('util').inspect.defaultOptions.depth = null
console.log(process.env.SESSION)
fs.writeFile("./session.json", Buffer.from(process.env.SESSION, "base64").toString(), (err) => {
  if (err) {
    console.log("Error While Generating Session Data!")
  }
})
    
const { state, saveState } = useSingleFileAuthState("./session.json")

const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) })

setInterval(() => {
	store.writeToFile('./baileys_store_multi.json')
}, 10000)

async function Priom() {
  const Proto = Baileys({})
  Proto.ev.on('messages.upsert', async (m) => {
      console.log(m)
  })
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
