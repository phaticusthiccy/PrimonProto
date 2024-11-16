const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, delay } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const fs = require('fs');

console.log("WhatsApp Bot");
console.log("QR Code Login");
whatsAsena();

/**
 * Initializes a WhatsApp session and generates a session string for the user.
 *
 * @returns {Promise<void>} - A Promise that resolves when the session is established
 * and the session string is sent.
 */
async function whatsAsena() {
    let { version } = await fetchLatestBaileysVersion();
    let { state, saveCreds } = await useMultiFileAuthState('./session/');
    let sock = makeWASocket({
        printQRInTerminal: false, // QR kodunu terminale yazdırma
        markOnlineOnConnect: false,
        auth: state,
        version: version,
        getMessage: async (key) => {},
    });

    sock.ev.on('connection.update', async (update) => {
        let { connection, qr } = update;
        if (connection === "connecting") {
            console.log("Connecting to WhatsApp... Please wait.");
        } else if (connection === 'open') {
            await delay(3000);
            let credentials = JSON.stringify(sock.authState.creds, null, 2);
            let st = credentials;

            console.log("Asena String Code: ", st);

            await sock.sendMessage(sock.user.id, {
                text: st,
            });
            await sock.sendMessage(sock.user.id, {
                text: "*Don't share this code with anyone!*",
            });

            console.log("If you are installing locally, you can start the bot with node bot.js.");
            process.exit(1);
        } else if (connection === 'close') {
            await whatsAsena();
        }

        // QR kodunu PNG dosyasına kaydet
        if (qr) {
            try {
                const qrCodeDataUrl = await QRCode.toDataURL(qr);
                const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
                fs.writeFileSync('qrsite\\qr-code.png', base64Data, 'base64');
                console.log('QR kodu qr-code.png dosyasına kaydedildi.');
            } catch (err) {
                console.error('QR kodu kaydetme hatası:', err);
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);
}
