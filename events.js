const PREFIX = [".","!","*"]
const commands = []; 

function addCommand(commandInfo, callback) { // Komutları eklemek çin bir fonksiyon
    commands.push({ commandInfo, callback }); // commandInfo özelleştirilebilir
}

async function start_command(msg, sock) { // Komutları başlatmak için bir fonksiyon
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

    // Prefix kontrolü
    let matchedPrefix = false;
    let validText = text; 

    for (const prefix of PREFIX) {
        if (text.startsWith(prefix)) {
            matchedPrefix = true;
            validText = text.slice(prefix.length).trim();
            break;
        }
    }

    if (!matchedPrefix) return;

    for (const { commandInfo, callback } of commands) { // eşleştirme kontrolü
        const match = validText.match(new RegExp(commandInfo.pattern, 'i'));
        if (match) {
            await callback(msg, match, sock); // eğer eşleştiyse komutu çalıştır
            return; 
        }
    }
}
// globale tanımlamak daha kullanışlı olacaktır
global.addCommand = addCommand;
global.start_command = start_command;
