const baileys = require('@whiskeysockets/baileys');
const path = require('path');
const configPath = path.join(__dirname, '..', 'config.js');
const axios = require('axios');
const crypto = require('crypto');
const ffmpeg = require('fluent-ffmpeg');
const fsp = require('fs').promises;
const fs = require('fs');
const { writeFile } = require('fs/promises');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { profile } = require('console');
const { weather, textpro } = require('ic3zyapi');
const simpleGit = require('simple-git');
const { exec } = require('child_process');
const git = simpleGit();
const { tableWrite, getUserByJid, updateKayitByJid , updateOnayByJid, updateCoinByJid, checkUserExists } = require('./sqlite/sql');
const { send, exit } = require('process');
// const downloads = require('../whatsasena/music');
const {addCommand} = require('../list');
const {addDesc} = require('../list');
const yts = require('yt-search');
const ic3zymp3 = require('ic3zy-mp3').Downloader;
const instaDownload = require('../whatsasena/insta').instaDownload;
const tiktokDownload = require('../whatsasena/tiktok');
const instaİmageDownload = require('../whatsasena/insta').instaİmageDownload;
const getGist = require('../whatsasena/gist');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI('GEMINI-API-KEY');
const webpToMp4 = require('../whatsasena/webp');
const lyricsFinder = require('lyrics-finder')
let config = require(configPath);
let sudo = config.SUDOUSER;
let onestart = true;
let convertSudo = [];
let wk = config.WORKTYPE === 'public' ? true : false;
let prefix = config.HANDLERS;
let alv = config.ALIVEMSG;
let desc = '';
let users = '';
let wait = false;
let waituser = '';
let kart = '';
let kart2 = '';
let ukart = '';
let ukart2 = '';
let klist = [];
let krplist = [];
let etop = '';
let ktop = '';
let kusers = '';
var textlist = [
    {name: '.textdevil', desc: 'Şeytan Temalı Logo Yapar.'},
    {name: '.text2devil', desc: '2. Bir Şeytan Temalı Logo Yapar.'},
    {name: '.textbear', desc: 'Ayı İkonu İçeren Logo Yapar'},
    {name: '.textwolf', desc: 'Kurt İkonu İçeren Logo Yapar.'},
    {name: '.textneon', desc: 'Neon Efekti İçeren Logo Yapar.'},
    {name: '.text2neon', desc: '2. Bir Neon Efekti İçeren Logo Yapar.'},
    {name: '.text3neon', desc: '3. Bir Neon Temalı Logo Yapar.'},
    {name: '.text4neon', desc: '4. Bir Neon Temalı Logo Yapar.'},
    {name: '.text5neon', desc: '5. Bir Neon Temalı Logo Yapar.'},
    {name: '.textlight', desc: 'Yıldırım Temalı Logo Yapar.'},
    {name: '.textjoker', desc: 'Joker Temalı Logo Yapar.'}, 
    {name: '.textninja', desc: 'Ninja Temalı Logo Yapar.'},
    {name: '.textglitter', desc: 'Parıltı Temalı Logo Yapar.'},
    {name: '.textbokeh', desc: 'Bokeh Efekti İçeren Logo Yapar.'},
    {name: '.textmarvel', desc: 'Siyah Beyaz Marvel Logosu Yapar.'},
    {name: '.text2marvel', desc: 'Renkli Marvel Logosu Yapar.'},
    {name: '.textgraf', desc: 'Graffiti Temalı Logo Yapar.'},
    {name: '.text2graf', desc: '2. Bir Graffiti Temalı Logo Yapar.'},
    {name: '.text3graf', desc: '3. Bir Graffiti Temalı Logo Yapar.'},
    {name: '.textlion', desc: 'Aslan Temalı Logo Yapar.'},
    {name: '.textice', desc: 'Buz Temalı Logo Yapar.'},
    {name: '.textspace', desc: 'Uzay Temalı Logo Yapar.'},
    {name: '.textfire', desc: 'Alev Temalı Logo Yapar.'},
    {name: '.textharry', desc: 'Harry Potter Temalı Logo Yapar.'},
    {name: '.text2harry', desc: '2. Bir Harry Potter Temalı Logo Yapar.'},
    {name: '.textstone', desc: 'Taş ve Çekiç Temalı Logo Yapar.'},
    {name: '.textgradient', desc: 'Renk Gradyan Temalı Logo Yapar.'},
    {name: '.textmagma', desc: 'Magme Temalı Logo Yapar.'},
    {name: '.textbglass', desc: 'Kırık Cam Temalı Logo Yapar.'},
    {name: '.textpaper', desc: 'Kağıt Temalı Logo Yapar.'},
    {name: '.textmetal', desc: 'Metal Temalı Logo Yapar.'},
    {name: '.textwcolor', desc: 'Suluboya Temalı Logo Yapar.'},
    {name: '.textart', desc: 'Çizim Efekti ile Renkli Logo Yapar.'},
    {name: '.text3d', desc: '3 Boyutlu Baskı Temalı Logo Yapar.'},
    {name: '.text2light', desc: '2. Bir Yıldırım Temalı Logo Yapar.'},
    {name: '.textrobo', desc: 'Transformers Temalı Logo Yapar.'},
    {name: '.textblood', desc: 'Kan Temalı Logo Yapar.'},
    {name: '.text2blood', desc: '2. BirKan Temalı Logo Yapar.'},
    {name: '.textpink', desc: 'Siyah ve Pembe Temalı Logo Yapar.'},
    {name: '.textsand', desc: 'Kum Temalı Logo Yapar.'},
    {name: '.text2sand', desc: '2. Bir Kum Temalı Logo Yapar.'},
    {name: '.text3sand', desc: '3. Bir Kum Temalı Logo Yapar.'},
    {name: '.text4sand', desc: '4. Bir Kum Temalı Logo Yapar.'},
    {name: '.textberry', desc: 'Dut Temalı Logo Yapar.'},
    {name: '.texthub', desc: 'PHub Temalı Logo Yapar.'},
    {name: '.textretro', desc: 'Retro Temalı Logo Yapar.'},
    {name: '.textsci', desc: 'Bilim Kurgu Temalı Logo Yapar.'},
    {name: '.textglitch', desc: 'Glitch Efekti İçeren Logo Yapar.'},
    {name: '.text2glitch', desc: '2. Bir Glitch Efekti İçeren Logo Yapar.'}
]
for (const a of sudo) {
	var convert = `${a}@s.whatsapp.net`;
	convertSudo.push(convert);
}

async function reloadConfig() {
    try {
        delete require.cache[require.resolve(configPath)];
        config = require(configPath);
		alv = '';
		alv = config.ALIVEMSG;
		prefix = [];
		prefix = config.HANDLERS;
		wk = config.WORKTYPE === 'public' ? true : false;
		sudo = config.SUDOUSER;
		convertSudo = [];
		for (const a of sudo) {
			var convert = `${a}@s.whatsapp.net`;
			convertSudo.push(convert);
		}
        console.log("Config dosyası başarıyla yeniden yüklendi.");
        console.log(config); 
    } catch (error) {
        console.error("Config dosyası yeniden yüklenirken hata oluştu:", error);
    }
}
async function downloadMedia(message) {
    const media = message.imageMessage || message.videoMessage || message.audioMessage;

    if (!media) {
        throw new Error('Medya içeriği bulunamadı.');
    }

    const buffer = await baileys.downloadContentFromMessage(message, media.mimetype);
    const filePath = path.join(__dirname, `downloaded_media.${media.mimetype.split('/')[1]}`);
    
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(filePath);
            }
        });
    });
}
async function gitins() {
    return new Promise((resolve, reject) => {
        const process = exec('git pull');

        process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            if (data.includes('Already')) {msj = `Bot zaten güncel`}
            else {mesj = `Bot güncellendi data: \n${data}`}
        });
        process.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        process.on('close', (code) => {
            if (code === 0) {
                console.log(`Process exited successfully with code ${code}`);
                resolve(code);
            }
            mesj = `error : \n ${code}`;
        });
    });
}
async function downloadProfilePicture(sock, jid, outputFilePath) {
    try {
        const profilePictureUrl = await sock.profilePictureUrl(jid, 'image');
        const response = await axios.get(profilePictureUrl, { responseType: 'arraybuffer' });
        if (response.status !== 200) throw new Error('Failed to fetch profile picture');
        const buffer = Buffer.from(response.data);
        fs.writeFileSync(outputFilePath, buffer);
        console.log(`Profil fotoğrafı ${outputFilePath} olarak kaydedildi.`);
    } catch (error) {
        console.error(`Profil fotoğrafı alınırken bir hata oluştu: ${error.message}`);
    }
}
async function ffmcvt(ver, imagepath) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (ver === 'colorful') {
                console.log('ffmpeg start...');
                ffmpeg(imagepath)
                    .outputOptions(["-y", "-vf", "eq=contrast=1.3:saturation=1.5:brightness=-0.2"])
                    .save('assets\\output.jpg')
                    .on('end', () => {
                        resolve('İşlem tamamlandı!');
                    })
                    .on('error', () => {
                        reject('errror');
                    });
            } else if (ver === 'artimage') {
                console.log('ffmpeg start...');
                ffmpeg(imagepath)
                    .outputOptions(["-y", "-vf", "convolution=-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2:-2 -1 0 -1 1 1 0 1 2"])
                    .save('assets\\output.jpg')
                    .on('end', () => {
                        resolve('İşlem tamamlandı!');
                    })
                    .on('error', () => {
                        reject('errror');
                    });
            } else if (ver === 'negative') {
                console.log('ffmpeg start...');
                ffmpeg(imagepath)
                    .outputOptions(["-y", "-vf", "curves=color_negative"])
                    .save('assets\\output.jpg')
                    .on('end', () => {
                        resolve('İşlem tamamlandı!');
                    })
                    .on('error', () => {
                        reject('errror');
                    });
            } else if (ver === 'rainbow') {
                console.log('ffmpeg start...');
                ffmpeg(imagepath)
                    .outputOptions(["-y", "-vf", "geq=r='X/W*r(X,Y)':g='(1-X/W)*g(X,Y)':b='(H-Y)/H*b(X,Y)"])
                    .videoFilters('eq=brightness=0.5')
                    .save('assets\\output.jpg')
                    .on('end', () => {
                        resolve('İşlem tamamlandı!');
                    })
                    .on('error', () => {
                        reject('errror');
                    });
            } else if (ver === 'gren') {
                console.log('ffmpeg start...');
                ffmpeg(imagepath)
                    .outputOptions(["-y", "-vf", "geq=r='X/W*r(X,Y)':g='(1-X/W)*g(X,Y)':b='(H-Y)/H*b(X,Y)"])
                    .videoFilters('eq=brightness=0.5')
                    .save('assets\\output.jpg')
                    .on('end', () => {
                        resolve('İşlem tamamlandı!');
                    })
                    .on('error', () => {
                        reject('errror');
                    });
            } else if (ver === 'enhance') {
                console.log('ffmpeg start...');
                ffmpeg(imagepath)
                    .outputOptions(["-y", "-vf", "unsharp=3:3:1.5"])
                    .videoFilters('eq=brightness=0.5')
                    .save('assets\\output.jpg')
                    .on('end', () => {
                        resolve('İşlem tamamlandı!');
                    })
                    .on('error', () => {
                        reject('errror');
                    });
            } else if (ver === 'edge') {
                console.log('ffmpeg start...');
                ffmpeg(imagepath)
                    .outputOptions(["-y", "-filter:v", "edgedetect=low=0.9:high=0.2"])
                    .videoFilters('eq=brightness=0.5')
                    .save('assets\\output.jpg')
                    .on('end', () => {
                        resolve('İşlem tamamlandı!');
                    })
                    .on('error', () => {
                        reject('errror');
                    });
            } else if (ver === 'blur') {
                console.log('ffmpeg start...');
                ffmpeg(imagepath)
                    .outputOptions(["-y", "-vf", "split[original][copy];[copy]scale=ih*16/9:-1,crop=h=iw*9/16,gblur=sigma=20[blurred];[blurred][original]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2"])
                    .videoFilters('eq=brightness=0.5')
                    .save('assets\\output.jpg')
                    .on('end', () => {
                        resolve('İşlem tamamlandı!');
                    })
                    .on('error', () => {
                        reject('errror');
                    });
            } else if (ver === 'vintage') {
                console.log('ffmpeg start...');
                ffmpeg(imagepath)
                    .outputOptions(["-y", "-vf", "curves=vintage"])
                    .videoFilters('eq=brightness=0.5')
                    .save('assets\\output.jpg')
                    .on('end', () => {
                        resolve('İşlem tamamlandı!');
                    })
                    .on('error', () => {
                        reject('errror');
                    });
            } else if (ver === 'bw') {
                console.log('ffmpeg start...');
                ffmpeg(imagepath)
                    .outputOptions(["-y", "-vf", "hue=s=0"])
                    .videoFilters('eq=brightness=0.5')
                    .save('assets\\output.jpg')
                    .on('end', () => {
                        resolve('İşlem tamamlandı!');
                    })
                    .on('error', () => {
                        reject('errror');
                    });
            } else {
                console.log('arg null');
                resolve('yanlış argüman.');
            }
        }, 5000);
    });
}

async function checkIfBotIsAdmin(sock, groupJid) {
	try {
	  const groupMetadata = await sock.groupMetadata(groupJid);
	  const admins = groupMetadata.participants.filter(participant => participant.admin === 'admin' || participant.admin === 'superadmin');
	  const bottid = sock.user.id;
	  const botjid = bottid.split(':')
	  const botJid = `${botjid[0]}@s.whatsapp.net`;
	  const isBotAdmin = admins.some(admin => admin.id === botJid);
	  
	  if (isBotAdmin) {
		console.log("Bot bu grupta bir admin.");
	  } else {
		console.log("Bot bu grupta admin değil.");
	  }
  
	  return isBotAdmin;
	} catch (error) {
	  console.error("Botun admin olup olmadığını kontrol ederken hata oluştu:", error);
	}
  }
async function replaceUserPosition(sock, groupJid, userJid, argm) {
	try {
	   /*
	  	* If argm = add, it adds a person to the group.
		* If argm = remove, it removes a person from the group.
		* If argm = promote, it makes a person an admin in the group.
		* If argm = demote, it removes a person from their admin role in the group.
		*/
		const result = await sock.groupParticipantsUpdate(
			groupJid,
			[userJid],
			`${argm}`
		);
		if (result) {
			console.log(`${userJid} gruba eklendi.`);
		} else {
			console.log(`${userJid} gruba eklenemedi.`);
		}
	} catch (error) {
		console.error('Gruba üye işlemi yapılırken hata oluştu:', error);
	}
}
// async function removeMemberFromGroup(sock, groupJid, userJids) {
// 	try {
// 	  if (userJids.length > 2) {
// 		console.log('Birden fazla kullanıcı çıkarmaya çalıştınız. İşlem yapılmadı.');
// 	  }
// 	  const result = await sock.groupParticipantsUpdate(
// 		groupJid,
// 		[userJids],
// 		'remove'
// 	  );
	  
// 	  if (result) {
// 		console.log(`${userJids[0]} gruptan çıkarıldı.`);
// 	  } else {
// 		console.log(`${userJids[0]} gruptan çıkarılamadı.`);
// 	  }
// 	} catch (error) {
// 	  console.error('Gruptan üye çıkarılırken hata oluştu:', error);
// 	}
//   }
// async function promoteMemberFromGroup(sock, groupJid, userJids) {
// 	try {
// 	  // Eğer çıkarılacak kullanıcı sayısı birden fazla ise hiçbir işlem yapılmasın
// 	  if (userJids.length > 2) {
// 		console.log('Birden fazla kullanıcı çıkarmaya çalıştınız. İşlem yapılmadı.');
// 	  }
// 	  const result = await sock.groupParticipantsUpdate(
// 		groupJid,       
// 		[userJids],       
// 		'promote'        
// 	  );
	  
// 	  if (result) {
// 		console.log(`${userJids[0]} gruptan çıkarıldı.`);
// 	  } else {
// 		console.log(`${userJids[0]} gruptan çıkarılamadı.`);
// 	  }
// 	} catch (error) {
// 	  console.error('Gruptan üye çıkarılırken hata oluştu:', error);
// 	}
//   }
async function checkUserInGroup(sock, groupJid, userJid) {
    try {
        let groupMetadata = await sock.groupMetadata(groupJid);
        let participants = groupMetadata.participants.map(function(participant) {
            return participant.id;
        });
        let isInGroup = participants.includes(userJid);

        if (isInGroup) {
            console.log(userJid + ' is in the group ' + groupJid);
        } else {
            console.log(userJid + ' is not in the group ' + groupJid);
        }

        return isInGroup;
    } catch (error) {
        console.error('An error occurred:', error);
        return false;
    }
}
async function getRandomBoolean() {
    let ona = false;
	const sy = Math.floor(Math.random() * 15);
	if (sy > 9){ona=true;}
	return ona;

}
async function checkIsAdmin(sock, groupJid, userJid) {
	try {
	  const groupMetadata = await sock.groupMetadata(groupJid);
	  
	  const admins = groupMetadata.participants.filter(participant => participant.admin === 'admin' || participant.admin === 'superadmin');
	  const isUserAdmin = admins.some(admin => admin.id === userJid);
	  
	  if (isUserAdmin) {
		console.log("Verilen Jid bu grupta bir admin.");
	  } else {
		console.log("Verilen Jid bu grupta admin değil.");
	  }
  
	  return isUserAdmin;
	} catch (error) {
	  console.error("Verilen Jidin admin olup olmadığını kontrol ederken hata oluştu:", error);
	}
  }
async function saveConfig(updatedConfig) {
    try {
        await fsp.writeFile(configPath, updatedConfig, 'utf-8');
        console.log('config.js dosyası başarıyla güncellendi.');
    } catch (error) {
        console.error('Dosya kaydetme hatası:', error);
    }
}
async function updateValueInConfig(newValue, variableName) {
    try {
        let configFile = await fsp.readFile(configPath, 'utf-8');
        const variableRegex = new RegExp(`${variableName}:\\s*['"]?(.*?)['"]?\\s*(,|})`, 's');
        if (configFile.match(variableRegex)) {
            const updatedVariable = `${variableName}: '${newValue}'$2`;
            configFile = configFile.replace(variableRegex, updatedVariable);
            await saveConfig(configFile);
            console.log(`${variableName} değişkeni güncellendi ve yeni değer: ${newValue}`);
        } else {
            console.error(`${variableName} değişkeni bulunamadı veya liste değil.`);
        }
    } catch (error) {
        console.error('Dosya okuma veya yazma hatası:', error);
    }
}
async function updateArrayInConfig(newUserId, arrayName) {
    try {
        let configFile = await fsp.readFile(configPath, 'utf-8');
        const arrayRegex = new RegExp(`${arrayName}:\\s*\\[(.*?)\\]`, 's');
        if (configFile.match(arrayRegex)) {
            const updatedArray = `${arrayName}: [${newUserId}]`;
            configFile = configFile.replace(arrayRegex, updatedArray);
            await saveConfig(configFile);
            console.log(`${arrayName} dizisi temizlendi ve sadece ${newUserId} eklendi.`);
        } else {
            console.error(`${arrayName} dizisi bulunamadı veya bir liste değil.`);
        }
    } catch (error) {
        console.error('Dosya okuma veya yazma hatası:', error);
    }
}
async function geminAi(msj) {
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
	const result = await model.generateContent([msj]);
	return result.response.text();
}
async function getLink(caseName) {
    switch (caseName) {
        case 'devil':
            return ["https://textpro.me/create-neon-devil-wings-text-effect-online-free-1014.html", 1];
        case 'sci':
            return ["https://textpro.me/create-science-fiction-text-effect-online-free-1038.html", 1];
        case '2devil':
            return ["https://textpro.me/create-green-horror-style-text-effect-online-1036.html", 1];
        case 'hub':
            return ["https://textpro.me/pornhub-style-logo-online-generator-free-977.html", 2];
        case 'retro':
            return ["https://textpro.me/video-game-classic-8-bit-text-effect-1037.html", 2];
        case '3graf':
            return ["https://textpro.me/break-wall-text-effect-871.html", 1];
        case 'berry':
            return ["https://textpro.me/create-berry-text-effect-online-free-1033.html", 1];
        case '4sand':
            return ["https://textpro.me/create-a-summery-sand-writing-text-effect-988.html", 1];
        case '3sand':
            return ["https://textpro.me/sand-engraved-3d-text-effect-989.html", 1];
        case '2sand':
            return ["https://textpro.me/sand-writing-text-effect-online-990.html", 1];
        case 'sand':
            return ["https://textpro.me/write-in-sand-summer-beach-free-online-991.html", 1];
        case 'fire':
            return ["https://textpro.me/halloween-fire-text-effect-940.html", 1];
        case 'pink':
            return ["https://textpro.me/blood-text-on-the-frosted-glass-941.html", 1];
        case 'blood':
            return ["https://textpro.me/horror-blood-text-effect-online-883.html", 1];
        case '2light':
            return ["https://textpro.me/online-thunder-text-effect-generator-1031.html", 1];
        case '3d':
            return ["https://textpro.me/create-layered-text-effects-online-free-1032.html", 1];
        case 'art':
            return ["https://textpro.me/online-multicolor-3d-paper-cut-text-effect-1016.html", 1];
        case 'wcolor':
            return ["https://textpro.me/create-a-free-online-watercolor-text-effect-1017.html", 1];
        case 'magma':
            return ["https://textpro.me/create-a-magma-hot-text-effect-online-1030.html", 1];
        case 'metal':
            return ["https://textpro.me/create-a-3d-glossy-metal-text-effect-1019.html", 1];
        case 'paper':
            return ["https://textpro.me/create-art-paper-cut-text-effect-online-1022.html", 1];
        case 'bglass':
            return ["https://textpro.me/broken-glass-text-effect-free-online-1023.html", 1];
        case '4neon':
            return ["https://textpro.me/create-3d-neon-light-text-effect-online-1028.html", 1];
        case 'gradient':
            return ["https://textpro.me/online-3d-gradient-text-effect-generator-1020.html", 1];
        case '2harry':
            return ["https://textpro.me/create-harry-potter-text-effect-online-1025.html", 1];
        case 'stone':
            return ["https://textpro.me/3d-stone-cracked-cool-text-effect-1029.html", 1];
        case 'bear':
            return ["https://textpro.me/online-black-and-white-bear-mascot-logo-creation-1012.html", 1];
        case 'wolf':
            return ["https://textpro.me/create-wolf-logo-galaxy-online-936.html", 2];
        case 'neon':
            return ["https://textpro.me/create-a-futuristic-technology-neon-light-text-effect-1006.html", 1];
        case '2neon':
            return ["https://textpro.me/neon-text-effect-online-879.html", 1];
        case 'light':
            return ["https://textpro.me/thunder-text-effect-online-881.html", 1];
        case 'joker':
            return ["https://textpro.me/create-logo-joker-online-934.html", 1];
        case 'ninja':
            return ["https://textpro.me/create-ninja-logo-online-935.html", 2];
        case 'glitter':
            return ["https://textpro.me/advanced-glow-text-effect-873.html", 1];
        case 'bokeh':
            return ["https://textpro.me/bokeh-text-effect-876.html", 1];
        case 'marvel':
            return ["https://textpro.me/create-logo-style-marvel-studios-online-971.html", 2];
        case '2marvel':
            return ["https://textpro.me/create-3d-avengers-logo-online-974.html", 2];
        case '2glitch':
            return ["https://textpro.me/create-a-glitch-text-effect-online-free-1026.html", 2];
        case 'glitch':
            return ["https://textpro.me/create-glitch-text-effect-style-tik-tok-983.html", 2];
        case 'graf':
            return ["https://textpro.me/create-cool-wall-graffiti-text-effect-online-1009.html", 2];
        case '2graf':
            return ["https://textpro.me/create-a-cool-graffiti-text-on-the-wall-1010.html", 2];
        case 'lion':
            return ["https://textpro.me/create-lion-logo-mascot-online-938.html", 2];
        case '3neon':
            return ["https://textpro.me/neon-text-effect-online-963.html", 1];
        case 'ice':
            return ["https://textpro.me/ice-cold-text-effect-862.html", 1];
        case 'space':
            return ["https://textpro.me/create-space-3d-text-effect-online-985.html", 2];
        default:
            return []; 
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function kartCek() {
	kart = Math.floor(Math.random() * 10) + 1; 
	return kart === 1 ? 'As' : kart;
}
function toplamHesapla(kartlar) {
	toplam = 0;
	asSayisi = 0;
	for (let kart of kartlar) {
		if (kart === 'As') {
			asSayisi += 1;
			toplam += 11; 
		} else {
			toplam += kart;
		}
	}
	while (toplam > 21 && asSayisi > 0) {
		toplam -= 10; 
		asSayisi -= 1;
	}

	return toplam;
}
function asDurumunuGoster(kartlar, toplam) {
	if (kartlar.includes('As') && toplam <= 21) {
		let alternatifToplam = toplam - 10;
		return `${alternatifToplam}/${toplam}`; 
	} else {
		return toplam;
	}
}
function addlist() {
    addCommand(['add', 'alive', 'asena', 'ban',
				'demote', 'promote', 'sticker',
				'setvar', 'money', 'image_',
				'slot', 'getprofile', 'bonus',
				'update now', 'update', 'getvar_',
				'kayit', 'yazitura', 'weather', 
				'song', 'tagall', 'kartcek', 
				'imagealive', 'reels', 'tiktok', 
				'insta', 'gemini', 'download', 
				'stickermedia', 'text', 'lyrics',
				'kickme', 'devam', 'bj']);
}
function addAsenaDesc() {
	addDesc([
		{ name: 'add', description: 'Gruba Kişi eklemenizi sağlar örn: .add 905510310485 || veya grupta olmayan birine yanıt.' },
		{ name: 'alive', description: 'Botun çalışıp çalışmadığını kontrol eder.' },
		{ name: 'asena', description: 'Tüm komutları gösterir.' },
		{ name: 'ban', description: 'Gruptan kişi banlamanızı sağlar' },
		{ name: 'demote', description: 'Yanıt verilen kişiyi adminlikten çıkartır.'},
		{ name: 'getprofile', description: `Yazılan chat'in proil fotoğrafını gönderir.`},
		{ name: 'game', description: 'Oynayabileceğiniz oyunları ve açıklamasını gönderir.'},
		{ name: 'promote', description: 'Yanıt verilen kişiyi admin yapar.'},
		{ name: 'image_', description: `Alt tire '_' kısmından sonra argüman girerek bir resim yanıtladığınızda resimi editler // argümanları almak için: .image || örn: .image_colorful`},
		{ name: 'sticker', description: 'Yanıt verilen medyayı sticker yapar.' },
		{ name: 'tiktok', description: 'Tiktok videosu indirmenizi sağlar örn: .tiktok https://tiktokurl'},
		{ name: 'reels', description: 'İnstagramdan reels videosu indirmenizi sağlar örn: .reels https://instareelsurl'},
		{ name: 'song', description: `İtunes'dan şarkı indirmenizi sağlar örn: .song ferdi tayfur hatıran yeter`},
		{ name: 'weather', description: 'Verilen şehrin hava durumunu gösterir örn: .weather istanbul'},
		{ name: 'tagall', description: 'Gruptaki tüm üyeleri etiketler.'},
		{ name: 'imagealive', description: `alive mesajında kullanmak üzere yanıt verilen görseli indirir.`},
		{ name: 'update', description: `WhatsAsena'ya güncelleme gelip gelmediğini kontrol eder.`},
		{ name: 'update now', description: `Eğer güncelleme gelmiş ise WhatsAsena'yı günceller.`},
		{ name: 'setvar_SUDOUSER', description: `Sudo'ları değiştirmek için kullanılır. Örnek: .setvar_SUDO '905510310485','90512345678'` },
		{ name: 'setvar_ALIVEMSG', description: 'Alive mesajını değiştirmek için kullanabilirsiniz. Alive argümanları için: .helpalive' },
		{ name: 'setvar_WORKTYPE', description: 'Worktype değiştirmenizi sağlar örn: setvar_WORKTYPE private // veya public olarak değiştirebilirsiniz. || public ise herkes kullanabilir: private sadece siz.' },
		{ name: 'setvar_HANDLERS', description: `Prefixinizi güncellemenizi sağlar. örn: .setvar_HANDLERS '.','!,'*'` },
		{ name: 'getvar_WORKTYPE', description: 'Mevcut worktype değişkenini görmenizi sağlar.'},
		{ name: 'getvar_ALIVEMSG', description: 'Mevcut alive mesajınızı görmenizi sağlar.'},
		{ name: 'getvar_SUDOUSER', description: 'Mevcut sudo kullanıcılarınızı görmenizi sağlar.'},
		{ name: 'getvar_HANDLERS', description: 'Mevcut prefix argümanını görmenizi sağlar.'}
	]);
	let {desc} = require('../list');
	console.log(desc);
}
addlist();
addAsenaDesc();
module.exports = {
	handleCommand: async (sock, message) => {
		const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
		console.log('yeni mesaj => ', text);
		if (!text) {
			console.log('Mesajda text bulunamadı.');
			return;
		}
		for (const prf of prefix) {
			if (text === `${prf}alive` || 
				text === `${prf}asena` ||
				text === `${prf}stickermedia` ||
				text === `${prf}sticker` ||
				text.startsWith(`${prf}getprofile`) ||
				text.startsWith(`${prf}weather`) ||
				text.startsWith(`${prf}yazitura`) ||
				text.startsWith(`${prf}kayit`) ||
				text.startsWith(`${prf}bonus`) ||
				text.startsWith(`${prf}money`) ||
				text.startsWith(`${prf}slot`) ||
				text.startsWith(`${prf}song `) ||
				text.startsWith(`${prf}image_`) ||
				text.startsWith(`${prf}reels `) ||
				text.startsWith(`${prf}tiktok `) ||
				text.startsWith(`${prf}insta`) ||
				text.startsWith(`${prf}gemini`) ||
				text.startsWith(`${prf}download`) ||
				text.startsWith(`${prf}stickermedia`) ||
				text.startsWith(`${prf}text`) ||
				text.startsWith(`${prf}lyrics`) ||
				//bj commands
				wait&&text.startsWith(`${prf}kartcek`) || wait&&text.startsWith(`${prf}devam`) || text.startsWith(`${prf}bj`)
				) {

				/* SUDO CONTROLS */

				const chatId = message.key.remoteJid;
				var fromMe = message.key.fromMe;
				if (chatId.includes('@g.us')) {
					var userId = message.key.participant;
				}
				else {
					var userId = message.key.remoteJid;
				}
				var botId = sock.user.id;
				let onay = false;
				if (!fromMe) {
					for (const a of convertSudo) {
						if (a === userId) onay = true;
					}
				}

				/* if fromMe YOUR MESSAGE : true and false, onay SUDO CONTROL, if wk WORKTYPE = PUBLİC: true AND false*/
				/* PUBLİC COMMANDS */
				if (!fromMe && !onay && !wk) return;
				console.log(convertSudo);
				//console.log(sock);
				if (text === `${prf}alive`) {
					if (alv === 'default' || alv === '' || alv === ' ') {
						alv = 'Tanrı Türk\'ü Korusun. 🐺 Asena Hizmetinde!\n\n*Version*: '+config.VERSION+'\n*Branch*: '+config.BRANCH+'\n*Telegram Group*: https://t.me/AsenaSupport\n*Telegram Channel:* https://t.me/asenaremaster';
						sock.sendMessage(message.key.remoteJid, { text: alv});
					} 
					else {
						var arg = ['{pp}', '{version}', '{branch}', '{default}', '{image}'];
						alv = config.ALIVEMSG;
						if (alv.includes(arg[1])) {alv = alv.replace(`${arg[1]}`, `${config.VERSION}`);}
						if (alv.includes(arg[2])) {alv = alv.replace(`${arg[2]}`, `${config.BRANCH}`);}
						if (alv.includes(arg[3])) {alv = alv.replace(`${arg[3]}`, 'Tanrı Türk\'ü Korusun. 🐺 Asena Hizmetinde!\n\n*Version*: '+config.VERSION+'\n*Branch*: '+config.BRANCH+'\n*Telegram Group*: https://t.me/AsenaSupport\n*Telegram Channel:* https://t.me/asenaremaster');}
						if (alv.includes(arg[0])) {
							var profilepath = `${path.join(__dirname, '..')}\\assets\\aliveprofile.png`;
							console.log('pp indiriliyor...');
							alv = alv.replace(`${arg[0]}`, '');
							var idps = sock.user.id;
							var idsl = idps.split(':')
							var ids = `${idsl[0]}@s.whatsapp.net`;
							if (!fs.existsSync(profilepath)) {
								onestart = false;
								try {
									//console.log(profilepath)
									await downloadProfilePicture(sock, ids, profilepath);
									var prfc = fs.readFileSync(profilepath);
									sock.sendMessage(message.key.remoteJid, { image: prfc, caption: alv});
								} catch (error) {
									console.error('Profil fotoğrafı indirilirken bir hata oluştu:', error);
								}
								return;
							} else {
								var prfc = fs.readFileSync(profilepath);
								sock.sendMessage(message.key.remoteJid, { image: prfc, caption: alv})
							}
						} else if (alv.includes(arg[4])) {
							var asspath = path.join(__dirname, '..', 'assets');
							var imagepath = `${asspath}\\aliveimage.png`;
							if (fs.existsSync(imagepath)) {
								var image = fs.readFileSync(imagepath);
								alv = alv.replace(`${arg[4]}`, '');
								sock.sendMessage(message.key.remoteJid, { image: image, caption: alv});
							}
							else sock.sendMessage(message.key.remoteJid, { text: 'Alive Error!\n{image} Argümanını kullanabilmek için önceden bir mesaja yanıt vererek .imagealive yazmanız gerekmektedir'})
						} else {
							var dflv = 'Tanrı Türk\'ü Korusun. 🐺 Asena Hizmetinde!\n\n*Version*: '+config.VERSION+'\n*Branch*: '+config.BRANCH+'\n*Telegram Group*: https://t.me/AsenaSupport\n*Telegram Channel:* https://t.me/asenaremaster';
							if (alv.includes(arg[3])) sock.sendMessage(message.key.remoteJid, { text: dflv});
							else sock.sendMessage(message.key.remoteJid, { text: alv});
						}
					}
				} else if (text === `${prf}imagealive`) {
					if (!message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
						await sock.sendMessage(message.key.remoteJid, { text: 'Lütfen bir medya mesajına yanıt verin.' });
						return;
					}
					sock.sendMessage(message.key.remoteJid, { text: 'Media indiriliyor lütfen bekleyiniz...'});
					var asspath = path.join(__dirname, '..', 'assets');
					var imagepath = `${asspath}\\aliveimage.png`;
					const quotedMessage = message.message.extendedTextMessage.contextInfo.quotedMessage;
					const quotedMessageType = Object.keys(quotedMessage)[0];
					if (quotedMessageType === 'imageMessage') {
						const buffer = await downloadMediaMessage(
							{ message: quotedMessage },
							'buffer',
							{},
							{
								logger: console,
								reuploadRequest: sock.updateMediaMessage
							}
						);
						fs.writeFileSync(imagepath, buffer);
						sock.sendMessage(message.key.remoteJid, { text: 'Media indirildi artık: {image} argümanı ile alive mesajınızda kullanabilirsiniz.'});
					}
				} else if (text === `${prf}stickermedia`) {
					if (!message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
						await sock.sendMessage(message.key.remoteJid, { text: 'Lütfen bir medya mesajına yanıt verin.' });
						return;
					}
					const stick = path.join(__dirname, '..', 'assets', 'stickerm.webp');
					const quotedMessage = message.message.extendedTextMessage.contextInfo.quotedMessage;
					const animated = quotedMessage.stickerMessage.isAnimated;
					const quotedMessageType = Object.keys(quotedMessage)[0];
					if (true) {
						const buffer = await downloadMediaMessage(
							{ message: quotedMessage },
							'buffer',
							{},
							{
								logger: console,
								reuploadRequest: sock.updateMediaMessage
							}
						);
						fs.writeFileSync(stick, buffer);
						if (animated) {
							const exitfile = path.join(__dirname, '..', 'assets', 'stickout.mp4');
							await webpToMp4(stick, exitfile);
							await sock.sendMessage(message.key.remoteJid, {video: fs.readFileSync(exitfile)});
						} else if (!animated) {
							ffmpeg(stick)
							.fromFormat('webp_pipe')
							.save('output.png')
							.on('end', async () => {
								await sock.sendMessage(message.key.remoteJid, {image: fs.readFileSync('output.png'), caption: 'Made by WhatsAsena'});
							});
						}
					}
				} else if (text === `${prf}asena`) {
					let wrk = 'Private';
					if (config.WORKTYPE === 'public') wrk='Public'
					desc = require('../list').desc;
					let sonuc = `●▬▬▬ WhatsAsena ${wrk} ▬▬▬●\n\n`;
					desc.forEach(command => {
						sonuc += `🛠: ${command.name}\n💬: ${command.description}\n\n`;
					});
					sock.sendMessage(message.key.remoteJid, { text: sonuc});
				} else  if (text === (`${prf}sticker`)) {
					if (!message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
						await sock.sendMessage(message.key.remoteJid, { text: 'Lütfen bir medya mesajına yanıt verin.' });
						return;
					}
		
					const quotedMessage = message.message.extendedTextMessage.contextInfo.quotedMessage;
					const quotedMessageType = Object.keys(quotedMessage)[0];
					if (quotedMessageType === 'imageMessage' || quotedMessageType === 'videoMessage') {
						const buffer = await downloadMediaMessage(
							{ message: quotedMessage },
							'buffer',
							{},
							{
								logger: console,
								reuploadRequest: sock.updateMediaMessage
							}
						);
						const tempFile = quotedMessageType === 'imageMessage' ? 'temp_image.jpg' : 'temp_video.mp4';
						const stickerFile = 'sticker.webp';
						fs.writeFileSync(tempFile, buffer);
						ffmpeg(tempFile)
							.outputOptions(["-y", "-vcodec libwebp"])
							.videoFilters('scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1')
							.save(stickerFile)
							.on('end', async () => {
								var stickerf = fs.readFileSync(stickerFile)
								await sock.sendMessage(message.key.remoteJid, {
									sticker: fs.readFileSync(stickerFile)
								});
								fs.unlinkSync(tempFile);
								fs.unlinkSync(stickerFile);
							});
					} else {
						await sock.sendMessage(message.key.remoteJid, { text: 'Lütfen bir görsel veya videoya yanıt verin.' });
					}
				} else if (text.startsWith(`${prf}getprofile`)) {
					let quotedMessage = false;
					try {
						quotedMessage = message.message.extendedTextMessage.contextInfo;
					} catch {
						quotedMessage = false;
					}
					const chatType = message.key.remoteJid.includes('@g.us') ? 'group' : 'individual';
					//console.log(message.key.remoteJid);
					let ids = '';
					//console.log(quotedMessage);
					if (quotedMessage) {
						ids = quotedMessage.participant;
						//console.log(ids)
					}
					else {
						ids = message.key.remoteJid;
					}
					try {
						var profilepath = `${path.join(__dirname, '..')}\\assets\\profile.png`;
						//console.log(profilepath)
						await downloadProfilePicture(sock, ids, profilepath);
						var prfc = fs.readFileSync(profilepath);
						sock.sendMessage(message.key.remoteJid, { image: prfc, caption: 'MadeBy WhatsAsena'});
					} catch (error) {
						console.error('Profil fotoğrafı indirilirken bir hata oluştu:', error);
					}
				} else if (text.startsWith(`${prf}weather`)) {
					if (!text.includes(' ')) { sock.sendMessage(message.key.remoteJid, { text: 'Lütfen bir şehir giriniz.'});return;}
					var country = text.replace(`${prf}weather `, '');
					var { sicaklik, nem, ruzgar, bulut } = await weather(country);
					sock.sendMessage(message.key.remoteJid, { text: `_*${country}*' için hava durumu_:\n\n*Sıcaklık*: _${sicaklik}_\n*Nem*: _${nem}_\n*Rüzgar hızı*: _${ruzgar}_\n*Bulut durumu*: _${bulut}_`});
					return;
				} else if (text.startsWith(`${prf}yazitura`)) {
					const kzky = await getRandomBoolean();
					console.log(kzky);
					const wko = await checkUserExists(userId);
					if (!wko) { sock.sendMessage(message.key.remoteJid, {text: 'Kayıtlı değilsiniz kayıt olmak için .kayit yazabilirsiniz.'});return;}
					const sayi = text.match(/\d+/);
					let number = null;
					console.log(sayi);
					if (sayi) {
						number = parseInt(sayi[0], 10);
					}
					if (number === null) {
						sock.sendMessage(message.key.remoteJid, {text: 'Yanlış argüman! örn: .yazitura 50 // 50 coin ile yazıtura atar.'});
						return;
					}
					users = await getUserByJid(userId);
					const oldcoin = users.userCoin;
					if (number > oldcoin) {sock.sendMessage(message.key.remoteJid, {text: 'Lütfen geçerli bir bahis giriniz.'});return;}
					const send = await sock.sendMessage(message.key.remoteJid, {text: 'Yazı tura atılıyor lütfen bekleyiniz \\'});
					await sleep(400);
					await sock.sendMessage(message.key.remoteJid, {text: 'Yazı tura atılıyor lütfen bekleyiniz | ', edit: send.key});
					await sleep(300);
					await sock.sendMessage(message.key.remoteJid, {text: 'Yazı tura atılıyor lütfen bekleyiniz /', edit: send.key});
					await sleep(300);
					await sock.sendMessage(message.key.remoteJid, {text: 'Yazı tura atılıyor lütfen bekleyiniz -', edit: send.key});
					let st = 1
					while (st < 4) {
						await sleep(300);
						await sock.sendMessage(message.key.remoteJid, {text: 'Yazı tura atılıyor lütfen bekleyiniz \\', edit: send.key});
						await sleep(300);
						await sock.sendMessage(message.key.remoteJid, {text: 'Yazı tura atılıyor lütfen bekleyiniz | ', edit: send.key});
						await sleep(300);
						await sock.sendMessage(message.key.remoteJid, {text: 'Yazı tura atılıyor lütfen bekleyiniz /', edit: send.key});
						await sleep(300);
						await sock.sendMessage(message.key.remoteJid, {text: 'Yazı tura atılıyor lütfen bekleyiniz -', edit: send.key});
						st+=1;
					}
					if (kzky) {
						const kznm = number*2;
						await sock.sendMessage(message.key.remoteJid, {text: `Kazandınız! Kazanılan miktar: ${kznm}`, edit: send.key});
						const newcoin = oldcoin+kznm;
						await updateCoinByJid(userId, newcoin);
						return;
					} else {
						await sock.sendMessage(message.key.remoteJid, {text: `Kaybettiniz! Kaybedilen miktar: ${number}`, edit: send.key});
						const newcoin = oldcoin-number;
						await updateCoinByJid(userId, newcoin);
						return;
					}
				} else if (text.startsWith(`${prf}kayit`)) {
					const wko = await checkUserExists(userId);
					if (wko) {sock.sendMessage(message.key.remoteJid, {text: 'Siz zaten kayıtlısınız.'});return;}
					await tableWrite(userId, 200, false);
					await sock.sendMessage(message.key.remoteJid, {text: 'Başarı ile kayıt oldunuz.'})
				} else if (text.startsWith(`${prf}bonus`)) {
					const wko = await checkUserExists(userId);
					if (!wko) {sock.sendMessage(message.key.remoteJid, {text: 'Kayıtlı değilsiniz kayıt olmak için .kayit yazabilirsiniz.'});return;}
					users = await getUserByJid(userId);
					if (users.userCoin > 200) {sock.sendMessage(message.key.remoteJid, {text: `Paranız 200'ün üzerinde, bonus alamazsınız.`});return;}
					let oldcoin = users.userCoin;
					if (oldcoin === NaN || oldcoin === null || oldcoin === undefined){oldcoin = 0;}
					const newcoin = oldcoin+200;
					await updateCoinByJid(userId, newcoin);
					sock.sendMessage(message.key.remoteJid, {text: `200 coin bonus verildi yeni bakiyeniz: ${newcoin}`});
					return;
				} else if (text.startsWith(`${prf}money`)) {
					const wko = await checkUserExists(userId);
					if (!wko) {sock.sendMessage(message.key.remoteJid, {text: 'Kayıtlı değilsiniz kayıt olmak için .kayit yazabilirsiniz.'});return;}
					users = await getUserByJid(userId);
					sock.sendMessage(message.key.remoteJid, {text: `Bakiyeniz: ${users.userCoin}`});
					return;
				} else if (text.startsWith(`${prf}slot`)) {
					const wko = await checkUserExists(userId);
					if (!wko) {sock.sendMessage(message.key.remoteJid, {text: 'Kayıtlı değilsiniz kayıt olmak için .kayit yazabilirsiniz.'});return;}
					users = await getUserByJid(userId);
					var oldcoin = users.userCoin;
					const send = await sock.sendMessage(message.key.remoteJid, {text: 'one two tree'});
					const sayi = text.match(/\d+/);
					let number = null;
					console.log(sayi);
					if (sayi) {
						number = parseInt(sayi[0], 10);
					}
					if (number === null) {
						sock.sendMessage(message.key.remoteJid, {text: 'Yanlış argüman! örn: .slot 50 // 50 coin ile yazıtura atar.'});
						return;
					}
					if (number > oldcoin+1){sock.sendMessage(message.key.remoteJid, {text: 'Lütfen geçerli bir bahis giriniz.'});return;}
					users = await getUserByJid(userId);
					const items = ['🍒', '🍓', '🍋', '🍏', '🍎', '🍊'];
					let maxIterations = 14;
					let iterationCount = 1;
					let sle= 100;
					let sleept = 1.15;
					let rand = 0
					let rand2 = 0
					let rand3 = 0
					while (iterationCount < maxIterations) {
						rand = Math.floor(Math.random() * 6);
						rand2 = Math.floor(Math.random() * 6);
						rand3 = Math.floor(Math.random() * 6);
						// rand = 1;
						// rand2 = 2;
						// rand3 = 1;
						await sleep(30);
						await sock.sendMessage(message.key.remoteJid, {text: `${items[rand]} ${items[rand2]} ${items[rand3]}`, edit: send.key});
						await sleep(sle);
						sle *= sleept;
						iterationCount += 1;
					}
					console.log(rand,'\n\n', rand2,'\n\n', rand3);
					if (rand === rand2 && rand2 === rand3) {
						const hcoin = number*36;
						const newcoin = oldcoin+hcoin
						await sock.sendMessage(message.key.remoteJid, {text: `${items[rand]} ${items[rand2]} ${items[rand3]}\nTebrikler kazandınız. Kazanılan miktar: ${hcoin}`, edit: send.key});
						await updateCoinByJid(userId, newcoin);
						console.log('main');
						return;

					}
					else if (rand === rand2 || rand === rand3 || rand2 === rand3) {
						const hcoin = number*2;
						const newcoin = oldcoin+hcoin;
						await sock.sendMessage(message.key.remoteJid, {text: `${items[rand]} ${items[rand2]} ${items[rand3]}\nTebrikler yarım kazanç sağladınız. Kazanılan miktar: ${hcoin}`, edit: send.key});
						await updateCoinByJid(userId, newcoin);
						console.log('1');
						return;
					}
					await sock.sendMessage(message.key.remoteJid, {text: `${items[rand]} ${items[rand2]} ${items[rand3]}\nKaybettiniz! Kaybedilen miktar: ${number}`, edit: send.key})
					const newcoin = oldcoin-number;
					await updateCoinByJid(userId, newcoin);
					return;
				} else if (text === `${prf}bj`) {
					let usId = '';
					if (fromMe) {
						usId = 'fromMe';
					} else {usId = userId}
					kusers = usId;
					kart = kartCek();
					kart2 = kartCek();
					ukart = kartCek();
					ukart2 = kartCek();
					
					klist = [ukart, ukart2];
					krplist = [kart, kart2];
					
					etop = toplamHesapla(klist);
					ktop = toplamHesapla(krplist);
					
					let con = true;
					wait = true;
					await sock.sendMessage(message.key.remoteJid, {text: `Krupiyenin ilk eli: ${kart}\nSenin elin: ${ukart}, ${ukart2} (Toplam: ${asDurumunuGoster(klist, etop)})`});
				} else if (text.startsWith(`${prf}devam`)) {
					if (kusers==='fromMe' && !fromMe)return;
					if (kusers!=='fromMe' && kusers!==userId)return;
					let next = true;
					let mesjs = '';
					const send = await sock.sendMessage(message.key.remoteJid, {text: 'Devam ediliyor...'})
					while (next) {
						if (ktop > etop && ktop <= 21) {
							if (mesjs==='')mesjs = `${mesjs}Krupiyenin eli: ${krplist} (Toplam: ${ktop})\nKrupiye kazandı!`;
							else {mesjs = `${mesjs}Krupiyenin eli: ${krplist} (Toplam: ${ktop})\nKrupiye kazandı!`;}
							await sock.sendMessage(message.key.remoteJid, {text: `${mesjs}`, edit: send.key});
							next = false;
							con = false;
							return;
						} else if (ktop < 16) {
							var newkart = kartCek();
							krplist.push(newkart);
							ktop = toplamHesapla(krplist);
							if (mesjs==='')mesjs = `${mesjs}Krupiye yeni kart çekti: ${newkart} (Toplam: ${ktop})`;
							else {mesjs = `${mesjs}\nKrupiye yeni kart çekti: ${newkart} (Toplam: ${ktop})`;}
							await sock.sendMessage(message.key.remoteJid, {text: `${mesjs}`, edit: send.key});
						} else if (ktop > 21) {
							if (mesjs==='')mesjs = `${mesjs}Krupiyenin eli: ${krplist} (Toplam: ${ktop})\nKrupiye patladı, sen kazandın!`;
							else{mesjs=`${mesjs}\nKrupiyenin eli: ${krplist} (Toplam: ${ktop})\nKrupiye patladı, sen kazandın!`;}
							await sock.sendMessage(message.key.remoteJid, {text: `${mesjs}`, edit: send.key});
							next = false;
							con = false;return;
						} else if (etop > ktop) {
							if (mesjs==='')mesjs = `${mesjs}Krupiyenin eli: ${krplist} (Toplam: ${ktop})\nSen kazandın! Senin elin: ${etop}`;
							else {mesjs = `${mesjs}\nKrupiyenin eli: ${krplist} (Toplam: ${ktop})\nSen kazandın! Senin elin: ${etop}`;}
							await sock.sendMessage(message.key.remoteJid, {text: `${mesjs}`, edit: send.key});
							next = false;
							con = false;
							return;
						} else {
							console.log(`Krupiyenin eli: ${krplist} (Toplam: ${ktop})`);
							if (mesjs==='')mesjs = `${mesjs}Eşit kaldınız!`;
							else {mesjs = `${mesjs}\nEşit kaldınız!`;}
							await sock.sendMessage(message.key.remoteJid, {text: `${mesjs}`, edit: send.key});
							next = false;
							con = false;
							return;
						}
					}
				} else if (wait&&text.startsWith(`${prf}kartcek`) || wait&&text.startsWith('kal')) {
					if (kusers==='fromMe' && !fromMe)return;
					if (kusers!=='fromMe' && kusers!==userId)return;
					const sent = await sock.sendMessage(message.key.remoteJid, {text: 'kart çekiliyor...'});
					var nukart = kartCek();
					let mssj = '';
					klist.push(nukart);
					etop = toplamHesapla(klist);
					if (etop <= 10){
						if (mssj = ''){
							mssj=`Yeni elin: ${klist} (Toplam: ${asDurumunuGoster(klist, etop)})`
						}
						else{
							mssj=`\nYeni elin: ${klist} (Toplam: ${asDurumunuGoster(klist, etop)})`
						}
					}
					else {
						if (mssj === ''){
							mssj=`Yeni elin: ${klist} (Toplam: ${asDurumunuGoster(klist, etop)})`
						}
						else {
							mssj=`\nYeni elin: ${klist} (Toplam: ${etop})`
						}
					}
					await sock.sendMessage(message.key.remoteJid, {text: `${mssj}`, edit: sent.key})
					if (etop > 21) {
						mssj = `${mssj}\nKaybettin! Elin 21\'i geçti.`;
						await sock.sendMessage(message.key.remoteJid, {text: `${mssj}`, edit: sent.key});
						con = false;
						return;
					}
					return;
				} else if (text.startsWith(`${prf}song `)) {
					try {
						var sname = text.replace(`${prf}song `, '');
						var dname = path.join(__dirname, '..', 'assets', 'song.mp3');
						var srch = await yts(sname);
						const downloader = new ic3zymp3({
							getTags: false,
							outputDir: path.resolve(__dirname, '..', 'assets')
						});
						console.log(srch.videos.map(video => video.url)[0]);
						await downloader.downloadSong(srch.videos.map(video => video.url)[0], `${path.resolve(__dirname, '..', 'assets')}\\song.mp3`)
						
						console.log('Şarkı başarıyla indirildi.');
						await sock.sendMessage(
							message.key.remoteJid, 
							{ 
								audio: { url: "./assets/song.mp3" }, 
								mimetype: 'audio/mp4' 
							}
						);
						fs.unlinkSync('./assets/song.mp3')
					} catch (err) {
						var botId = sock.user.id;
						var mapBotId = botId.split(':')[0]+'@s.whatsapp.net';
						try {
							await sock.sendMessage(
								message.key.remoteJid, 
								{ 
									audio: { url: "./assets/song.mp3" }, 
									mimetype: 'audio/mp4' 
								}
							);
							fs.unlinkSync('./assets/song.mp3');
						}
						catch (error) {
							await sock.sendMessage(message.key.remoteJid, {text: 'Şarkı indirilirken bir hata oluştu. Şarkı itunes de mevcut olduğundan emin olun.'});
							await sock.sendMessage(mapBotId, {text: `WhatsAsena bir hata üretti:\n${error}\n\n${err}`});
						}
					}
					fs.unlinkSync("./assets/song.mp3");
				} else if (text.startsWith(`${prf}image_`)) {
					const ver = text.replace(`${prf}image_`, '');
					console.log(ver);
					if (!message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
						await sock.sendMessage(message.key.remoteJid, { text: 'Lütfen bir medya mesajına yanıt verin.' });
						return;
					}
		
					const quotedMessage = message.message.extendedTextMessage.contextInfo.quotedMessage;
					const quotedMessageType = Object.keys(quotedMessage)[0];
					if (quotedMessageType === 'imageMessage' || quotedMessageType === 'videoMessage') {
						var asspath = path.join(__dirname, '..', 'assets');
						var imagepath = `${asspath}\\ffmp.jpg`;
						const quotedMessage = message.message.extendedTextMessage.contextInfo.quotedMessage;
						const quotedMessageType = Object.keys(quotedMessage)[0];
						if (quotedMessageType === 'imageMessage') {
							const buffer = await downloadMediaMessage(
								{ message: quotedMessage },
								'buffer',
								{},
								{
									logger: console,
									reuploadRequest: sock.updateMediaMessage
								}
							);
							fs.writeFileSync(imagepath, buffer);
							await ffmcvt(ver, imagepath);
							await sock.sendMessage(message.key.remoteJid, {image: fs.readFileSync('assets\\output.jpg'), caption: '*MadeBy WhatsAsena'});

						}
					} 
				} else if (text.startsWith(`${prf}reels `)) {
					var match = text.replace(`${prf}reels `, '');
					console.log(match);
					var assPath = path.join(__dirname, '..', 'assets', 'reels.mp4');
					try {
						await instaDownload(match, assPath);
						await sock.sendMessage(message.key.remoteJid, {video: {url: assPath}, caption: 'MadeBy *WhatsAsena*'});
						fs.unlinkSync(assPath);
						return;
					} catch (error) {
						var botId = sock.user.id;
						var mapBotId = botId.split(':')[0]+'@s.whatsapp.net';
						await sock.sendMessage(message.key.remoteJid, {text: 'Video indirilirken bir hata oluştu. Verilen linkin bir reels videosu olduğundan emin olunuz'})
						await sock.sendMessage(mapBotId, {text: `WhatsAsena bir hata üretti:\n${error}`});
						try {fs.unlinkSync;return;} catch (error) {return;}
					}
				} else if (text.startsWith(`${prf}tiktok `)) {
					var match = text.replace(`${prf}tiktok `, '');
					var assPath = path.join(__dirname, '..', 'assets', 'tiktok.mp4');
					try {
						await tiktokDownload(match, assPath);
						await sock.sendMessage(message.key.remoteJid, {video: {url: assPath}, caption: 'MadeBy *WhatsAsena*'});
						fs.unlinkSync(assPath);
						return;
					} catch (error) {
						var botId = sock.user.id;
						var mapBotId = botId.split(':')[0]+'@s.whatsapp.net';
						await sock.sendMessage(message.key.remoteJid, {text: 'Video indirilirken bir hata oluştu. Verilen linkin bir tiktok videosu olduğundan emin olunuz'})
						await sock.sendMessage(mapBotId, {text: `WhatsAsena bir hata üretti:\n${error},`});
						try {fs.unlinkSync;return;} catch (error) {await sock.sendMessage(mapBotId, {text: `WhatsAsena bir hata üretti:\n${error}\n\n${err}`});return;}
					}
				} else if (text.startsWith(`${prf}insta `)) {
					var match = text.replace(`${prf}insta `, '');
					var assPath = path.join(__dirname, '..', 'assets', 'insta.mp4');
					try {
						await instaİmageDownload(match, assPath);
						await sock.sendMessage(message.key.remoteJid, {image: {url: assPath}, caption: 'MadeBy *WhatsAsena*'});
						fs.unlinkSync(assPath);
						return;
					} catch (error) {
						var botId = sock.user.id;
						var mapBotId = botId.split(':')[0]+'@s.whatsapp.net';
						await sock.sendMessage(message.key.remoteJid, {text: 'Resim indirilirken bir hata oluştu. Verilen linkin bir reels videosu olduğundan emin olunuz'})
						await sock.sendMessage(mapBotId, {text: `WhatsAsena bir hata üretti:\n${error}`});
						try {fs.unlinkSync;return;} catch (error) {return;}
					}
				} else if (text.startsWith(`${prf}gemini `)) {
					var intext = text.replace(`${prf}gemini `, '');
					var out = await geminAi(intext);
					console.log(out);
					await sock.sendMessage(message.key.remoteJid, {text: `${out}`});
				} else if (text.startsWith(`${prf}download`)) {
					if (!message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
						await sock.sendMessage(message.key.remoteJid, { text: 'Lütfen bir medya mesajına yanıt verin.' });
						return;
					}
					sock.sendMessage(message.key.remoteJid, { text: 'Media indiriliyor lütfen bekleyiniz...'});
					var asspath = path.join(__dirname, '..', 'assets');
					var imagepath = `${asspath}\\once.png`;
					const quotedMessage = message.message.extendedTextMessage.contextInfo.quotedMessage;
					console.log('quo mesaj',quotedMessage);
					const quotedMessageType = Object.keys(quotedMessage)[0];
					console.log('quo mesaj', quotedMessageType);
					if (true) {
						const buffer = await downloadMediaMessage(
							{ message: quotedMessage },
							'buffer',
							{},
							{
								logger: console,
								reuploadRequest: sock.updateMediaMessage
							}
						);
						fs.writeFileSync(imagepath, buffer);
						sock.sendMessage(message.key.remoteJid, { gif: { url: `./once.png`}});
					}
				} else if (text.startsWith(`${prf}text`)) {
					var rtext = text.replace(`${prf}text`, '');
					var mtext = text.split(' ')[0].replace(`${prf}text`, '');
					var menuls = textlist.map(item => {return `💻 *Komut:* ${item.name}\nℹ️ *Açıklama:* ${item.desc}`;}).join('\n\n');
					if (mtext === 'menu'){sock.sendMessage(message.key.remoteJid, {text: menuls});return;}
					console.log('mtx :',mtext);
					const link = await getLink(mtext);
					console.log(link);
					var atext = text.replace(`${prf}text${mtext} `, '');
					var num = link[1];
					var savepath = path.join(__dirname, '..', 'assets', 'text.png');
					if (num === 2) {
						var stext = atext.split(', ');
						console.log('S', stext);
						var len = stext.length;
						if (len !== 2){sock.sendMessage(message.key.remoteJid, {text: `Yanlış kullanım. Örn: ${prf}text${mtext} arg1, arg2`});return;}
						await textpro(link[0], stext, savepath);
						await sock.sendMessage(message.key.remoteJid, {image: {url: savepath}, caption: '_MadeBy_ *WhatsAsena*'});
						fs.unlinkSync(savepath);
					} else {
						console.log(atext);
						await textpro(link[0], `[${atext}]`, savepath);
						await sock.sendMessage(message.key.remoteJid, {image: {url: savepath}, caption: '_MadeBy_ *WhatsAsena*'});
						fs.unlinkSync(savepath);
					}
				} else if (text.startsWith(`${prf}lyrics `)) {
					var rep = text.replace(`${prf}lyrics `, '');
					var match = text.split(',');
					const lyrc = await lyricsFinder(`${match[0]}`, `${match[1]}`);
					if (!lyrc){sock.sendMessage(message.key.remoteJid, {text: 'Şarkı sözleri alınamadı lütfen düzgün argüman verdiğinize emin olunuz. \nörn: _.lyrics sertab erener, aşk'});return;}
					sock.sendMessage(message.key.remoteJid, {text: `${lyrc}`});
				}
			/* SUDO OR USER COMMANDS AND ALWAYS GROUP COMMANDS */
			} else if (
				text.startsWith(`${prf}admin`) ||
				text.startsWith(`${prf}add`) ||
				text.startsWith(`${prf}ban`) ||
				text.startsWith(`${prf}promote`) ||
				text.startsWith(`${prf}demote`) ||
				text.startsWith(`${prf}kickme`)
			) {
				/* ------ group controls ------ */
				if (message.key.remoteJid.includes('@g.us')) {
					var usId = message.key.participant;
					var fromMe = message.key.fromMe;
					let onay = false;
					if (!fromMe) {
						for (const i of convertSudo) {
							if (i === usId) {
								onay = true;
							}
						}
					}
					/* ---- always sudo and fromMe command ---- */
					if (!fromMe && !onay) return;
					var isBotAdmin = await checkIfBotIsAdmin(sock, message.key.remoteJid);
					if (isBotAdmin) {

						if (text.startsWith(`${prf}admin`)) {

							var isBotAdmin = await checkIfBotIsAdmin(sock, message.key.remoteJid);
							console.log(isBotAdmin);
							return;

						} else if (text.startsWith(`${prf}add`)) {
							if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
								var chatId = message.key.remoteJid;
								if (!chatId.includes('@g.us')) {sock.sendMessage(message.key.remoteJid, { text: 'Bu komut sadece gruplarda kullanılabilir.'}); return;}
								var quotedMessage = message.message.extendedTextMessage.contextInfo;
								var partId = quotedMessage.participant;
								var isInGroup = await checkUserInGroup(sock, chatId, partId);
								if (!isInGroup) {
									await replaceUserPosition(sock, chatId, partId, 'add');
									sock.sendMessage(message.key.remoteJid, { text: 'Kullanıcı gruba eklendi'});
									return;
								}
								else {
									sock.sendMessage(message.key.remoteJid, { text: 'Kullanıcı zaten grupta'});
									return;
								}
							} else if (text.includes(`${prf}add `)) {
								console.log('bekleniyor');
								var addIds = text.replace(`${prf}add `, '');
								var addId = `${addIds}@s.whatsapp.net`;
								var groupId = message.key.remoteJid;
								await replaceUserPosition(sock, groupId, addId, 'add');
								sock.sendMessage(message.key.remoteJid, { text: 'Kullanıcı gruba eklendi'});
								return;
							} else {
								sock.sendMessage(message.key.jid, { text: 'Lütfen bir kullanıcı numarası yazın veya mesajına yanıt verin.'});
								return;
							}

						} else if (text.startsWith(`${prf}ban`)) {
							if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
								var chatId = message.key.remoteJid;
								if (!chatId.includes('@g.us')) {sock.sendMessage(message.key.remoteJid, { text: 'Bu komut sadece gruplarda kullanılabilir.'}); return;}
								var quotedMessage = message.message.extendedTextMessage.contextInfo;
								var partId = quotedMessage.participant;
								var isInGroup = await checkUserInGroup(sock, chatId, partId);
								if (isInGroup) {
									await replaceUserPosition(sock, chatId, partId, 'remove');
									sock.sendMessage(message.key.remoteJid, { text: 'Kullanıcı gruptan çıkarıldı.'});
									return;
								}
								else {
									sock.sendMessage(message.key.remoteJid, { text: 'Kullanıcı zaten grupta değil'});
									return;
								}

							} else if (text.includes(' @')) {
								var liste = text.split('@');
								var len = liste.length;
								//console.log(len, '\n\n', liste);
								if (len > 2) {sock.sendMessage(message.key.remoteJid, { text: 'Tek seferde sadece 1 kişiyi banlayabilirsiniz.'}); return;}
								console.log('bekleniyor');
								var banIds = text.replace(`${prf}ban @`, '');
								var banId = `${banIds}@s.whatsapp.net`;
								var groupId = message.key.remoteJid;
								await replaceUserPosition(sock, groupId, banId, 'remove');
								sock.sendMessage(message.key.remoteJid, { text: 'Kullanıcı gruptan çıkarıldı.'});
								return;

							} else {
								sock.sendMessage(message.key.remoteJid, { text: 'Lütfen bir kişiyi etiketleyin yada yanıt verin.'});
								return;
							}
						} else if (text.startsWith(`${prf}promote`)) {
							if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
								var groupId = message.key.remoteJid;
								var quotedMessage = message.message.extendedTextMessage.contextInfo;
								var partId = quotedMessage.participant;
								var isUserAdmin = await checkIsAdmin(sock, groupId, partId);
								if (isUserAdmin) { sock.sendMessage(message.key.remoteJid, { text: 'Kullanıcı zaten yönetici.'});return;}
								var isInGroup = await checkUserInGroup(sock, groupId, partId);
								if (!isInGroup) { sock.sendMessage(message.key.remoteJid, { text: 'Kullanıcı grupta değil'});return;}
								await replaceUserPosition(sock, groupId, partId, 'promote');
								sock.sendMessage(message.key.remoteJid, { text: 'Kullanıcı yönetici yapıldı.'});
								return;
							} else if (text.includes(` @`)) {
								var liste = text.split('@');
								var len = liste.length;
								if (len > 2) { sock.sendMessage(message.key.remoteJid, { text: 'Tek seferde sadece 1 kişiyi Yönetici yapabilirisiniz.'});return;}
								console.log('bekleniyor');
								var proIds = text.replace(`${prf}promote @`, '');
								var proId = `${proIds}@s.whatsapp.net`;
								var groupId = message.key.remoteJid;
								await replaceUserPosition(sock, groupId, proId, 'promote');
								sock.sendMessage(message.key.remoteJid, { text: 'Kullanıcı yönetici yapıldı.'});
								return;
							} else { sock.sendMessage(message.key.remoteJid, { text: 'Lütfen bir kişiyi etiketleyin yada yanıt verin.'});return;}
						} else if (text.startsWith(`${prf}demote`)) {
							if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
								var groupId = message.key.remoteJid;
								var quotedMessage = message.message.extendedTextMessage.contextInfo;
								var partId = quotedMessage.participant;
								var isUserAdmin = await checkIsAdmin(sock, groupId, partId);
								if (!isUserAdmin) { sock.sendMessage(message.key.remoteJid, { text: 'Kullanıcı zaten yönetici değil.'});return;}
								var isInGroup = await checkUserInGroup(sock, groupId, partId);
								if (!isInGroup) { sock.sendMessage(message.key.remoteJid, { text: 'Kullanıcı grupta değil'});return;}
								await replaceUserPosition(sock, groupId, partId, 'demote');
								sock.sendMessage(message.key.remoteJid, { text: 'Kullanıcının yöneticiliği alındı.'})
								return;
							} else if (text.includes(` @`)) {
								var liste = text.split('@');
								var len = liste.length;
								if (len > 2) { sock.sendMessage(message.key.remoteJid, { text: 'Tek seferde sadece 1 kişiyi Yöneticilikten çıkarabilirsiniz.'});return;}
								console.log('bekleniyor');
								var proIds = text.replace(`${prf}promote @`, '');
								var proId = `${proIds}@s.whatsapp.net`;
								var groupId = message.key.remoteJid;
								await replaceUserPosition(sock, groupId, proId, 'demote');
								sock.sendMessage(message.key.remoteJid, { text: 'Kullanıcının yöneticiliği alındı.'});
								return;
							} else { sock.sendMessage(message.key.remoteJid, { text: 'Lütfen bir kişiyi etiketleyin yada yanıt verin.'});return;}
						}
					} else {
						if (text.startsWith(`${prf}kickme`)) {
							var chatId = message.key.remoteJid;
							await sock.sendMessage(message.key.remoteJid, {text: 'hoscakal'});
							await sleep(200);
							await sock.groupLeave(chatId);
							return;
						}
						else {sock.sendMessage(message.key.remoteJid, { text: 'Bu komutu kullanabilmem için admin olmam gerekir.'});return;}}
				} else {sock.sendMessage(message.key.remoteJid, { text: 'Bu komut sadece gruplarda kullanılabilir.'});return;}
				/* User and Sudo commands */
			} else if (
				text === `${prf}imagealive` ||
				text.startsWith(`${prf}tagall`) ||
				text.startsWith(`${prf}setvar_`) ||
				text.startsWith(`${prf}googlesearch`) ||
				text.startsWith(`${prf}getvar_`) ||
				text.startsWith(`${prf}update`) ||
				text.startsWith(`${prf}update now`)||
				text.startsWith(`${prf}tyes`) ||
				text.startsWith(`${prf}liste`)
			) {
				var chId = message.key.participant;
				let usId = message.key.remoteJid;
				if (usId.includes('@g.us')) { usId = message.key.participant;}
				var fromMe = message.key.fromMe;
				let onay = false;
				if (!fromMe) {
					for (const i of convertSudo) {
						if (i === usId) {
							onay = true;
						}
					}
				}
				/* ---- always sudo and fromMe command ---- */
				if (!fromMe && !onay) return;
				if (text.startsWith(`${prf}tagall`)) {
					var msj = text.replace(`${prf}tagall`, '');
					try {
						if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
							const quotedMessage = message.message.extendedTextMessage.contextInfo.quotedMessage;
							const dirname = path.join(__dirname, '..', 'assets');
							const paths = `${dirname}\\file.png`; 
							if (quotedMessage.imageMessage) {
								const isGroup = message.key.remoteJid.endsWith('@g.us');
								if (!isGroup) {
									await sock.sendMessage(message.key.remoteJid, { text: 'Bu komut sadece grup sohbetlerinde kullanılabilir.' });
									return;
							  	}
								const buffer = await downloadMediaMessage(
									{ message: quotedMessage },
									'buffer',
									{},
									{
										logger: console,
										reuploadRequest: sock.updateMediaMessage
									}
								);
							  	const groupMetadata = await sock.groupMetadata(message.key.remoteJid); 
							  	const participants = groupMetadata.participants.map(participant => participant.id); 
								fs.writeFileSync(paths, buffer);
								var imagepath = fs.readFileSync(paths);
								sock.sendMessage(message.key.remoteJid, { image: imagepath, mentions: participants});
							} else if (quotedMessage.stickerMessage) {
								const buffer = await downloadMediaMessage(
									{ message: quotedMessage },
									'buffer',
									{},
									{
										logger: console,
										reuploadRequest: sock.updateMediaMessage
									}
								);
								const aspath = path.join(__dirname, '..', 'assets');
								const save = `${aspath}\\sticker.webp`;
								const groupMetadata = await sock.groupMetadata(message.key.remoteJid); 
								const participants = groupMetadata.participants.map(participant => participant.id); 
								fs.writeFileSync(save, buffer);
								sock.sendMessage(message.key.remoteJid, { sticker: fs.readFileSync(save), mentions: participants});
							} else if (quotedMessage.videoMessage) {
								const quotedMessage = message.message.extendedTextMessage.contextInfo.quotedMessage;
								const dirname = path.join(__dirname, '..', 'assets');
								const paths = `${dirname}\\file.mp4`; 
								const isGroup = message.key.remoteJid.endsWith('@g.us');
								if (!isGroup) {
									await sock.sendMessage(message.key.remoteJid, { text: 'Bu komut sadece grup sohbetlerinde kullanılabilir.' });
									return;
								}
								const buffer = await downloadMediaMessage(
									{ message: quotedMessage },
									'buffer',
									{},
									{
										logger: console,
										reuploadRequest: sock.updateMediaMessage
									}
								);
								const groupMetadata = await sock.groupMetadata(message.key.remoteJid); 
								const participants = groupMetadata.participants.map(participant => participant.id); 
								fs.writeFileSync(paths, buffer);
								var videopath = fs.readFileSync(paths);
								sock.sendMessage(message.key.remoteJid, { video: videopath, mentions: participants});
							} else {
								console.log('text mevcut.');
								const isGroup = message.key.remoteJid.endsWith('@g.us');
								if (!isGroup) {
									await sock.sendMessage(message.key.remoteJid, { text: 'Bu komut sadece grup sohbetlerinde kullanılabilir.' });
									return;
								}
								const groupMetadata = await sock.groupMetadata(message.key.remoteJid); 
								const participants = groupMetadata.participants.map(participant => participant.id); 
								const finalMessage = `*${quotedMessage.conversation}*`; 
				
								await sock.sendMessage(message.key.remoteJid, {
									text: finalMessage,
									mentions: participants 
								});
							}
						} else {
							if (msj === ' ' || msj === '') {
								try {
									const isGroup = message.key.remoteJid.endsWith('@g.us');
									if (!isGroup) {
										  await sock.sendMessage(message.key.remoteJid, { text: 'Bu komut sadece grup sohbetlerinde kullanılabilir.' });
										  return;
									}
									const groupMetadata = await sock.groupMetadata(message.key.remoteJid); 
									const participants = groupMetadata.participants.map(participant => participant.id); 
									const mentions = participants.map(participant => `• @${participant.split('@')[0]}`).join('\n'); 
									const finalMessage = `${mentions}`;
							  
									await sock.sendMessage(message.key.remoteJid, {
										  text: finalMessage,
										  mentions: participants 
									});
								} catch (error) {
									console.error('tagall komutunda hata:', error);
								}
							} else {
								try {
									const isGroup = message.key.remoteJid.endsWith('@g.us');
									if (!isGroup) {
										await sock.sendMessage(message.key.remoteJid, { text: 'Bu komut sadece gruplarda kullanılabilir.' });
										return;
									}
							
									const messageText = message.message.conversation || message.message.extendedTextMessage?.text; 
									const groupMetadata = await sock.groupMetadata(message.key.remoteJid); 
									const participants = groupMetadata.participants.map(participant => participant.id); 
									const mesj = text.replace(`${prf}tagall `, '');
									const finalMessage = `*${mesj}*`; 
					
									await sock.sendMessage(message.key.remoteJid, {
										text: finalMessage,
										mentions: participants 
									});
								} catch (error) {
									console.error('tagall komutunda hata:', error);
								}
							}
						}
					} catch (error) {
						console.error('tagall komutunda hata:', error);
					}
				} else if (text === `${prf}imagealive`) {
					if (!message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
						await sock.sendMessage(message.key.remoteJid, { text: 'Lütfen bir medya mesajına yanıt verin.' });
						return;
					}
					sock.sendMessage(message.key.remoteJid, { text: 'Media indiriliyor lütfen bekleyiniz...'});
					var asspath = path.join(__dirname, '..', 'assets');
					var imagepath = `${asspath}\\aliveimage.png`;
					const quotedMessage = message.message.extendedTextMessage.contextInfo.quotedMessage;
					const quotedMessageType = Object.keys(quotedMessage)[0];
					if (quotedMessageType === 'imageMessage') {
						const buffer = await downloadMediaMessage(
							{ message: quotedMessage },
							'buffer',
							{},
							{
								logger: console,
								reuploadRequest: sock.updateMediaMessage
							}
						);
						fs.writeFileSync(imagepath, buffer);
						sock.sendMessage(message.key.remoteJid, { text: 'Media indirildi artık: {image} argümanı ile alive mesajınızda kullanabilirsiniz.'});
					}
				} else if (text.startsWith(`${prf}setvar_ALIVEMSG`)) {
					if (!text.includes(' '))return;
					var newarg = text.replace(`${prf}setvar_ALIVEMSG `, '');
					await updateValueInConfig(newarg, 'ALIVEMSG');
					sock.sendMessage(message.key.remoteJid, { text: `_ALIVEMSG_ *${newarg}* _olarak güncellendi_`});
					await reloadConfig();
					return;
				} else if (text.startsWith(`${prf}setvar_WORKTYPE`)) {
					if (!text.includes(' '))return;
					var newarg = text.replace(`${prf}setvar_WORKTYPE `, '');
					await updateValueInConfig(newarg, 'WORKTYPE');
					sock.sendMessage(message.key.remoteJid, { text: `_Worktype_ *${newarg}* _olarak güncellendi_`});
					await reloadConfig();
					return;
				} else if (text.startsWith(`${prf}setvar_SUDOUSER`)) {
					if (!text.includes(' '))return;
					var newarg = text.replace(`${prf}setvar_SUDOUSER `, '');
					await updateArrayInConfig(newarg, 'SUDOUSER');
					sock.sendMessage(message.key.remoteJid, { text: `_Sudo User_ *${newarg}* _olarak güncellendi_`});
					await reloadConfig();
					return;
				} else if (text.startsWith(`${prf}setvar_HANDLERS`)) {
					if (!text.includes(' '))return;
					var newarg = text.replace(`${prf}setvar_HANDLERS `, '');
					await updateArrayInConfig(newarg, 'HANDLERS');
					sock.sendMessage(message.key.remoteJid, { text: `_Handlers_ *${newarg}* _olarak güncellendi_`});
					await reloadConfig();
					return;
				} else if (text.startsWith(`${prf}getvar_`)) {
					var arg = text.replace(`${prf}getvar_`, '')
					console.log(arg);
					let msj =  '';
					switch (arg) {
						case 'SUDOUSER':
							msj = config.SUDOUSER;
							break;
						case 'HANDLERS':
							msj = config.HANDLERS;
							break;
						case 'ALIVEMSG':
							msj = config.ALIVEMSG;
							break;
						case 'WORKTYPE':
							msj = config.WORKTYPE;
							break;
						default:
							msj = 'Girilen argüman config dosyasında bulunamadı.';
					}
					sock.sendMessage(message.key.remoteJid, { text: `${msj}`});
				/* not supported update function*/
				} else if (text.startsWith(`${prf}update`)) {
						await gitins();
						await sock.sendMessage(message.key.remoteJid, { text: msj });
				} else if (text.startsWith(`${prf}liste`)) {
					await sock.sendMessage(
						message.key.remoteJid, 
						{ 
							audio: { url: "./assets/music.mp3" }, 
							mimetype: 'audio/mp4' 
						}
					);
				}
			}
		}
	}
};