import { Boom } from '@hapi/boom'
import P from 'pino'
import makeWASocket, { AnyMessageContent, delay, DisconnectReason, makeInMemoryStore, useSingleFileAuthState } from '@adiwajshing/baileys'
import * as fs from "fs"

const store = makeInMemoryStore({ logger: P().child({ level: 'debug', stream: 'store' }) })
store.readFromFile('./baileys_store_multi.json')

setInterval(() => {
	store.writeToFile('./baileys_store_multi.json')
}, 10_000)

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
