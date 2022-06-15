// Primon Proto
// Headless WebSocket, type-safe Whatsapp Bot
//
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can usable with mjs)
//
// Phaticusthiccy - 2022

import { Boom } from "@hapi/boom";
import P from "pino";
import makeWASocket, {
  AnyMessageContent,
  delay,
  DisconnectReason,
  makeInMemoryStore,
  useSingleFileAuthState,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from "@adiwajshing/baileys";
import * as fs from "fs";
import * as readline from "readline";
import chalk from "chalk";
import { Octokit } from "@octokit/core";
import axios from "axios";
import neko from "@phaticusthiccy/open-apis";
import { exec, spawn, execSync } from "child_process";
import shell from "shelljs";

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
      "media": []
    },
    "db_url": "",
    "token_key": "",
    "lang_json": false,
    "public": false,
    "isstarred": false
  }

`;

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

var pmsg =
  "______     _                        \n| ___ \\   (_)                       \n| |_/ / __ _ _ __ ___   ___  _ __   \n|  __/ '__| | '_ \\` _ \\ / _ \\| '_ \\  \n| |  | |  | | | | | | | (_) | | | | \n\\_|  |_|  |_|_| |_| |_|\\___/|_| |_| \n                                    \n                                    \n______          _                   \n| ___ \\        | |                  \n| |_/ / __ ___ | |_ ___             \n|  __/ '__/ _ \\| __/ _ \\            \n| |  | | | (_) | || (_) |           \n\\_|  |_|  \\___/ \\__\\___/            \n                                    \n                ";
var penmsg =
  "______     _                        \n| ___ \\   (_)                       \n| |_/ / __ _ _ __ ___   ___  _ __   \n|  __/ '__| | '_ \\` _ \\ / _ \\| '_ \\  \n| |  | |  | | | | | | | (_) | | | | \n\\_|  |_|  |_|_| |_| |_|\\___/|_| |_| \n                                    \n                                    \n______          _                   \n| ___ \\        | |                  \n| |_/ / __ ___ | |_ ___             \n|  __/ '__/ _ \\| __/ _ \\            \n| |  | | | (_) | || (_) |           \n\\_|  |_|  \\___/ \\__\\___/            \n                                    \n                ";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

let token: string = "";
let st: string = "";
let qst: string = "";
let FIRST_TIMESTEP = 0;
let lang: string = "";
let anahtar: string = "";

async function MAIN() {
  var octokit = new Octokit({ auth: process.env.GITHUB_AUTH });
  var res = await octokit.request("POST /gists", {
    description: "Persistent Database for Primon Proto",
    files: {
      key: {
        content: db,
        filename: "primon.db.json",
      },
    },
    public: false,
  });
  var jsoner = JSON.parse(res.data.files["primon.db.json"].content);
  jsoner.db_url = res.data.id;
  fs.writeFileSync("./gb_db.txt", res.data.id);
  fs.writeFileSync("./gb_auth.txt", process.env.GITHUB_AUTH);
  jsoner.token_key = token;
  jsoner.afk.message =
    "*Bip Bop 🤖* \nThis is a bot. My owner is not here right now. I told this to my owner. It will be returned as soon as possible.\n\n*Last Seen:* {lastseen}\n*Reason:* {reason}";
  jsoner.alive_msg =
    "_Primon Proto Alive!_\n\n_Version: {version}_\n_Owner:_ {name}_";
  jsoner.ban_msg = "*Banned* {user} f*rom this group!*";
  jsoner.block_msg =
    "*Blocked* {user}! *Now you can't able to send message to me!*";
  jsoner.unblock_msg = "*Unblocked {user}! *You can send messages to me.*";
  jsoner.mute_msg = "*Grop chat muted for {time}!*";
  jsoner.unmute_msg = "*Well, they can talk again.*";
  jsoner.language = "EN";
  var fin = JSON.stringify(jsoner, null, 2);
  await octokit.request("PATCH /gists/{gist_id}", {
    gist_id: jsoner.db_url,
    description: "Persistent Database for Primon Proto",
    files: {
      key: {
        content: fin,
        filename: "primon.db.json",
      },
    },
  });
  await PRIMON_PROTO()
  delay(200000)
}

async function PRIMON_PROTO() {
  const store = makeInMemoryStore({
    logger: P().child({ level: "silent", stream: "store" }),
  });
  store.readFromFile("./baileys_store_multi.json");
  var { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = useMultiFileAuthState("session_record");
  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    browser: ["Primon Proto", "Chrome", "1.0.0"],
    printQRInTerminal: true,
    auth: state,
    version: [3, 3234, 9],
  });
  var z = false;

  var INTERVAL = setInterval(async () => {
    store.writeToFile("./baileys_store_multi.json");
    fs.exists("./session_record", async (e: any) => {
      if (!e == false) {
        var a = fs.readdirSync("./session_record");
        var d = "";
        a.map((e: string) => {
          d += fs.readFileSync("./session_record/" + e).toString() + "&&&&&&&"
        })
        fs.writeFileSync("./auth_info_multi.json", btoa(d))
        var c = "";
        a.map((e2: string) => {
          c += e2 + "&&&&&&&"
        })
        fs.writeFileSync("./session5", btoa(c))
        var s = fs.readFileSync("./auth_info_multi.json");
        if (s.toString().length < 8000) {
          console.clear();
          if (lang == "EN") {
            console.log("Please Scan The QR Code Again!");
          }
          process.exit();
        }
        var s1 = btoa(fs.readFileSync("./auth_info_multi.json").toString());
        fs.unlinkSync("./auth_info_multi.json");
        fs.unlinkSync("./baileys_store_multi.json");
        fs.writeFileSync("./break.txt", s1);
        fs.writeFileSync("./sudo.txt", sock.authState.creds.me.id);
        await delay(1000);
        process.exit();
      }
    });
  }, 20000);
  store.bind(sock.ev);
  sock.ev.on("connection.update", async (update: { connection: any; lastDisconnect: any; }) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      if (
        (lastDisconnect.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut
      ) {
        PRIMON_PROTO();
      } else {
        console.log("connection closed");
      }
    }
    store.writeToFile("./baileys_store_multi.json");
    console.log("connection update", update);
  });
  sock.ev.on("creds.update", saveCreds);
  return sock;
}


// To use it on VDS, VPS, AWS, NGROK ..etc;
// Set ENV{GITHUB_DB=Github DB Token}
// Set ENV{GITHUB_AUTH=Github Auth Token}
// Set ENV{SESSION1=Primon Session}
// Set ENV{SESSION2=Primon Session}
// Set ENV{SESSION3=Primon Session}
// Set ENV{SESSION4=Primon Session}

// Split primon session into 4 pieces and set once by once.
// Run ["bash", "pri.sh"]
