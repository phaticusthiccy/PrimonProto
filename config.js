// config.js
const path = require('path');

module.exports = {
    // Handlers for different types of commands
    HANDLERS: [':','.','!'], // Bu, komutların başında kullanılacak karakterdir. Örneğin, !asena şeklinde.
    // Bot'un çalışma modu. 'private' veya 'public' olarak ayarlanabilir.
    WORKTYPE: 'public',
    // Bot'un Sudo bilgileri. Sudo botun üzerinde yetkili kişidir.
    SUDOUSER: ['782', '682'],
    VERSION: '1.0.0',
    // Bot'un branch bilgisi
    BRANCH: 'main',
    // Telegram grubu ve kanal linkleri
    CHANNEL: 'https://t.me/WhatsAsena', // example
    TELEGRAM_GROUP: 'https://t.me/WhatsAsena', // example
    ALIVEMSG: '{image} {default}',
    // Çalışma ortamına göre dosya yolları veya başka konfigürasyonlar
    MEDIA_PATH: path.join(__dirname, 'media'), // Medya dosyalarının bulunduğu klasörün yolu
    LOG_FILE_PATH: path.join(__dirname, 'logs', 'bot.log'), // Log dosyasının yolu
    ONESTART: true
};
