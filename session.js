const { MessageType, WAConnection } = require("@adiwajshing/baileys");
var fs = require("fs")
const log = console.log
async function getQRSession() {
  // Create New Class Work
  const event = new WAConnection();
  event.browserDescription = [Buffer.from("TGlnaHR3ZWlnaHRXQS1Cb3Q=", 'base64').toString('ascii'), "Chrome", '1.0'];
  event.version = [3, 3234, 9]
  event.logger.level = 'warn'
  event.regenerateQRIntervalMs = 50000;
  event.on('connecting', async (qr) => {
    log(
      "Scan the QR Code to Get Session..\n"
    )
  })
  event.on('open', async () => {
    var Session = Buffer.from(JSON.stringify(event.base64EncodedAuthInfo())).toString('base64');
    log(
      "Your String Session is: " + Session
    )
    await event.sendMessage(event.user.jid,"Your String Session is: ", MessageType.text)
    await new Promise(r => setTimeout(r,500));
    await event.sendMessage(event.user.jid, Session, MessageType.text)
    log("\nOr Check Your WhatsApp!")
    if (!fs.existsSync('config.env')) {
      fs.writeFileSync('config.env', `SESSION="${Session}"`);
    }
    process.exit(0);
  })
  await event.connect();
}
getQRSession()