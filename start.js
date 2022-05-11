const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const Primon = new Client();

Primon.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

Primon.on('ready', () => {
    console.log('Client is ready!');
});

Primon.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

Primon.initialize();
