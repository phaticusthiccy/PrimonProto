"use strict";
// Primon Proto 
// Headless WebSocket, type-safe Whatsapp Bot
// 
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES6 Module (can usable with mjs)
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
var readline = require("readline");
var chalk_1 = require("chalk");
var core_1 = require("@octokit/core");
var child_process_1 = require("child_process");
var shelljs_1 = require("shelljs");
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
var pmsg = '______     _                        \n| ___ \\   (_)                       \n| |_\/ \/ __ _ _ __ ___   ___  _ __   \n|  __\/ \'__| | \'_ \\` _ \\ \/ _ \\| \'_ \\  \n| |  | |  | | | | | | | (_) | | | | \n\\_|  |_|  |_|_| |_| |_|\\___\/|_| |_| \n                                    \n                                    \n______          _                   \n| ___ \\        | |                  \n| |_\/ \/ __ ___ | |_ ___             \n|  __\/ \'__\/ _ \\| __\/ _ \\            \n| |  | | | (_) | || (_) |           \n\\_|  |_|  \\___\/ \\__\\___\/            \n                                    \n                ';
var penmsg = '______     _                        \n| ___ \\   (_)                       \n| |_\/ \/ __ _ _ __ ___   ___  _ __   \n|  __\/ \'__| | \'_ \\` _ \\ \/ _ \\| \'_ \\  \n| |  | |  | | | | | | | (_) | | | | \n\\_|  |_|  |_|_| |_| |_|\\___\/|_| |_| \n                                    \n                                    \n______          _                   \n| ___ \\        | |                  \n| |_\/ \/ __ ___ | |_ ___             \n|  __\/ \'__\/ _ \\| __\/ _ \\            \n| |  | | | (_) | || (_) |           \n\\_|  |_|  \\___\/ \\__\\___\/            \n                                    \n                ';
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
try {
    fs.unlinkSync("./auth_info_multi.json");
}
catch (_a) { }
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var token = "";
var st = "";
var qst = "";
var FIRST_TIMESTEP = 0;
var lang = "";
var anahtar = "";
function MAIN() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fs.existsSync("./break_session.txt")) return [3 /*break*/, 4];
                    if (!(fs.readFileSync("./lang.txt").toString() == "TR" ||
                        fs.readFileSync("./lang.txt").toString() == "TR\n")) return [3 /*break*/, 2];
                    return [4 /*yield*/, after_s_tr()];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!(fs.readFileSync("./lang.txt").toString() == "EN" ||
                        fs.readFileSync("./lang.txt").toString() == "EN\n")) return [3 /*break*/, 4];
                    return [4 /*yield*/, after_s_en()];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    if (!fs.existsSync("./break.txt")) return [3 /*break*/, 8];
                    if (!(fs.readFileSync("./lang.txt").toString() == "TR" ||
                        fs.readFileSync("./lang.txt").toString() == "TR\n")) return [3 /*break*/, 6];
                    return [4 /*yield*/, after_tr()];
                case 5: return [2 /*return*/, _a.sent()];
                case 6:
                    if (!(fs.readFileSync("./lang.txt").toString() == "EN" ||
                        fs.readFileSync("./lang.txt").toString() == "EN\n")) return [3 /*break*/, 8];
                    return [4 /*yield*/, after_en()];
                case 7: return [2 /*return*/, _a.sent()];
                case 8:
                    rl.question("Select A Language \n\n" +
                        "[1]" +
                        " :: Türkçe \n" +
                        "[2]" +
                        " :: English\n\n>>> ", function (answer) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    FIRST_TIMESTEP = new Date().getTime();
                                    fs.writeFileSync("./time.txt", FIRST_TIMESTEP.toString());
                                    if (!(answer == 1)) return [3 /*break*/, 3];
                                    console.log("Türkçe Dili Seçildi!");
                                    lang == "TR";
                                    fs.writeFileSync("./lang.txt", "TR");
                                    return [4 /*yield*/, delay(3000)];
                                case 1:
                                    _a.sent();
                                    console.clear();
                                    return [4 /*yield*/, delay(400)];
                                case 2:
                                    _a.sent();
                                    rl.question("\n\nNe Yapmak İstiyorsunuz? \n\n" +
                                        "[1]" +
                                        " :: Session Yenileme\n" +
                                        "[2]" +
                                        " :: Bot Kurma" +
                                        "\n\n1) Session yenileme işlemi, yavaş çalışan botu hızlandırmak veya çıkış yapılan botu veri kaybı olmadan geri getirmek için kullanılır.\n>>> ", function (answer2) { return __awaiter(_this, void 0, void 0, function () {
                                        var _this = this;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!(answer2 == 1)) return [3 /*break*/, 6];
                                                    console.log("Session Yenileme Seçildi!");
                                                    return [4 /*yield*/, delay(3000)];
                                                case 1:
                                                    _a.sent();
                                                    console.clear();
                                                    console.log(pmsg);
                                                    return [4 /*yield*/, delay(1500)];
                                                case 2:
                                                    _a.sent();
                                                    console.log("Lütfen Veritabanı Kodunu giriniz.");
                                                    return [4 /*yield*/, delay(1500)];
                                                case 3:
                                                    _a.sent();
                                                    console.log("Bunu railway üzerindeki uygulamanızın" +
                                                        " Variables " +
                                                        "kısmından " +
                                                        "GITHUB_DB " +
                                                        "bölümünü görebilirsiniz.");
                                                    return [4 /*yield*/, delay(1500)];
                                                case 4:
                                                    _a.sent();
                                                    console.log("Bunu yapamıyorsanız, lütfen daha önceden kurmuş olduğunuz botun, kendi numaranıza göndermiş olduğu mesajı kontrol edin. "
                                                        +
                                                            "Veritabanı" +
                                                        " ismindeki kodu ekrana yapıştırın. \n\n");
                                                    return [4 /*yield*/, delay(1500)];
                                                case 5:
                                                    _a.sent();
                                                    rl.question("Anahtarı Girin :: ", function (a1) { return __awaiter(_this, void 0, void 0, function () {
                                                        var _this = this;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    anahtar = a1;
                                                                    console.log("\n\nTeşekkürler");
                                                                    return [4 /*yield*/, delay(3000)];
                                                                case 1:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    console.log(pmsg);
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 2:
                                                                    _a.sent();
                                                                    console.log("Lütfen Token Kodunu giriniz.");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 3:
                                                                    _a.sent();
                                                                    console.log("Bunu railway üzerindeki uygulamanızın" +
                                                                        " Variables " +
                                                                        "kısmından " +
                                                                        "GITHUB_AUTH " +
                                                                        "bölümünü görebilirsiniz.");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 4:
                                                                    _a.sent();
                                                                    console.log("Bunu yapamıyorsanız, lütfen daha önceden kurmuş olduğunuz botun, kendi numaranıza göndermiş olduğu mesajı kontrol edin. "
                                                                        +
                                                                            "Token" +
                                                                        " ismindeki kodu ekrana yapıştırın. \n\n");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 5:
                                                                    _a.sent();
                                                                    rl.question("Anahtarı Girin :: ", function (a2) { return __awaiter(_this, void 0, void 0, function () {
                                                                        var test1, _a, octokit;
                                                                        var _this = this;
                                                                        return __generator(this, function (_b) {
                                                                            switch (_b.label) {
                                                                                case 0:
                                                                                    token = a2;
                                                                                    console.log("\n\nTeşekkürler, lütfen biraz bekleyin. Girdiğiniz kodların geçerli olup olmadığını kontrol ediyorum..");
                                                                                    _b.label = 1;
                                                                                case 1:
                                                                                    _b.trys.push([1, 3, , 4]);
                                                                                    test1 = new core_1.Octokit({ auth: token });
                                                                                    return [4 /*yield*/, test1.request("GET /gists/{gist_id}", {
                                                                                            gist_id: anahtar
                                                                                        })];
                                                                                case 2:
                                                                                    _b.sent();
                                                                                    return [3 /*break*/, 4];
                                                                                case 3:
                                                                                    _a = _b.sent();
                                                                                    console.clear();
                                                                                    console.log("\n\nÜzgünüm, girdiğniz değeler doğru değil. Lütfen tekrar kontrol ediniz.");
                                                                                    process.exit();
                                                                                    return [3 /*break*/, 4];
                                                                                case 4:
                                                                                    console.log("\n\nGirdiğiniz Bilgiler Doğru!");
                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                case 5:
                                                                                    _b.sent();
                                                                                    octokit = new core_1.Octokit({ auth: token });
                                                                                    console.log("Şimdi ise WhatsApp uygulmanızı açın ve 'Bağlı Cihazlar' kısmına tıklayın.");
                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                case 6:
                                                                                    _b.sent();
                                                                                    console.log("\n\nArdından 'Çoklu Cihaz' programını aktif edin.");
                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                case 7:
                                                                                    _b.sent();
                                                                                    console.log("\n\nBunları yaptıktan sonra lütfen enter tuşuna basın.");
                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                case 8:
                                                                                    _b.sent();
                                                                                    rl.question("\n\n[Enter Tuşuna Bas]", function (answer7) { return __awaiter(_this, void 0, void 0, function () {
                                                                                        var prpc;
                                                                                        return __generator(this, function (_a) {
                                                                                            switch (_a.label) {
                                                                                                case 0:
                                                                                                    console.clear();
                                                                                                    console.log(pmsg);
                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                case 1:
                                                                                                    _a.sent();
                                                                                                    console.log("Şimdi ise ekrana gelecek QR kodunu okutun.");
                                                                                                    return [4 /*yield*/, delay(2800)];
                                                                                                case 2:
                                                                                                    _a.sent();
                                                                                                    console.log("QR Okuttuktun Sonra Komut Satırına" +
                                                                                                        "`node PrimonProto/local/local.js`" +
                                                                                                        "Yazın!");
                                                                                                    return [4 /*yield*/, delay(5000)];
                                                                                                case 3:
                                                                                                    _a.sent();
                                                                                                    console.clear();
                                                                                                    return [4 /*yield*/, PRIMON_PROTO6()];
                                                                                                case 4:
                                                                                                    prpc = _a.sent();
                                                                                                    return [4 /*yield*/, delay(200000)];
                                                                                                case 5:
                                                                                                    _a.sent();
                                                                                                    return [4 /*yield*/, after()];
                                                                                                case 6:
                                                                                                    _a.sent();
                                                                                                    return [2 /*return*/];
                                                                                            }
                                                                                        });
                                                                                    }); });
                                                                                    return [2 /*return*/];
                                                                            }
                                                                        });
                                                                    }); });
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); });
                                                    return [3 /*break*/, 10];
                                                case 6:
                                                    if (!(answer2 == 2)) return [3 /*break*/, 9];
                                                    console.log("Bot Kurma Seçildi!");
                                                    return [4 /*yield*/, delay(3000)];
                                                case 7:
                                                    _a.sent();
                                                    console.clear();
                                                    console.log(pmsg);
                                                    return [4 /*yield*/, delay(1500)];
                                                case 8:
                                                    _a.sent();
                                                    console.log("İlk önce bir github hesabınız yoksa https://github.com adresine tıklayıp yeni bir hesap açın. Ardından mail adresinize e-posta ile hesabınızı onaylayın. Bu işlemi yaptıktan sonra enter tuşuna basıp devam ediniz.\n\n");
                                                    rl.question("[Enter Tuşuna Bas]", function (answer3) { return __awaiter(_this, void 0, void 0, function () {
                                                        var _this = this;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    console.clear();
                                                                    console.log(pmsg);
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 1:
                                                                    _a.sent();
                                                                    console.log("Hesap açtıktan sonra mail onayı için https://github.com/settings/emails bu adrese gidin ve 'Resend verification email' yazısına basın. Ardından mailinizi kontol edin. Bunları hali hazırda yapmış iseniz veya devam etmek için lütfen enter tuşuna basınız.\n\n");
                                                                    rl.question("[Enter Tuşuna Bas]", function (answer4) { return __awaiter(_this, void 0, void 0, function () {
                                                                        var _this = this;
                                                                        return __generator(this, function (_a) {
                                                                            switch (_a.label) {
                                                                                case 0:
                                                                                    console.clear();
                                                                                    console.log(pmsg);
                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                case 1:
                                                                                    _a.sent();
                                                                                    console.log("Hesabınız onaylandığına göre şimdi token alalım. \n\n");
                                                                                    return [4 /*yield*/, delay(3000)];
                                                                                case 2:
                                                                                    _a.sent();
                                                                                    console.log("Lütfen https://github.com/settings/tokens bu adrese gidin ve 'Personal access tokens' yazan kısıma basın. Bu işlemi yaptıktan sonra enter tuşuna basın.\n\n");
                                                                                    rl.question("[Enter Tuşuna Bas]", function (answer5) { return __awaiter(_this, void 0, void 0, function () {
                                                                                        var _this = this;
                                                                                        return __generator(this, function (_a) {
                                                                                            switch (_a.label) {
                                                                                                case 0:
                                                                                                    console.clear();
                                                                                                    console.log(pmsg);
                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                case 1:
                                                                                                    _a.sent();
                                                                                                    console.log("Burda ise 'Generate New Token' butonuna tıklayın.\n\n");
                                                                                                    return [4 /*yield*/, delay(3000)];
                                                                                                case 2:
                                                                                                    _a.sent();
                                                                                                    console.log("Ve ayarlarımız şu şekide olsun: \n\nNOTE: Primon \n\nExpiration: No expiration\n\nDaha sonra ise aşağıda 'repo' ve 'gist' yazan kutucuğu işaretleyin.\n\n");
                                                                                                    return [4 /*yield*/, delay(3000)];
                                                                                                case 3:
                                                                                                    _a.sent();
                                                                                                    console.log("Son olarak aşağıdaki 'Generate token' butonuna basın. Karşınıza gelecek anahtarı kopyalayın! İşlem bitene kadar bu anahtarı kaybetmeyin! Kopyaladıktan sonra ise ekrana gelecek giriş bölümüne yapıştırın.\n\n");
                                                                                                    rl.question("Anahtarı Girin :: ", function (answer6) { return __awaiter(_this, void 0, void 0, function () {
                                                                                                        var test1, res, _a, octokit, t1, t2, t3, res, jsoner, fin, step;
                                                                                                        var _this = this;
                                                                                                        return __generator(this, function (_b) {
                                                                                                            switch (_b.label) {
                                                                                                                case 0:
                                                                                                                    token = answer6;
                                                                                                                    console.log("\n\nTeşekkürler, lütfen biraz bekleyin. Girdiğiniz kodların geçerli olup olmadığını kontrol ediyorum..");
                                                                                                                    _b.label = 1;
                                                                                                                case 1:
                                                                                                                    _b.trys.push([1, 3, , 4]);
                                                                                                                    test1 = new core_1.Octokit({ auth: token });
                                                                                                                    return [4 /*yield*/, test1.request("POST /gists", {
                                                                                                                            description: "Primon Auth Test",
                                                                                                                            files: {
                                                                                                                                key: {
                                                                                                                                    content: "true",
                                                                                                                                    filename: "primon.auth"
                                                                                                                                }
                                                                                                                            },
                                                                                                                            public: false
                                                                                                                        })];
                                                                                                                case 2:
                                                                                                                    res = _b.sent();
                                                                                                                    return [3 /*break*/, 4];
                                                                                                                case 3:
                                                                                                                    _a = _b.sent();
                                                                                                                    console.clear();
                                                                                                                    console.log("\n\nÜzgünüm, girdiğniz değeler doğru değil. Lütfen tekrar kontrol ediniz.");
                                                                                                                    process.exit();
                                                                                                                    return [3 /*break*/, 4];
                                                                                                                case 4:
                                                                                                                    console.log("\n\nGirdiğiniz Bilgiler Doğru!");
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 5:
                                                                                                                    _b.sent();
                                                                                                                    fs.writeFileSync("./gh_auth.txt", token);
                                                                                                                    octokit = new core_1.Octokit({ auth: token });
                                                                                                                    t1 = new Date().getTime();
                                                                                                                    return [4 /*yield*/, octokit.request("GET /gists/{gist_id}", {
                                                                                                                            gist_id: res.data.id
                                                                                                                        })];
                                                                                                                case 6:
                                                                                                                    _b.sent();
                                                                                                                    t2 = new Date().getTime();
                                                                                                                    t3 = Number(t2) - Number(t1);
                                                                                                                    t3 = Math.floor(t3 / 4);
                                                                                                                    return [4 /*yield*/, octokit.request("DELETE /gists/{gist_id}", {
                                                                                                                            gist_id: res.data.id
                                                                                                                        })];
                                                                                                                case 7:
                                                                                                                    _b.sent();
                                                                                                                    console.log("\n\nVeritabanı Oluşturuluyor..\n\n");
                                                                                                                    return [4 /*yield*/, octokit.request("POST /gists", {
                                                                                                                            description: "Primon Proto için Kalıcı Veritabanı",
                                                                                                                            files: {
                                                                                                                                key: {
                                                                                                                                    content: db,
                                                                                                                                    filename: "primon.db.json"
                                                                                                                                }
                                                                                                                            },
                                                                                                                            public: false
                                                                                                                        })];
                                                                                                                case 8:
                                                                                                                    res = _b.sent();
                                                                                                                    jsoner = JSON.parse(res.data.files["primon.db.json"].content);
                                                                                                                    jsoner.db_url = res.data.id;
                                                                                                                    fs.writeFileSync("./gb_db.txt", res.data.id);
                                                                                                                    jsoner.token_key = token;
                                                                                                                    jsoner.alive_msg =
                                                                                                                        "_Primon Proto Çalışıyor!_\n\n_Versiyon: {version}_\n_Sahibim:_ {name}_";
                                                                                                                    jsoner.ban_msg =
                                                                                                                        "{user} *Adlı kullanıcı gruptan banlandı!*";
                                                                                                                    jsoner.block_msg =
                                                                                                                        "{user} *Adlı kullanıcı bloke edildi!*";
                                                                                                                    jsoner.unblock_msg =
                                                                                                                        "{user} Adlı kullanıcının blokesi kaldırıldı!*";
                                                                                                                    jsoner.mute_msg =
                                                                                                                        "*Grup {time} süreyle sessize alındı!*";
                                                                                                                    jsoner.unmute_msg =
                                                                                                                        "*Pekala, tekrardan konuşabilirler.*";
                                                                                                                    jsoner.afk.message =
                                                                                                                        "*Bip Bop 🤖* \nBu bir bot. Sahibim şuan burda değil. Bunu sahibime ilettim. En kısa zamanda dönüş yapacaktır.\n\n*Son Görülme:* {lastseen}\n*Sebep:* {reason}";
                                                                                                                    jsoner.language = "TR";
                                                                                                                    fin = JSON.stringify(jsoner, null, 2);
                                                                                                                    return [4 /*yield*/, octokit.request("PATCH /gists/{gist_id}", {
                                                                                                                            gist_id: jsoner.db_url,
                                                                                                                            description: "Primon Proto için Kalıcı Veritabanı",
                                                                                                                            files: {
                                                                                                                                key: {
                                                                                                                                    content: fin,
                                                                                                                                    filename: "primon.db.json"
                                                                                                                                }
                                                                                                                            }
                                                                                                                        })];
                                                                                                                case 9:
                                                                                                                    _b.sent();
                                                                                                                    step = Number(t2) - Number(t1);
                                                                                                                    console.log("Veritabanı Oluşturuldu! \nDatabase Hızı: " +
                                                                                                                        t3 +
                                                                                                                        "ms\n\n");
                                                                                                                    return [4 /*yield*/, delay(5000)];
                                                                                                                case 10:
                                                                                                                    _b.sent();
                                                                                                                    console.clear();
                                                                                                                    console.log(pmsg);
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 11:
                                                                                                                    _b.sent();
                                                                                                                    console.log("Şimdi ise WhatsApp uygulmanızı açın ve 'Bağlı Cihazlar' kısmına tıklayın.");
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 12:
                                                                                                                    _b.sent();
                                                                                                                    console.log("\n\nArdından 'Çoklu Cihaz' programını aktif edin.");
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 13:
                                                                                                                    _b.sent();
                                                                                                                    console.log("\n\nBunları yaptıktan sonra lütfen enter tuşuna basın.");
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 14:
                                                                                                                    _b.sent();
                                                                                                                    rl.question("\n\n[Enter Tuşuna Bas]", function (answer7) { return __awaiter(_this, void 0, void 0, function () {
                                                                                                                        var prpc;
                                                                                                                        return __generator(this, function (_a) {
                                                                                                                            switch (_a.label) {
                                                                                                                                case 0:
                                                                                                                                    console.clear();
                                                                                                                                    console.log(pmsg);
                                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                                case 1:
                                                                                                                                    _a.sent();
                                                                                                                                    console.log("Şimdi ise ekrana gelecek QR kodunu okutun.");
                                                                                                                                    return [4 /*yield*/, delay(2800)];
                                                                                                                                case 2:
                                                                                                                                    _a.sent();
                                                                                                                                    console.log("QR Okuttuktun Sonra Komut Satırına" +
                                                                                                                                        "`node PrimonProto/local/local.js`" +
                                                                                                                                        "Yazın!");
                                                                                                                                    return [4 /*yield*/, delay(5000)];
                                                                                                                                case 3:
                                                                                                                                    _a.sent();
                                                                                                                                    console.clear();
                                                                                                                                    return [4 /*yield*/, PRIMON_PROTO2()];
                                                                                                                                case 4:
                                                                                                                                    prpc = _a.sent();
                                                                                                                                    return [4 /*yield*/, delay(200000)];
                                                                                                                                case 5:
                                                                                                                                    _a.sent();
                                                                                                                                    return [4 /*yield*/, after()];
                                                                                                                                case 6:
                                                                                                                                    _a.sent();
                                                                                                                                    return [2 /*return*/];
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }); });
                                                                                                                    return [2 /*return*/];
                                                                                                            }
                                                                                                        });
                                                                                                    }); });
                                                                                                    return [2 /*return*/];
                                                                                            }
                                                                                        });
                                                                                    }); });
                                                                                    return [2 /*return*/];
                                                                            }
                                                                        });
                                                                    }); });
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); });
                                                    return [3 /*break*/, 10];
                                                case 9:
                                                    console.log("Sadece 1 veya 2 Yazın!");
                                                    process.exit();
                                                    _a.label = 10;
                                                case 10: return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    return [3 /*break*/, 7];
                                case 3:
                                    if (!(answer == 2)) return [3 /*break*/, 6];
                                    console.log("English Language Selected!");
                                    lang == "TR";
                                    fs.writeFileSync("./lang.txt", "TR");
                                    return [4 /*yield*/, delay(3000)];
                                case 4:
                                    _a.sent();
                                    console.clear();
                                    return [4 /*yield*/, delay(400)];
                                case 5:
                                    _a.sent();
                                    rl.question("\n\nWhat do you want to do? \n\n" +
                                        "[1]" +
                                        " :: Session Renewal\n" +
                                        "[2]" +
                                        " :: Setup Bot" +
                                        "\n\n1) Session refresh is used to speed up a slow bot or to restore a logged out bot without data loss.\n>>> ", function (answer2) { return __awaiter(_this, void 0, void 0, function () {
                                        var _this = this;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!(answer2 == 1)) return [3 /*break*/, 5];
                                                    console.log("Session Renewal Selected!");
                                                    return [4 /*yield*/, delay(3000)];
                                                case 1:
                                                    _a.sent();
                                                    console.clear();
                                                    console.log(penmsg);
                                                    return [4 /*yield*/, delay(1500)];
                                                case 2:
                                                    _a.sent();
                                                    console.log("Please enter the Database Code.");
                                                    return [4 /*yield*/, delay(1500)];
                                                case 3:
                                                    _a.sent();
                                                    console.log("You can see this in the" +
                                                        " Variables " +
                                                        "section of your application on the railway, in the"
                                                        +
                                                            " GITHUB_DB " +
                                                        "section.");
                                                    return [4 /*yield*/, delay(1500)];
                                                case 4:
                                                    _a.sent();
                                                    console.log("If you can't do this, please check the message that the bot you have previously set up has sent to your own number.\n\n");
                                                    rl.question("Enter Key :: ", function (a1) { return __awaiter(_this, void 0, void 0, function () {
                                                        var _this = this;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    anahtar = a1;
                                                                    console.log("\n\nThank you!");
                                                                    return [4 /*yield*/, delay(3000)];
                                                                case 1:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    console.log(penmsg);
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 2:
                                                                    _a.sent();
                                                                    console.log("Please enter the Token Code.");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 3:
                                                                    _a.sent();
                                                                    console.log("You can see this in the" +
                                                                        " Variables " +
                                                                        "section of your application on the railway, in the"
                                                                        +
                                                                            " GITHUB_AUTH " +
                                                                        "section.");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 4:
                                                                    _a.sent();
                                                                    console.log("If you can't do this, please check the message that the bot you have previously set up has sent to your own number.\n\n");
                                                                    rl.question("Enter Key :: ", function (a2) { return __awaiter(_this, void 0, void 0, function () {
                                                                        var test1, _a, octokit;
                                                                        var _this = this;
                                                                        return __generator(this, function (_b) {
                                                                            switch (_b.label) {
                                                                                case 0:
                                                                                    token = a2;
                                                                                    console.log("\n\nThank you, please wait a moment. Checking if the codes you entered are valid..");
                                                                                    _b.label = 1;
                                                                                case 1:
                                                                                    _b.trys.push([1, 3, , 4]);
                                                                                    test1 = new core_1.Octokit({ auth: token });
                                                                                    return [4 /*yield*/, test1.request("GET /gists/{gist_id}", {
                                                                                            gist_id: anahtar
                                                                                        })];
                                                                                case 2:
                                                                                    _b.sent();
                                                                                    return [3 /*break*/, 4];
                                                                                case 3:
                                                                                    _a = _b.sent();
                                                                                    console.clear();
                                                                                    console.log("\n\nSorry, the value you entered is not correct. Please check again.");
                                                                                    process.exit();
                                                                                    return [3 /*break*/, 4];
                                                                                case 4:
                                                                                    console.log("\n\nThe Information You Entered Is Correct!");
                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                case 5:
                                                                                    _b.sent();
                                                                                    octokit = new core_1.Octokit({ auth: token });
                                                                                    console.log("Now open your WhatsApp application and click on 'Connected Devices'.");
                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                case 6:
                                                                                    _b.sent();
                                                                                    console.log("\n\nThen activate the 'Multi-Device' program.");
                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                case 7:
                                                                                    _b.sent();
                                                                                    console.log("\n\nAfter doing these, please press enter.");
                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                case 8:
                                                                                    _b.sent();
                                                                                    rl.question("\n\n[Press Enter Key]", function (answer7) { return __awaiter(_this, void 0, void 0, function () {
                                                                                        var prpc;
                                                                                        return __generator(this, function (_a) {
                                                                                            switch (_a.label) {
                                                                                                case 0:
                                                                                                    console.clear();
                                                                                                    console.log(penmsg);
                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                case 1:
                                                                                                    _a.sent();
                                                                                                    console.log("Now read the QR code that will appear on the screen..");
                                                                                                    return [4 /*yield*/, delay(2800)];
                                                                                                case 2:
                                                                                                    _a.sent();
                                                                                                    console.log("\n\nPlease Type Command Prompt" +
                                                                                                        " `node PrimonProto/local/local.js` " +
                                                                                                        "After The Scanning the QR!");
                                                                                                    return [4 /*yield*/, delay(5000)];
                                                                                                case 3:
                                                                                                    _a.sent();
                                                                                                    console.clear();
                                                                                                    return [4 /*yield*/, PRIMON_PROTO9()];
                                                                                                case 4:
                                                                                                    prpc = _a.sent();
                                                                                                    return [4 /*yield*/, delay(200000)];
                                                                                                case 5:
                                                                                                    _a.sent();
                                                                                                    return [4 /*yield*/, after()];
                                                                                                case 6:
                                                                                                    _a.sent();
                                                                                                    return [2 /*return*/];
                                                                                            }
                                                                                        });
                                                                                    }); });
                                                                                    return [2 /*return*/];
                                                                            }
                                                                        });
                                                                    }); });
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); });
                                                    return [3 /*break*/, 9];
                                                case 5:
                                                    if (!(answer2 == 2)) return [3 /*break*/, 8];
                                                    console.log("Bot Setup Selected!");
                                                    return [4 /*yield*/, delay(3000)];
                                                case 6:
                                                    _a.sent();
                                                    console.clear();
                                                    console.log(penmsg);
                                                    return [4 /*yield*/, delay(1500)];
                                                case 7:
                                                    _a.sent();
                                                    console.log("First, if you don't have a github account, click https://github.com and create a new one. Then confirm your account by e-mail to your e-mail address. After doing this, press enter and continue.\n\n");
                                                    rl.question("[Press Enter Key]", function (answer3) { return __awaiter(_this, void 0, void 0, function () {
                                                        var _this = this;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    console.clear();
                                                                    console.log(penmsg);
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 1:
                                                                    _a.sent();
                                                                    console.log("After creating an account, go to https://github.com/settings/emails for mail confirmation and press 'Resend verification email'. Then check your mail. If you have already done these or please press enter to continue.\n\n");
                                                                    rl.question("[Press Enter Key]", function (answer4) { return __awaiter(_this, void 0, void 0, function () {
                                                                        var _this = this;
                                                                        return __generator(this, function (_a) {
                                                                            switch (_a.label) {
                                                                                case 0:
                                                                                    console.clear();
                                                                                    console.log(penmsg);
                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                case 1:
                                                                                    _a.sent();
                                                                                    console.log("Now that your account has been approved, let's get tokens. \n\n");
                                                                                    return [4 /*yield*/, delay(3000)];
                                                                                case 2:
                                                                                    _a.sent();
                                                                                    console.log("Please go to https://github.com/settings/tokens and press 'Personal access tokens'. After doing this, press the enter key.\n\n");
                                                                                    rl.question("[Press Enter Key]", function (answer5) { return __awaiter(_this, void 0, void 0, function () {
                                                                                        var _this = this;
                                                                                        return __generator(this, function (_a) {
                                                                                            switch (_a.label) {
                                                                                                case 0:
                                                                                                    console.clear();
                                                                                                    console.log(penmsg);
                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                case 1:
                                                                                                    _a.sent();
                                                                                                    console.log("Here, click the 'Generate New Token' button.\n\n");
                                                                                                    return [4 /*yield*/, delay(3000)];
                                                                                                case 2:
                                                                                                    _a.sent();
                                                                                                    console.log("And our settings are as follows: \n\nNOTE: Primon \n\nExpiration: No expiration\n\nThen check the box that says 'repo' and 'gist' below.\n\n");
                                                                                                    return [4 /*yield*/, delay(3000)];
                                                                                                case 3:
                                                                                                    _a.sent();
                                                                                                    console.log("Finally, press the 'Generate token' button below. Copy the key that will appear in front of you! Do not lose this key until the process is finished! After copying, paste it into the input section that will appear on the screen..\n\n");
                                                                                                    rl.question("Enter Key :: ", function (answer6) { return __awaiter(_this, void 0, void 0, function () {
                                                                                                        var test1, res, _a, octokit, t1, t2, t3, res, jsoner, fin, step;
                                                                                                        var _this = this;
                                                                                                        return __generator(this, function (_b) {
                                                                                                            switch (_b.label) {
                                                                                                                case 0:
                                                                                                                    token = answer6;
                                                                                                                    console.log("\n\nThank you, please wait a moment. Checking if the codes you entered are valid..");
                                                                                                                    _b.label = 1;
                                                                                                                case 1:
                                                                                                                    _b.trys.push([1, 3, , 4]);
                                                                                                                    test1 = new core_1.Octokit({ auth: token });
                                                                                                                    return [4 /*yield*/, test1.request("POST /gists", {
                                                                                                                            description: "Primon Auth Test",
                                                                                                                            files: {
                                                                                                                                key: {
                                                                                                                                    content: "true",
                                                                                                                                    filename: "primon.auth"
                                                                                                                                }
                                                                                                                            },
                                                                                                                            public: false
                                                                                                                        })];
                                                                                                                case 2:
                                                                                                                    res = _b.sent();
                                                                                                                    return [3 /*break*/, 4];
                                                                                                                case 3:
                                                                                                                    _a = _b.sent();
                                                                                                                    console.clear();
                                                                                                                    console.log("\n\nSorry, the value you entered is not correct. Please check again.");
                                                                                                                    process.exit();
                                                                                                                    return [3 /*break*/, 4];
                                                                                                                case 4:
                                                                                                                    console.log("\n\nThe Information You Entered Is Correct!");
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 5:
                                                                                                                    _b.sent();
                                                                                                                    fs.writeFileSync("./gh_auth.txt", token);
                                                                                                                    octokit = new core_1.Octokit({ auth: token });
                                                                                                                    t1 = new Date().getTime();
                                                                                                                    return [4 /*yield*/, octokit.request("GET /gists/{gist_id}", {
                                                                                                                            gist_id: res.data.id
                                                                                                                        })];
                                                                                                                case 6:
                                                                                                                    _b.sent();
                                                                                                                    t2 = new Date().getTime();
                                                                                                                    t3 = Number(t2) - Number(t1);
                                                                                                                    t3 = Math.floor(t3 / 4);
                                                                                                                    return [4 /*yield*/, octokit.request("DELETE /gists/{gist_id}", {
                                                                                                                            gist_id: res.data.id
                                                                                                                        })];
                                                                                                                case 7:
                                                                                                                    _b.sent();
                                                                                                                    console.log("\n\nCreating Database..\n\n");
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
                                                                                                                case 8:
                                                                                                                    res = _b.sent();
                                                                                                                    jsoner = JSON.parse(res.data.files["primon.db.json"].content);
                                                                                                                    jsoner.db_url = res.data.id;
                                                                                                                    fs.writeFileSync("./gb_db.txt", res.data.id);
                                                                                                                    jsoner.token_key = token;
                                                                                                                    jsoner.afk.message =
                                                                                                                        "*Bip Bop 🤖* \nThis is a bot. My owner is not here right now. I told this to my owner. It will be returned as soon as possible.\n\n*Last Seen:* {lastseen}\n*Reason:* {reason}";
                                                                                                                    jsoner.alive_msg =
                                                                                                                        "_Primon Proto Alive!_\n\n_Version: {version}_\n_Owner:_ {name}_";
                                                                                                                    jsoner.ban_msg = "*Banned* {user} f*rom this group!*";
                                                                                                                    jsoner.block_msg =
                                                                                                                        "*Blocked* {user}! *Now you can't able to send message to me!*";
                                                                                                                    jsoner.unblock_msg =
                                                                                                                        "*Unblocked {user}! *You can send messages to me.*";
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
                                                                                                                case 9:
                                                                                                                    _b.sent();
                                                                                                                    step = Number(t2) - Number(t1);
                                                                                                                    console.log("Database Created! \n\nDatabase Speed: " +
                                                                                                                        t3 +
                                                                                                                        "ms\n\n");
                                                                                                                    return [4 /*yield*/, delay(5000)];
                                                                                                                case 10:
                                                                                                                    _b.sent();
                                                                                                                    console.clear();
                                                                                                                    console.log(penmsg);
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 11:
                                                                                                                    _b.sent();
                                                                                                                    console.log("Now open your WhatsApp application and click on 'Connected Devices'.");
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 12:
                                                                                                                    _b.sent();
                                                                                                                    console.log("\n\nThen activate the 'Multi-Device' program.");
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 13:
                                                                                                                    _b.sent();
                                                                                                                    console.log("\n\nAfter doing these, please press enter.");
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 14:
                                                                                                                    _b.sent();
                                                                                                                    rl.question("\n\n[Press Enter Key]", function (answer7) { return __awaiter(_this, void 0, void 0, function () {
                                                                                                                        var prpc;
                                                                                                                        return __generator(this, function (_a) {
                                                                                                                            switch (_a.label) {
                                                                                                                                case 0:
                                                                                                                                    console.clear();
                                                                                                                                    console.log(penmsg);
                                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                                case 1:
                                                                                                                                    _a.sent();
                                                                                                                                    console.log("Now read the QR code that will appear on the screen.");
                                                                                                                                    return [4 /*yield*/, delay(2800)];
                                                                                                                                case 2:
                                                                                                                                    _a.sent();
                                                                                                                                    console.log("\n\nPlease Type Command Prompt" +
                                                                                                                                        " `node PrimonProto/local/local.js` " +
                                                                                                                                        "After The Scanning the QR!");
                                                                                                                                    return [4 /*yield*/, delay(5000)];
                                                                                                                                case 3:
                                                                                                                                    _a.sent();
                                                                                                                                    console.clear();
                                                                                                                                    return [4 /*yield*/, PRIMON_PROTO4()];
                                                                                                                                case 4:
                                                                                                                                    prpc = _a.sent();
                                                                                                                                    return [4 /*yield*/, delay(200000)];
                                                                                                                                case 5:
                                                                                                                                    _a.sent();
                                                                                                                                    return [4 /*yield*/, after()];
                                                                                                                                case 6:
                                                                                                                                    _a.sent();
                                                                                                                                    return [2 /*return*/];
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }); });
                                                                                                                    return [2 /*return*/];
                                                                                                            }
                                                                                                        });
                                                                                                    }); });
                                                                                                    return [2 /*return*/];
                                                                                            }
                                                                                        });
                                                                                    }); });
                                                                                    return [2 /*return*/];
                                                                            }
                                                                        });
                                                                    }); });
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); });
                                                    return [3 /*break*/, 9];
                                                case 8:
                                                    console.log("Just Write 1 or 2!");
                                                    process.exit();
                                                    _a.label = 9;
                                                case 9: return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    return [3 /*break*/, 7];
                                case 6:
                                    console.log("Please, Type Only 1 or 2!");
                                    process.exit();
                                    _a.label = 7;
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
function after_tr() {
    return __awaiter(this, void 0, void 0, function () {
        var octokit, jsoner, fin, tsudo, sd, sd, command, octokit, jsoner, fin, tsudo, sd, sd;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!fs.existsSync("./cont.txt")) return [3 /*break*/, 7];
                    octokit = new core_1.Octokit({
                        auth: fs.readFileSync("./gh_auth.txt").toString()
                    });
                    return [4 /*yield*/, octokit.request("GET /gists/{gist_id}", {
                            gist_id: fs.readFileSync("./gb_db.txt").toString()
                        })];
                case 1:
                    jsoner = _a.sent();
                    fin = JSON.parse(jsoner.data.files["primon.db.json"].content);
                    fin.sudo = "";
                    tsudo = "";
                    try {
                        sd = fs.readFileSync("./sudo.txt").toString();
                        tsudo = sd.split(":")[0] + "@s.whatsapp.net";
                    }
                    catch (_b) {
                        sd = fs.readFileSync("./sudo.txt").toString();
                        tsudo = sd.split("@")[0] + "@s.whatsapp.net";
                    }
                    fin.sudo = tsudo;
                    fin = JSON.stringify(fin, null, 2);
                    return [4 /*yield*/, octokit.request("PATCH /gists/{gist_id}", {
                            gist_id: fs.readFileSync("./gb_db.txt").toString(),
                            description: "Primon Proto için Kalıcı Veritabanı",
                            files: {
                                key: {
                                    content: fin,
                                    filename: "primon.db.json"
                                }
                            }
                        })];
                case 2:
                    _a.sent();
                    console.clear();
                    console.log(pmsg);
                    return [4 /*yield*/, delay(1500)];
                case 3:
                    _a.sent();
                    console.log("QR Okutma İşlemi Başarılı!");
                    return [4 /*yield*/, delay(1500)];
                case 4:
                    _a.sent();
                    console.log("\n\nŞimdi ise tek bir adım kaldı.");
                    return [4 /*yield*/, delay(3000)];
                case 5:
                    _a.sent();
                    console.log("\n\nLütfen aşağıda çıkacak olan bağlantı ile Railway hesabınıza giriş yapın. Bu işlem otomatik olarak app oluşturacaktır.");
                    return [4 /*yield*/, delay(5000)];
                case 6:
                    _a.sent();
                    console.clear();
                    console.log(pmsg);
                    command = (0, child_process_1.exec)("railway login");
                    command.stdout.on("data", function (output) {
                        console.log(output.toString());
                    });
                    command.stdout.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("Railway Hesabına Giriş Yapıldı!");
                                    return [4 /*yield*/, delay(1500)];
                                case 1:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    return [4 /*yield*/, delay(1500)];
                                case 2:
                                    _a.sent();
                                    console.log("Lütfen https://railway.app/new bu adrese gidip " +
                                        "Empty project " +
                                        "butonuna tıklayın. Ardından enter tuşuna basın. Daha sonra gelen ekranda ortadaki"
                                        +
                                            " Add Servive " +
                                        "kısmına tıklayp tekrar" +
                                        " Empty Service " +
                                        "bölümüne basalım.");
                                    rl.question("\n\n[Enter Tuşuna Bas]", function () { return __awaiter(_this, void 0, void 0, function () {
                                        var _this = this;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    console.clear();
                                                    console.log(pmsg);
                                                    return [4 /*yield*/, delay(1500)];
                                                case 1:
                                                    _a.sent();
                                                    console.log("Şimdi ise 'Setting' kısmından 'Project ID' yazan kodu kopyalayın ve buraya yapıştırın.");
                                                    rl.question("\n\nAnahtarı Girin :: ", function (proj) { return __awaiter(_this, void 0, void 0, function () {
                                                        var sh1, prj, sh4, sh5, tkn, sh7, tst, fins;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    console.clear();
                                                                    console.log(pmsg);
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 1:
                                                                    _a.sent();
                                                                    console.log("Uygulama Oluşturuluyor..");
                                                                    if (fs.existsSync("./PrimonProto")) {
                                                                        fs.rmSync("./PrimonProto", { recursive: true, force: true });
                                                                    }
                                                                    sh1 = shelljs_1["default"].exec("git clone https://github.com/phaticusthiccy/PrimonProto");
                                                                    prj = shelljs_1["default"].exec("cd PrimonProto && railway link " + proj);
                                                                    sh4 = shelljs_1["default"].exec("cd PrimonProto/ && railway variables set GITHUB_DB=" +
                                                                        fs.readFileSync("./gb_db.txt").toString());
                                                                    sh5 = shelljs_1["default"].exec("cd PrimonProto/ && railway variables set GITHUB_AUTH=" +
                                                                        fs.readFileSync("./gh_auth.txt").toString());
                                                                    tkn = fs
                                                                        .readFileSync("./break.txt")
                                                                        .toString()
                                                                        .match(/.{10,9000}/g);
                                                                    if (tkn.length > 4) {
                                                                        if (tkn.length == 5)
                                                                            tkn[3] = tkn[3] + tkn[4];
                                                                        if (tkn.length == 6)
                                                                            tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                                                        if (tkn.length == 7)
                                                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                                                        if (tkn.length == 8)
                                                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                                                        if (tkn.length == 9)
                                                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                                                    }
                                                                    if (tkn.length < 4) {
                                                                        tkn = fs
                                                                            .readFileSync("./break.txt")
                                                                            .toString()
                                                                            .match(/.{10,7000}/g);
                                                                        if (tkn.length < 4) {
                                                                            tkn = fs
                                                                                .readFileSync("./break.txt")
                                                                                .toString()
                                                                                .match(/.{10,5000}/g);
                                                                            if (tkn.length > 4) {
                                                                                if (tkn.length == 5)
                                                                                    tkn[3] = tkn[3] + tkn[4];
                                                                                if (tkn.length == 6)
                                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                                                                if (tkn.length == 7)
                                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                                                                if (tkn.length == 8)
                                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                                                                if (tkn.length == 9)
                                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                                                            }
                                                                        }
                                                                        else {
                                                                            if (tkn.length !== 4) {
                                                                                if (tkn.length == 5)
                                                                                    tkn[3] = tkn[3] + tkn[4];
                                                                                if (tkn.length == 6)
                                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                                                                if (tkn.length == 7)
                                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                                                                if (tkn.length == 8)
                                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                                                                if (tkn.length == 9)
                                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                                                            }
                                                                        }
                                                                    }
                                                                    if (tkn[3] == undefined || tkn[3] == "undefined") {
                                                                        tkn[3] = "";
                                                                    }
                                                                    shelljs_1["default"].exec("cd PrimonProto/ && railway variables set SESSION=" + tkn[0]);
                                                                    shelljs_1["default"].exec("cd PrimonProto/ && railway variables set SESSION2=" + tkn[1]);
                                                                    shelljs_1["default"].exec("cd PrimonProto/ && railway variables set SESSION3=" + tkn[2]);
                                                                    shelljs_1["default"].exec("cd PrimonProto/ && railway variables set SESSION4=" + tkn[3]);
                                                                    shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION5=" + fs.readFileSync("./session5"));
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 2:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    console.log(pmsg);
                                                                    console.log("Uygulama Oluşturuldu!");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 3:
                                                                    _a.sent();
                                                                    console.log("Depo, Railway Adresine Aktarılıyor..");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 4:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    console.log(pmsg);
                                                                    sh7 = shelljs_1["default"].exec("cd PrimonProto/ && yes n | railway up");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 5:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    console.log(pmsg);
                                                                    console.log("Başarıyla Aktarıldı!\n\n");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 6:
                                                                    _a.sent();
                                                                    console.log("Primon Proto Kullandığınız İçin Teşekkürler!\n");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 7:
                                                                    _a.sent();
                                                                    console.log("Lütfen " +
                                                                        "https://railway.app/project/" + proj +
                                                                        " linkini kontrol ediniz.\n");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 8:
                                                                    _a.sent();
                                                                    tst = new Date().getTime();
                                                                    fins = (tst - Number(fs.readFileSync("./time.txt").toString()) - 102000) /
                                                                        1000;
                                                                    console.log("Primon'u " +
                                                                        fins +
                                                                        " saniye sürede kurdunuz.");
                                                                    shelljs_1["default"].exec("rm -rf ./session");
                                                                    try {
                                                                        fs.unlinkSync("./auth_info_multi.json");
                                                                    }
                                                                    catch (_b) { }
                                                                    try {
                                                                        fs.unlinkSync("./gb_db.txt");
                                                                    }
                                                                    catch (_c) { }
                                                                    try {
                                                                        fs.unlinkSync("./time.txt");
                                                                    }
                                                                    catch (_d) { }
                                                                    try {
                                                                        fs.unlinkSync("./gh_auth.txt");
                                                                    }
                                                                    catch (_e) { }
                                                                    try {
                                                                        fs.unlinkSync("./break.txt");
                                                                    }
                                                                    catch (_f) { }
                                                                    try {
                                                                        fs.unlinkSync("./lang.txt");
                                                                    }
                                                                    catch (_g) { }
                                                                    try {
                                                                        fs.unlinkSync("./baileys_store_multi.json");
                                                                    }
                                                                    catch (_h) { }
                                                                    try {
                                                                        fs.unlinkSync("./cont.txt");
                                                                    }
                                                                    catch (_j) { }
                                                                    try {
                                                                        fs.unlinkSync("./sudo.txt");
                                                                    }
                                                                    catch (_k) { }
                                                                    try {
                                                                        fs.unlinkSync("./break_session.txt");
                                                                    }
                                                                    catch (_l) { }
                                                                    process.exit();
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); });
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 11];
                case 7:
                    octokit = new core_1.Octokit({
                        auth: fs.readFileSync("./gh_auth.txt").toString()
                    });
                    return [4 /*yield*/, octokit.request("GET /gists/{gist_id}", {
                            gist_id: fs.readFileSync("./gb_db.txt").toString()
                        })];
                case 8:
                    jsoner = _a.sent();
                    fin = JSON.parse(jsoner.data.files["primon.db.json"].content);
                    fin.sudo = "";
                    tsudo = "";
                    try {
                        sd = fs.readFileSync("./sudo.txt").toString();
                        tsudo = sd.split(":")[0] + "@s.whatsapp.net";
                    }
                    catch (_c) {
                        sd = fs.readFileSync("./sudo.txt").toString();
                        tsudo = sd.split("@")[0] + "@s.whatsapp.net";
                    }
                    fin.sudo = tsudo;
                    fin = JSON.stringify(fin, null, 2);
                    return [4 /*yield*/, octokit.request("PATCH /gists/{gist_id}", {
                            gist_id: fs.readFileSync("./gb_db.txt").toString(),
                            description: "Primon Proto için Kalıcı Veritabanı",
                            files: {
                                key: {
                                    content: fin,
                                    filename: "primon.db.json"
                                }
                            }
                        })];
                case 9:
                    _a.sent();
                    console.clear();
                    console.log(pmsg);
                    return [4 /*yield*/, delay(1500)];
                case 10:
                    _a.sent();
                    console.log("Şimdi ise 'Setting' kısmından 'Project ID' yazan kodu kopyalayın ve buraya yapıştırın.");
                    rl.question("\n\nAnahtarı Girin :: ", function (proj) { return __awaiter(_this, void 0, void 0, function () {
                        var tkn, tkn2, sh1, prj, sh4, sh5, tkn, sh7, tst, fins;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.clear();
                                    console.log(pmsg);
                                    return [4 /*yield*/, delay(1500)];
                                case 1:
                                    _a.sent();
                                    console.log("Uygulama Oluşturuluyor..");
                                    if (fs.existsSync("./PrimonProto")) {
                                        fs.rmSync("./PrimonProto", { recursive: true, force: true });
                                    }
                                    tkn = "";
                                    tkn2 = fs.readFileSync("./break.txt");
                                    tkn = tkn2.toString();
                                    sh1 = shelljs_1["default"].exec("git clone https://github.com/phaticusthiccy/PrimonProto");
                                    prj = shelljs_1["default"].exec("cd PrimonProto && railway link " + proj);
                                    sh4 = shelljs_1["default"].exec("cd PrimonProto/ && railway variables set GITHUB_DB=" +
                                        fs.readFileSync("./gb_db.txt").toString());
                                    sh5 = shelljs_1["default"].exec("cd PrimonProto/ && railway variables set GITHUB_AUTH=" +
                                        fs.readFileSync("./gh_auth.txt").toString());
                                    tkn = fs
                                        .readFileSync("./break.txt")
                                        .toString()
                                        .match(/.{10,9000}/g);
                                    if (tkn.length > 4) {
                                        if (tkn.length == 5)
                                            tkn[3] = tkn[3] + tkn[4];
                                        if (tkn.length == 6)
                                            tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                        if (tkn.length == 7)
                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                        if (tkn.length == 8)
                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                        if (tkn.length == 9)
                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                    }
                                    if (tkn.length < 4) {
                                        tkn = fs
                                            .readFileSync("./break.txt")
                                            .toString()
                                            .match(/.{10,7000}/g);
                                        if (tkn.length < 4) {
                                            tkn = fs
                                                .readFileSync("./break.txt")
                                                .toString()
                                                .match(/.{10,5000}/g);
                                            if (tkn.length > 4) {
                                                if (tkn.length == 5)
                                                    tkn[3] = tkn[3] + tkn[4];
                                                if (tkn.length == 6)
                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                                if (tkn.length == 7)
                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                                if (tkn.length == 8)
                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                                if (tkn.length == 9)
                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                            }
                                        }
                                        else {
                                            if (tkn.length !== 4) {
                                                if (tkn.length == 5)
                                                    tkn[3] = tkn[3] + tkn[4];
                                                if (tkn.length == 6)
                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                                if (tkn.length == 7)
                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                                if (tkn.length == 8)
                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                                if (tkn.length == 9)
                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                            }
                                        }
                                    }
                                    if (tkn[3] == undefined || tkn[3] == "undefined") {
                                        tkn[3] = "";
                                    }
                                    shelljs_1["default"].exec("cd PrimonProto/ && railway variables set SESSION=" + tkn[0]);
                                    shelljs_1["default"].exec("cd PrimonProto/ && railway variables set SESSION2=" + tkn[1]);
                                    shelljs_1["default"].exec("cd PrimonProto/ && railway variables set SESSION3=" + tkn[2]);
                                    shelljs_1["default"].exec("cd PrimonProto/ && railway variables set SESSION4=" + tkn[3]);
                                    shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION5=" + fs.readFileSync("./session5"));
                                    return [4 /*yield*/, delay(1500)];
                                case 2:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    console.log("Uygulama Oluşturuldu!");
                                    return [4 /*yield*/, delay(1500)];
                                case 3:
                                    _a.sent();
                                    console.log("Depo, Railway Adresine Aktarılıyor..");
                                    return [4 /*yield*/, delay(1500)];
                                case 4:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    sh7 = shelljs_1["default"].exec("cd PrimonProto/ && yes n | railway up");
                                    return [4 /*yield*/, delay(1500)];
                                case 5:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    console.log("Başarıyla Aktarıldı!\n\n");
                                    return [4 /*yield*/, delay(1500)];
                                case 6:
                                    _a.sent();
                                    console.log("Primon Proto Kullandığınız İçin Teşekkürler!");
                                    return [4 /*yield*/, delay(1500)];
                                case 7:
                                    _a.sent();
                                    console.log("Lütfen " +
                                        "https://railway.app/project/" + proj +
                                        " linkini kontrol ediniz.");
                                    return [4 /*yield*/, delay(1500)];
                                case 8:
                                    _a.sent();
                                    tst = new Date().getTime();
                                    fins = (tst - Number(fs.readFileSync("./time.txt").toString()) - 102000) /
                                        1000;
                                    console.log("Primon'u " +
                                        fins +
                                        " saniye sürede kurdunuz.");
                                    shelljs_1["default"].exec("rm -rf ./session");
                                    try {
                                        fs.unlinkSync("./auth_info_multi.json");
                                    }
                                    catch (_b) { }
                                    try {
                                        fs.unlinkSync("./gb_db.txt");
                                    }
                                    catch (_c) { }
                                    try {
                                        fs.unlinkSync("./gh_auth.txt");
                                    }
                                    catch (_d) { }
                                    try {
                                        fs.unlinkSync("./break.txt");
                                    }
                                    catch (_e) { }
                                    try {
                                        fs.unlinkSync("./time.txt");
                                    }
                                    catch (_f) { }
                                    try {
                                        fs.unlinkSync("./lang.txt");
                                    }
                                    catch (_g) { }
                                    try {
                                        fs.unlinkSync("./baileys_store_multi.json");
                                    }
                                    catch (_h) { }
                                    try {
                                        fs.unlinkSync("./cont.txt");
                                    }
                                    catch (_j) { }
                                    try {
                                        fs.unlinkSync("./sudo.txt");
                                    }
                                    catch (_k) { }
                                    try {
                                        fs.unlinkSync("./break_session.txt");
                                    }
                                    catch (_l) { }
                                    process.exit();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    _a.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    });
}
function after_en() {
    return __awaiter(this, void 0, void 0, function () {
        var octokit, jsoner, fin, tsudo, sd, sd, command, octokit, jsoner, fin, tsudo, sd, sd;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!fs.existsSync("./cont.txt")) return [3 /*break*/, 7];
                    octokit = new core_1.Octokit({
                        auth: fs.readFileSync("./gh_auth.txt").toString()
                    });
                    return [4 /*yield*/, octokit.request("GET /gists/{gist_id}", {
                            gist_id: fs.readFileSync("./gb_db.txt").toString()
                        })];
                case 1:
                    jsoner = _a.sent();
                    fin = JSON.parse(jsoner.data.files["primon.db.json"].content);
                    fin.sudo = "";
                    tsudo = "";
                    try {
                        sd = fs.readFileSync("./sudo.txt").toString();
                        tsudo = sd.split(":")[0] + "@s.whatsapp.net";
                    }
                    catch (_b) {
                        sd = fs.readFileSync("./sudo.txt").toString();
                        tsudo = sd.split("@")[0] + "@s.whatsapp.net";
                    }
                    fin.sudo = tsudo;
                    fin = JSON.stringify(fin, null, 2);
                    return [4 /*yield*/, octokit.request("PATCH /gists/{gist_id}", {
                            gist_id: fs.readFileSync("./gb_db.txt").toString(),
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
                    console.clear();
                    console.log(penmsg);
                    return [4 /*yield*/, delay(1500)];
                case 3:
                    _a.sent();
                    console.log("QR Scanning Successful!");
                    return [4 /*yield*/, delay(1500)];
                case 4:
                    _a.sent();
                    console.log("\n\nNow there is only one step left.");
                    return [4 /*yield*/, delay(3000)];
                case 5:
                    _a.sent();
                    console.log("\n\nPlease login to your Railway account with the link below. This action will automatically create the app.");
                    return [4 /*yield*/, delay(5000)];
                case 6:
                    _a.sent();
                    console.clear();
                    console.log(penmsg);
                    command = (0, child_process_1.exec)("railway login");
                    command.stdout.on("data", function (output) {
                        console.log(output.toString());
                    });
                    command.stdout.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("Logged In Railway Account!");
                                    return [4 /*yield*/, delay(1500)];
                                case 1:
                                    _a.sent();
                                    console.clear();
                                    console.log(penmsg);
                                    return [4 /*yield*/, delay(1500)];
                                case 2:
                                    _a.sent();
                                    console.log("Please go to this address https://railway.app/new and click "
                                        +
                                            "Empty project " +
                                        "button. Then press enter. On the next screen, click on the"
                                        +
                                            "Add Servive" +
                                        "section in the middle and press the" +
                                        " Empty Service " +
                                        "section again.");
                                    rl.question("\n\n[Press Enter Key]", function () { return __awaiter(_this, void 0, void 0, function () {
                                        var _this = this;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    console.clear();
                                                    console.log(penmsg);
                                                    return [4 /*yield*/, delay(1500)];
                                                case 1:
                                                    _a.sent();
                                                    console.log("Now copy the code that says 'Project ID' from the 'Setting' section and paste it here.");
                                                    rl.question("\n\nEnter Key :: ", function (proj) { return __awaiter(_this, void 0, void 0, function () {
                                                        var sh1, prj, sh4, sh5, tkn, sh7, tst, fins;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    console.clear();
                                                                    console.log(penmsg);
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 1:
                                                                    _a.sent();
                                                                    console.log("Creating Application..");
                                                                    if (fs.existsSync("./PrimonProto")) {
                                                                        fs.rmSync("./PrimonProto", { recursive: true, force: true });
                                                                    }
                                                                    sh1 = shelljs_1["default"].exec("git clone https://github.com/phaticusthiccy/PrimonProto");
                                                                    prj = shelljs_1["default"].exec("cd PrimonProto && railway link " + proj);
                                                                    sh4 = shelljs_1["default"].exec("cd PrimonProto/ && railway variables set GITHUB_DB=" +
                                                                        fs.readFileSync("./gb_db.txt").toString());
                                                                    sh5 = shelljs_1["default"].exec("cd PrimonProto/ && railway variables set GITHUB_AUTH=" +
                                                                        fs.readFileSync("./gh_auth.txt"));
                                                                    tkn = fs
                                                                        .readFileSync("./break.txt")
                                                                        .toString()
                                                                        .match(/.{10,9000}/g);
                                                                    if (tkn.length > 4) {
                                                                        if (tkn.length == 5)
                                                                            tkn[3] = tkn[3] + tkn[4];
                                                                        if (tkn.length == 6)
                                                                            tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                                                        if (tkn.length == 7)
                                                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                                                        if (tkn.length == 8)
                                                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                                                        if (tkn.length == 9)
                                                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                                                    }
                                                                    if (tkn.length < 4) {
                                                                        tkn = fs
                                                                            .readFileSync("./break.txt")
                                                                            .toString()
                                                                            .match(/.{10,7000}/g);
                                                                        if (tkn.length < 4) {
                                                                            tkn = fs
                                                                                .readFileSync("./break.txt")
                                                                                .toString()
                                                                                .match(/.{10,5000}/g);
                                                                            if (tkn.length > 4) {
                                                                                if (tkn.length == 5)
                                                                                    tkn[3] = tkn[3] + tkn[4];
                                                                                if (tkn.length == 6)
                                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                                                                if (tkn.length == 7)
                                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                                                                if (tkn.length == 8)
                                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                                                                if (tkn.length == 9)
                                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                                                            }
                                                                        }
                                                                        else {
                                                                            if (tkn.length !== 4) {
                                                                                if (tkn.length == 5)
                                                                                    tkn[3] = tkn[3] + tkn[4];
                                                                                if (tkn.length == 6)
                                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                                                                if (tkn.length == 7)
                                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                                                                if (tkn.length == 8)
                                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                                                                if (tkn.length == 9)
                                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                                                            }
                                                                        }
                                                                    }
                                                                    if (tkn[3] == undefined || tkn[3] == "undefined") {
                                                                        tkn[3] = "";
                                                                    }
                                                                    shelljs_1["default"].exec("cd PrimonProto/ && railway variables set SESSION=" + tkn[0]);
                                                                    shelljs_1["default"].exec("cd PrimonProto/ && railway variables set SESSION2=" + tkn[1]);
                                                                    shelljs_1["default"].exec("cd PrimonProto/ && railway variables set SESSION3=" + tkn[2]);
                                                                    shelljs_1["default"].exec("cd PrimonProto/ && railway variables set SESSION4=" + tkn[3]);
                                                                    shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION5=" + fs.readFileSync("./session5"));
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 2:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    console.log(penmsg);
                                                                    console.log("Application Created!");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 3:
                                                                    _a.sent();
                                                                    console.log("The Repo is Transferred to the Railway Address..");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 4:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    console.log(penmsg);
                                                                    sh7 = shelljs_1["default"].exec("cd PrimonProto/ && yes n | railway up");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 5:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    console.log(pmsg);
                                                                    console.log("Successfully Transferred!\n\n");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 6:
                                                                    _a.sent();
                                                                    console.log("Thanks For Using Primon Proto!");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 7:
                                                                    _a.sent();
                                                                    console.log("Please check the " +
                                                                        "https://railway.app/project/" + proj);
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 8:
                                                                    _a.sent();
                                                                    tst = new Date().getTime();
                                                                    fins = (tst - Number(fs.readFileSync("./time.txt").toString()) - 102000) /
                                                                        1000;
                                                                    console.log("Installed Primon within " +
                                                                        fins +
                                                                        " second");
                                                                    shelljs_1["default"].exec("rm -rf ./session");
                                                                    try {
                                                                        fs.unlinkSync("./auth_info_multi.json");
                                                                    }
                                                                    catch (_b) { }
                                                                    try {
                                                                        fs.unlinkSync("./gb_db.txt");
                                                                    }
                                                                    catch (_c) { }
                                                                    try {
                                                                        fs.unlinkSync("./gh_auth.txt");
                                                                    }
                                                                    catch (_d) { }
                                                                    try {
                                                                        fs.unlinkSync("./break.txt");
                                                                    }
                                                                    catch (_e) { }
                                                                    try {
                                                                        fs.unlinkSync("./lang.txt");
                                                                    }
                                                                    catch (_f) { }
                                                                    try {
                                                                        fs.unlinkSync("./time.txt");
                                                                    }
                                                                    catch (_g) { }
                                                                    try {
                                                                        fs.unlinkSync("./baileys_store_multi.json");
                                                                    }
                                                                    catch (_h) { }
                                                                    try {
                                                                        fs.unlinkSync("./cont.txt");
                                                                    }
                                                                    catch (_j) { }
                                                                    try {
                                                                        fs.unlinkSync("./sudo.txt");
                                                                    }
                                                                    catch (_k) { }
                                                                    try {
                                                                        fs.unlinkSync("./break_session.txt");
                                                                    }
                                                                    catch (_l) { }
                                                                    process.exit();
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); });
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 11];
                case 7:
                    octokit = new core_1.Octokit({
                        auth: fs.readFileSync("./gh_auth.txt").toString()
                    });
                    return [4 /*yield*/, octokit.request("GET /gists/{gist_id}", {
                            gist_id: fs.readFileSync("./gb_db.txt").toString()
                        })];
                case 8:
                    jsoner = _a.sent();
                    fin = JSON.parse(jsoner.data.files["primon.db.json"].content);
                    fin.sudo = "";
                    tsudo = "";
                    try {
                        sd = fs.readFileSync("./sudo.txt").toString();
                        tsudo = sd.split(":")[0] + "@s.whatsapp.net";
                    }
                    catch (_c) {
                        sd = fs.readFileSync("./sudo.txt").toString();
                        tsudo = sd.split("@")[0] + "@s.whatsapp.net";
                    }
                    fin.sudo = tsudo;
                    fin = JSON.stringify(fin, null, 2);
                    return [4 /*yield*/, octokit.request("PATCH /gists/{gist_id}", {
                            gist_id: fs.readFileSync("./gb_db.txt").toString(),
                            description: "Persistent Database for Primon Proto",
                            files: {
                                key: {
                                    content: fin,
                                    filename: "primon.db.json"
                                }
                            }
                        })];
                case 9:
                    _a.sent();
                    console.clear();
                    console.log(pmsg);
                    return [4 /*yield*/, delay(1500)];
                case 10:
                    _a.sent();
                    console.log("Now copy the code that says 'Project ID' from the 'Setting' section and paste it here.");
                    rl.question("\n\nEnter Key :: ", function (proj) { return __awaiter(_this, void 0, void 0, function () {
                        var sh1, prj, sh4, sh5, tkn, sh7, tst, fins;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.clear();
                                    console.log(pmsg);
                                    return [4 /*yield*/, delay(1500)];
                                case 1:
                                    _a.sent();
                                    console.log("Creating Application..");
                                    if (fs.existsSync("./PrimonProto")) {
                                        fs.rmSync("./PrimonProto", { recursive: true, force: true });
                                    }
                                    sh1 = shelljs_1["default"].exec("git clone https://github.com/phaticusthiccy/PrimonProto");
                                    prj = shelljs_1["default"].exec("cd PrimonProto && railway link " + proj);
                                    sh4 = shelljs_1["default"].exec("cd PrimonProto/ && railway variables set GITHUB_DB=" +
                                        fs.readFileSync("./gb_db.txt").toString());
                                    sh5 = shelljs_1["default"].exec("cd PrimonProto/ && railway variables set GITHUB_AUTH=" +
                                        fs.readFileSync("./gh_auth.txt"));
                                    tkn = fs
                                        .readFileSync("./break.txt")
                                        .toString()
                                        .match(/.{10,9000}/g);
                                    if (tkn.length > 4) {
                                        if (tkn.length == 5)
                                            tkn[3] = tkn[3] + tkn[4];
                                        if (tkn.length == 6)
                                            tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                        if (tkn.length == 7)
                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                        if (tkn.length == 8)
                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                        if (tkn.length == 9)
                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                    }
                                    if (tkn.length < 4) {
                                        tkn = fs
                                            .readFileSync("./break.txt")
                                            .toString()
                                            .match(/.{10,7000}/g);
                                        if (tkn.length < 4) {
                                            tkn = fs
                                                .readFileSync("./break.txt")
                                                .toString()
                                                .match(/.{10,5000}/g);
                                            if (tkn.length > 4) {
                                                if (tkn.length == 5)
                                                    tkn[3] = tkn[3] + tkn[4];
                                                if (tkn.length == 6)
                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                                if (tkn.length == 7)
                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                                if (tkn.length == 8)
                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                                if (tkn.length == 9)
                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                            }
                                        }
                                        else {
                                            if (tkn.length !== 4) {
                                                if (tkn.length == 5)
                                                    tkn[3] = tkn[3] + tkn[4];
                                                if (tkn.length == 6)
                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                                if (tkn.length == 7)
                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                                if (tkn.length == 8)
                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                                if (tkn.length == 9)
                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                            }
                                        }
                                    }
                                    if (tkn[3] == undefined || tkn[3] == "undefined") {
                                        tkn[3] = "";
                                    }
                                    shelljs_1["default"].exec("cd PrimonProto/ && railway variables set SESSION=" + tkn[0]);
                                    shelljs_1["default"].exec("cd PrimonProto/ && railway variables set SESSION2=" + tkn[1]);
                                    shelljs_1["default"].exec("cd PrimonProto/ && railway variables set SESSION3=" + tkn[2]);
                                    shelljs_1["default"].exec("cd PrimonProto/ && railway variables set SESSION4=" + tkn[3]);
                                    shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION5=" + fs.readFileSync("./session5"));
                                    return [4 /*yield*/, delay(1500)];
                                case 2:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    console.log("Application Created!");
                                    return [4 /*yield*/, delay(1500)];
                                case 3:
                                    _a.sent();
                                    console.log("The Repo is Transferred to the Railway Address..");
                                    return [4 /*yield*/, delay(1500)];
                                case 4:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    sh7 = shelljs_1["default"].exec("cd PrimonProto/ && yes n | railway up");
                                    return [4 /*yield*/, delay(1500)];
                                case 5:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    console.log("Transferred Successfully!\n\n");
                                    return [4 /*yield*/, delay(1500)];
                                case 6:
                                    _a.sent();
                                    console.log("Thanks For Using Primon Proto!");
                                    return [4 /*yield*/, delay(1500)];
                                case 7:
                                    _a.sent();
                                    console.log("Please check the " +
                                        "https://railway.app/project/" + proj);
                                    return [4 /*yield*/, delay(1500)];
                                case 8:
                                    _a.sent();
                                    tst = new Date().getTime();
                                    fins = (tst - Number(fs.readFileSync("./time.txt").toString()) - 102000) /
                                        1000;
                                    console.log("Installed Primon within " +
                                        fins +
                                        " second");
                                    shelljs_1["default"].exec("rm -rf ./session");
                                    try {
                                        fs.unlinkSync("./auth_info_multi.json");
                                    }
                                    catch (_b) { }
                                    try {
                                        fs.unlinkSync("./gb_db.txt");
                                    }
                                    catch (_c) { }
                                    try {
                                        fs.unlinkSync("./gh_auth.txt");
                                    }
                                    catch (_d) { }
                                    try {
                                        fs.unlinkSync("./break.txt");
                                    }
                                    catch (_e) { }
                                    try {
                                        fs.unlinkSync("./time.txt");
                                    }
                                    catch (_f) { }
                                    try {
                                        fs.unlinkSync("./lang.txt");
                                    }
                                    catch (_g) { }
                                    try {
                                        fs.unlinkSync("./baileys_store_multi.json");
                                    }
                                    catch (_h) { }
                                    try {
                                        fs.unlinkSync("./cont.txt");
                                    }
                                    catch (_j) { }
                                    try {
                                        fs.unlinkSync("./sudo.txt");
                                    }
                                    catch (_k) { }
                                    try {
                                        fs.unlinkSync("./break_session.txt");
                                    }
                                    catch (_l) { }
                                    process.exit();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    _a.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    });
}
function after_s_tr() {
    return __awaiter(this, void 0, void 0, function () {
        var command;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.clear();
                    console.log(pmsg);
                    return [4 /*yield*/, delay(1500)];
                case 1:
                    _a.sent();
                    console.log("QR Kod Başarıyla Okutuldu!");
                    return [4 /*yield*/, delay(1500)];
                case 2:
                    _a.sent();
                    console.log("Şimdi ise SESSION yenilemek için lütfen Railway hesabınıza giriş yapın. Az sonra giriş linki altta belirecek.");
                    return [4 /*yield*/, delay(5000)];
                case 3:
                    _a.sent();
                    console.clear();
                    console.log(pmsg);
                    command = (0, child_process_1.exec)("railway login");
                    command.stdout.on('data', function (output) {
                        console.log(output.toString());
                    });
                    command.stdout.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("Railway Hesabına Giriş Yapıldı!");
                                    return [4 /*yield*/, delay(1500)];
                                case 1:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    return [4 /*yield*/, delay(1500)];
                                case 2:
                                    _a.sent();
                                    console.log("Şimdi ise botun kurulu olduğu uygulamaya girin. Ardından 'Settings' kısmından 'Project ID' yazan kodu kopyalayın ve buraya yapıştırın.");
                                    rl.question("\n\nAnahtarı Girin :: ", function (proj) { return __awaiter(_this, void 0, void 0, function () {
                                        var sh1, prj, tkn, sh7;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    console.clear();
                                                    console.log(pmsg);
                                                    return [4 /*yield*/, delay(1500)];
                                                case 1:
                                                    _a.sent();
                                                    shelljs_1["default"].exec('rm -rf PrimonProto');
                                                    sh1 = shelljs_1["default"].exec('git clone https://github.com/phaticusthiccy/PrimonProto');
                                                    prj = shelljs_1["default"].exec("cd PrimonProto && railway link " + proj);
                                                    tkn = fs.readFileSync("./break_session.txt").toString().match(/.{10,9000}/g);
                                                    if (tkn.length > 4) {
                                                        if (tkn.length == 5)
                                                            tkn[3] = tkn[3] + tkn[4];
                                                        if (tkn.length == 6)
                                                            tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                                        if (tkn.length == 7)
                                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                                        if (tkn.length == 8)
                                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                                        if (tkn.length == 9)
                                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                                    }
                                                    if (tkn.length < 4) {
                                                        tkn = fs.readFileSync("./break_session.txt").toString().match(/.{10,7000}/g);
                                                        if (tkn.length < 4) {
                                                            tkn = fs.readFileSync("./break_session.txt").toString().match(/.{10,5000}/g);
                                                            if (tkn.length > 4) {
                                                                if (tkn.length == 5)
                                                                    tkn[3] = tkn[3] + tkn[4];
                                                                if (tkn.length == 6)
                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                                                if (tkn.length == 7)
                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                                                if (tkn.length == 8)
                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                                                if (tkn.length == 9)
                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                                            }
                                                        }
                                                        else {
                                                            if (tkn.length !== 4) {
                                                                if (tkn.length == 5)
                                                                    tkn[3] = tkn[3] + tkn[4];
                                                                if (tkn.length == 6)
                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                                                if (tkn.length == 7)
                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                                                if (tkn.length == 8)
                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                                                if (tkn.length == 9)
                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                                            }
                                                        }
                                                    }
                                                    if (tkn[3] == undefined || tkn[3] == "undefined") {
                                                        tkn[3] = "";
                                                    }
                                                    shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION=" + tkn[0]);
                                                    shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION2=" + tkn[1]);
                                                    shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION3=" + tkn[2]);
                                                    shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION4=" + tkn[3]);
                                                    shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION5=" + fs.readFileSync("./session5"));
                                                    return [4 /*yield*/, delay(1500)];
                                                case 2:
                                                    _a.sent();
                                                    console.clear();
                                                    console.log(pmsg);
                                                    sh7 = shelljs_1["default"].exec("cd PrimonProto/ && yes n | railway up");
                                                    return [4 /*yield*/, delay(1500)];
                                                case 3:
                                                    _a.sent();
                                                    console.clear();
                                                    console.log(pmsg);
                                                    console.log("SESSION Yenilendi! Veri kaybı olmadan eski ayarlar geri getirildi.\n\n");
                                                    console.log("Primon Proto Kullandığınız İçin Teşekkürler!\n\n");
                                                    return [4 /*yield*/, delay(1500)];
                                                case 4:
                                                    _a.sent();
                                                    console.log("Lütfen " + "https://railway.app/project/" + proj + " linkini kontrol ediniz.");
                                                    shelljs_1["default"].exec("rm -rf ./session");
                                                    try {
                                                        fs.unlinkSync("./auth_info_multi.json");
                                                    }
                                                    catch (_b) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./gb_db.txt");
                                                    }
                                                    catch (_c) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./gh_auth.txt");
                                                    }
                                                    catch (_d) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./break.txt");
                                                    }
                                                    catch (_e) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./lang.txt");
                                                    }
                                                    catch (_f) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./baileys_store_multi.json");
                                                    }
                                                    catch (_g) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./cont.txt");
                                                    }
                                                    catch (_h) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./time.txt");
                                                    }
                                                    catch (_j) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./sudo.txt");
                                                    }
                                                    catch (_k) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./session5");
                                                    }
                                                    catch (_l) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./break_session.txt");
                                                    }
                                                    catch (_m) {
                                                    }
                                                    process.exit();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
function after_s_en() {
    return __awaiter(this, void 0, void 0, function () {
        var command;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.clear();
                    console.log(pmsg);
                    return [4 /*yield*/, delay(1500)];
                case 1:
                    _a.sent();
                    console.log("QR Code Read Successfully!");
                    return [4 /*yield*/, delay(1500)];
                case 2:
                    _a.sent();
                    console.log("Now, please login to your Railway account to renew the SESSION. The login link will appear below.");
                    return [4 /*yield*/, delay(5000)];
                case 3:
                    _a.sent();
                    console.clear();
                    console.log(pmsg);
                    command = (0, child_process_1.exec)("railway login");
                    command.stdout.on('data', function (output) {
                        console.log(output.toString());
                    });
                    command.stdout.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("Logged In Railway Account!");
                                    return [4 /*yield*/, delay(1500)];
                                case 1:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    return [4 /*yield*/, delay(1500)];
                                case 2:
                                    _a.sent();
                                    console.log("Now go to the application where the bot is installed. Then copy the code that says 'Project ID' from 'Settings' and paste it here.");
                                    rl.question("\n\nEnter Key :: ", function (proj) { return __awaiter(_this, void 0, void 0, function () {
                                        var sh1, prj, tkn, sh7;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    console.clear();
                                                    console.log(pmsg);
                                                    return [4 /*yield*/, delay(1500)];
                                                case 1:
                                                    _a.sent();
                                                    shelljs_1["default"].exec('rm -rf PrimonProto');
                                                    sh1 = shelljs_1["default"].exec('git clone https://github.com/phaticusthiccy/PrimonProto');
                                                    prj = shelljs_1["default"].exec("cd PrimonProto && railway link " + proj);
                                                    tkn = fs.readFileSync("./break_session.txt").toString().match(/.{10,10000}/g);
                                                    if (tkn.length > 4) {
                                                        if (tkn.length == 5)
                                                            tkn[3] = tkn[3] + tkn[4];
                                                        if (tkn.length == 6)
                                                            tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                                        if (tkn.length == 7)
                                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                                        if (tkn.length == 8)
                                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                                        if (tkn.length == 9)
                                                            tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                                    }
                                                    if (tkn.length < 4) {
                                                        tkn = fs.readFileSync("./break_session.txt").toString().match(/.{10,7000}/g);
                                                        if (tkn.length < 4) {
                                                            tkn = fs.readFileSync("./break_session.txt").toString().match(/.{10,5000}/g);
                                                            if (tkn.length > 4) {
                                                                if (tkn.length == 5)
                                                                    tkn[3] = tkn[3] + tkn[4];
                                                                if (tkn.length == 6)
                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                                                if (tkn.length == 7)
                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                                                if (tkn.length == 8)
                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                                                if (tkn.length == 9)
                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                                            }
                                                        }
                                                        else {
                                                            if (tkn.length !== 4) {
                                                                if (tkn.length == 5)
                                                                    tkn[3] = tkn[3] + tkn[4];
                                                                if (tkn.length == 6)
                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5];
                                                                if (tkn.length == 7)
                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6];
                                                                if (tkn.length == 8)
                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7];
                                                                if (tkn.length == 9)
                                                                    tkn[3] = tkn[3] + tkn[4] + tkn[5] + tkn[6] + tkn[7] + tkn[8];
                                                            }
                                                        }
                                                    }
                                                    if (tkn[3] == undefined || tkn[3] == "undefined") {
                                                        tkn[3] = "";
                                                    }
                                                    shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION=" + tkn[0]);
                                                    shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION2=" + tkn[1]);
                                                    shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION3=" + tkn[2]);
                                                    shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION4=" + tkn[3]);
                                                    shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION5=" + fs.readFileSync("./session5"));
                                                    return [4 /*yield*/, delay(1500)];
                                                case 2:
                                                    _a.sent();
                                                    console.clear();
                                                    console.log(penmsg);
                                                    sh7 = shelljs_1["default"].exec("cd PrimonProto/ && yes n | railway up");
                                                    return [4 /*yield*/, delay(1500)];
                                                case 3:
                                                    _a.sent();
                                                    console.clear();
                                                    console.log(penmsg);
                                                    console.log("SESSION Renewed! Restored old settings without data loss.\n\n");
                                                    console.log("Thanks For Using Primon Proto!\n\n");
                                                    return [4 /*yield*/, delay(1500)];
                                                case 4:
                                                    _a.sent();
                                                    console.log("Please check the " + "https://railway.app/project/" + proj);
                                                    shelljs_1["default"].exec("rm -rf ./session");
                                                    try {
                                                        fs.unlinkSync("./auth_info_multi.json");
                                                    }
                                                    catch (_b) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./session5");
                                                    }
                                                    catch (_c) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./gb_db.txt");
                                                    }
                                                    catch (_d) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./gh_auth.txt");
                                                    }
                                                    catch (_e) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./break.txt");
                                                    }
                                                    catch (_f) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./lang.txt");
                                                    }
                                                    catch (_g) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./baileys_store_multi.json");
                                                    }
                                                    catch (_h) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./cont.txt");
                                                    }
                                                    catch (_j) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./sudo.txt");
                                                    }
                                                    catch (_k) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./time.txt");
                                                    }
                                                    catch (_l) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./break_session.txt");
                                                    }
                                                    catch (_m) {
                                                    }
                                                    process.exit();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
function PRIMON_PROTO() {
    return __awaiter(this, void 0, void 0, function () {
        var store, version, _a, state, saveCreds, sock;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'silent', stream: 'store' }) });
                    store.readFromFile('./baileys_store_multi.json');
                    return [4 /*yield*/, (0, baileys_1.fetchLatestBaileysVersion)()];
                case 1:
                    version = (_b.sent()).version;
                    return [4 /*yield*/, useMultiFileAuthState('session')];
                case 2:
                    _a = _b.sent(), state = _a.state, saveCreds = _a.saveCreds;
                    sock = (0, baileys_1["default"])({
                        logger: (0, pino_1["default"])({ level: 'silent' }),
                        browser: ['Primon Proto', 'Chrome', '1.0.0'],
                        printQRInTerminal: true,
                        auth: state,
                        version: [3, 3234, 9]
                    });
                    setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            store.writeToFile('./baileys_store_multi.json');
                            fs.exists("session", function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var a, d, s, s1;
                                return __generator(this, function (_a) {
                                    if (!e == false) {
                                        a = fs.readdirSync("./session");
                                        d = "";
                                        a.map(function (e) {
                                            d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&";
                                        });
                                        fs.writeFileSync("./auth_info_multi.json", btoa(d));
                                        s = fs.readFileSync("./auth_info_multi.json");
                                        if (s.toString().length < 8000) {
                                            console.clear();
                                            if (lang == "EN") {
                                                console.log("Please Scan The QR Code Again!");
                                            }
                                            if (lang == "TR") {
                                                console.log("Lütfen QR Kodu Tekrar Okutun!");
                                            }
                                            process.exit();
                                        }
                                        s1 = btoa(fs.readFileSync("./auth_info_multi.json").toString());
                                        fs.unlinkSync("./auth_info_multi.json");
                                        fs.unlinkSync("./baileys_store_multi.json");
                                        console.log(s1);
                                        process.exit();
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            return [2 /*return*/];
                        });
                    }); }, 20000);
                    store.bind(sock.ev);
                    sock.ev.on('connection.update', function (update) {
                        var _a, _b;
                        var connection = update.connection, lastDisconnect = update.lastDisconnect;
                        if (connection === 'close') {
                            if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut) {
                                PRIMON_PROTO();
                            }
                            else {
                                console.log('connection closed');
                            }
                        }
                        store.writeToFile('./baileys_store_multi.json');
                        console.log('connection update', update);
                    });
                    sock.ev.on('creds.update', saveCreds);
                    return [2 /*return*/, sock];
            }
        });
    });
}
function PRIMON_PROTO2() {
    return __awaiter(this, void 0, void 0, function () {
        var store, version, _a, state, saveCreds, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'silent', stream: 'store' }) });
                    store.readFromFile('./baileys_store_multi.json');
                    return [4 /*yield*/, (0, baileys_1.fetchLatestBaileysVersion)()];
                case 1:
                    version = (_b.sent()).version;
                    return [4 /*yield*/, useMultiFileAuthState('session')];
                case 2:
                    _a = _b.sent(), state = _a.state, saveCreds = _a.saveCreds;
                    sock = (0, baileys_1["default"])({
                        logger: (0, pino_1["default"])({ level: 'silent' }),
                        browser: ['Primon Proto', 'Chrome', '1.0.0'],
                        printQRInTerminal: true,
                        auth: state,
                        version: [3, 3234, 9]
                    });
                    z = false;
                    INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            store.writeToFile('./baileys_store_multi.json');
                            fs.exists("./session", function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var a, d, c, s, s1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(!e == false)) return [3 /*break*/, 2];
                                            a = fs.readdirSync("./session");
                                            d = "";
                                            a.map(function (e) {
                                                d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&";
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
                                                if (lang == "TR") {
                                                    console.log("Lütfen QR Kodu Tekrar Okutun!");
                                                }
                                                process.exit();
                                            }
                                            s1 = fs.readFileSync("./auth_info_multi.json").toString();
                                            fs.unlinkSync("./auth_info_multi.json");
                                            fs.unlinkSync("./baileys_store_multi.json");
                                            fs.writeFileSync("./break.txt", s1);
                                            fs.writeFileSync("./sudo.txt", sock.authState.creds.me.id);
                                            console.log(chalk_1["default"].red("Lütfen Sistemi Tekrar Çalıştırın!"));
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
                    sock.ev.on('connection.update', function (update) { return __awaiter(_this, void 0, void 0, function () {
                        var connection, lastDisconnect;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            connection = update.connection, lastDisconnect = update.lastDisconnect;
                            if (connection === 'close') {
                                if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut) {
                                    PRIMON_PROTO2();
                                }
                                else {
                                    console.log('connection closed');
                                }
                            }
                            store.writeToFile('./baileys_store_multi.json');
                            console.log('connection update', update);
                            return [2 /*return*/];
                        });
                    }); });
                    sock.ev.on('creds.update', saveCreds);
                    return [2 /*return*/, sock];
            }
        });
    });
}
function PRIMON_PROTO3() {
    return __awaiter(this, void 0, void 0, function () {
        var store, version, _a, state, saveCreds, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'silent', stream: 'store' }) });
                    store.readFromFile('./baileys_store_multi.json');
                    return [4 /*yield*/, (0, baileys_1.fetchLatestBaileysVersion)()];
                case 1:
                    version = (_b.sent()).version;
                    return [4 /*yield*/, useMultiFileAuthState('session')];
                case 2:
                    _a = _b.sent(), state = _a.state, saveCreds = _a.saveCreds;
                    sock = (0, baileys_1["default"])({
                        logger: (0, pino_1["default"])({ level: 'silent' }),
                        browser: ['Primon Proto', 'Chrome', '1.0.0'],
                        printQRInTerminal: true,
                        auth: state,
                        version: [3, 3234, 9]
                    });
                    z = false;
                    INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            store.writeToFile('./baileys_store_multi.json');
                            fs.exists("./session", function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var a, d, c, s, s1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(!e == false)) return [3 /*break*/, 2];
                                            a = fs.readdirSync("./session");
                                            d = "";
                                            a.map(function (e) {
                                                d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&";
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
                                                if (lang == "TR") {
                                                    console.log("Lütfen QR Kodu Tekrar Okutun!");
                                                }
                                                process.exit();
                                            }
                                            s1 = fs.readFileSync("./auth_info_multi.json").toString();
                                            fs.unlinkSync("./auth_info_multi.json");
                                            fs.unlinkSync("./baileys_store_multi.json");
                                            fs.writeFileSync("./break.txt", s1);
                                            fs.writeFileSync("./cont.txt", "1");
                                            console.log(chalk_1["default"].red("Lütfen Sistemi Tekrar Çalıştırın!"));
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
                    sock.ev.on('connection.update', function (update) { return __awaiter(_this, void 0, void 0, function () {
                        var connection, lastDisconnect;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            connection = update.connection, lastDisconnect = update.lastDisconnect;
                            if (connection === 'close') {
                                if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut) {
                                    PRIMON_PROTO2();
                                }
                                else {
                                    console.log('connection closed');
                                }
                            }
                            store.writeToFile('./baileys_store_multi.json');
                            console.log('connection update', update);
                            return [2 /*return*/];
                        });
                    }); });
                    sock.ev.on('creds.update', saveCreds);
                    return [2 /*return*/, sock];
            }
        });
    });
}
function PRIMON_PROTO4() {
    return __awaiter(this, void 0, void 0, function () {
        var store, version, _a, state, saveCreds, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'silent', stream: 'store' }) });
                    store.readFromFile('./baileys_store_multi.json');
                    return [4 /*yield*/, (0, baileys_1.fetchLatestBaileysVersion)()];
                case 1:
                    version = (_b.sent()).version;
                    return [4 /*yield*/, useMultiFileAuthState('session')];
                case 2:
                    _a = _b.sent(), state = _a.state, saveCreds = _a.saveCreds;
                    sock = (0, baileys_1["default"])({
                        logger: (0, pino_1["default"])({ level: 'silent' }),
                        browser: ['Primon Proto', 'Chrome', '1.0.0'],
                        printQRInTerminal: true,
                        auth: state,
                        version: [3, 3234, 9]
                    });
                    z = false;
                    INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            store.writeToFile('./baileys_store_multi.json');
                            fs.exists("./session", function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var a, d, c, s, s1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(!e == false)) return [3 /*break*/, 2];
                                            a = fs.readdirSync("./session");
                                            d = "";
                                            a.map(function (e) {
                                                d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&";
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
                                                if (lang == "TR") {
                                                    console.log("Lütfen QR Kodu Tekrar Okutun!");
                                                }
                                                process.exit();
                                            }
                                            s1 = fs.readFileSync("./auth_info_multi.json").toString();
                                            fs.unlinkSync("./auth_info_multi.json");
                                            fs.unlinkSync("./baileys_store_multi.json");
                                            fs.writeFileSync("./break.txt", s1);
                                            fs.writeFileSync("./sudo.txt", sock.authState.creds.me.id);
                                            console.log(chalk_1["default"].red("Please Re-Run System!"));
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
                    sock.ev.on('connection.update', function (update) { return __awaiter(_this, void 0, void 0, function () {
                        var connection, lastDisconnect;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            connection = update.connection, lastDisconnect = update.lastDisconnect;
                            if (connection === 'close') {
                                if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut) {
                                    PRIMON_PROTO2();
                                }
                                else {
                                    console.log('connection closed');
                                }
                            }
                            store.writeToFile('./baileys_store_multi.json');
                            console.log('connection update', update);
                            return [2 /*return*/];
                        });
                    }); });
                    sock.ev.on('creds.update', saveCreds);
                    return [2 /*return*/, sock];
            }
        });
    });
}
function PRIMON_PROTO5() {
    return __awaiter(this, void 0, void 0, function () {
        var store, version, _a, state, saveCreds, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'silent', stream: 'store' }) });
                    store.readFromFile('./baileys_store_multi.json');
                    return [4 /*yield*/, (0, baileys_1.fetchLatestBaileysVersion)()];
                case 1:
                    version = (_b.sent()).version;
                    return [4 /*yield*/, useMultiFileAuthState('session')];
                case 2:
                    _a = _b.sent(), state = _a.state, saveCreds = _a.saveCreds;
                    sock = (0, baileys_1["default"])({
                        logger: (0, pino_1["default"])({ level: 'silent' }),
                        browser: ['Primon Proto', 'Chrome', '1.0.0'],
                        printQRInTerminal: true,
                        auth: state,
                        version: [3, 3234, 9]
                    });
                    z = false;
                    INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            store.writeToFile('./baileys_store_multi.json');
                            fs.exists("./session", function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var a, d, c, s, s1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(!e == false)) return [3 /*break*/, 2];
                                            a = fs.readdirSync("./session");
                                            d = "";
                                            a.map(function (e) {
                                                d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&";
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
                                                if (lang == "TR") {
                                                    console.log("Lütfen QR Kodu Tekrar Okutun!");
                                                }
                                                process.exit();
                                            }
                                            s1 = fs.readFileSync("./auth_info_multi.json").toString();
                                            fs.unlinkSync("./auth_info_multi.json");
                                            fs.unlinkSync("./baileys_store_multi.json");
                                            fs.writeFileSync("./break.txt", s1);
                                            fs.writeFileSync("./cont.txt", "1");
                                            console.log(chalk_1["default"].red("Please Re-Run System!"));
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
                    sock.ev.on('connection.update', function (update) { return __awaiter(_this, void 0, void 0, function () {
                        var connection, lastDisconnect;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            connection = update.connection, lastDisconnect = update.lastDisconnect;
                            if (connection === 'close') {
                                if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut) {
                                    PRIMON_PROTO2();
                                }
                                else {
                                    console.log('connection closed');
                                }
                            }
                            store.writeToFile('./baileys_store_multi.json');
                            console.log('connection update', update);
                            return [2 /*return*/];
                        });
                    }); });
                    sock.ev.on('creds.update', saveCreds);
                    return [2 /*return*/, sock];
            }
        });
    });
}
function PRIMON_PROTO6() {
    return __awaiter(this, void 0, void 0, function () {
        var store, version, _a, state, saveCreds, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'silent', stream: 'store' }) });
                    store.readFromFile('./baileys_store_multi.json');
                    return [4 /*yield*/, (0, baileys_1.fetchLatestBaileysVersion)()];
                case 1:
                    version = (_b.sent()).version;
                    return [4 /*yield*/, useMultiFileAuthState('session')];
                case 2:
                    _a = _b.sent(), state = _a.state, saveCreds = _a.saveCreds;
                    sock = (0, baileys_1["default"])({
                        logger: (0, pino_1["default"])({ level: 'silent' }),
                        browser: ['Primon Proto', 'Chrome', '1.0.0'],
                        printQRInTerminal: true,
                        auth: state,
                        version: [3, 3234, 9]
                    });
                    z = false;
                    INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            store.writeToFile('./baileys_store_multi.json');
                            fs.exists("./session", function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var a, d, c, s, s1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(!e == false)) return [3 /*break*/, 2];
                                            a = fs.readdirSync("./session");
                                            d = "";
                                            a.map(function (e) {
                                                d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&";
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
                                                if (lang == "TR") {
                                                    console.log("Lütfen QR Kodu Tekrar Okutun!");
                                                }
                                                process.exit();
                                            }
                                            s1 = fs.readFileSync("./auth_info_multi.json").toString();
                                            fs.unlinkSync("./auth_info_multi.json");
                                            fs.unlinkSync("./baileys_store_multi.json");
                                            fs.writeFileSync("./break_session.txt", s1);
                                            console.log(chalk_1["default"].red("Lütfen Sistemi Tekrar Çalıştırın!"));
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
                    sock.ev.on('connection.update', function (update) { return __awaiter(_this, void 0, void 0, function () {
                        var connection, lastDisconnect;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            connection = update.connection, lastDisconnect = update.lastDisconnect;
                            if (connection === 'close') {
                                if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut) {
                                    PRIMON_PROTO2();
                                }
                                else {
                                    console.log('connection closed');
                                }
                            }
                            store.writeToFile('./baileys_store_multi.json');
                            console.log('connection update', update);
                            return [2 /*return*/];
                        });
                    }); });
                    sock.ev.on('creds.update', saveCreds);
                    return [2 /*return*/, sock];
            }
        });
    });
}
function PRIMON_PROTO7() {
    return __awaiter(this, void 0, void 0, function () {
        var store, version, _a, state, saveCreds, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'silent', stream: 'store' }) });
                    store.readFromFile('./baileys_store_multi.json');
                    return [4 /*yield*/, (0, baileys_1.fetchLatestBaileysVersion)()];
                case 1:
                    version = (_b.sent()).version;
                    return [4 /*yield*/, useMultiFileAuthState('session')];
                case 2:
                    _a = _b.sent(), state = _a.state, saveCreds = _a.saveCreds;
                    sock = (0, baileys_1["default"])({
                        logger: (0, pino_1["default"])({ level: 'silent' }),
                        browser: ['Primon Proto', 'Chrome', '1.0.0'],
                        printQRInTerminal: true,
                        auth: state,
                        version: [3, 3234, 9]
                    });
                    z = false;
                    INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            store.writeToFile('./baileys_store_multi.json');
                            fs.exists("./session", function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var a, d, c, s, s1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(!e == false)) return [3 /*break*/, 2];
                                            a = fs.readdirSync("./session");
                                            d = "";
                                            a.map(function (e) {
                                                d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&";
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
                                                if (lang == "TR") {
                                                    console.log("Lütfen QR Kodu Tekrar Okutun!");
                                                }
                                                process.exit();
                                            }
                                            s1 = fs.readFileSync("./auth_info_multi.json").toString();
                                            fs.unlinkSync("./auth_info_multi.json");
                                            fs.unlinkSync("./baileys_store_multi.json");
                                            fs.writeFileSync("./break_session.txt", s1);
                                            console.log(chalk_1["default"].red("Lütfen Sistemi Tekrar Çalıştırın!"));
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
                    sock.ev.on('connection.update', function (update) { return __awaiter(_this, void 0, void 0, function () {
                        var connection, lastDisconnect;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            connection = update.connection, lastDisconnect = update.lastDisconnect;
                            if (connection === 'close') {
                                if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut) {
                                    PRIMON_PROTO2();
                                }
                                else {
                                    console.log('connection closed');
                                }
                            }
                            store.writeToFile('./baileys_store_multi.json');
                            console.log('connection update', update);
                            return [2 /*return*/];
                        });
                    }); });
                    sock.ev.on('creds.update', saveCreds);
                    return [2 /*return*/, sock];
            }
        });
    });
}
function PRIMON_PROTO8() {
    return __awaiter(this, void 0, void 0, function () {
        var store, version, _a, state, saveCreds, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'silent', stream: 'store' }) });
                    store.readFromFile('./baileys_store_multi.json');
                    return [4 /*yield*/, (0, baileys_1.fetchLatestBaileysVersion)()];
                case 1:
                    version = (_b.sent()).version;
                    return [4 /*yield*/, useMultiFileAuthState('session')];
                case 2:
                    _a = _b.sent(), state = _a.state, saveCreds = _a.saveCreds;
                    sock = (0, baileys_1["default"])({
                        logger: (0, pino_1["default"])({ level: 'silent' }),
                        browser: ['Primon Proto', 'Chrome', '1.0.0'],
                        printQRInTerminal: true,
                        auth: state,
                        version: [3, 3234, 9]
                    });
                    z = false;
                    INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            store.writeToFile('./baileys_store_multi.json');
                            fs.exists("./session", function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var a, d, c, s, s1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(!e == false)) return [3 /*break*/, 2];
                                            a = fs.readdirSync("./session");
                                            d = "";
                                            a.map(function (e) {
                                                d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&";
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
                                                if (lang == "TR") {
                                                    console.log("Lütfen QR Kodu Tekrar Okutun!");
                                                }
                                                process.exit();
                                            }
                                            s1 = fs.readFileSync("./auth_info_multi.json").toString();
                                            fs.unlinkSync("./auth_info_multi.json");
                                            fs.unlinkSync("./baileys_store_multi.json");
                                            fs.writeFileSync("./break_session.txt", s1);
                                            console.log(chalk_1["default"].red("Please Re-Run System!"));
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
                    sock.ev.on('connection.update', function (update) { return __awaiter(_this, void 0, void 0, function () {
                        var connection, lastDisconnect;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            connection = update.connection, lastDisconnect = update.lastDisconnect;
                            if (connection === 'close') {
                                if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut) {
                                    PRIMON_PROTO2();
                                }
                                else {
                                    console.log('connection closed');
                                }
                            }
                            store.writeToFile('./baileys_store_multi.json');
                            console.log('connection update', update);
                            return [2 /*return*/];
                        });
                    }); });
                    sock.ev.on('creds.update', saveCreds);
                    return [2 /*return*/, sock];
            }
        });
    });
}
function PRIMON_PROTO9() {
    return __awaiter(this, void 0, void 0, function () {
        var store, version, _a, state, saveCreds, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'silent', stream: 'store' }) });
                    store.readFromFile('./baileys_store_multi.json');
                    return [4 /*yield*/, (0, baileys_1.fetchLatestBaileysVersion)()];
                case 1:
                    version = (_b.sent()).version;
                    return [4 /*yield*/, useMultiFileAuthState('session')];
                case 2:
                    _a = _b.sent(), state = _a.state, saveCreds = _a.saveCreds;
                    sock = (0, baileys_1["default"])({
                        logger: (0, pino_1["default"])({ level: 'silent' }),
                        browser: ['Primon Proto', 'Chrome', '1.0.0'],
                        printQRInTerminal: true,
                        auth: state,
                        version: [3, 3234, 9]
                    });
                    z = false;
                    INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            store.writeToFile('./baileys_store_multi.json');
                            fs.exists("./session", function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var a, d, c, s, s1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(!e == false)) return [3 /*break*/, 2];
                                            a = fs.readdirSync("./session");
                                            d = "";
                                            a.map(function (e) {
                                                d += fs.readFileSync("./session/" + e).toString() + "&&&&&&&";
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
                                                if (lang == "TR") {
                                                    console.log("Lütfen QR Kodu Tekrar Okutun!");
                                                }
                                                process.exit();
                                            }
                                            s1 = fs.readFileSync("./auth_info_multi.json").toString();
                                            fs.unlinkSync("./auth_info_multi.json");
                                            fs.unlinkSync("./baileys_store_multi.json");
                                            fs.writeFileSync("./break_session.txt", s1);
                                            console.log(chalk_1["default"].red("Please Re-Run System!"));
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
                    sock.ev.on('connection.update', function (update) { return __awaiter(_this, void 0, void 0, function () {
                        var connection, lastDisconnect;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            connection = update.connection, lastDisconnect = update.lastDisconnect;
                            if (connection === 'close') {
                                if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut) {
                                    PRIMON_PROTO2();
                                }
                                else {
                                    console.log('connection closed');
                                }
                            }
                            store.writeToFile('./baileys_store_multi.json');
                            console.log('connection update', update);
                            return [2 /*return*/];
                        });
                    }); });
                    sock.ev.on('creds.update', saveCreds);
                    return [2 /*return*/, sock];
            }
        });
    });
}
MAIN();
