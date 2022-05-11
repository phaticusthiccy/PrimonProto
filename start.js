const { Client } = require('whatsapp-web.js');

const Primon = new Client();

Primon.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
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
