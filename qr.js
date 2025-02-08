const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  delay,
  Browsers
} = require('@whiskeysockets/baileys')
const fs = require('fs')
const qrcode = require('qrcode-terminal')
const pino = require('pino')

// var chat_count = 0
try {
  fs.rmSync('./session', { recursive: true, force: true })
} catch {}
try {
  fs.rmSync('./.started', { recursive: true, force: true })
} catch {}
// var countdown = Math.max(150, chat_count * 5)

const logger = pino({
  level: 'silent',
  customLevels: {
    trace: 10000,
    debug: 10000,
    info: 10000,
    warn: 10000,
    error: 10000,
    fatal: 10000
  }
})

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

console.clear()
rl.question(
  'Login with QR code (1) or Phone Number (2)\n\n⚠️  Logging with phone number is not recommend! :: ',
  async answer => {
    console.clear()
    if (answer == '2') {
      rl.question(
        'Enter your phone number. Example: 905123456789 ',
        async number => {
          await loginWithPhone(number)
        }
      )
    } else if (answer == '1') {
      genQR(true)
    }
  }
)

async function genQR(qr) {
  let { version } = await fetchLatestBaileysVersion()
  let { state, saveCreds } = await useMultiFileAuthState('./session/')
  let sock = makeWASocket({
    version,
    syncFullHistory: false,
    auth: state,
    logger,
    markOnlineOnConnect: false,
    browser: Browsers.ubuntu('Chrome')
    // getMessage: async (key) => {},
  })
  if (!qr && !sock.authState.creds.registered) {
    console.log('You must use QR code to login.')
    process.exit(1)
  }

  sock.ev.process(async events => {
    if (events['connection.update']) {
      const update = events['connection.update']
      const { connection, qr: qrCode } = update
      if (qrCode) {
        qrcode.generate(qrCode, { small: true })
      }
      if (connection === 'connecting') {
        console.log('Connecting to WhatsApp... Please wait.')
      } else if (connection === 'open') {
        console.clear()
        await saveCreds()
        await delay(3000)
        fs.writeFileSync('.started', '1')
        console.log('Run `pm2 start main.js` to start the bot.')
        process.exit(1)
      } else if (connection === 'close') {
        console.log('connection close')
        await genQR(qr)
      }
    }
    if (events['creds.update']) {
      await saveCreds()
    }
  })
  return sock
}

async function loginWithPhone(phoneNumber) {
  let { version } = await fetchLatestBaileysVersion()
  let { state, saveCreds } = await useMultiFileAuthState('./session/')
  let sock = makeWASocket({
    version,
    syncFullHistory: false,
    auth: state,
    logger,
    markOnlineOnConnect: false,
    browser: Browsers.ubuntu('Chrome')
  })

  sock.ev.process(async events => {
    if (events['connection.update']) {
      const update = events['connection.update']
      const { connection } = update
      
      if (connection === 'open') {
        console.log('Successfully logged in!')
        await saveCreds() 
        await delay(3000)
        console.clear()
        fs.writeFileSync('.started', '1')
        console.log('Run `pm2 start main.js` to start the bot.')
        process.exit(1)
      } else if (connection === 'close') {
        await loginWithPhone(phoneNumber)
      } else if (!connection && !sock.authState.creds.registered) {
       
        let pairingCode = await sock.requestPairingCode(phoneNumber)
        pairingCode = pairingCode.slice(0, 4) + '-' + pairingCode.slice(4)
        console.log(`Your WhatsApp pairing code: ${pairingCode}`)
        console.log(
          'Enter this code on your WhatsApp app under "Linked Devices".'
        )
      }
    }
    if (events['creds.update']) {
      await saveCreds()
    }
  })

  return sock
}
