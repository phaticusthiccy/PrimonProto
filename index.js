const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, downloadMediaMessage } = require('@whiskeysockets/baileys');
const commands = require('./plugins/commands'); 
const fs = require('fs');
const path = require('path');
const plpth = path.join(__dirname, 'plugins', 'custom');
const pino = require('pino');
const notifier = require('node-notifier');
let config = require('./config');
let configdid = config.DİNTD;
const dailyVeri = require('./whatsasena/gist');
let prefix = config.HANDLERS;
let files = '';
global.pattern = prefix;
const logger = pino({
  level: 'debug', 
});
function reload() {
  delete require.cache[require.resolve('./config.js')];
  config = '';
  config = require('./config');
  console.log(config);
  configdid = '';
  configdid = config.DİNTD;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function sendNotification(username, msj) {
  console.log('username', username)
  return new Promise((resolve, reject) => {
    notifier.notify({
      title: `${username} Kullanıcından :`,
      message: `${msj}`,
      subtitle: 'WhatsAsena...',
      icon: path.join(__dirname, 'assets', 'ico.jpg'),
      sound: true,
      wait: false
    }, function (err, response) {
      if (err) {
        return reject(err);
      }
      resolve(response);
    });
  });
}
async function updateDİNTD(newValue) {
  fs.readFile('./config.js', 'utf8', (err, data) => {
      if (err) {
          console.error('Dosya okunurken hata:', err);
          return;
      }
      const updatedData = data.replace(/(DİNTD:\s*)\d+/, `$1${newValue}`);
      fs.writeFile('./config.js', updatedData, 'utf8', (err) => {
          if (err) {
              console.error('Dosya yazılırken hata:', err);
              return;
          }
          console.log(`DİNTD değeri ${newValue} olarak güncellendi.`);
      });
  });
}

async function loadPlugins() {
  global.intext = 'intext loader';
  await commands.handleCommand('sock', 'msg');
  fs.readdirSync(plpth).forEach(file => {
    if (file.endsWith('.js')) {
      files = require(`./plugins/custom/${file}`);
      files.handleCommand('sock', 'msg');
    }
  });
  let {command} = require('./list');
  console.log(command);
}
loadPlugins();
async function whatsAsena() {
  let { version } = await fetchLatestBaileysVersion();
  let { state, saveCreds } = await useMultiFileAuthState(__dirname + "/session/");

  const sock = makeWASocket({
    logger: logger,
    printQRInTerminal: true,
    markOnlineOnConnect: false,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    auth: state,
    version: version,
  });
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error.output.statusCode !== 401);
      if (shouldReconnect) {
        console.log('Bağlantı kesildi, yeniden bağlanılıyor...');
        whatsAsena();
      } else {
        console.log('QR kodu taranmadı.');
      }
    } else if (connection === 'open') {
      console.log('Bağlantı açıldı.');
      const usrId = sock.user.id;
      const mappedId = usrId.split(':')[0]+`@s.whatsapp.net`;
      async function getGists(botId) {
        var lst = await dailyVeri();
        var splst = lst.split(',');
        console.log(lst);
        if (splst[0] !== `${configdid}`) {
          console.log(splst[0], configdid);
          sock.sendMessage(botId, {text: splst[1]});
          await updateDİNTD(splst[0]);
          await sleep(200);
          reload();
        }
      }
      async function startGistFetcher() {
        await getGists(mappedId); 
        setTimeout(async () => {
            //console.log('getGist fonksiyonu çalıştırılıyor...');
            await startGistFetcher(); 
        }, 3600000); 
     }
      startGistFetcher();
      let stmsj = '';
      if (config.WORKTYPE === 'private') {
        stmsj = "*WhatsAsena Private Olarak Çalışıyor! 🐺*\n\n" + "_Lütfen burada plugin denemesi yapmayın. Burası sizin LOG numaranızdır._\n" + "_Herhangi bir sohbette komutları deneyebilirsiniz :)_\n\n" + "*Botunuz sadece size özel olarak çalışmaktadır. Değiştirmek için* _.setvar_WORKTYPE public_ *komutunu kullanın.*\n\n" + "*WhatsAsena Kullandığın İçin Teşekkürler 💌*"
      } else if (config.WORKTYPE === 'public') {
        stmsj = "*WhatsAsena Public Olarak Çalışıyor! 🐺*\n\n" +
        "_Lütfen burada plugin denemesi yapmayın. Burası sizin LOG numaranızdır._\n" +
        "_Herhangi bir sohbette komutları deneyebilirsiniz :)_\n\n" +
        "*Botunuz herkese açık olarak çalışmaktadır. Değiştirmek için* _.setvar_WORKTYPE private_ *komutunu kullanın.*\n\n" +
        "*WhatsAsena Kullandığın İçin Teşekkürler 💌*"
      } else {
        stmsj = "WORKTYPE *error* Lütfen WORKTYPE değişkenini public veya private olarak ayarlayın.";
      }

      sock.sendMessage(mappedId, {text: stmsj});
    }

  });
  let list = require('./list');
  let command = list.command;
  sock.ev.on("messages.upsert", async (msg) => {
    try {
      console.log(msg.messages[0]);
      msg = msg.messages[0];
      console.log('ismsg', msg.message);
      const Type = Object.keys(msg.message)[1];
      var usrs = sock.user.id;
      var usrsId = usrs.split(':')[0]+'@s.whatsapp.net';
      //console.log('typ', Type);
      if (Type === 'viewOnceMessageV2' && config.RSVOMSG) {
        const buffer = await downloadMediaMessage(
          { message: msg.message },
          'buffer',
          {},
          {
            logger: console,
            reuploadRequest: sock.updateMediaMessage
          }
        );
        var aspath = path.join(__dirname, 'assets', 'oncemsg.')
        const futureProofMessage = msg.message.viewOnceMessageV2.message;
        //console.log(futureProofMessage);
        let form = 'png';
        if (futureProofMessage.videoMessage) {console.log('indirilen media video');
          fs.writeFileSync(`${aspath}mp4`, buffer);
          sock.sendMessage(usrsId, {video: {url: `${aspath}mp4`}, caption: `*${msg.pushName}(${msg.remoteJid})* _Kişisinden gelen media_`});
        }
        else if (futureProofMessage.imageMessage){console.log('indirilen media resim');
          fs.writeFileSync(`${aspath}png`, buffer);
          sock.sendMessage(usrsId, {image: {url: `${aspath}png`}, caption: `*${msg.pushName}(${msg.key.remoteJid})* _Kişisinden gelen media_`});
        }
      }
      const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
      let wtxt = true;
      if (!text) {wtxt=false;return;}
      console.log(msg.fromMe);
      if (msg.key.remoteJid !== usrsId && !msg.key.fromMe && config.NOTİFY) {
        let ptp = '';
        if (`${msg.remoteJid}`.includes('@g.us')){
          ptp = msg.key.participant;
        }
        if (ptp !== usrsId) {
          var msgus = msg.pushName;
          sendNotification(msgus, text);
        }
      }
      if (wtxt) {
        global.intext = text;
        console.log(msg);
        let turn = false;
        for (var prf of prefix) {
          for (var cmd of command) {
            if (text.startsWith(`${prf}${cmd}`)) {turn = true;console.log('komut algılandı');break;}
          }
        }
        if (!turn)return;
        if (msg.key && msg.key.remoteJid == "status@broadcast") return;
        await commands.handleCommand(sock, msg);
        fs.readdirSync(plpth).forEach(file => {
          if (file.endsWith('.js')) {
            files = require(`./plugins/custom/${file}`);
            //console.log(file, 'yüklendi')
            files.handleCommand(sock, msg);
          }
        });
      }
    } catch (error) {
      var usrs = sock.user.id;
      var usrsId = usrs.split(':')[0]+'@s.whatsapp.net';
      sock.sendMessage(usrsId, {text: `WhatsAsena bir hata üretti:\n${error}`});
    }
  })
  
}

whatsAsena();
