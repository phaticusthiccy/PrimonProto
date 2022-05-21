import { Boom } from '@hapi/boom'
import P from 'pino'
import makeWASocket, { AnyMessageContent, delay, DisconnectReason, makeInMemoryStore, useSingleFileAuthState } from '@adiwajshing/baileys'

const store = makeInMemoryStore({ logger: P().child({ level: 'debug', stream: 'store' }) })
store.readFromFile('./baileys_store_multi.json')
// save every 10s
setInterval(() => {
	store.writeToFile('./baileys_store_multi.json')
}, 10_000)

const { state, saveState } = useSingleFileAuthState(atob(process.env.SESSION))

const Proto = makeWASocket({ })

async function Primon () {
  Proto.ev.on('messages.upsert', async (m) => {
      console.log(m)
  })
}
Primon()
