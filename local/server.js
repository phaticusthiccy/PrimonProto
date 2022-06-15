"use strict";
// Primon Proto
// Headless WebSocket, type-safe Whatsapp Bot
//
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can usable with mjs)
//
// Phaticusthiccy - 2022
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var pino_1 = require("pino");
var baileys_1 = require("@adiwajshing/baileys");
var fs = require("fs");
var core_1 = require("@octokit/core");
var db = "{\n    \"author\": \"https://github.com/phaticusthiccy\",\n    \"welcome\": [],\n    \"welcome_media\": [],\n    \"goodbye\": [],\n    \"goodbye_media\": [],\n    \"sudo\": \"\",\n    \"super_sudo\": [],\n    \"pmpermit\": [],\n    \"pmpermit_media\": {\n      \"type\": \"\",\n      \"media\": \"\"\n    },\n    \"handler\": \".!;/\",\n    \"blocklist\": [],\n    \"snip\": [],\n    \"snip_media\": [],\n    \"antiflood\": [],\n    \"warn\": [],\n    \"block_msg\": \"\",\n    \"bloc_msg_media\": {\n      \"type\": \"\",\n      \"media\": \"\"\n    },\n    \"unblock_msg\": \"\",\n    \"unblock_msg_media\": {\n      \"type\": \"\",\n      \"media\": \"\"\n    },\n    \"ban_msg\": \"\",\n    \"ban_msg_media\": {\n      \"type\": \"\",\n      \"media\": \"\"\n    },\n    \"mute_msg\": \"\",\n    \"mute_msg_media\": {\n      \"type\": \"\",\n      \"media\": \"\"\n    },\n    \"unmute_msg\": \"\",\n    \"unmute_msg_media\": {\n      \"type\": \"\",\n      \"media\": \"\"\n    },\n    \"warncount\": [],\n    \"language\": \"\",\n    \"debug\": false,\n    \"afk\": { \n      \"status\": false, \n      \"message\": \"I am AFK Now! \\nLastseen: {lastseen}\"\n    },\n    \"afk_media\": {\n      \"type\": \"\",\n      \"media\": \"\"\n    },\n    \"filter\": [],\n    \"filter_media\": [],\n    \"global_filter\": [],\n    \"global_filter_media\": [],\n    \"alive_msg\": \"\",\n    \"alive_msg_media\": {\n      \"type\": \"\",\n      \"media\": \"\"\n    },\n    \"db_url\": \"\",\n    \"token_key\": \"\",\n    \"lang_json\": false\n  }\n\n";
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
var pmsg = "______     _                        \n| ___ \\   (_)                       \n| |_/ / __ _ _ __ ___   ___  _ __   \n|  __/ '__| | '_ \\` _ \\ / _ \\| '_ \\  \n| |  | |  | | | | | | | (_) | | | | \n\\_|  |_|  |_|_| |_| |_|\\___/|_| |_| \n                                    \n                                    \n______          _                   \n| ___ \\        | |                  \n| |_/ / __ ___ | |_ ___             \n|  __/ '__/ _ \\| __/ _ \\            \n| |  | | | (_) | || (_) |           \n\\_|  |_|  \\___/ \\__\\___/            \n                                    \n                ";
var penmsg = "______     _                        \n| ___ \\   (_)                       \n| |_/ / __ _ _ __ ___   ___  _ __   \n|  __/ '__| | '_ \\` _ \\ / _ \\| '_ \\  \n| |  | |  | | | | | | | (_) | | | | \n\\_|  |_|  |_|_| |_| |_|\\___/|_| |_| \n                                    \n                                    \n______          _                   \n| ___ \\        | |                  \n| |_/ / __ ___ | |_ ___             \n|  __/ '__/ _ \\| __/ _ \\            \n| |  | | | (_) | || (_) |           \n\\_|  |_|  \\___/ \\__\\___/            \n                                    \n                ";
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
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
var token = "";
var st = "";
var qst = "";
var FIRST_TIMESTEP = 0;
var lang = "";
var anahtar = "";
function MAIN() {
    return __awaiter(this, void 0, void 0, function () {
        var octokit, res, jsoner, fin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    octokit = new core_1.Octokit({ auth: process.env.GITHUB_AUTH });
                    return [4 /*yield*/, octokit.request("POST /gists", {
                            description: "Persistent Database for Primon Proto",
                            files: {
                                key: {
                                    content: db,
                                    filename: "primon.db.json"
                                }
                            },
                            public: false
                        })];
                case 1:
                    res = _a.sent();
                    jsoner = JSON.parse(res.data.files["primon.db.json"].content);
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
                    fin = JSON.stringify(jsoner, null, 2);
                    return [4 /*yield*/, octokit.request("PATCH /gists/{gist_id}", {
                            gist_id: jsoner.db_url,
                            description: "Persistent Database for Primon Proto",
                            files: {
                                key: {
                                    content: fin,
                                    filename: "primon.db.json"
                                }
                            }
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, PRIMON_PROTO()];
                case 3:
                    _a.sent();
                    delay(200000);
                    return [2 /*return*/];
            }
        });
    });
}
function PRIMON_PROTO() {
    return __awaiter(this, void 0, void 0, function () {
        var store, version, _a, state, saveCreds, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    store = (0, baileys_1.makeInMemoryStore)({
                        logger: (0, pino_1["default"])().child({ level: "silent", stream: "store" })
                    });
                    store.readFromFile("./baileys_store_multi.json");
                    return [4 /*yield*/, (0, baileys_1.fetchLatestBaileysVersion)()];
                case 1:
                    version = (_b.sent()).version;
                    _a = (0, baileys_1.useMultiFileAuthState)("session_record"), state = _a.state, saveCreds = _a.saveCreds;
                    sock = (0, baileys_1["default"])({
                        logger: (0, pino_1["default"])({ level: "silent" }),
                        browser: ["Primon Proto", "Chrome", "1.0.0"],
                        printQRInTerminal: true,
                        auth: state,
                        version: [3, 3234, 9]
                    });
                    z = false;
                    INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            store.writeToFile("./baileys_store_multi.json");
                            fs.exists("./session_record", function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var a, d, c, s, s1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(!e == false)) return [3 /*break*/, 2];
                                            a = fs.readdirSync("./session_record");
                                            d = "";
                                            a.map(function (e) {
                                                d += fs.readFileSync("./session_record/" + e).toString() + "&&&&&&&";
                                            });
                                            fs.writeFileSync("./auth_info_multi.json", btoa(d));
                                            c = "";
                                            a.map(function (e2) {
                                                c += e2 + "&&&&&&&";
                                            });
                                            fs.writeFileSync("./session5", btoa(c));
                                            s = fs.readFileSync("./auth_info_multi.json");
                                            if (s.toString().length < 8000) {
                                                console.clear();
                                                if (lang == "EN") {
                                                    console.log("Please Scan The QR Code Again!");
                                                }
                                                process.exit();
                                            }
                                            s1 = btoa(fs.readFileSync("./auth_info_multi.json").toString());
                                            fs.unlinkSync("./auth_info_multi.json");
                                            fs.unlinkSync("./baileys_store_multi.json");
                                            fs.writeFileSync("./break.txt", s1);
                                            fs.writeFileSync("./sudo.txt", sock.authState.creds.me.id);
                                            return [4 /*yield*/, delay(1000)];
                                        case 1:
                                            _a.sent();
                                            process.exit();
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [2 /*return*/];
                        });
                    }); }, 20000);
                    store.bind(sock.ev);
                    sock.ev.on("connection.update", function (update) { return __awaiter(_this, void 0, void 0, function () {
                        var connection, lastDisconnect;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            connection = update.connection, lastDisconnect = update.lastDisconnect;
                            if (connection === "close") {
                                if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !==
                                    baileys_1.DisconnectReason.loggedOut) {
                                    PRIMON_PROTO();
                                }
                                else {
                                    console.log("connection closed");
                                }
                            }
                            store.writeToFile("./baileys_store_multi.json");
                            console.log("connection update", update);
                            return [2 /*return*/];
                        });
                    }); });
                    sock.ev.on("creds.update", saveCreds);
                    return [2 /*return*/, sock];
            }
        });
    });
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
