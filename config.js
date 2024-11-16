// config.js
const path = require('path');

module.exports = {
    // Handlers for different types of commands
    HANDLERS: [':','.','!'], // Bu, komutların başında kullanılacak karakterdir. Örneğin, !komut şeklinde.
    // Bot'un çalışma modu. 'private' veya 'public' olarak ayarlanabilir.
    WORKTYPE: 'public',
    // Bot'un Sudo bilgileri. Sudo botun üzerinde yetkili kişir
    SUDOUSER: ['sudo number'],
    VERSION: '1.0.0',
    // Bot'un branch bilgisi
    BRANCH: 'main',
    // Telegram grubu ve kanal linkleri
    CHANNEL: 'https://t.me/asena', // Plugin kanalın URL'si
    TELEGRAM_GROUP: 'https://t.me/asena', // Telegram grubun URL'si
    // Bot'un sağladığı mesajlar ve dosya yolları
    ALIVEMSG: '{pp} {default}',
    KICKME: 'Hoşçakal',
    DİNTD: 6, // burayı ellemeyiniz.
    RSVOMSG: true,
    NOTİFY: true, // windows kullanıcısı iseniz mesaj geldiğinde bilgisayarınıza bildirim düşer.
    MEDIA_PATH: path.join(__dirname, 'media'), // Medya dosyalarının bulunduğu klasörün yolu
    LOG_FILE_PATH: path.join(__dirname, 'logs', 'bot.log'), // Log dosyasının yolu
    ONESTART: false
};
