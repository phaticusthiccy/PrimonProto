// Primon Proto
// Headless WebSocket, type-safe Whatsapp Bot
//
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can usable with mjs)
//
// Phaticusthiccy - 2022


import { Boom } from '@hapi/boom'
import P from 'pino'
import makeWASocket, { BufferJSON, AnyMessageContent, delay, DisconnectReason, makeInMemoryStore, fetchLatestBaileysVersion, initAuthCreds, AuthenticationCreds, AuthenticationState, SignalDataTypeMap, proto } from '@adiwajshing/baileys'

import { mkdir, readFile, stat, unlink, writeFile } from 'fs/promises'
import { join } from 'path'

export const useMultiFileAuthState = async(folder: string): Promise<{ state: AuthenticationState, saveCreds: () => Promise<void> }> => {

	const writeData = (data: any, file: string) => {
		return writeFile(join(folder, fixFileName(file)), JSON.stringify(data, BufferJSON.replacer))
	}

	const readData = async(file: string) => {
		try {
			const data = await readFile(join(folder, fixFileName(file)), { encoding: 'utf-8' })
			return JSON.parse(data, BufferJSON.reviver)
		} catch(error) {
			return null
		}
	}

	const removeData = async(file: string) => {
		try {
			await unlink(fixFileName(file))
		} catch{

		}
	}

	const folderInfo = await stat(folder).catch(() => { })
	if(folderInfo) {
		if(!folderInfo.isDirectory()) {
			throw new Error(`found something that is not a directory at ${folder}, either delete it or specify a different location`)
		}
	} else {
		await mkdir(folder, { recursive: true })
	}

	const fixFileName = (file?: string) => file?.replace(/\//g, '__')?.replace(/:/g, '-')

	const creds: AuthenticationCreds = await readData('creds.json') || initAuthCreds()

	return {
		state: {
			creds,
			keys: {
				get: async(type, ids) => {
					const data: { [_: string]: SignalDataTypeMap[typeof type] } = { }
					await Promise.all(
						ids.map(
							async id => {
								let value = await readData(`${type}-${id}.json`)
								if(type === 'app-state-sync-key' && value) {
									value = proto.AppStateSyncKeyData.fromObject(value)
								}

								data[id] = value
							}
						)
					)

					return data
				},
				set: async(data) => {
					const tasks: Promise<void>[] = []
					for(const category in data) {
						for(const id in data[category]) {
							const value = data[category][id]
							const file = `${category}-${id}.json`
							tasks.push(value ? writeData(value, file) : removeData(file))
						}
					}

					await Promise.all(tasks)
				}
			}
		},
		saveCreds: () => {
			return writeData(creds, 'creds.json')
		}
	}
}

import * as fs from "fs"
import * as readline from 'readline';
import chalk from "chalk";
import { Octokit } from "@octokit/core";
import axios from "axios"
import neko from "@phaticusthiccy/open-apis";
import { exec, spawn, execSync } from "child_process";
import rw from "./railway"
import shell from 'shelljs'

  var db = `{
    "author": "https://github.com/phaticusthiccy",
    "welcome": [],
    "welcome_media": [],
    "goodbye": [],
    "goodbye_media": [],
    "sudo": "",
    "super_sudo": [],
    "pmpermit": [],
    "pmpermit_media": {
      "type": "",
      "media": ""
    },
    "handler": ".!;/",
    "blocklist": [],
    "snip": [],
    "snip_media": [],
    "antiflood": [],
    "warn": [],
    "block_msg": "",
    "bloc_msg_media": {
      "type": "",
      "media": ""
    },
    "unblock_msg": "",
    "unblock_msg_media": {
      "type": "",
      "media": ""
    },
    "ban_msg": "",
    "ban_msg_media": {
      "type": "",
      "media": ""
    },
    "mute_msg": "",
    "mute_msg_media": {
      "type": "",
      "media": ""
    },
    "unmute_msg": "",
    "unmute_msg_media": {
      "type": "",
      "media": ""
    },
    "warncount": [],
    "language": "",
    "debug": false,
    "afk": { 
      "status": false, 
      "message": "I am AFK Now! \\nLastseen: {lastseen}"
    },
    "afk_media": {
      "type": "",
      "media": ""
    },
    "filter": [],
    "filter_media": [],
    "global_filter": [],
    "global_filter_media": [],
    "alive_msg": "",
    "alive_msg_media": {
      "type": "",
      "media": ""
    },
    "db_url": "",
    "token_key": "",
    "lang_json": false
  }

`

// media [object]
// {
//     "type": "",
//     "media": ""
// }
//
// 
// media [array]
// {
//     "type": "",
//     "media": "",
//     "jid": ""
// }
//
//
// filter_media [object]
// {
//     "type": "",
//     "media": "",
//     "jid": "",
//     "trigger": ""
// }
//
//
// handler[string]
// [".", "!", "/", ";"]
// Info: Primon's handlers
//
//
// lang_json[string]
// "{ "STRINGS": { "menu": { "menu": "Command List", "owner": "Developer"}}... }
// Info: Configurational language data. Default: false? bool
//
//
// welcome [jid: string, message: string]
// [
//   {
//     "jid": "1111@(s || g.us).whatsapp.net",
//     "message": "Welcome the Group! {gpp}"
//   }
// ]
// Info: Stores the welcome messages and groups
//
//
// goodbye [jid: string, message: string]
// [
//   {
//     "jid": "1111@(s || g.us).whatsapp.net",
//     "message": "Goodbye the {gname}.."
//   }
// ]
// Info: Stores the goodbye messages and groups
//
//
// blocklist [any]
// ["xxxx@s.whatsapp.net", "yyyy@g.us"],
// Info: Stores the blocklist groups (Primon will not work these groups)
//
//
// antiflood [jid: string, message: string, type: string]
// [
//   {
//     "jid": "1111@(s || g.us).whatsapp.net",
//     "message": "Dont Make-Flood!",
//     "type": "ban || warn || mute"
//   }
// ]
// Info: Stores the anti-flood data for groups or private messages. 
//
//
// warncount [jid: string]
// [
//   {
//     "jid": "1111@g.us",
//     "count": 3
//   }
// ]
// Info: Stroes the groups warn counts (Diffrent for every setted group)
//
//
// warn [jid: string, type: string, count: number]
// [
//   {
//     "jid: "xxxx@s.whatsapp.net",
//     "count": 1,
//     "reasons": ["Dont Flood"]
//   }
// ]
// group?.type: "delete || deleteAll"
// Info: Stroes the users warn status.
//
//
// snip [note: string]
// [
//   {
//     "snip": "$test",
//     "message": "If ı wrote $test, Primon will send this message."
//   }
// ]
// Info: Stores the user's saved snippets. Can call with starting "$"
//
//
// afk [type: true | false, message: string]
// [
//   {
//     "status": true || false,
//     "message": "I am AFK Now! \nLastseen: {lastseen}"
//   }
// ]
// Info: Stores the AFK status (Away From Keyboard)
// lastseen?: Last seen via second type. 120 = 2min, 621 ≂ 10min
//
//
// filter [jid: string]
// [
//   {
//     "jid": "1111@(s || g.us).whatsapp.net",
//     "trigger": "hi",
//     "message": "Hello!"
//   }
// ]
// Info: Stores the filters (For every setted groups)
//
//
// global_filter [jid: string]
// [
//   {
//     "trigger": "hi",
//     "message": "Hello!"
//   }
// ]
// Info: Stores the global filters, which they can works with all groups. (Just a filter but for every chat)
//
//
// pm [jid: string, message]
// [
//   {
//     "jid": "1111@(s || us).whatsapp.net",
//     "approved": ["xxxx@s.whatsapp.net", "yyyy@s.whatsapp.net"],
//     "disapproved": ["xxxx@s.whatsapp.net", "yyyy@s.whatsapp.net"],
//     "message": "This is a PM-Permit! Wait for the my owner comes here.."
//   }
// ]
// Info: Stores the pm-permit data
//
//
// sudo [any]
// ["xxxx@s.whatsapp.net", "yyyy@s.whatsapp.net"]
// Info: Stores the SUDO numbers. They can use the bot (not including ban, kickme etc.)
//
// super_sudo[any]
// ["xxxx@s.whatsapp.net", "yyyy@s.whatsapp.net"]
// Info: Just like a sudo. Only diffrance, super SUDO users can use the Primon with all access. (including ban etc..)
//
//


var pmsg = `

┌─────────────────────────────────┬──────────┐
│ ${chalk.cyan("Primon Proto - Whatsapp Userbot")} │ Versiyon │
├─────────────────────────────────┼──────────┤
│ ${chalk.cyan("Railway Otomatik Deploy")}         │      1.0 │
└─────────────────────────────────┴──────────┘


`
var penmsg = `

┌─────────────────────────────────┬─────────┐
│ ${chalk.cyan("Primon Proto - Whatsapp Userbot")} │ Version │
├─────────────────────────────────┼─────────┤
│ ${chalk.cyan("Railway Auto Deploy")}             │     1.0 │
└─────────────────────────────────┴─────────┘


`
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// octokit.request('GET /gists/{gist_id}', {
//   gist_id: 'id'
// }).then(async (j) => { console.log( JSON.parse(j.data.files["primon.db.json"].content))})



/*
const octokit = new Octokit({
  auth: ""
})

octokit.request('POST /gists', {
  description: "Primon Proto için Kalıcı Veritabanı",
  files: {
    key: {
      content: db,
      filename: "primon.db.json"
    }
  },
  public: false
}).then(async (res) => {
  console.log(JSON.parse(res.data.files["primon.db.json"].content))
})
*/

try {
  fs.unlinkSync("./auth_info_multi.json")
} catch { }
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var token, st, qst, FIRST_TIMESTEP;
var lang = ""
var anahtar = ""

async function MAIN() {

  if (fs.existsSync("./break_session.txt")) {
    if (fs.readFileSync("./lang.txt").toString() == "TR" || fs.readFileSync("./lang.txt").toString() == "TR\n") {
      return await after_s_tr()
    }
    if (fs.readFileSync("./lang.txt").toString() == "EN" || fs.readFileSync("./lang.txt").toString() == "EN\n") {
      return await after_s_en()
    }
  }
  if (fs.existsSync("./break.txt")) {
    if (fs.readFileSync("./lang.txt").toString() == "TR" || fs.readFileSync("./lang.txt").toString() == "TR\n") {
      return await after_tr()
    }
    if (fs.readFileSync("./lang.txt").toString() == "EN" || fs.readFileSync("./lang.txt").toString() == "EN\n") {
      return await after_en()
    }
  }

  rl.question(chalk.blue("Select A Language \n\n") + chalk.yellow("[1]") + " :: Türkçe \n" + chalk.yellow("[2]") + " :: English\n\n>>> ", async (answer) => {
    FIRST_TIMESTEP = new Date().getTime()
    fs.writeFileSync("./time.txt", FIRST_TIMESTEP.toString())
    if (answer == 1) {
      console.log(chalk.green("Türkçe Dili Seçildi!"))
      lang == "TR"
      fs.writeFileSync("./lang.txt", "TR")
      await delay(3000)
      console.clear()
      await delay(400)
      rl.question(chalk.blue("\n\nNe Yapmak İstiyorsunuz? \n\n") + chalk.yellow("[1]") + " :: Session Yenileme\n" + chalk.yellow("[2]") + " :: Bot Kurma" + "\n\n1) Session yenileme işlemi, yavaş çalışan botu hızlandırmak veya çıkış yapılan botu veri kaybı olmadan geri getirmek için kullanılır.\n>>> ", async (answer2) => {
        if (answer2 == 1) {
          console.log(chalk.green("Session Yenileme Seçildi!"))
          await delay(3000)
          console.clear()
          console.log(pmsg)
          await delay(1500)
          console.log(chalk.green("Lütfen Veritabanı Kodunu giriniz."))
          await delay(1500)
          console.log(chalk.green("Bunu railway üzerindeki uygulamanızın") + chalk.yellow(" Variables ") + chalk.green("kısmından ") + chalk.yellow("GITHUB_DB ") + chalk.green("bölümünü görebilirsiniz."))
          await delay(1500)
          console.log(chalk.green("Bunu yapamıyorsanız, lütfen daha önceden kurmuş olduğunuz botun, kendi numaranıza göndermiş olduğu mesajı kontrol edin. ") + chalk.yellow("Veritabanı") + chalk.green(" ismindeki kodu ekrana yapıştırın. \n\n"))
          await delay(1500)
          rl.question(chalk.blue("Anahtarı Girin :: "), async (a1) => {
            anahtar = a1
            console.log(chalk.yellow("\n\nTeşekkürler"))
            await delay(3000)
            console.clear()
            console.log(pmsg)
            await delay(1500)
            console.log(chalk.green("Lütfen Token Kodunu giriniz."))
            await delay(1500)
            console.log(chalk.green("Bunu railway üzerindeki uygulamanızın") + chalk.yellow(" Variables ") + chalk.green("kısmından ") + chalk.yellow("GITHUB_AUTH ") + chalk.green("bölümünü görebilirsiniz."))
            await delay(1500)
            console.log(chalk.green("Bunu yapamıyorsanız, lütfen daha önceden kurmuş olduğunuz botun, kendi numaranıza göndermiş olduğu mesajı kontrol edin. ") + chalk.yellow("Token") + chalk.green(" ismindeki kodu ekrana yapıştırın. \n\n"))
            await delay(1500)
            rl.question(chalk.blue("Anahtarı Girin :: "), async (a2) => {
              token = a2
              console.log(chalk.yellow("\n\nTeşekkürler, lütfen biraz bekleyin. Girdiğiniz kodların geçerli olup olmadığını kontrol ediyorum.."))
              try {
                var test1 = new Octokit({ auth: token })
                await test1.request('GET /gists/{gist_id}', {
                  gist_id: anahtar
                })
              } catch {
                console.clear()
                console.log(chalk.red("\n\nÜzgünüm, girdiğniz değeler doğru değil. Lütfen tekrar kontrol ediniz."))
                process.exit()
              }
              console.log(chalk.green("\n\nGirdiğiniz Bilgiler Doğru!"))
              await delay(1500)
              var octokit = new Octokit({ auth: token })
              console.log(chalk.green("Şimdi ise WhatsApp uygulmanızı açın ve 'Bağlı Cihazlar' kısmına tıklayın."))
              await delay(1500)
              console.log(chalk.green("\n\nArdından 'Çoklu Cihaz' programını aktif edin."))
              await delay(1500)
              console.log(chalk.green("\n\nBunları yaptıktan sonra lütfen enter tuşuna basın."))
              await delay(1500)
              rl.question("\n\n[Enter Tuşuna Bas]", async (answer7) => {
                console.clear()
                console.log(pmsg)
                await delay(1500)
                console.log(chalk.green("Şimdi ise ekrana gelecek QR kodunu okutun."))
                await delay(2800)
                console.log(chalk.red("QR Okuttuktun Sonra Lütfen Sistemi Tekrar Çalıştırın!"))
                await delay(5000)
                console.clear()
                var prpc = await PRIMON_PROTO6()
                await delay(200000)
                await after()
              })
            })
          })
        } else if (answer2 == 2) {
          console.log(chalk.green("Bot Kurma Seçildi!"))
          await delay(3000)
          console.clear()
          console.log(pmsg)
          await delay(1500)
          console.log(chalk.green("İlk önce bir github hesabınız yoksa https://github.com adresine tıklayıp yeni bir hesap açın. Ardından mail adresinize e-posta ile hesabınızı onaylayın. Bu işlemi yaptıktan sonra enter tuşuna basıp devam ediniz.\n\n"))
          rl.question("[Enter Tuşuna Bas]", async (answer3) => {
            console.clear()
            console.log(pmsg)
            await delay(1500)
            console.log(chalk.green("Hesap açtıktan sonra mail onayı için https://github.com/settings/emails bu adrese gidin ve 'Resend verification email' yazısına basın. Ardından mailinizi kontol edin. Bunları hali hazırda yapmış iseniz veya devam etmek için lütfen enter tuşuna basınız.\n\n"))
            rl.question("[Enter Tuşuna Bas]", async (answer4) => {
              console.clear()
              console.log(pmsg)
              await delay(1500)
              console.log(chalk.green("Hesabınız onaylandığına göre şimdi token alalım. \n\n"))
              await delay(3000)
              console.log(chalk.green("Lütfen https://github.com/settings/tokens bu adrese gidin ve 'Personal access tokens' yazan kısıma basın. Bu işlemi yaptıktan sonra enter tuşuna basın.\n\n"))
              rl.question("[Enter Tuşuna Bas]", async (answer5) => {
                console.clear()
                console.log(pmsg)
                await delay(1500)
                console.log(chalk.green("Burda ise 'Generate New Token' butonuna tıklayın.\n\n"))
                await delay(3000)
                console.log(chalk.green("Ve ayarlarımız şu şekide olsun: \n\nNOTE: Primon \n\nExpiration: No expiration\n\nDaha sonra ise aşağıda 'repo' ve 'gist' yazan kutucuğu işaretleyin.\n\n"))
                await delay(3000)
                console.log(chalk.green("Son olarak aşağıdaki 'Generate token' butonuna basın. Karşınıza gelecek anahtarı kopyalayın! İşlem bitene kadar bu anahtarı kaybetmeyin! Kopyaladıktan sonra ise ekrana gelecek giriş bölümüne yapıştırın.\n\n"))
                rl.question(chalk.blue("Anahtarı Girin :: "), async (answer6) => {
                  token = answer6
                  console.log(chalk.yellow("\n\nTeşekkürler, lütfen biraz bekleyin. Girdiğiniz kodların geçerli olup olmadığını kontrol ediyorum.."))
                  try {
                    var test1 = new Octokit({ auth: token })
                    var res = await test1.request('POST /gists', {
                      description: "Primon Auth Test",
                      files: {
                        key: {
                          content: "true",
                          filename: "primon.auth"
                        }
                      },
                      public: false
                    })
                  } catch {
                    console.clear()
                    console.log(chalk.red("\n\nÜzgünüm, girdiğniz değeler doğru değil. Lütfen tekrar kontrol ediniz."))
                    process.exit()
                  }
                  console.log(chalk.green("\n\nGirdiğiniz Bilgiler Doğru!"))
                  await delay(1500)
                  fs.writeFileSync("./gh_auth.txt", token)
                  var octokit = new Octokit({ auth: token })
                  var t1 = new Date().getTime()
                  await octokit.request('GET /gists/{gist_id}', {
                    gist_id: res.data.id
                  })
                  var t2 = new Date().getTime()
                  var t3 = Number(t2) - Number(t1)
                  t3 = Math.floor(t3 / 4)
                  await octokit.request('DELETE /gists/{gist_id}', {
                    gist_id: res.data.id
                  })
                  console.log(chalk.green("\n\nVeritabanı Oluşturuluyor..\n\n"))
                  var res = await octokit.request('POST /gists', {
                    description: "Primon Proto için Kalıcı Veritabanı",
                    files: {
                      key: {
                        content: db,
                        filename: "primon.db.json"
                      }
                    },
                    public: false
                  })
                  var jsoner = JSON.parse(res.data.files["primon.db.json"].content)
                  jsoner.db_url = res.data.id
                  fs.writeFileSync("./gb_db.txt", res.data.id)
                  jsoner.token_key = token
                  jsoner.alive_msg = "_Primon Proto Çalışıyor!_\n\n_Versiyon: {version}_\n_Sahibim:_ {name}_"
                  jsoner.ban_msg = "{user} *Adlı kullanıcı gruptan banlandı!*"
                  jsoner.block_msg = "{user} *Adlı kullanıcı bloke edildi!*"
                  jsoner.unblock_msg = "{user} Adlı kullanıcının blokesi kaldırıldı!*"
                  jsoner.mute_msg = "*Grup {time} süreyle sessize alındı!*"
                  jsoner.unmute_msg = "*Pekala, tekrardan konuşabilirler.*"
                  jsoner.afk.message = "*Bip Bop 🤖* \nBu bir bot. Sahibim şuan burda değil. Bunu sahibime ilettim. En kısa zamanda dönüş yapacaktır.\n\n*Son Görülme:* {lastseen}\n*Sebep:* {reason}"
                  jsoner.language = "TR"
                  var fin = JSON.stringify(jsoner, null, 2)
                  await octokit.request('PATCH /gists/{gist_id}', {
                    gist_id: jsoner.db_url,
                    description: "Primon Proto için Kalıcı Veritabanı",
                    files: {
                      key: {
                        content: fin,
                        filename: "primon.db.json",
                      },
                    }
                  })

                  var step = Number(t2) - Number(t1)
                  console.log(chalk.green("Veritabanı Oluşturuldu! \nDatabase Hızı: " + t3 + "ms\n\n"))
                  await delay(5000)
                  console.clear()
                  console.log(pmsg)
                  await delay(1500)
                  console.log(chalk.green("Şimdi ise WhatsApp uygulmanızı açın ve 'Bağlı Cihazlar' kısmına tıklayın."))
                  await delay(1500)
                  console.log(chalk.green("\n\nArdından 'Çoklu Cihaz' programını aktif edin."))
                  await delay(1500)
                  console.log(chalk.green("\n\nBunları yaptıktan sonra lütfen enter tuşuna basın."))
                  await delay(1500)
                  rl.question("\n\n[Enter Tuşuna Bas]", async (answer7) => {
                    console.clear()
                    console.log(pmsg)
                    await delay(1500)
                    console.log(chalk.green("Şimdi ise ekrana gelecek QR kodunu okutun."))
                    await delay(2800)
                    console.log(chalk.red("QR Okuttuktun Sonra Lütfen Sistemi Tekrar Çalıştırın!"))
                    await delay(5000)
                    console.clear()
                    var prpc = await PRIMON_PROTO2()
                    await delay(200000)
                    await after()
                  })
                })
              })
            })
          })
        } else {
          console.log(chalk.red("Sadece 1 veya 2 Yazın!"))
          process.exit()
        }
      })
    } else if (answer == 2) {
      console.log(chalk.green("English Language Selected!"))
      lang == "TR"
      fs.writeFileSync("./lang.txt", "TR")
      await delay(3000)
      console.clear()
      await delay(400)
      rl.question(chalk.blue("\n\nWhat do you want to do? \n\n") + chalk.yellow("[1]") + " :: Session Renewal\n" + chalk.yellow("[2]") + " :: Setup Bot" + "\n\n1) Session refresh is used to speed up a slow bot or to restore a logged out bot without data loss.\n>>> ", async (answer2) => {
        if (answer2 == 1) {
          console.log(chalk.green("Session Renewal Selected!"))
          await delay(3000)
          console.clear()
          console.log(penmsg)
          await delay(1500)
          console.log(chalk.green("Please enter the Database Code."))
          await delay(1500)
          console.log(chalk.green("You can see this in the") + chalk.yellow(" Variables ") + chalk.green("section of your application on the railway, in the") + chalk.yellow(" GITHUB_DB ") + chalk.green("section."))
          await delay(1500)
          console.log(chalk.green("If you can't do this, please check the message that the bot you have previously set up has sent to your own number.\n\n"))
          rl.question(chalk.blue("Enter Key :: "), async (a1) => {
            anahtar = a1
            console.log(chalk.yellow("\n\nThank you!"))
            await delay(3000)
            console.clear()
            console.log(penmsg)
            await delay(1500)
            console.log(chalk.green("Please enter the Token Code."))
            await delay(1500)
            console.log(chalk.green("You can see this in the") + chalk.yellow(" Variables ") + chalk.green("section of your application on the railway, in the") + chalk.yellow(" GITHUB_AUTH ") + chalk.green("section."))
            await delay(1500)
            console.log(chalk.green("If you can't do this, please check the message that the bot you have previously set up has sent to your own number.\n\n"))
            rl.question(chalk.blue("Enter Key :: "), async (a2) => {
              token = a2
              console.log(chalk.yellow("\n\nThank you, please wait a moment. Checking if the codes you entered are valid.."))
              try {
                var test1 = new Octokit({ auth: token })
                await test1.request('GET /gists/{gist_id}', {
                  gist_id: anahtar
                })
              } catch {
                console.clear()
                console.log(chalk.red("\n\nSorry, the value you entered is not correct. Please check again."))
                process.exit()
              }
              console.log(chalk.green("\n\nThe Information You Entered Is Correct!"))
              await delay(1500)
              var octokit = new Octokit({ auth: token })
              console.log(chalk.green("Now open your WhatsApp application and click on 'Connected Devices'."))
              await delay(1500)
              console.log(chalk.green("\n\nThen activate the 'Multi-Device' program."))
              await delay(1500)
              console.log(chalk.green("\n\nAfter doing these, please press enter."))
              await delay(1500)
              rl.question("\n\n[Press Enter Key]", async (answer7) => {
                console.clear()
                console.log(penmsg)
                await delay(1500)
                console.log(chalk.green("Now read the QR code that will appear on the screen.."))
                await delay(2800)
                console.log(chalk.red("\n\nPlease Restart the System After Scanning the QR!"))
                await delay(5000)
                console.clear()
                var prpc = await PRIMON_PROTO9()
                await delay(200000)
                await after()
              })
            })
          })
        } else if (answer2 == 2) {
          console.log(chalk.green("Bot Setup Selected!"))
          await delay(3000)
          console.clear()
          console.log(penmsg)
          await delay(1500)
          console.log(chalk.green("First, if you don't have a github account, click https://github.com and create a new one. Then confirm your account by e-mail to your e-mail address. After doing this, press enter and continue.\n\n"))
          rl.question("[Press Enter Key]", async (answer3) => {
            console.clear()
            console.log(penmsg)
            await delay(1500)
            console.log(chalk.green("After creating an account, go to https://github.com/settings/emails for mail confirmation and press 'Resend verification email'. Then check your mail. If you have already done these or please press enter to continue.\n\n"))
            rl.question("[Press Enter Key]", async (answer4) => {
              console.clear()
              console.log(penmsg)
              await delay(1500)
              console.log(chalk.green("Now that your account has been approved, let's get tokens. \n\n"))
              await delay(3000)
              console.log(chalk.green("Please go to https://github.com/settings/tokens and press 'Personal access tokens'. After doing this, press the enter key.\n\n"))
              rl.question("[Press Enter Key]", async (answer5) => {
                console.clear()
                console.log(penmsg)
                await delay(1500)
                console.log(chalk.green("Here, click the 'Generate New Token' button.\n\n"))
                await delay(3000)
                console.log(chalk.green("And our settings are as follows: \n\nNOTE: Primon \n\nExpiration: No expiration\n\nThen check the box that says 'repo' and 'gist' below.\n\n"))
                await delay(3000)
                console.log(chalk.green("Finally, press the 'Generate token' button below. Copy the key that will appear in front of you! Do not lose this key until the process is finished! After copying, paste it into the input section that will appear on the screen..\n\n"))
                rl.question(chalk.blue("Enter Key :: "), async (answer6) => {
                  token = answer6
                  console.log(chalk.yellow("\n\nThank you, please wait a moment. Checking if the codes you entered are valid.."))
                  try {
                    var test1 = new Octokit({ auth: token })
                    var res = await test1.request('POST /gists', {
                      description: "Primon Auth Test",
                      files: {
                        key: {
                          content: "true",
                          filename: "primon.auth"
                        }
                      },
                      public: false
                    })
                  } catch {
                    console.clear()
                    console.log(chalk.red("\n\nSorry, the value you entered is not correct. Please check again."))
                    process.exit()
                  }
                  console.log(chalk.green("\n\nThe Information You Entered Is Correct!"))
                  await delay(1500)
                  fs.writeFileSync("./gh_auth.txt", token)
                  var octokit = new Octokit({ auth: token })
                  var t1 = new Date().getTime()
                  await octokit.request('GET /gists/{gist_id}', {
                    gist_id: res.data.id
                  })
                  var t2 = new Date().getTime()
                  var t3 = Number(t2) - Number(t1)
                  t3 = Math.floor(t3 / 4)
                  await octokit.request('DELETE /gists/{gist_id}', {
                    gist_id: res.data.id
                  })
                  console.log(chalk.green("\n\nCreating Database..\n\n"))
                  var res = await octokit.request('POST /gists', {
                    description: "Persistent Database for Primon Proto",
                    files: {
                      key: {
                        content: db,
                        filename: "primon.db.json"
                      }
                    },
                    public: false
                  })
                  var jsoner = JSON.parse(res.data.files["primon.db.json"].content)
                  jsoner.db_url = res.data.id
                  fs.writeFileSync("./gb_db.txt", res.data.id)
                  jsoner.token_key = token
                  jsoner.afk.message = "*Bip Bop 🤖* \nThis is a bot. My owner is not here right now. I told this to my owner. It will be returned as soon as possible.\n\n*Last Seen:* {lastseen}\n*Reason:* {reason}"
                  jsoner.alive_msg = "_Primon Proto Alive!_\n\n_Version: {version}_\n_Owner:_ {name}_"
                  jsoner.ban_msg = "*Banned* {user} f*rom this group!*"
                  jsoner.block_msg = "*Blocked* {user}! *Now you can't able to send message to me!*"
                  jsoner.unblock_msg = "*Unblocked {user}! *You can send messages to me.*"
                  jsoner.mute_msg = "*Grop chat muted for {time}!*"
                  jsoner.unmute_msg = "*Well, they can talk again.*"
                  jsoner.language = "EN"
                  var fin = JSON.stringify(jsoner, null, 2)
                  await octokit.request('PATCH /gists/{gist_id}', {
                    gist_id: jsoner.db_url,
                    description: "Persistent Database for Primon Proto",
                    files: {
                      key: {
                        content: fin,
                        filename: "primon.db.json",
                      },
                    }
                  })

                  var step = Number(t2) - Number(t1)
                  console.log(chalk.green("Database Created! \n\nDatabase Speed: " + t3 + "ms\n\n"))
                  await delay(5000)
                  console.clear()
                  console.log(penmsg)
                  await delay(1500)
                  console.log(chalk.green("Now open your WhatsApp application and click on 'Connected Devices'."))
                  await delay(1500)
                  console.log(chalk.green("\n\nThen activate the 'Multi-Device' program."))
                  await delay(1500)
                  console.log(chalk.green("\n\nAfter doing these, please press enter."))
                  await delay(1500)
                  rl.question("\n\n[Press Enter Key]", async (answer7) => {
                    console.clear()
                    console.log(penmsg)
                    await delay(1500)
                    console.log(chalk.green("Now read the QR code that will appear on the screen."))
                    await delay(2800)
                    console.log(chalk.red("After scanned the QR, please run the system again!"))
                    await delay(5000)
                    console.clear()
                    var prpc = await PRIMON_PROTO4()
                    await delay(200000)
                    await after()
                  })
                })
              })
            })
          })
        } else {
          console.log(chalk.red("Just Write 1 or 2!"))
          process.exit()
        }
      })
    } else {
      console.log("Please, Type Only 1 or 2!")
      process.exit()
    }
  });
}


async function after_tr() {
  if (!fs.existsSync("./cont.txt")) {
    var octokit = new Octokit({ auth: fs.readFileSync("./gh_auth.txt").toString() })
    var jsoner = await octokit.request('GET /gists/{gist_id}', {
      gist_id: fs.readFileSync("./gb_db.txt").toString()
    })
    var fin = JSON.parse(jsoner.data.files["primon.db.json"].content)
    fin.sudo = ""
    var tsudo = ""
    try {
      var sd = fs.readFileSync("./sudo.txt").toString()
      tsudo = sd.split(":")[0] + "@s.whatsapp.net"
    } catch {
      var sd = fs.readFileSync("./sudo.txt").toString()
      tsudo = sd.split("@")[0] + "@s.whatsapp.net"
    }
    fin.sudo = tsudo
    fin = JSON.stringify(fin, null, 2)
    await octokit.request('PATCH /gists/{gist_id}', {
      gist_id: fs.readFileSync("./gb_db.txt").toString(),
      description: "Primon Proto için Kalıcı Veritabanı",
      files: {
        key: {
          content: fin,
          filename: "primon.db.json",
        },
      }
    })
    console.clear()
    console.log(pmsg)
    await delay(1500)
    console.log(chalk.green("QR Okutma İşlemi Başarılı!"))
    await delay(1500)
    console.log(chalk.green("\n\nŞimdi ise tek bir adım kaldı."))
    await delay(3000)
    console.log(chalk.green("\n\nLütfen aşağıda çıkacak olan bağlantı ile Railway hesabınıza giriş yapın. Bu işlem otomatik olarak app oluşturacaktır."))
    await delay(5000)
    console.clear()
    console.log(pmsg)
    const command = exec("bash wb.sh")
    command.stdout.on('data', output => {
      console.log(output.toString())
    })
    command.stdout.on("end", async () => {
      console.log(chalk.green("Railway Hesabına Giriş Yapıldı!"))
      await delay(1500)
      console.clear()
      console.log(pmsg)
      await delay(1500)
      console.log(chalk.green("Lütfen https://railway.app/new bu adrese gidip ") + chalk.yellow("Empty project ") + chalk.green("butonuna tıklayın. Ardından enter tuşuna basın. Daha sonra gelen ekranda ortadaki") + chalk.yellow(' Add Servive ') + chalk.green("kısmına tıklayp tekrar") + chalk.yellow(" Empty Service ") + chalk.green("bölümüne basalım."))
      rl.question("\n\n[Enter Tuşuna Bas]", async () => {
        console.clear()
        console.log(pmsg)
        await delay(1500)
        console.log(chalk.green("Şimdi ise 'Setting' kısmından 'Project ID' yazan kodu kopyalayın ve buraya yapıştırın."))
        rl.question("\n\nAnahtarı Girin :: ", async (proj) => {
          console.clear()
          console.log(pmsg)
          await delay(1500)
          console.log(chalk.green("Uygulama Oluşturuluyor.."))
          if (fs.existsSync("./PrimonProto")) {
            fs.rmSync("./PrimonProto", { recursive: true, force: true });
          }
          var sh1 = shell.exec('git clone https://github.com/phaticusthiccy/PrimonProto')
          var sh3 = shell.exec("bash wb3.sh")
          var prj = shell.exec("cd PrimonProto && node railway.js link " + proj)
          var sh4 = shell.exec("cd PrimonProto/ && node railway.js variables set GITHUB_DB=" + fs.readFileSync("./gb_db.txt").toString())
          var sh5 = shell.exec("cd PrimonProto/ && node railway.js variables set GITHUB_AUTH=" + fs.readFileSync("./gh_auth.txt").toString())
          var tkn = fs.readFileSync("./break.txt").toString().match(/.{10,9000}/g)
          if (tkn.length > 4) {
            if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
            if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
            if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
            if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
            if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
          }
          if (tkn.length < 4) {
            tkn = fs.readFileSync("./break.txt").toString().match(/.{10,7000}/g)
            if (tkn.length < 4) {
              tkn = fs.readFileSync("./break.txt").toString().match(/.{10,5000}/g)
              if (tkn.length > 4) {
                if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
                if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
                if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
                if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
                if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
              }
            } else {
              if (tkn.length !== 4) {
                if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
                if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
                if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
                if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
                if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
              }
            }
          }
          if (tkn[3] == undefined || tkn[3] == "undefined") {
            tkn[3] = ""
          }
          shell.exec("cd PrimonProto/ && node railway.js variables set SESSION=" + tkn[0])
          shell.exec("cd PrimonProto/ && node railway.js variables set SESSION2=" + tkn[1])
          shell.exec("cd PrimonProto/ && node railway.js variables set SESSION3=" + tkn[2])
          shell.exec("cd PrimonProto/ && node railway.js variables set SESSION4=" + tkn[3])
          shell.exec("cd PrimonProto/ && node railway.js variables set SESSION5=" + fs.readFileSync("./session5"))
          await delay(1500)
          console.clear()
          console.log(pmsg)
          console.log(chalk.green("Uygulama Oluşturuldu!"))
          await delay(1500)
          console.log(chalk.green("Depo, Railway Adresine Aktarılıyor.."))
          await delay(1500)
          console.clear()
          console.log(pmsg)
          var sh7 = shell.exec("cd PrimonProto/ && yes n | node railway.js up")
          await delay(1500)
          console.clear()
          console.log(pmsg)
          console.log(chalk.green("Başarıyla Aktarıldı!\n\n"))
          await delay(1500)
          console.log(chalk.yellow("Primon Proto Kullandığınız İçin Teşekkürler!\n"))
          await delay(1500)
          console.log(chalk.green("Lütfen ") + chalk.blue("https://railway.app/project/" + proj) + chalk.green(" linkini kontrol ediniz.\n"))
          await delay(1500)
          var tst = new Date().getTime()
          var fins = (tst - (Number(fs.readFileSync("./time.txt").toString())) - 102000) / 1000
          console.log(chalk.green("Primon'u ") + chalk.yellow(fins) + chalk.green(" saniye sürede kurdunuz."))
          shell.exec("rm -rf ./session")
          try {
            fs.unlinkSync("./auth_info_multi.json")
          } catch {
          }
          try {
            fs.unlinkSync("./gb_db.txt")
          } catch {
          }
          try {
            fs.unlinkSync("./time.txt")
          } catch {
          }
          try {
            fs.unlinkSync("./gh_auth.txt")
          } catch {
          }
          try {
            fs.unlinkSync("./break.txt")
          } catch {
          }
          try {
            fs.unlinkSync("./lang.txt")
          } catch {
          }
          try {
            fs.unlinkSync("./baileys_store_multi.json")
          } catch {
          }
          try {
            fs.unlinkSync("./session5")
          } catch {
          }
          try {
            fs.unlinkSync("./cont.txt")
          } catch {
          }
          try {
            fs.unlinkSync("./sudo.txt")
          } catch {
          }
          try {
            fs.unlinkSync("./break_session.txt")
          } catch {
          }
          process.exit()
        })
      })
    })
  } else {
    var octokit = new Octokit({ auth: fs.readFileSync("./gh_auth.txt").toString() })
    var jsoner = await octokit.request('GET /gists/{gist_id}', {
      gist_id: fs.readFileSync("./gb_db.txt").toString()
    })
    var fin = JSON.parse(jsoner.data.files["primon.db.json"].content)
    fin.sudo = ""
    var tsudo = ""
    try {
      var sd = fs.readFileSync("./sudo.txt").toString()
      tsudo = sd.split(":")[0] + "@s.whatsapp.net"
    } catch {
      var sd = fs.readFileSync("./sudo.txt").toString()
      tsudo = sd.split("@")[0] + "@s.whatsapp.net"
    }
    fin.sudo = tsudo
    fin = JSON.stringify(fin, null, 2)
    await octokit.request('PATCH /gists/{gist_id}', {
      gist_id: fs.readFileSync("./gb_db.txt").toString(),
      description: "Primon Proto için Kalıcı Veritabanı",
      files: {
        key: {
          content: fin,
          filename: "primon.db.json",
        },
      }
    })
    console.clear()
    console.log(pmsg)
    await delay(1500)
    console.log(chalk.green("Şimdi ise 'Setting' kısmından 'Project ID' yazan kodu kopyalayın ve buraya yapıştırın."))
    rl.question("\n\nAnahtarı Girin :: ", async (proj) => {
      console.clear()
      console.log(pmsg)
      await delay(1500)
      console.log(chalk.green("Uygulama Oluşturuluyor.."))
      if (fs.existsSync("./PrimonProto")) {
        fs.rmSync("./PrimonProto", { recursive: true, force: true });
      }
      var tkn = "";
      var tkn2 = fs.readFileSync("./break.txt")
      tkn = tkn2.toString()
      var sh1 = shell.exec('git clone https://github.com/phaticusthiccy/PrimonProto')
      var sh3 = shell.exec("bash wb3.sh")
      var prj = shell.exec("cd PrimonProto && node railway.js link " + proj)
      var sh4 = shell.exec("cd PrimonProto/ && node railway.js variables set GITHUB_DB=" + fs.readFileSync("./gb_db.txt").toString())
      var sh5 = shell.exec("cd PrimonProto/ && node railway.js variables set GITHUB_AUTH=" + fs.readFileSync("./gh_auth.txt").toString())
      var tkn = fs.readFileSync("./break.txt").toString().match(/.{10,9000}/g)
      if (tkn.length > 4) {
        if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
        if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
        if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
        if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
        if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
      }
      if (tkn.length < 4) {
        tkn = fs.readFileSync("./break.txt").toString().match(/.{10,7000}/g)
        if (tkn.length < 4) {
          tkn = fs.readFileSync("./break.txt").toString().match(/.{10,5000}/g)
          if (tkn.length > 4) {
            if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
            if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
            if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
            if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
            if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
          }
        } else {
          if (tkn.length !== 4) {
            if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
            if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
            if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
            if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
            if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
          }
        }
      }
      if (tkn[3] == undefined || tkn[3] == "undefined") {
        tkn[3] = ""
      }
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION=" + tkn[0])
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION2=" + tkn[1])
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION3=" + tkn[2])
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION4=" + tkn[3])
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION5=" + fs.readFileSync("./session5"))
      await delay(1500)
      console.clear()
      console.log(pmsg)
      console.log(chalk.green("Uygulama Oluşturuldu!"))
      await delay(1500)
      console.log(chalk.green("Depo, Railway Adresine Aktarılıyor.."))
      await delay(1500)
      console.clear()
      console.log(pmsg)
      var sh7 = shell.exec("cd PrimonProto/ && yes n | node railway.js up")
      await delay(1500)
      console.clear()
      console.log(pmsg)
      console.log(chalk.green("Başarıyla Aktarıldı!\n\n"))
      await delay(1500)
      console.log(chalk.yellow("Primon Proto Kullandığınız İçin Teşekkürler!"))
      await delay(1500)
      console.log(chalk.green("Lütfen ") + chalk.blue("https://railway.app/project/" + proj) + chalk.green(" linkini kontrol ediniz."))
      await delay(1500)
      var tst = new Date().getTime()
      var fins = ((tst - Number(fs.readFileSync("./time.txt").toString())) - 102000) / 1000
      console.log(chalk.green("Primon'u ") + chalk.yellow(fins) + chalk.green(" saniye sürede kurdunuz."))
      shell.exec("rm -rf ./session")
      try {
        fs.unlinkSync("./auth_info_multi.json")
      } catch {
      }
      try {
        fs.unlinkSync("./gb_db.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./gh_auth.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./break.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./time.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./lang.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./baileys_store_multi.json")
      } catch {
      }
      try {
        fs.unlinkSync("./cont.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./session5")
      } catch {
      }
      try {
        fs.unlinkSync("./sudo.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./break_session.txt")
      } catch {
      }
      process.exit()
    })
  }
}

async function after_en() {
  if (!fs.existsSync("./cont.txt")) {
    var octokit = new Octokit({ auth: fs.readFileSync("./gh_auth.txt").toString() })
    var jsoner = await octokit.request('GET /gists/{gist_id}', {
      gist_id: fs.readFileSync("./gb_db.txt").toString()
    })
    var fin = JSON.parse(jsoner.data.files["primon.db.json"].content)
    fin.sudo = ""
    var tsudo = ""
    try {
      var sd = fs.readFileSync("./sudo.txt").toString()
      tsudo = sd.split(":")[0] + "@s.whatsapp.net"
    } catch {
      var sd = fs.readFileSync("./sudo.txt").toString()
      tsudo = sd.split("@")[0] + "@s.whatsapp.net"
    }
    fin.sudo = tsudo
    fin = JSON.stringify(fin, null, 2)
    await octokit.request('PATCH /gists/{gist_id}', {
      gist_id: fs.readFileSync("./gb_db.txt").toString(),
      description: "Persistent Database for Primon Proto",
      files: {
        key: {
          content: fin,
          filename: "primon.db.json",
        },
      }
    })
    console.clear()
    console.log(penmsg)
    await delay(1500)
    console.log(chalk.green("QR Scanning Successful!"))
    await delay(1500)
    console.log(chalk.green("\n\nNow there is only one step left."))
    await delay(3000)
    console.log(chalk.green("\n\nPlease login to your Railway account with the link below. This action will automatically create the app."))
    await delay(5000)
    console.clear()
    console.log(penmsg)
    const command = exec("bash wb.sh")
    command.stdout.on('data', output => {
      console.log(output.toString())
    })
    command.stdout.on("end", async () => {
      console.log(chalk.green("Logged In Railway Account!"))
      await delay(1500)
      console.clear()
      console.log(penmsg)
      await delay(1500)
      console.log(chalk.green("Please go to this address https://railway.app/new and click ") + chalk.yellow("Empty project ") + chalk.green("button. Then press enter. On the next screen, click on the") + chalk.yellow('Add Servive') + chalk.green("section in the middle and press the") + chalk.yellow(" Empty Service ") + chalk.green("section again."))
      rl.question("\n\n[Press Enter Key]", async () => {
        console.clear()
        console.log(penmsg)
        await delay(1500)
        console.log(chalk.green("Now copy the code that says 'Project ID' from the 'Setting' section and paste it here."))
        rl.question("\n\nEnter Key :: ", async (proj) => {
          console.clear()
          console.log(penmsg)
          await delay(1500)
          console.log(chalk.green("Creating Application.."))
          if (fs.existsSync("./PrimonProto")) {
            fs.rmSync("./PrimonProto", { recursive: true, force: true });
          }
          var sh1 = shell.exec('git clone https://github.com/phaticusthiccy/PrimonProto')
          var sh3 = shell.exec("bash wb3.sh")
          var prj = shell.exec("cd PrimonProto && node railway.js link " + proj)
          var sh4 = shell.exec("cd PrimonProto/ && node railway.js variables set GITHUB_DB=" + fs.readFileSync("./gb_db.txt").toString())
          var sh5 = shell.exec("cd PrimonProto/ && node railway.js variables set GITHUB_AUTH=" + fs.readFileSync("./gh_auth.txt"))
          var tkn = fs.readFileSync("./break.txt").toString().match(/.{10,9000}/g)
          if (tkn.length > 4) {
            if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
            if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
            if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
            if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
            if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
          }
          if (tkn.length < 4) {
            tkn = fs.readFileSync("./break.txt").toString().match(/.{10,7000}/g)
            if (tkn.length < 4) {
              tkn = fs.readFileSync("./break.txt").toString().match(/.{10,5000}/g)
              if (tkn.length > 4) {
                if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
                if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
                if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
                if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
                if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
              }
            } else {
              if (tkn.length !== 4) {
                if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
                if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
                if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
                if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
                if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
              }
            }
          }
          if (tkn[3] == undefined || tkn[3] == "undefined") {
            tkn[3] = ""
          }
          shell.exec("cd PrimonProto/ && node railway.js variables set SESSION=" + tkn[0])
          shell.exec("cd PrimonProto/ && node railway.js variables set SESSION2=" + tkn[1])
          shell.exec("cd PrimonProto/ && node railway.js variables set SESSION3=" + tkn[2])
          shell.exec("cd PrimonProto/ && node railway.js variables set SESSION4=" + tkn[3])
          shell.exec("cd PrimonProto/ && node railway.js variables set SESSION5=" + fs.readFileSync("./session5"))
          await delay(1500)
          console.clear()
          console.log(penmsg)
          console.log(chalk.green("Application Created!"))
          await delay(1500)
          console.log(chalk.green("The Repo is Transferred to the Railway Address.."))
          await delay(1500)
          console.clear()
          console.log(penmsg)
          var sh7 = shell.exec("cd PrimonProto/ && yes n | node railway.js up")
          await delay(1500)
          console.clear()
          console.log(pmsg)
          console.log(chalk.green("Successfully Transferred!\n\n"))
          await delay(1500)
          console.log(chalk.yellow("Thanks For Using Primon Proto!"))
          await delay(1500)
          console.log(chalk.green("Please check the ") + chalk.blue("https://railway.app/project/" + proj))
          await delay(1500)
          var tst = new Date().getTime()
          var fins = ((tst - Number(fs.readFileSync("./time.txt").toString())) - 102000) / 1000
          console.log(chalk.green("Installed Primon within ") + chalk.yellow(fins) + chalk.green(" second"))
          shell.exec("rm -rf ./session")
          try {
            fs.unlinkSync("./auth_info_multi.json")
          } catch {
          }
          try {
            fs.unlinkSync("./gb_db.txt")
          } catch {
          }
          try {
            fs.unlinkSync("./gh_auth.txt")
          } catch {
          }
          try {
            fs.unlinkSync("./break.txt")
          } catch {
          }
          try {
            fs.unlinkSync("./lang.txt")
          } catch {
          }
          try {
            fs.unlinkSync("./time.txt")
          } catch {
          }
          try {
            fs.unlinkSync("./baileys_store_multi.json")
          } catch {
          }
          try {
            fs.unlinkSync("./cont.txt")
          } catch {
          }
          try {
            fs.unlinkSync("./sudo.txt")
          } catch {
          }
          try {
            fs.unlinkSync("./session5")
          } catch {
          }
          try {
            fs.unlinkSync("./break_session.txt")
          } catch {
          }
          process.exit()
        })
      })
    })
  } else {
    var octokit = new Octokit({ auth: fs.readFileSync("./gh_auth.txt").toString() })
    var jsoner = await octokit.request('GET /gists/{gist_id}', {
      gist_id: fs.readFileSync("./gb_db.txt").toString()
    })
    var fin = JSON.parse(jsoner.data.files["primon.db.json"].content)
    fin.sudo = ""
    var tsudo = ""
    try {
      var sd = fs.readFileSync("./sudo.txt").toString()
      tsudo = sd.split(":")[0] + "@s.whatsapp.net"
    } catch {
      var sd = fs.readFileSync("./sudo.txt").toString()
      tsudo = sd.split("@")[0] + "@s.whatsapp.net"
    }
    fin.sudo = tsudo
    fin = JSON.stringify(fin, null, 2)
    await octokit.request('PATCH /gists/{gist_id}', {
      gist_id: fs.readFileSync("./gb_db.txt").toString(),
      description: "Persistent Database for Primon Proto",
      files: {
        key: {
          content: fin,
          filename: "primon.db.json",
        },
      }
    })
    console.clear()
    console.log(pmsg)
    await delay(1500)
    console.log(chalk.green("Now copy the code that says 'Project ID' from the 'Setting' section and paste it here."))
    rl.question("\n\nEnter Key :: ", async (proj) => {
      console.clear()
      console.log(pmsg)
      await delay(1500)
      console.log(chalk.green("Creating Application.."))
      if (fs.existsSync("./PrimonProto")) {
        fs.rmSync("./PrimonProto", { recursive: true, force: true });
      }
      var sh1 = shell.exec('git clone https://github.com/phaticusthiccy/PrimonProto')
      var sh3 = shell.exec("bash wb3.sh")
      var prj = shell.exec("cd PrimonProto && node railway.js link " + proj)
      var sh4 = shell.exec("cd PrimonProto/ && node railway.js variables set GITHUB_DB=" + fs.readFileSync("./gb_db.txt").toString())
      var sh5 = shell.exec("cd PrimonProto/ && node railway.js variables set GITHUB_AUTH=" + fs.readFileSync("./gh_auth.txt"))
      var tkn = fs.readFileSync("./break.txt").toString().match(/.{10,9000}/g)
      if (tkn.length > 4) {
        if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
        if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
        if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
        if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
        if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
      }
      if (tkn.length < 4) {
        tkn = fs.readFileSync("./break.txt").toString().match(/.{10,7000}/g)
        if (tkn.length < 4) {
          tkn = fs.readFileSync("./break.txt").toString().match(/.{10,5000}/g)
          if (tkn.length > 4) {
            if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
            if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
            if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
            if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
            if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
          }
        } else {
          if (tkn.length !== 4) {
            if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
            if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
            if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
            if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
            if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
          }
        }
      }
      if (tkn[3] == undefined || tkn[3] == "undefined") {
        tkn[3] = ""
      }
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION=" + tkn[0])
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION2=" + tkn[1])
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION3=" + tkn[2])
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION4=" + tkn[3])
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION5=" + fs.readFileSync("./session5"))
      await delay(1500)
      console.clear()
      console.log(pmsg)
      console.log(chalk.green("Application Created!"))
      await delay(1500)
      console.log(chalk.green("The Repo is Transferred to the Railway Address.."))
      await delay(1500)
      console.clear()
      console.log(pmsg)
      var sh7 = shell.exec("cd PrimonProto/ && yes n | node railway.js up")
      await delay(1500)
      console.clear()
      console.log(pmsg)
      console.log(chalk.green("Transferred Successfully!\n\n"))
      await delay(1500)
      console.log(chalk.yellow("Thanks For Using Primon Proto!"))
      await delay(1500)
      console.log(chalk.green("Please check the ") + chalk.blue("https://railway.app/project/" + proj))
      await delay(1500)
      var tst = new Date().getTime()
      var fins = ((tst - Number(fs.readFileSync("./time.txt").toString())) - 102000) / 1000
      console.log(chalk.green("Installed Primon within ") + chalk.yellow(fins) + chalk.green(" second"))
      shell.exec("rm -rf ./session")
      try {
        fs.unlinkSync("./auth_info_multi.json")
      } catch {
      }
      try {
        fs.unlinkSync("./gb_db.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./gh_auth.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./break.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./time.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./lang.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./baileys_store_multi.json")
      } catch {
      }
      try {
        fs.unlinkSync("./cont.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./sudo.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./session5")
      } catch {
      }
      try {
        fs.unlinkSync("./break_session.txt")
      } catch {
      }
      process.exit()
    })
  }
}

async function after_s_tr() {
  console.clear()
  console.log(pmsg)
  await delay(1500)
  console.log(chalk.green("QR Kod Başarıyla Okutuldu!"))
  await delay(1500)
  console.log(chalk.green("Şimdi ise SESSION yenilemek için lütfen Railway hesabınıza giriş yapın. Az sonra giriş linki altta belirecek."))
  await delay(5000)
  console.clear()
  console.log(pmsg)
  const command = exec("bash wb.sh")
  command.stdout.on('data', output => {
    console.log(output.toString())
  })
  command.stdout.on("end", async () => {
    console.log(chalk.green("Railway Hesabına Giriş Yapıldı!"))
    await delay(1500)
    console.clear()
    console.log(pmsg)
    await delay(1500)
    console.log(chalk.green("Şimdi ise botun kurulu olduğu uygulamaya girin. Ardından 'Settings' kısmından 'Project ID' yazan kodu kopyalayın ve buraya yapıştırın."))
    rl.question("\n\nAnahtarı Girin :: ", async (proj) => {
      console.clear()
      console.log(pmsg)
      await delay(1500)
      shell.exec('rm -rf PrimonProto')
      var sh1 = shell.exec('git clone https://github.com/phaticusthiccy/PrimonProto')
      var sh3 = shell.exec("bash wb3.sh")
      var prj = shell.exec("cd PrimonProto && node railway.js link " + proj)
      var tkn = fs.readFileSync("./break_session.txt").toString().match(/.{10,9000}/g)
      if (tkn.length > 4) {
        if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
        if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
        if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
        if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
        if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
      }
      if (tkn.length < 4) {
        tkn = fs.readFileSync("./break_session.txt").toString().match(/.{10,7000}/g)
        if (tkn.length < 4) {
          tkn = fs.readFileSync("./break_session.txt").toString().match(/.{10,5000}/g)
          if (tkn.length > 4) {
            if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
            if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
            if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
            if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
            if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
          }
        } else {
          if (tkn.length !== 4) {
            if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
            if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
            if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
            if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
            if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
          }
        }
      }
      if (tkn[3] == undefined || tkn[3] == "undefined") {
        tkn[3] = ""
      }
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION=" + tkn[0])
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION2=" + tkn[1])
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION3=" + tkn[2])
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION4=" + tkn[3])
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION5=" + fs.readFileSync("./session5"))
      await delay(1500)
      console.clear()
      console.log(pmsg)
      var sh7 = shell.exec("cd PrimonProto/ && yes n | node railway.js up")
      await delay(1500)
      console.clear()
      console.log(pmsg)
      console.log(chalk.green("SESSION Yenilendi! Veri kaybı olmadan eski ayarlar geri getirildi.\n\n"))
      console.log(chalk.yellow("Primon Proto Kullandığınız İçin Teşekkürler!\n\n"))
      await delay(1500)
      console.log(chalk.green("Lütfen ") + chalk.blue("https://railway.app/project/" + proj) + chalk.green(" linkini kontrol ediniz."))
      shell.exec("rm -rf ./session")
      try {
        fs.unlinkSync("./auth_info_multi.json")
      } catch {
      }
      try {
        fs.unlinkSync("./gb_db.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./gh_auth.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./break.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./lang.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./baileys_store_multi.json")
      } catch {
      }
      try {
        fs.unlinkSync("./cont.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./time.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./sudo.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./session5")
      } catch {
      }
      try {
        fs.unlinkSync("./break_session.txt")
      } catch {
      }
      process.exit()
    })
  })
}

async function after_s_en() {
  console.clear()
  console.log(pmsg)
  await delay(1500)
  console.log(chalk.green("QR Code Read Successfully!"))
  await delay(1500)
  console.log(chalk.green("Now, please login to your Railway account to renew the SESSION. The login link will appear below."))
  await delay(5000)
  console.clear()
  console.log(pmsg)
  const command = exec("bash wb.sh")
  command.stdout.on('data', output => {
    console.log(output.toString())
  })
  command.stdout.on("end", async () => {
    console.log(chalk.green("Logged In Railway Account!"))
    await delay(1500)
    console.clear()
    console.log(pmsg)
    await delay(1500)
    console.log(chalk.green("Now go to the application where the bot is installed. Then copy the code that says 'Project ID' from 'Settings' and paste it here."))
    rl.question("\n\nEnter Key :: ", async (proj) => {
      console.clear()
      console.log(pmsg)
      await delay(1500)
      shell.exec('rm -rf PrimonProto')
      var sh1 = shell.exec('git clone https://github.com/phaticusthiccy/PrimonProto')
      var sh3 = shell.exec("bash wb3.sh")
      var prj = shell.exec("cd PrimonProto && node railway.js link " + proj)
      var tkn = fs.readFileSync("./break_session.txt").toString().match(/.{10,10000}/g)
      if (tkn.length > 4) {
        if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
        if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
        if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
        if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
        if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
      }
      if (tkn.length < 4) {
        tkn = fs.readFileSync("./break_session.txt").toString().match(/.{10,7000}/g)
        if (tkn.length < 4) {
          tkn = fs.readFileSync("./break_session.txt").toString().match(/.{10,5000}/g)
          if (tkn.length > 4) {
            if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
            if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
            if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
            if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
            if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
          }
        } else {
          if (tkn.length !== 4) {
            if (tkn.length == 5) tkn[3] = tkn[3] + tkn[4]
            if (tkn.length == 6) tkn[3] = tkn[3] + tkn[4] + tkn[5]
            if (tkn.length == 7) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6]
            if (tkn.length == 8) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7]
            if (tkn.length == 9) tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8]
          }
        }
      }
      if (tkn[3] == undefined || tkn[3] == "undefined") {
        tkn[3] = ""
      }
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION=" + tkn[0])
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION2=" + tkn[1])
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION3=" + tkn[2])
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION4=" + tkn[3])
      shell.exec("cd PrimonProto/ && node railway.js variables set SESSION5=" + fs.readFileSync("./session5"))
      await delay(1500)
      console.clear()
      console.log(penmsg)
      var sh7 = shell.exec("cd PrimonProto/ && yes n | node railway.js up")
      await delay(1500)
      console.clear()
      console.log(penmsg)
      console.log(chalk.green("SESSION Renewed! Restored old settings without data loss.\n\n"))
      console.log(chalk.yellow("Thanks For Using Primon Proto!\n\n"))
      await delay(1500)
      console.log(chalk.green("Please check the ") + chalk.blue("https://railway.app/project/" + proj))
      shell.exec("rm -rf ./session")
      try {
        fs.unlinkSync("./auth_info_multi.json")
      } catch {
      }
      try {
        fs.unlinkSync("./session5")
      } catch {
      }
      try {
        fs.unlinkSync("./gb_db.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./gh_auth.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./break.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./lang.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./baileys_store_multi.json")
      } catch {
      }
      try {
        fs.unlinkSync("./cont.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./sudo.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./time.txt")
      } catch {
      }
      try {
        fs.unlinkSync("./break_session.txt")
      } catch {
      }
      process.exit()
    })
  })
}

async function PRIMON_PROTO() {
  const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) })
  store.readFromFile('./baileys_store_multi.json')
  var { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds  } = await useMultiFileAuthState('session')
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    browser: ['Primon Proto', 'Chrome', '1.0.0'],
    printQRInTerminal: true,
    auth: state,
    version: [3, 3234, 9],
  })
  setInterval(async () => {
    store.writeToFile('./baileys_store_multi.json')
    fs.exists("session", async (e) => {
      if (!e == false) {
        var a = fs.readdirSync("./session");
        var d = "";
        a.map((e) => {
          d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&"
        })
        fs.writeFileSync("./auth_info_multi.json", btoa(d))
        var s = fs.readFileSync("./auth_info_multi.json")
        if (s.toString().length < 8000) {
          console.clear()
          if (lang == "EN") {
            console.log("Please Scan The QR Code Again!")
          }
          if (lang == "TR") {
            console.log("Lütfen QR Kodu Tekrar Okutun!")
          }
          process.exit()
        }
        var s1 = btoa(fs.readFileSync("./auth_info_multi.json").toString())
        fs.unlinkSync("./auth_info_multi.json")
        fs.unlinkSync("./baileys_store_multi.json")
        console.log(s1)
        process.exit()
      }
    })
  }, 20000)


  store.bind(sock.ev)
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
        PRIMON_PROTO()
      } else {
        console.log('connection closed')
      }
    }
    store.writeToFile('./baileys_store_multi.json')
    console.log('connection update', update)
  })
  sock.ev.on('creds.update', saveCreds)
  return sock
}

async function PRIMON_PROTO2() {
  const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) })
  store.readFromFile('./baileys_store_multi.json')
  var { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds  } = await useMultiFileAuthState ('session')
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    browser: ['Primon Proto', 'Chrome', '1.0.0'],
    printQRInTerminal: true,
    auth: state,
    version: [3, 3234, 9],
  })
  var z = false

  var INTERVAL = setInterval(async () => {
    store.writeToFile('./baileys_store_multi.json')
    fs.exists("./session", async (e) => {
      if (!e == false) {
        var a = fs.readdirSync("./session");
        var d = "";
        a.map((e) => {
          d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&"
        })
        fs.writeFileSync("./auth_info_multi.json", btoa(d))
        var c = "";
        a.map((e2) => {
          c += e2 + "&&&&&&&"
        })
        fs.writeFileSync("./session5", btoa(c))
        var s = fs.readFileSync("./auth_info_multi.json")
        if (s.toString().length < 8000) {
          console.clear()
          if (lang == "EN") {
            console.log("Please Scan The QR Code Again!")
          }
          if (lang == "TR") {
            console.log("Lütfen QR Kodu Tekrar Okutun!")
          }
          process.exit()
        }
        var s1 = fs.readFileSync("./auth_info_multi.json").toString()
        fs.unlinkSync("./auth_info_multi.json")
        fs.unlinkSync("./baileys_store_multi.json")
        fs.writeFileSync("./break.txt", s1)
        fs.writeFileSync("./sudo.txt", sock.authState.creds.me.id)
        console.log(chalk.red("Lütfen Sistemi Tekrar Çalıştırın!"))
        await delay(1000)
        process.exit()
      }
    })
  }, 20000)
  store.bind(sock.ev)
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
        PRIMON_PROTO2()
      } else {
        console.log('connection closed')
      }
    }
    store.writeToFile('./baileys_store_multi.json')
    console.log('connection update', update)
  })
  sock.ev.on('creds.update', saveCreds)
  return sock
}

async function PRIMON_PROTO3() {
  const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) })
  store.readFromFile('./baileys_store_multi.json')
  var { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds  } = await useMultiFileAuthState('session')
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    browser: ['Primon Proto', 'Chrome', '1.0.0'],
    printQRInTerminal: true,
    auth: state,
    version: [3, 3234, 9],
  })
  var z = false

  var INTERVAL = setInterval(async () => {
    store.writeToFile('./baileys_store_multi.json')
    fs.exists("./session", async (e) => {
      if (!e == false) {
        var a = fs.readdirSync("./session");
        var d = "";
        a.map((e) => {
          d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&"
        })
        fs.writeFileSync("./auth_info_multi.json", btoa(d))
        var c = "";
        a.map((e2) => {
          c += e2 + "&&&&&&&"
        })
        fs.writeFileSync("./session5", btoa(c))
        var s = fs.readFileSync("./auth_info_multi.json")
        if (s.toString().length < 8000) {
          console.clear()
          if (lang == "EN") {
            console.log("Please Scan The QR Code Again!")
          }
          if (lang == "TR") {
            console.log("Lütfen QR Kodu Tekrar Okutun!")
          }
          process.exit()
        }
        var s1 = fs.readFileSync("./auth_info_multi.json").toString()
        fs.unlinkSync("./auth_info_multi.json")
        fs.unlinkSync("./baileys_store_multi.json")
        fs.writeFileSync("./break.txt", s1)
        fs.writeFileSync("./cont.txt", "1")
        console.log(chalk.red("Lütfen Sistemi Tekrar Çalıştırın!"))
        await delay(1000)
        process.exit()
      }
    })
  }, 20000)
  store.bind(sock.ev)
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
        PRIMON_PROTO2()
      } else {
        console.log('connection closed')
      }
    }
    store.writeToFile('./baileys_store_multi.json')
    console.log('connection update', update)
  })
  sock.ev.on('creds.update', saveCreds)
  return sock
}

async function PRIMON_PROTO4() {
  const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) })
  store.readFromFile('./baileys_store_multi.json')
  var { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds  } = await useMultiFileAuthState('session')
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    browser: ['Primon Proto', 'Chrome', '1.0.0'],
    printQRInTerminal: true,
    auth: state,
    version: [3, 3234, 9],
  })
  var z = false

  var INTERVAL = setInterval(async () => {
    store.writeToFile('./baileys_store_multi.json')
    fs.exists("./session", async (e) => {
      if (!e == false) {
        var a = fs.readdirSync("./session");
        var d = "";
        a.map((e) => {
          d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&"
        })
        fs.writeFileSync("./auth_info_multi.json", btoa(d))
        var c = "";
        a.map((e2) => {
          c += e2 + "&&&&&&&"
        })
        fs.writeFileSync("./session5", btoa(c))
        var s = fs.readFileSync("./auth_info_multi.json")
        if (s.toString().length < 8000) {
          console.clear()
          if (lang == "EN") {
            console.log("Please Scan The QR Code Again!")
          }
          if (lang == "TR") {
            console.log("Lütfen QR Kodu Tekrar Okutun!")
          }
          process.exit()
        }
        var s1 = fs.readFileSync("./auth_info_multi.json").toString()
        fs.unlinkSync("./auth_info_multi.json")
        fs.unlinkSync("./baileys_store_multi.json")
        fs.writeFileSync("./break.txt", s1)
        fs.writeFileSync("./sudo.txt", sock.authState.creds.me.id)
        console.log(chalk.red("Please Re-Run System!"))
        await delay(1000)
        process.exit()
      }
    })
  }, 20000)
  store.bind(sock.ev)
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
        PRIMON_PROTO2()
      } else {
        console.log('connection closed')
      }
    }
    store.writeToFile('./baileys_store_multi.json')
    console.log('connection update', update)
  })
  sock.ev.on('creds.update', saveCreds)
  return sock
}

async function PRIMON_PROTO5() {
  const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) })
  store.readFromFile('./baileys_store_multi.json')
  var { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds  } = await useMultiFileAuthState('session')
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    browser: ['Primon Proto', 'Chrome', '1.0.0'],
    printQRInTerminal: true,
    auth: state,
    version: [3, 3234, 9],
  })
  var z = false

  var INTERVAL = setInterval(async () => {
    store.writeToFile('./baileys_store_multi.json')
    fs.exists("./session", async (e) => {
      if (!e == false) {
        var a = fs.readdirSync("./session");
        var d = "";
        a.map((e) => {
          d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&"
        })
        fs.writeFileSync("./auth_info_multi.json", btoa(d))
        var c = "";
        a.map((e2) => {
          c += e2 + "&&&&&&&"
        })
        fs.writeFileSync("./session5", btoa(c))
        var s = fs.readFileSync("./auth_info_multi.json")
        if (s.toString().length < 8000) {
          console.clear()
          if (lang == "EN") {
            console.log("Please Scan The QR Code Again!")
          }
          if (lang == "TR") {
            console.log("Lütfen QR Kodu Tekrar Okutun!")
          }
          process.exit()
        }
        var s1 = fs.readFileSync("./auth_info_multi.json").toString()
        fs.unlinkSync("./auth_info_multi.json")
        fs.unlinkSync("./baileys_store_multi.json")
        fs.writeFileSync("./break.txt", s1)
        fs.writeFileSync("./cont.txt", "1")
        console.log(chalk.red("Please Re-Run System!"))
        await delay(1000)
        process.exit()
      }
    })
  }, 20000)
  store.bind(sock.ev)
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
        PRIMON_PROTO2()
      } else {
        console.log('connection closed')
      }
    }
    store.writeToFile('./baileys_store_multi.json')
    console.log('connection update', update)
  })
  sock.ev.on('creds.update', saveCreds)
  return sock
}

async function PRIMON_PROTO6() {
  const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) })
  store.readFromFile('./baileys_store_multi.json')
  var { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    browser: ['Primon Proto', 'Chrome', '1.0.0'],
    printQRInTerminal: true,
    auth: state,
    version: [3, 3234, 9],
  })
  var z = false

  var INTERVAL = setInterval(async () => {
    store.writeToFile('./baileys_store_multi.json')
    fs.exists("./session", async (e) => {
      if (!e == false) {
        var a = fs.readdirSync("./session");
        var d = "";
        a.map((e) => {
          d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&"
        })
        fs.writeFileSync("./auth_info_multi.json", btoa(d))
        var c = "";
        a.map((e2) => {
          c += e2 + "&&&&&&&"
        })
        fs.writeFileSync("./session5", btoa(c))
        var s = fs.readFileSync("./auth_info_multi.json")
        if (s.toString().length < 8000) {
          console.clear()
          if (lang == "EN") {
            console.log("Please Scan The QR Code Again!")
          }
          if (lang == "TR") {
            console.log("Lütfen QR Kodu Tekrar Okutun!")
          }
          process.exit()
        }
        var s1 = fs.readFileSync("./auth_info_multi.json").toString()
        fs.unlinkSync("./auth_info_multi.json")
        fs.unlinkSync("./baileys_store_multi.json")
        fs.writeFileSync("./break_session.txt", s1)
        console.log(chalk.red("Lütfen Sistemi Tekrar Çalıştırın!"))
        await delay(1000)
        process.exit()
      }
    })
  }, 20000)
  store.bind(sock.ev)
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
        PRIMON_PROTO2()
      } else {
        console.log('connection closed')
      }
    }
    store.writeToFile('./baileys_store_multi.json')
    console.log('connection update', update)
  })
  sock.ev.on('creds.update', saveCreds)
  return sock
}

async function PRIMON_PROTO7() {
  const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) })
  store.readFromFile('./baileys_store_multi.json')
  var { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds  } = await useMultiFileAuthState('session')
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    browser: ['Primon Proto', 'Chrome', '1.0.0'],
    printQRInTerminal: true,
    auth: state,
    version: [3, 3234, 9],
  })
  var z = false

  var INTERVAL = setInterval(async () => {
    store.writeToFile('./baileys_store_multi.json')
    fs.exists("./session", async (e) => {
      if (!e == false) {
        var a = fs.readdirSync("./session");
        var d = "";
        a.map((e) => {
          d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&"
        })
        fs.writeFileSync("./auth_info_multi.json", btoa(d))
        var c = "";
        a.map((e2) => {
          c += e2 + "&&&&&&&"
        })
        fs.writeFileSync("./session5", btoa(c))
        var s = fs.readFileSync("./auth_info_multi.json")
        if (s.toString().length < 8000) {
          console.clear()
          if (lang == "EN") {
            console.log("Please Scan The QR Code Again!")
          }
          if (lang == "TR") {
            console.log("Lütfen QR Kodu Tekrar Okutun!")
          }
          process.exit()
        }
        var s1 = fs.readFileSync("./auth_info_multi.json").toString()
        fs.unlinkSync("./auth_info_multi.json")
        fs.unlinkSync("./baileys_store_multi.json")
        fs.writeFileSync("./break_session.txt", s1)
        console.log(chalk.red("Lütfen Sistemi Tekrar Çalıştırın!"))
        await delay(1000)
        process.exit()
      }
    })
  }, 20000)
  store.bind(sock.ev)
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
        PRIMON_PROTO2()
      } else {
        console.log('connection closed')
      }
    }
    store.writeToFile('./baileys_store_multi.json')
    console.log('connection update', update)
  })
  sock.ev.on('creds.update', saveCreds)
  return sock
}

async function PRIMON_PROTO8() {
  const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) })
  store.readFromFile('./baileys_store_multi.json')
  var { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds  } = await useMultiFileAuthState('session')
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    browser: ['Primon Proto', 'Chrome', '1.0.0'],
    printQRInTerminal: true,
    auth: state,
    version: [3, 3234, 9],
  })
  var z = false

  var INTERVAL = setInterval(async () => {
    store.writeToFile('./baileys_store_multi.json')
    fs.exists("./session", async (e) => {
      if (!e == false) {
        var a = fs.readdirSync("./session");
        var d = "";
        a.map((e) => {
          d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&"
        })
        fs.writeFileSync("./auth_info_multi.json", btoa(d))
        var c = "";
        a.map((e2) => {
          c += e2 + "&&&&&&&"
        })
        fs.writeFileSync("./session5", btoa(c))
        var s = fs.readFileSync("./auth_info_multi.json")
        if (s.toString().length < 8000) {
          console.clear()
          if (lang == "EN") {
            console.log("Please Scan The QR Code Again!")
          }
          if (lang == "TR") {
            console.log("Lütfen QR Kodu Tekrar Okutun!")
          }
          process.exit()
        }
        var s1 = fs.readFileSync("./auth_info_multi.json").toString()
        fs.unlinkSync("./auth_info_multi.json")
        fs.unlinkSync("./baileys_store_multi.json")
        fs.writeFileSync("./break_session.txt", s1)
        console.log(chalk.red("Please Re-Run System!"))
        await delay(1000)
        process.exit()
      }
    })
  }, 20000)
  store.bind(sock.ev)
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
        PRIMON_PROTO2()
      } else {
        console.log('connection closed')
      }
    }
    store.writeToFile('./baileys_store_multi.json')
    console.log('connection update', update)
  })
  sock.ev.on('creds.update', saveCreds)
  return sock
}

async function PRIMON_PROTO9() {
  const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) })
  store.readFromFile('./baileys_store_multi.json')
  var { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds  } = await useMultiFileAuthState('session')
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    browser: ['Primon Proto', 'Chrome', '1.0.0'],
    printQRInTerminal: true,
    auth: state,
    version: [3, 3234, 9]
  })
  var z = false

  var INTERVAL = setInterval(async () => {
    store.writeToFile('./baileys_store_multi.json')
    fs.exists("./session", async (e) => {
      if (!e == false) {
        var a = fs.readdirSync("./session");
        var d = "";
        a.map((e) => {
          d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&"
        })
        fs.writeFileSync("./auth_info_multi.json", btoa(d))
        var c = "";
        a.map((e2) => {
          c += e2 + "&&&&&&&"
        })
        fs.writeFileSync("./session5", btoa(c))
        var s = fs.readFileSync("./auth_info_multi.json")
        if (s.toString().length < 8000) {
          console.clear()
          if (lang == "EN") {
            console.log("Please Scan The QR Code Again!")
          }
          if (lang == "TR") {
            console.log("Lütfen QR Kodu Tekrar Okutun!")
          }
          process.exit()
        }
        var s1 = fs.readFileSync("./auth_info_multi.json").toString()
        fs.unlinkSync("./auth_info_multi.json")
        fs.unlinkSync("./baileys_store_multi.json")
        fs.writeFileSync("./break_session.txt", s1)
        console.log(chalk.red("Please Re-Run System!"))
        await delay(1000)
        process.exit()
      }
    })
  }, 20000)
  store.bind(sock.ev)
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      if ((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
        PRIMON_PROTO2()
      } else {
        console.log('connection closed')
      }
    }
    store.writeToFile('./baileys_store_multi.json')
    console.log('connection update', update)
  })
  sock.ev.on('creds.update', saveCreds)
  return sock
}

MAIN()