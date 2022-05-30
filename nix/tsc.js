"use strict";
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
var db = "{\n  \"author\": \"https://github.com/phaticusthiccy\",\n  \"welcome\": [],\n  \"goodbye\": [],\n  \"sudo\": false,\n  \"super_sudo\": [],\n  \"pmpermit\": [],\n  \"handler\": \".!;/\",\n  \"blocklist\": [],\n  \"snip\": [],\n  \"antiflood\": [],\n  \"warn\": [],\n  \"block_msg\": \"\",\n  \"unblock_msg\": \"\",\n  \"ban_msg\": \"\",\n  \"mute_msg\": \"\",\n  \"unmute_msg\": \"\",\n  \"warncount\": [],\n  \"language\": \"\",\n  \"debug\": false,\n  \"afk\": { \n    \"status\": false, \n    \"message\": \"I am AFK Now! \\nLastseen: {lastseen}\"\n  },\n  \"filter\": [],\n  \"global_filter\": [],\n  \"alive_msg\": \"\",\n  \"db_url\": \"\",\n  \"token_key\": \"\"\n}\n\n";
// handler[string]
// [".", "!", "/", ";"]
// Info: Primon's handlers
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
//     "message": "I am AFK Now! \nLastseen: {lastseen}",
//   }
// ]
// Info: Stores the AFK status (Away From Keyboard)
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
var pmsg = "\n\n\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 ".concat(chalk_1["default"].cyan("Primon Proto - Whatsapp Userbot"), " \u2502 Versiyon \u2502\n\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 ").concat(chalk_1["default"].cyan("Railway Otomatik Deploy"), "         \u2502      1.0 \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\n");
var penmsg = "\n\n\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 ".concat(chalk_1["default"].cyan("Primon Proto - Whatsapp Userbot"), " \u2502 Version \u2502\n\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 ").concat(chalk_1["default"].cyan("Railway Auto Deploy"), "             \u2502     1.0 \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\n");
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
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var token, st, qst, FIRST_TIMESTEP;
var lang = "";
var anahtar = "";
function MAIN() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fs.existsSync("./break_session.txt")) return [3 /*break*/, 4];
                    if (!(fs.readFileSync("./lang.txt").toString() == "TR" || fs.readFileSync("./lang.txt").toString() == "TR\n")) return [3 /*break*/, 2];
                    return [4 /*yield*/, after_s_tr()];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!(fs.readFileSync("./lang.txt").toString() == "EN" || fs.readFileSync("./lang.txt").toString() == "EN\n")) return [3 /*break*/, 4];
                    return [4 /*yield*/, after_s_en()];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    if (!fs.existsSync("./break.txt")) return [3 /*break*/, 8];
                    if (!(fs.readFileSync("./lang.txt").toString() == "TR" || fs.readFileSync("./lang.txt").toString() == "TR\n")) return [3 /*break*/, 6];
                    return [4 /*yield*/, after_tr()];
                case 5: return [2 /*return*/, _a.sent()];
                case 6:
                    if (!(fs.readFileSync("./lang.txt").toString() == "EN" || fs.readFileSync("./lang.txt").toString() == "EN\n")) return [3 /*break*/, 8];
                    return [4 /*yield*/, after_en()];
                case 7: return [2 /*return*/, _a.sent()];
                case 8:
                    rl.question(chalk_1["default"].blue("Select A Language \n\n") + chalk_1["default"].yellow("[1]") + " :: Türkçe \n" + chalk_1["default"].yellow("[2]") + " :: English\n\n>>> ", function (answer) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    FIRST_TIMESTEP = new Date().getTime();
                                    if (!(answer == 1)) return [3 /*break*/, 3];
                                    console.log(chalk_1["default"].green("Türkçe Dili Seçildi!"));
                                    lang == "TR";
                                    fs.writeFileSync("./lang.txt", "TR");
                                    return [4 /*yield*/, delay(3000)];
                                case 1:
                                    _a.sent();
                                    console.clear();
                                    return [4 /*yield*/, delay(400)];
                                case 2:
                                    _a.sent();
                                    rl.question(chalk_1["default"].blue("\n\nNe Yapmak İstiyorsunuz? \n\n") + chalk_1["default"].yellow("[1]") + " :: Session Yenileme\n" + chalk_1["default"].yellow("[2]") + " :: Bot Kurma" + "\n\n1) Session yenileme işlemi, yavaş çalışan botu hızlandırmak veya çıkış yapılan botu veri kaybı olmadan geri getirmek için kullanılır.\n>>> ", function (answer2) { return __awaiter(_this, void 0, void 0, function () {
                                        var _this = this;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!(answer2 == 1)) return [3 /*break*/, 6];
                                                    console.log(chalk_1["default"].green("Session Yenileme Seçildi!"));
                                                    return [4 /*yield*/, delay(3000)];
                                                case 1:
                                                    _a.sent();
                                                    console.clear();
                                                    console.log(pmsg);
                                                    return [4 /*yield*/, delay(1500)];
                                                case 2:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].green("Lütfen Veritabanı Kodunu giriniz."));
                                                    return [4 /*yield*/, delay(1500)];
                                                case 3:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].green("Bunu railway üzerindeki uygulamanızın") + chalk_1["default"].yellow(" Variables ") + chalk_1["default"].green("kısmından ") + chalk_1["default"].yellow("GITHUB_DB ") + chalk_1["default"].green("bölümünü görebilirsiniz."));
                                                    return [4 /*yield*/, delay(1500)];
                                                case 4:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].green("Bunu yapamıyorsanız, lütfen daha önceden kurmuş olduğunuz botun, kendi numaranıza göndermiş olduğu mesajı kontrol edin. ") + chalk_1["default"].yellow("Veritabanı") + chalk_1["default"].green(" ismindeki kodu ekrana yapıştırın. \n\n"));
                                                    return [4 /*yield*/, delay(1500)];
                                                case 5:
                                                    _a.sent();
                                                    rl.question(chalk_1["default"].blue("Anahtarı Girin :: "), function (a1) { return __awaiter(_this, void 0, void 0, function () {
                                                        var _this = this;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    anahtar = a1;
                                                                    console.log(chalk_1["default"].yellow("\n\nTeşekkürler"));
                                                                    return [4 /*yield*/, delay(3000)];
                                                                case 1:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    console.log(pmsg);
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 2:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].green("Lütfen Token Kodunu giriniz."));
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 3:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].green("Bunu railway üzerindeki uygulamanızın") + chalk_1["default"].yellow(" Variables ") + chalk_1["default"].green("kısmından ") + chalk_1["default"].yellow("GITHUB_AUTH ") + chalk_1["default"].green("bölümünü görebilirsiniz."));
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 4:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].green("Bunu yapamıyorsanız, lütfen daha önceden kurmuş olduğunuz botun, kendi numaranıza göndermiş olduğu mesajı kontrol edin. ") + chalk_1["default"].yellow("Token") + chalk_1["default"].green(" ismindeki kodu ekrana yapıştırın. \n\n"));
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 5:
                                                                    _a.sent();
                                                                    rl.question(chalk_1["default"].blue("Anahtarı Girin :: "), function (a2) { return __awaiter(_this, void 0, void 0, function () {
                                                                        var test1, _a, octokit;
                                                                        var _this = this;
                                                                        return __generator(this, function (_b) {
                                                                            switch (_b.label) {
                                                                                case 0:
                                                                                    token = a2;
                                                                                    console.log(chalk_1["default"].yellow("\n\nTeşekkürler, lütfen biraz bekleyin. Girdiğiniz kodların geçerli olup olmadığını kontrol ediyorum.."));
                                                                                    _b.label = 1;
                                                                                case 1:
                                                                                    _b.trys.push([1, 3, , 4]);
                                                                                    test1 = new core_1.Octokit({ auth: token });
                                                                                    return [4 /*yield*/, test1.request('GET /gists/{gist_id}', {
                                                                                            gist_id: anahtar
                                                                                        })];
                                                                                case 2:
                                                                                    _b.sent();
                                                                                    return [3 /*break*/, 4];
                                                                                case 3:
                                                                                    _a = _b.sent();
                                                                                    console.clear();
                                                                                    console.log(chalk_1["default"].red("\n\nÜzgünüm, girdiğniz değeler doğru değil. Lütfen tekrar kontrol ediniz."));
                                                                                    process.exit();
                                                                                    return [3 /*break*/, 4];
                                                                                case 4:
                                                                                    console.log(chalk_1["default"].green("\n\nGirdiğiniz Bilgiler Doğru!"));
                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                case 5:
                                                                                    _b.sent();
                                                                                    octokit = new core_1.Octokit({ auth: token });
                                                                                    console.log(chalk_1["default"].green("Şimdi ise WhatsApp uygulmanızı açın ve 'Bağlı Cihazlar' kısmına tıklayın."));
                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                case 6:
                                                                                    _b.sent();
                                                                                    console.log(chalk_1["default"].green("\n\nArdından 'Çoklu Cihaz' programını aktif edin."));
                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                case 7:
                                                                                    _b.sent();
                                                                                    console.log(chalk_1["default"].green("\n\nBunları yaptıktan sonra lütfen enter tuşuna basın."));
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
                                                                                                    console.log(chalk_1["default"].green("Şimdi ise ekrana gelecek QR kodunu okutun."));
                                                                                                    return [4 /*yield*/, delay(2800)];
                                                                                                case 2:
                                                                                                    _a.sent();
                                                                                                    console.log(chalk_1["default"].red("QR Okuttuktun Sonra Lütfen Sistemi Tekrar Çalıştırın!"));
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
                                                    console.log(chalk_1["default"].green("Bot Kurma Seçildi!"));
                                                    return [4 /*yield*/, delay(3000)];
                                                case 7:
                                                    _a.sent();
                                                    console.clear();
                                                    console.log(pmsg);
                                                    return [4 /*yield*/, delay(1500)];
                                                case 8:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].green("İlk önce bir github hesabınız yoksa https://github.com adresine tıklayıp yeni bir hesap açın. Ardından mail adresinize e-posta ile hesabınızı onaylayın. Bu işlemi yaptıktan sonra enter tuşuna basıp devam ediniz.\n\n"));
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
                                                                    console.log(chalk_1["default"].green("Hesap açtıktan sonra mail onayı için https://github.com/settings/emails bu adrese gidin ve 'Resend verification email' yazısına basın. Ardından mailinizi kontol edin. Bunları hali hazırda yapmış iseniz veya devam etmek için lütfen enter tuşuna basınız.\n\n"));
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
                                                                                    console.log(chalk_1["default"].green("Hesabınız onaylandığına göre şimdi token alalım. \n\n"));
                                                                                    return [4 /*yield*/, delay(3000)];
                                                                                case 2:
                                                                                    _a.sent();
                                                                                    console.log(chalk_1["default"].green("Lütfen https://github.com/settings/tokens bu adrese gidin ve 'Personal access tokens' yazan kısıma basın. Bu işlemi yaptıktan sonra enter tuşuna basın.\n\n"));
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
                                                                                                    console.log(chalk_1["default"].green("Burda ise 'Generate New Token' butonuna tıklayın.\n\n"));
                                                                                                    return [4 /*yield*/, delay(3000)];
                                                                                                case 2:
                                                                                                    _a.sent();
                                                                                                    console.log(chalk_1["default"].green("Ve ayarlarımız şu şekide olsun: \n\nNOTE: Primon \n\nExpiration: No expiration\n\nDaha sonra ise aşağıda 'repo' ve 'gist' yazan kutucuğu işaretleyin.\n\n"));
                                                                                                    return [4 /*yield*/, delay(3000)];
                                                                                                case 3:
                                                                                                    _a.sent();
                                                                                                    console.log(chalk_1["default"].green("Son olarak aşağıdaki 'Generate token' butonuna basın. Karşınıza gelecek anahtarı kopyalayın! İşlem bitene kadar bu anahtarı kaybetmeyin! Kopyaladıktan sonra ise ekrana gelecek giriş bölümüne yapıştırın.\n\n"));
                                                                                                    rl.question(chalk_1["default"].blue("Anahtarı Girin :: "), function (answer6) { return __awaiter(_this, void 0, void 0, function () {
                                                                                                        var test1, res, _a, octokit, t1, t2, res, jsoner, fin, step;
                                                                                                        var _this = this;
                                                                                                        return __generator(this, function (_b) {
                                                                                                            switch (_b.label) {
                                                                                                                case 0:
                                                                                                                    token = answer6;
                                                                                                                    console.log(chalk_1["default"].yellow("\n\nTeşekkürler, lütfen biraz bekleyin. Girdiğiniz kodların geçerli olup olmadığını kontrol ediyorum.."));
                                                                                                                    _b.label = 1;
                                                                                                                case 1:
                                                                                                                    _b.trys.push([1, 3, , 4]);
                                                                                                                    test1 = new core_1.Octokit({ auth: token });
                                                                                                                    return [4 /*yield*/, test1.request('POST /gists', {
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
                                                                                                                    console.log(chalk_1["default"].red("\n\nÜzgünüm, girdiğniz değeler doğru değil. Lütfen tekrar kontrol ediniz."));
                                                                                                                    process.exit();
                                                                                                                    return [3 /*break*/, 4];
                                                                                                                case 4:
                                                                                                                    console.log(chalk_1["default"].green("\n\nGirdiğiniz Bilgiler Doğru!"));
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 5:
                                                                                                                    _b.sent();
                                                                                                                    fs.writeFileSync("./gh_auth.txt", token);
                                                                                                                    octokit = new core_1.Octokit({ auth: token });
                                                                                                                    t1 = new Date().getTime();
                                                                                                                    return [4 /*yield*/, octokit.request('GET /gists/{gist_id}', {
                                                                                                                            gist_id: res.data.id
                                                                                                                        })];
                                                                                                                case 6:
                                                                                                                    _b.sent();
                                                                                                                    t2 = new Date().getTime();
                                                                                                                    return [4 /*yield*/, octokit.request('DELETE /gists/{gist_id}', {
                                                                                                                            gist_id: res.data.id
                                                                                                                        })];
                                                                                                                case 7:
                                                                                                                    _b.sent();
                                                                                                                    console.log(chalk_1["default"].green("\n\nVeritabanı Oluşturuluyor..\n\n"));
                                                                                                                    return [4 /*yield*/, octokit.request('POST /gists', {
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
                                                                                                                    jsoner.afk.message = "*Bip Bop 🤖* \nBu bir bot. Sahibim şuan burda değil. Bunu sahibime ilettim. En kısa zamanda dönüş yapacaktır.\n\n*Son Görülme:* {lastseen}\n*Sebep:* {reason}";
                                                                                                                    jsoner.language = "TR";
                                                                                                                    fin = JSON.stringify(jsoner, null, 2);
                                                                                                                    return [4 /*yield*/, octokit.request('PATCH /gists/{gist_id}', {
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
                                                                                                                    console.log(chalk_1["default"].green("Veritabanı Oluşturuldu! \nDatabase Hızı: " + step.toString() + "ms\n\n"));
                                                                                                                    return [4 /*yield*/, delay(5000)];
                                                                                                                case 10:
                                                                                                                    _b.sent();
                                                                                                                    console.clear();
                                                                                                                    console.log(pmsg);
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 11:
                                                                                                                    _b.sent();
                                                                                                                    console.log(chalk_1["default"].green("Şimdi ise WhatsApp uygulmanızı açın ve 'Bağlı Cihazlar' kısmına tıklayın."));
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 12:
                                                                                                                    _b.sent();
                                                                                                                    console.log(chalk_1["default"].green("\n\nArdından 'Çoklu Cihaz' programını aktif edin."));
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 13:
                                                                                                                    _b.sent();
                                                                                                                    console.log(chalk_1["default"].green("\n\nBunları yaptıktan sonra lütfen enter tuşuna basın."));
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
                                                                                                                                    console.log(chalk_1["default"].green("Şimdi ise ekrana gelecek QR kodunu okutun."));
                                                                                                                                    return [4 /*yield*/, delay(2800)];
                                                                                                                                case 2:
                                                                                                                                    _a.sent();
                                                                                                                                    console.log(chalk_1["default"].red("QR Okuttuktun Sonra Lütfen Sistemi Tekrar Çalıştırın!"));
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
                                                    console.log(chalk_1["default"].red("Sadece 1 veya 2 Yazın!"));
                                                    process.exit();
                                                    _a.label = 10;
                                                case 10: return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    return [3 /*break*/, 7];
                                case 3:
                                    if (!(answer == 2)) return [3 /*break*/, 6];
                                    console.log(chalk_1["default"].green("English Language Selected!"));
                                    lang == "TR";
                                    fs.writeFileSync("./lang.txt", "TR");
                                    return [4 /*yield*/, delay(3000)];
                                case 4:
                                    _a.sent();
                                    console.clear();
                                    return [4 /*yield*/, delay(400)];
                                case 5:
                                    _a.sent();
                                    rl.question(chalk_1["default"].blue("\n\nWhat do you want to do? \n\n") + chalk_1["default"].yellow("[1]") + " :: Session Renewal\n" + chalk_1["default"].yellow("[2]") + " :: Setup Bot" + "\n\n1) Session refresh is used to speed up a slow bot or to restore a logged out bot without data loss.\n>>> ", function (answer2) { return __awaiter(_this, void 0, void 0, function () {
                                        var _this = this;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!(answer2 == 1)) return [3 /*break*/, 5];
                                                    console.log(chalk_1["default"].green("Session Renewal Selected!"));
                                                    return [4 /*yield*/, delay(3000)];
                                                case 1:
                                                    _a.sent();
                                                    console.clear();
                                                    console.log(penmsg);
                                                    return [4 /*yield*/, delay(1500)];
                                                case 2:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].green("Please enter the Database Code."));
                                                    return [4 /*yield*/, delay(1500)];
                                                case 3:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].green("You can see this in the") + chalk_1["default"].yellow(" Variables ") + chalk_1["default"].green("section of your application on the railway, in the") + chalk_1["default"].yellow(" GITHUB_DB ") + chalk_1["default"].green("section."));
                                                    return [4 /*yield*/, delay(1500)];
                                                case 4:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].green("If you can't do this, please check the message that the bot you have previously set up has sent to your own number.\n\n"));
                                                    rl.question(chalk_1["default"].blue("Enter Key :: "), function (a1) { return __awaiter(_this, void 0, void 0, function () {
                                                        var _this = this;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    anahtar = a1;
                                                                    console.log(chalk_1["default"].yellow("\n\nThank you!"));
                                                                    return [4 /*yield*/, delay(3000)];
                                                                case 1:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    console.log(penmsg);
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 2:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].green("Please enter the Token Code."));
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 3:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].green("You can see this in the") + chalk_1["default"].yellow(" Variables ") + chalk_1["default"].green("section of your application on the railway, in the") + chalk_1["default"].yellow(" GITHUB_AUTH ") + chalk_1["default"].green("section."));
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 4:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].green("If you can't do this, please check the message that the bot you have previously set up has sent to your own number.\n\n"));
                                                                    rl.question(chalk_1["default"].blue("Enter Key :: "), function (a2) { return __awaiter(_this, void 0, void 0, function () {
                                                                        var test1, _a, octokit;
                                                                        var _this = this;
                                                                        return __generator(this, function (_b) {
                                                                            switch (_b.label) {
                                                                                case 0:
                                                                                    token = a2;
                                                                                    console.log(chalk_1["default"].yellow("\n\nThank you, please wait a moment. Checking if the codes you entered are valid.."));
                                                                                    _b.label = 1;
                                                                                case 1:
                                                                                    _b.trys.push([1, 3, , 4]);
                                                                                    test1 = new core_1.Octokit({ auth: token });
                                                                                    return [4 /*yield*/, test1.request('GET /gists/{gist_id}', {
                                                                                            gist_id: anahtar
                                                                                        })];
                                                                                case 2:
                                                                                    _b.sent();
                                                                                    return [3 /*break*/, 4];
                                                                                case 3:
                                                                                    _a = _b.sent();
                                                                                    console.clear();
                                                                                    console.log(chalk_1["default"].red("\n\nSorry, the value you entered is not correct. Please check again."));
                                                                                    process.exit();
                                                                                    return [3 /*break*/, 4];
                                                                                case 4:
                                                                                    console.log(chalk_1["default"].green("\n\nThe Information You Entered Is Correct!"));
                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                case 5:
                                                                                    _b.sent();
                                                                                    octokit = new core_1.Octokit({ auth: token });
                                                                                    console.log(chalk_1["default"].green("Now open your WhatsApp application and click on 'Connected Devices'."));
                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                case 6:
                                                                                    _b.sent();
                                                                                    console.log(chalk_1["default"].green("\n\nThen activate the 'Multi-Device' program."));
                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                case 7:
                                                                                    _b.sent();
                                                                                    console.log(chalk_1["default"].green("\n\nAfter doing these, please press enter."));
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
                                                                                                    console.log(chalk_1["default"].green("Now read the QR code that will appear on the screen.."));
                                                                                                    return [4 /*yield*/, delay(2800)];
                                                                                                case 2:
                                                                                                    _a.sent();
                                                                                                    console.log(chalk_1["default"].red("\n\nPlease Restart the System After Scanning the QR!"));
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
                                                    console.log(chalk_1["default"].green("Bot Setup Selected!"));
                                                    return [4 /*yield*/, delay(3000)];
                                                case 6:
                                                    _a.sent();
                                                    console.clear();
                                                    console.log(penmsg);
                                                    return [4 /*yield*/, delay(1500)];
                                                case 7:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].green("First, if you don't have a github account, click https://github.com and create a new one. Then confirm your account by e-mail to your e-mail address. After doing this, press enter and continue.\n\n"));
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
                                                                    console.log(chalk_1["default"].green("After creating an account, go to https://github.com/settings/emails for mail confirmation and press 'Resend verification email'. Then check your mail. If you have already done these or please press enter to continue.\n\n"));
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
                                                                                    console.log(chalk_1["default"].green("Now that your account has been approved, let's get tokens. \n\n"));
                                                                                    return [4 /*yield*/, delay(3000)];
                                                                                case 2:
                                                                                    _a.sent();
                                                                                    console.log(chalk_1["default"].green("Please go to https://github.com/settings/tokens and press 'Personal access tokens'. After doing this, press the enter key.\n\n"));
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
                                                                                                    console.log(chalk_1["default"].green("Here, click the 'Generate New Token' button.\n\n"));
                                                                                                    return [4 /*yield*/, delay(3000)];
                                                                                                case 2:
                                                                                                    _a.sent();
                                                                                                    console.log(chalk_1["default"].green("And our settings are as follows: \n\nNOTE: Primon \n\nExpiration: No expiration\n\nThen check the box that says 'repo' and 'gist' below.\n\n"));
                                                                                                    return [4 /*yield*/, delay(3000)];
                                                                                                case 3:
                                                                                                    _a.sent();
                                                                                                    console.log(chalk_1["default"].green("Finally, press the 'Generate token' button below. Copy the key that will appear in front of you! Do not lose this key until the process is finished! After copying, paste it into the input section that will appear on the screen..\n\n"));
                                                                                                    rl.question(chalk_1["default"].blue("Enter Key :: "), function (answer6) { return __awaiter(_this, void 0, void 0, function () {
                                                                                                        var test1, res, _a, octokit, t1, t2, res, jsoner, fin, step;
                                                                                                        var _this = this;
                                                                                                        return __generator(this, function (_b) {
                                                                                                            switch (_b.label) {
                                                                                                                case 0:
                                                                                                                    token = answer6;
                                                                                                                    console.log(chalk_1["default"].yellow("\n\nThank you, please wait a moment. Checking if the codes you entered are valid.."));
                                                                                                                    _b.label = 1;
                                                                                                                case 1:
                                                                                                                    _b.trys.push([1, 3, , 4]);
                                                                                                                    test1 = new core_1.Octokit({ auth: token });
                                                                                                                    return [4 /*yield*/, test1.request('POST /gists', {
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
                                                                                                                    console.log(chalk_1["default"].red("\n\nSorry, the value you entered is not correct. Please check again."));
                                                                                                                    process.exit();
                                                                                                                    return [3 /*break*/, 4];
                                                                                                                case 4:
                                                                                                                    console.log(chalk_1["default"].green("\n\nThe Information You Entered Is Correct!"));
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 5:
                                                                                                                    _b.sent();
                                                                                                                    fs.writeFileSync("./gh_auth.txt", token);
                                                                                                                    octokit = new core_1.Octokit({ auth: token });
                                                                                                                    t1 = new Date().getTime();
                                                                                                                    return [4 /*yield*/, octokit.request('GET /gists/{gist_id}', {
                                                                                                                            gist_id: res.data.id
                                                                                                                        })];
                                                                                                                case 6:
                                                                                                                    _b.sent();
                                                                                                                    t2 = new Date().getTime();
                                                                                                                    return [4 /*yield*/, octokit.request('DELETE /gists/{gist_id}', {
                                                                                                                            gist_id: res.data.id
                                                                                                                        })];
                                                                                                                case 7:
                                                                                                                    _b.sent();
                                                                                                                    console.log(chalk_1["default"].green("\n\nCreating Database..\n\n"));
                                                                                                                    return [4 /*yield*/, octokit.request('POST /gists', {
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
                                                                                                                    jsoner.afk.message = "*Bip Bop 🤖* \nThis is a bot. My owner is not here right now. I told this to my owner. It will be returned as soon as possible.\n\n*Last Seen:* {lastseen}\n*Reason:* {reason}";
                                                                                                                    jsoner.language = "EN";
                                                                                                                    fin = JSON.stringify(jsoner, null, 2);
                                                                                                                    return [4 /*yield*/, octokit.request('PATCH /gists/{gist_id}', {
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
                                                                                                                    console.log(chalk_1["default"].green("Database Created! \n\nDatabase Speed: " + step.toString() + "ms\n\n"));
                                                                                                                    return [4 /*yield*/, delay(5000)];
                                                                                                                case 10:
                                                                                                                    _b.sent();
                                                                                                                    console.clear();
                                                                                                                    console.log(penmsg);
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 11:
                                                                                                                    _b.sent();
                                                                                                                    console.log(chalk_1["default"].green("Now open your WhatsApp application and click on 'Connected Devices'."));
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 12:
                                                                                                                    _b.sent();
                                                                                                                    console.log(chalk_1["default"].green("\n\nThen activate the 'Multi-Device' program."));
                                                                                                                    return [4 /*yield*/, delay(1500)];
                                                                                                                case 13:
                                                                                                                    _b.sent();
                                                                                                                    console.log(chalk_1["default"].green("\n\nAfter doing these, please press enter."));
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
                                                                                                                                    console.log(chalk_1["default"].green("Now read the QR code that will appear on the screen."));
                                                                                                                                    return [4 /*yield*/, delay(2800)];
                                                                                                                                case 2:
                                                                                                                                    _a.sent();
                                                                                                                                    console.log(chalk_1["default"].red("After scanned the QR, please run the system again!"));
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
                                                    console.log(chalk_1["default"].red("Just Write 1 or 2!"));
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
        var octokit, jsoner, fin, sd, sd, command, octokit, jsoner, fin, sd, sd;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!fs.existsSync("./cont.txt")) return [3 /*break*/, 7];
                    octokit = new core_1.Octokit({ auth: fs.readFileSync("./gh_auth.txt").toString() });
                    return [4 /*yield*/, octokit.request('GET /gists/{gist_id}', {
                            gist_id: fs.readFileSync("./gb_db.txt").toString()
                        })];
                case 1:
                    jsoner = _a.sent();
                    fin = JSON.parse(jsoner.data.files["primon.db.json"].content);
                    fin.sudo = [];
                    try {
                        sd = fs.readFileSync("./sudo.txt").toString();
                        sd = sd.split(":")[0] + "@s.whatsapp.net";
                    }
                    catch (_b) {
                        sd = fs.readFileSync("./sudo.txt").toString();
                        sd = sd.split("@")[0] + "@s.whatsapp.net";
                    }
                    fin.sudo.push(sd);
                    fin = JSON.stringify(fin, null, 2);
                    return [4 /*yield*/, octokit.request('PATCH /gists/{gist_id}', {
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
                    console.log(chalk_1["default"].green("QR Okutma İşlemi Başarılı!"));
                    return [4 /*yield*/, delay(1500)];
                case 4:
                    _a.sent();
                    console.log(chalk_1["default"].green("\n\nŞimdi ise tek bir adım kaldı."));
                    return [4 /*yield*/, delay(3000)];
                case 5:
                    _a.sent();
                    console.log(chalk_1["default"].green("\n\nLütfen aşağıda çıkacak olan bağlantı ile Railway hesabınıza giriş yapın. Bu işlem otomatik olarak app oluşturacaktır."));
                    return [4 /*yield*/, delay(5000)];
                case 6:
                    _a.sent();
                    console.clear();
                    console.log(pmsg);
                    command = (0, child_process_1.exec)("bash wb.sh");
                    command.stdout.on('data', function (output) {
                        console.log(output.toString());
                    });
                    command.stdout.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log(chalk_1["default"].green("Railway Hesabına Giriş Yapıldı!"));
                                    return [4 /*yield*/, delay(1500)];
                                case 1:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    return [4 /*yield*/, delay(1500)];
                                case 2:
                                    _a.sent();
                                    console.log(chalk_1["default"].green("Lütfen https://railway.app/new bu adrese gidip ") + chalk_1["default"].yellow("Empty project ") + chalk_1["default"].green("butonuna tıklayın. Ardından enter tuşuna basın. Daha sonra gelen ekranda ortadaki") + chalk_1["default"].yellow('Add Servive') + chalk_1["default"].green("kısmına tıklayp tekrar") + chalk_1["default"].yellow(" Empty Service ") + chalk_1["default"].green("bölümüne basalım."));
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
                                                    console.log(chalk_1["default"].green("Şimdi ise 'Setting' kısmından 'Project ID' yazan kodu kopyalayın ve buraya yapıştırın."));
                                                    rl.question("\n\nAnahtarı Girin :: ", function (proj) { return __awaiter(_this, void 0, void 0, function () {
                                                        var sh1, sh3, prj, sh4, sh5, tkn, sh6, sh7;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    console.clear();
                                                                    console.log(pmsg);
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 1:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].green("Uygulama Oluşturuluyor.."));
                                                                    if (fs.existsSync("./PrimonProto")) {
                                                                        fs.rmSync("./PrimonProto", { recursive: true, force: true });
                                                                    }
                                                                    sh1 = shelljs_1["default"].exec('git clone https://github.com/phaticusthiccy/PrimonProto');
                                                                    sh3 = shelljs_1["default"].exec("bash wb3.sh");
                                                                    prj = shelljs_1["default"].exec("cd PrimonProto && node railway.js link " + proj);
                                                                    sh4 = shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set GITHUB_DB=" + fs.readFileSync("./gb_db.txt").toString());
                                                                    sh5 = shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set GITHUB_AUTH=" + fs.readFileSync("./gh_auth.txt").toString());
                                                                    tkn = fs.readFileSync("./break.txt").toString();
                                                                    sh6 = shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION=" + tkn);
                                                                    if (!(sh6.stdout == "GraphQL query failed with 1 errors: Problem processing request\n")) return [3 /*break*/, 11];
                                                                    console.log(chalk_1["default"].green("QR Kodunuz Bozuk! Lütfen Yeniden Okutun!"));
                                                                    try {
                                                                        fs.unlinkSync("./auth_info_multi.json");
                                                                    }
                                                                    catch (_b) {
                                                                    }
                                                                    try {
                                                                        fs.unlinkSync("./baileys_store_multi.json");
                                                                    }
                                                                    catch (_c) {
                                                                    }
                                                                    return [4 /*yield*/, delay(3000)];
                                                                case 2:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].red("Lütfen Whatsapp Ekranındaki Bağladığınız Cihazın Üstüne Basıp Çıkış Yapın!\n\n"));
                                                                    return [4 /*yield*/, delay(3000)];
                                                                case 3:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].red("QR Hazırlanıyor..\n\n"));
                                                                    return [4 /*yield*/, delay(3000)];
                                                                case 4:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].red("5"));
                                                                    return [4 /*yield*/, delay(1000)];
                                                                case 5:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].red("4"));
                                                                    return [4 /*yield*/, delay(1000)];
                                                                case 6:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].red("3"));
                                                                    return [4 /*yield*/, delay(1000)];
                                                                case 7:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].red("2"));
                                                                    return [4 /*yield*/, delay(1000)];
                                                                case 8:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].red("1"));
                                                                    return [4 /*yield*/, delay(1000)];
                                                                case 9:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    return [4 /*yield*/, PRIMON_PROTO3()];
                                                                case 10: return [2 /*return*/, _a.sent()];
                                                                case 11: return [4 /*yield*/, delay(1500)];
                                                                case 12:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    console.log(pmsg);
                                                                    console.log(chalk_1["default"].green("Uygulama Oluşturuldu!"));
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 13:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].green("Depo, Railway Adresine Aktarılıyor.."));
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 14:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    console.log(pmsg);
                                                                    sh7 = shelljs_1["default"].exec("cd PrimonProto/ && yes n | node railway.js up");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 15:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    console.log(pmsg);
                                                                    console.log(chalk_1["default"].green("Başarıyla Aktarıldı!\n\n"));
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 16:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].yellow("Primon Proto Kullandığınız İçin Teşekkürler!"));
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 17:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].green("Lütfen ") + chalk_1["default"].blue("https://railway.app/project/" + proj) + chalk_1["default"].green(" linkini kontrol ediniz."));
                                                                    try {
                                                                        fs.unlinkSync("./auth_info_multi.json");
                                                                    }
                                                                    catch (_d) {
                                                                    }
                                                                    try {
                                                                        fs.unlinkSync("./gb_db.txt");
                                                                    }
                                                                    catch (_e) {
                                                                    }
                                                                    try {
                                                                        fs.unlinkSync("./gh_auth.txt");
                                                                    }
                                                                    catch (_f) {
                                                                    }
                                                                    try {
                                                                        fs.unlinkSync("./break.txt");
                                                                    }
                                                                    catch (_g) {
                                                                    }
                                                                    try {
                                                                        fs.unlinkSync("./lang.txt");
                                                                    }
                                                                    catch (_h) {
                                                                    }
                                                                    try {
                                                                        fs.unlinkSync("./baileys_store_multi.json");
                                                                    }
                                                                    catch (_j) {
                                                                    }
                                                                    try {
                                                                        fs.unlinkSync("./cont.txt");
                                                                    }
                                                                    catch (_k) {
                                                                    }
                                                                    try {
                                                                        fs.unlinkSync("./sudo.txt");
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
                    }); });
                    return [3 /*break*/, 11];
                case 7:
                    octokit = new core_1.Octokit({ auth: fs.readFileSync("./gh_auth.txt").toString() });
                    return [4 /*yield*/, octokit.request('GET /gists/{gist_id}', {
                            gist_id: fs.readFileSync("./gb_db.txt").toString()
                        })];
                case 8:
                    jsoner = _a.sent();
                    fin = JSON.parse(jsoner.data.files["primon.db.json"].content);
                    fin.sudo = [];
                    try {
                        sd = fs.readFileSync("./sudo.txt").toString();
                        sd = sd.split(":")[0] + "@s.whatsapp.net";
                    }
                    catch (_c) {
                        sd = fs.readFileSync("./sudo.txt").toString();
                        sd = sd.split("@")[0] + "@s.whatsapp.net";
                    }
                    fin.sudo.push(sd);
                    fin = JSON.stringify(fin, null, 2);
                    return [4 /*yield*/, octokit.request('PATCH /gists/{gist_id}', {
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
                    console.log(chalk_1["default"].green("Şimdi ise 'Setting' kısmından 'Project ID' yazan kodu kopyalayın ve buraya yapıştırın."));
                    rl.question("\n\nAnahtarı Girin :: ", function (proj) { return __awaiter(_this, void 0, void 0, function () {
                        var sh1, sh3, prj, sh4, sh5, tkn, sh6, sh7;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.clear();
                                    console.log(pmsg);
                                    return [4 /*yield*/, delay(1500)];
                                case 1:
                                    _a.sent();
                                    console.log(chalk_1["default"].green("Uygulama Oluşturuluyor.."));
                                    if (fs.existsSync("./PrimonProto")) {
                                        fs.rmSync("./PrimonProto", { recursive: true, force: true });
                                    }
                                    sh1 = shelljs_1["default"].exec('git clone https://github.com/phaticusthiccy/PrimonProto');
                                    sh3 = shelljs_1["default"].exec("bash wb3.sh");
                                    prj = shelljs_1["default"].exec("cd PrimonProto && node railway.js link " + proj);
                                    sh4 = shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set GITHUB_DB=" + fs.readFileSync("./gb_db.txt").toString());
                                    sh5 = shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set GITHUB_AUTH=" + fs.readFileSync("./gh_auth.txt").toString());
                                    tkn = fs.readFileSync("./break.txt").toString();
                                    sh6 = shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION=" + tkn);
                                    if (!(sh6.stdout == "GraphQL query failed with 1 errors: Problem processing request\n")) return [3 /*break*/, 11];
                                    console.log(chalk_1["default"].green("QR Kodunuz Bozuk! Lütfen Yeniden Okutun!\n\n"));
                                    try {
                                        fs.unlinkSync("./auth_info_multi.json");
                                    }
                                    catch (_b) {
                                    }
                                    try {
                                        fs.unlinkSync("./baileys_store_multi.json");
                                    }
                                    catch (_c) {
                                    }
                                    return [4 /*yield*/, delay(3000)];
                                case 2:
                                    _a.sent();
                                    console.log(chalk_1["default"].red("Lütfen Whatsapp Ekranındaki Bağladığınız Cihazın Üstüne Basıp Çıkış Yapın!\n\n"));
                                    return [4 /*yield*/, delay(3000)];
                                case 3:
                                    _a.sent();
                                    console.log(chalk_1["default"].red("QR Hazırlanıyor..\n\n"));
                                    return [4 /*yield*/, delay(3000)];
                                case 4:
                                    _a.sent();
                                    console.log(chalk_1["default"].red("5"));
                                    return [4 /*yield*/, delay(1000)];
                                case 5:
                                    _a.sent();
                                    console.log(chalk_1["default"].red("4"));
                                    return [4 /*yield*/, delay(1000)];
                                case 6:
                                    _a.sent();
                                    console.log(chalk_1["default"].red("3"));
                                    return [4 /*yield*/, delay(1000)];
                                case 7:
                                    _a.sent();
                                    console.log(chalk_1["default"].red("2"));
                                    return [4 /*yield*/, delay(1000)];
                                case 8:
                                    _a.sent();
                                    console.log(chalk_1["default"].red("1"));
                                    return [4 /*yield*/, delay(1000)];
                                case 9:
                                    _a.sent();
                                    console.clear();
                                    return [4 /*yield*/, PRIMON_PROTO3()];
                                case 10: return [2 /*return*/, _a.sent()];
                                case 11: return [4 /*yield*/, delay(1500)];
                                case 12:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    console.log(chalk_1["default"].green("Uygulama Oluşturuldu!"));
                                    return [4 /*yield*/, delay(1500)];
                                case 13:
                                    _a.sent();
                                    console.log(chalk_1["default"].green("Depo, Railway Adresine Aktarılıyor.."));
                                    return [4 /*yield*/, delay(1500)];
                                case 14:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    sh7 = shelljs_1["default"].exec("cd PrimonProto/ && yes n | node railway.js up");
                                    return [4 /*yield*/, delay(1500)];
                                case 15:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    console.log(chalk_1["default"].green("Başarıyla Aktarıldı!\n\n"));
                                    return [4 /*yield*/, delay(1500)];
                                case 16:
                                    _a.sent();
                                    console.log(chalk_1["default"].yellow("Primon Proto Kullandığınız İçin Teşekkürler!"));
                                    return [4 /*yield*/, delay(1500)];
                                case 17:
                                    _a.sent();
                                    console.log(chalk_1["default"].green("Lütfen ") + chalk_1["default"].blue("https://railway.app/project/" + proj) + chalk_1["default"].green(" linkini kontrol ediniz."));
                                    try {
                                        fs.unlinkSync("./auth_info_multi.json");
                                    }
                                    catch (_d) {
                                    }
                                    try {
                                        fs.unlinkSync("./gb_db.txt");
                                    }
                                    catch (_e) {
                                    }
                                    try {
                                        fs.unlinkSync("./gh_auth.txt");
                                    }
                                    catch (_f) {
                                    }
                                    try {
                                        fs.unlinkSync("./break.txt");
                                    }
                                    catch (_g) {
                                    }
                                    try {
                                        fs.unlinkSync("./lang.txt");
                                    }
                                    catch (_h) {
                                    }
                                    try {
                                        fs.unlinkSync("./baileys_store_multi.json");
                                    }
                                    catch (_j) {
                                    }
                                    try {
                                        fs.unlinkSync("./cont.txt");
                                    }
                                    catch (_k) {
                                    }
                                    try {
                                        fs.unlinkSync("./sudo.txt");
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
                    _a.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    });
}
function after_en() {
    return __awaiter(this, void 0, void 0, function () {
        var octokit, jsoner, fin, sd, sd, command, octokit, jsoner, fin, sd, sd;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!fs.existsSync("./cont.txt")) return [3 /*break*/, 7];
                    octokit = new core_1.Octokit({ auth: fs.readFileSync("./gh_auth.txt").toString() });
                    return [4 /*yield*/, octokit.request('GET /gists/{gist_id}', {
                            gist_id: fs.readFileSync("./gb_db.txt").toString()
                        })];
                case 1:
                    jsoner = _a.sent();
                    fin = JSON.parse(jsoner.data.files["primon.db.json"].content);
                    fin.sudo = [];
                    try {
                        sd = fs.readFileSync("./sudo.txt").toString();
                        sd = sd.split(":")[0] + "@s.whatsapp.net";
                    }
                    catch (_b) {
                        sd = fs.readFileSync("./sudo.txt").toString();
                        sd = sd.split("@")[0] + "@s.whatsapp.net";
                    }
                    fin.sudo.push(sd);
                    fin = JSON.stringify(fin, null, 2);
                    return [4 /*yield*/, octokit.request('PATCH /gists/{gist_id}', {
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
                    console.log(chalk_1["default"].green("QR Scanning Successful!"));
                    return [4 /*yield*/, delay(1500)];
                case 4:
                    _a.sent();
                    console.log(chalk_1["default"].green("\n\nNow there is only one step left."));
                    return [4 /*yield*/, delay(3000)];
                case 5:
                    _a.sent();
                    console.log(chalk_1["default"].green("\n\nPlease login to your Railway account with the link below. This action will automatically create the app."));
                    return [4 /*yield*/, delay(5000)];
                case 6:
                    _a.sent();
                    console.clear();
                    console.log(penmsg);
                    command = (0, child_process_1.exec)("bash wb.sh");
                    command.stdout.on('data', function (output) {
                        console.log(output.toString());
                    });
                    command.stdout.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log(chalk_1["default"].green("Logged In Railway Account!"));
                                    return [4 /*yield*/, delay(1500)];
                                case 1:
                                    _a.sent();
                                    console.clear();
                                    console.log(penmsg);
                                    return [4 /*yield*/, delay(1500)];
                                case 2:
                                    _a.sent();
                                    console.log(chalk_1["default"].green("Please go to this address https://railway.app/new and click ") + chalk_1["default"].yellow("Empty project ") + chalk_1["default"].green("button. Then press enter. On the next screen, click on the") + chalk_1["default"].yellow('Add Servive') + chalk_1["default"].green("section in the middle and press the") + chalk_1["default"].yellow(" Empty Service ") + chalk_1["default"].green("section again."));
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
                                                    console.log(chalk_1["default"].green("Now copy the code that says 'Project ID' from the 'Setting' section and paste it here."));
                                                    rl.question("\n\nEnter Key :: ", function (proj) { return __awaiter(_this, void 0, void 0, function () {
                                                        var sh1, sh3, prj, sh4, sh5, tkn, sh6, sh7;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    console.clear();
                                                                    console.log(penmsg);
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 1:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].green("Creating Application.."));
                                                                    if (fs.existsSync("./PrimonProto")) {
                                                                        fs.rmSync("./PrimonProto", { recursive: true, force: true });
                                                                    }
                                                                    sh1 = shelljs_1["default"].exec('git clone https://github.com/phaticusthiccy/PrimonProto');
                                                                    sh3 = shelljs_1["default"].exec("bash wb3.sh");
                                                                    prj = shelljs_1["default"].exec("cd PrimonProto && node railway.js link " + proj);
                                                                    sh4 = shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set GITHUB_DB=" + fs.readFileSync("./gb_db.txt").toString());
                                                                    sh5 = shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set GITHUB_AUTH=" + fs.readFileSync("./gh_auth.txt"));
                                                                    tkn = fs.readFileSync("./break.txt").toString();
                                                                    sh6 = shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION=" + tkn);
                                                                    if (!(sh6.stdout == "GraphQL query failed with 1 errors: Problem processing request\n")) return [3 /*break*/, 11];
                                                                    console.log(chalk_1["default"].green("Your QR Code is Corrupt! Please Reread!"));
                                                                    try {
                                                                        fs.unlinkSync("./auth_info_multi.json");
                                                                    }
                                                                    catch (_b) {
                                                                    }
                                                                    try {
                                                                        fs.unlinkSync("./baileys_store_multi.json");
                                                                    }
                                                                    catch (_c) {
                                                                    }
                                                                    return [4 /*yield*/, delay(3000)];
                                                                case 2:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].red("Please Click on the Device You Connected on the Whatsapp Screen and Exit!\n\n"));
                                                                    return [4 /*yield*/, delay(3000)];
                                                                case 3:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].red("QR Preparing..\n\n"));
                                                                    return [4 /*yield*/, delay(3000)];
                                                                case 4:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].red("5"));
                                                                    return [4 /*yield*/, delay(1000)];
                                                                case 5:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].red("4"));
                                                                    return [4 /*yield*/, delay(1000)];
                                                                case 6:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].red("3"));
                                                                    return [4 /*yield*/, delay(1000)];
                                                                case 7:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].red("2"));
                                                                    return [4 /*yield*/, delay(1000)];
                                                                case 8:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].red("1"));
                                                                    return [4 /*yield*/, delay(1000)];
                                                                case 9:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    return [4 /*yield*/, PRIMON_PROTO5()];
                                                                case 10: return [2 /*return*/, _a.sent()];
                                                                case 11: return [4 /*yield*/, delay(1500)];
                                                                case 12:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    console.log(penmsg);
                                                                    console.log(chalk_1["default"].green("Application Created!"));
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 13:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].green("The Repo is Transferred to the Railway Address.."));
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 14:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    console.log(penmsg);
                                                                    sh7 = shelljs_1["default"].exec("cd PrimonProto/ && yes n | node railway.js up");
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 15:
                                                                    _a.sent();
                                                                    console.clear();
                                                                    console.log(pmsg);
                                                                    console.log(chalk_1["default"].green("Successfully Transferred!\n\n"));
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 16:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].yellow("Thanks For Using Primon Proto!"));
                                                                    return [4 /*yield*/, delay(1500)];
                                                                case 17:
                                                                    _a.sent();
                                                                    console.log(chalk_1["default"].green("Please check the ") + chalk_1["default"].blue("https://railway.app/project/" + proj));
                                                                    try {
                                                                        fs.unlinkSync("./auth_info_multi.json");
                                                                    }
                                                                    catch (_d) {
                                                                    }
                                                                    try {
                                                                        fs.unlinkSync("./gb_db.txt");
                                                                    }
                                                                    catch (_e) {
                                                                    }
                                                                    try {
                                                                        fs.unlinkSync("./gh_auth.txt");
                                                                    }
                                                                    catch (_f) {
                                                                    }
                                                                    try {
                                                                        fs.unlinkSync("./break.txt");
                                                                    }
                                                                    catch (_g) {
                                                                    }
                                                                    try {
                                                                        fs.unlinkSync("./lang.txt");
                                                                    }
                                                                    catch (_h) {
                                                                    }
                                                                    try {
                                                                        fs.unlinkSync("./baileys_store_multi.json");
                                                                    }
                                                                    catch (_j) {
                                                                    }
                                                                    try {
                                                                        fs.unlinkSync("./cont.txt");
                                                                    }
                                                                    catch (_k) {
                                                                    }
                                                                    try {
                                                                        fs.unlinkSync("./sudo.txt");
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
                    }); });
                    return [3 /*break*/, 11];
                case 7:
                    octokit = new core_1.Octokit({ auth: fs.readFileSync("./gh_auth.txt").toString() });
                    return [4 /*yield*/, octokit.request('GET /gists/{gist_id}', {
                            gist_id: fs.readFileSync("./gb_db.txt").toString()
                        })];
                case 8:
                    jsoner = _a.sent();
                    fin = JSON.parse(jsoner.data.files["primon.db.json"].content);
                    fin.sudo = [];
                    try {
                        sd = fs.readFileSync("./sudo.txt").toString();
                        sd = sd.split(":")[0] + "@s.whatsapp.net";
                    }
                    catch (_c) {
                        sd = fs.readFileSync("./sudo.txt").toString();
                        sd = sd.split("@")[0] + "@s.whatsapp.net";
                    }
                    fin.sudo.push(sd);
                    fin = JSON.stringify(fin, null, 2);
                    return [4 /*yield*/, octokit.request('PATCH /gists/{gist_id}', {
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
                    console.log(chalk_1["default"].green("Now copy the code that says 'Project ID' from the 'Setting' section and paste it here."));
                    rl.question("\n\nEnter Key :: ", function (proj) { return __awaiter(_this, void 0, void 0, function () {
                        var sh1, sh3, prj, sh4, sh5, tkn, sh6, sh7;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.clear();
                                    console.log(pmsg);
                                    return [4 /*yield*/, delay(1500)];
                                case 1:
                                    _a.sent();
                                    console.log(chalk_1["default"].green("Creating Application.."));
                                    if (fs.existsSync("./PrimonProto")) {
                                        fs.rmSync("./PrimonProto", { recursive: true, force: true });
                                    }
                                    sh1 = shelljs_1["default"].exec('git clone https://github.com/phaticusthiccy/PrimonProto');
                                    sh3 = shelljs_1["default"].exec("bash wb3.sh");
                                    prj = shelljs_1["default"].exec("cd PrimonProto && node railway.js link " + proj);
                                    sh4 = shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set GITHUB_DB=" + fs.readFileSync("./gb_db.txt").toString());
                                    sh5 = shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set GITHUB_AUTH=" + fs.readFileSync("./gh_auth.txt"));
                                    tkn = fs.readFileSync("./break.txt").toString();
                                    sh6 = shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION=" + tkn);
                                    if (!(sh6.stdout == "GraphQL query failed with 1 errors: Problem processing request\n")) return [3 /*break*/, 11];
                                    console.log(chalk_1["default"].green("Your QR Code is Corrupt! Please Reread!\n\n"));
                                    try {
                                        fs.unlinkSync("./auth_info_multi.json");
                                    }
                                    catch (_b) {
                                    }
                                    try {
                                        fs.unlinkSync("./baileys_store_multi.json");
                                    }
                                    catch (_c) {
                                    }
                                    return [4 /*yield*/, delay(3000)];
                                case 2:
                                    _a.sent();
                                    console.log(chalk_1["default"].red("Please Click on the Device You Connected on the Whatsapp Screen and Exit!\n\n"));
                                    return [4 /*yield*/, delay(3000)];
                                case 3:
                                    _a.sent();
                                    console.log(chalk_1["default"].red("QR Preparing..\n\n"));
                                    return [4 /*yield*/, delay(3000)];
                                case 4:
                                    _a.sent();
                                    console.log(chalk_1["default"].red("5"));
                                    return [4 /*yield*/, delay(1000)];
                                case 5:
                                    _a.sent();
                                    console.log(chalk_1["default"].red("4"));
                                    return [4 /*yield*/, delay(1000)];
                                case 6:
                                    _a.sent();
                                    console.log(chalk_1["default"].red("3"));
                                    return [4 /*yield*/, delay(1000)];
                                case 7:
                                    _a.sent();
                                    console.log(chalk_1["default"].red("2"));
                                    return [4 /*yield*/, delay(1000)];
                                case 8:
                                    _a.sent();
                                    console.log(chalk_1["default"].red("1"));
                                    return [4 /*yield*/, delay(1000)];
                                case 9:
                                    _a.sent();
                                    console.clear();
                                    return [4 /*yield*/, PRIMON_PROTO5()];
                                case 10: return [2 /*return*/, _a.sent()];
                                case 11: return [4 /*yield*/, delay(1500)];
                                case 12:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    console.log(chalk_1["default"].green("Application Created!"));
                                    return [4 /*yield*/, delay(1500)];
                                case 13:
                                    _a.sent();
                                    console.log(chalk_1["default"].green("The Repo is Transferred to the Railway Address.."));
                                    return [4 /*yield*/, delay(1500)];
                                case 14:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    sh7 = shelljs_1["default"].exec("cd PrimonProto/ && yes n | node railway.js up");
                                    return [4 /*yield*/, delay(1500)];
                                case 15:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    console.log(chalk_1["default"].green("Transferred Successfully!\n\n"));
                                    return [4 /*yield*/, delay(1500)];
                                case 16:
                                    _a.sent();
                                    console.log(chalk_1["default"].yellow("Thanks For Using Primon Proto!"));
                                    return [4 /*yield*/, delay(1500)];
                                case 17:
                                    _a.sent();
                                    console.log(chalk_1["default"].green("Please check the ") + chalk_1["default"].blue("https://railway.app/project/" + proj));
                                    try {
                                        fs.unlinkSync("./auth_info_multi.json");
                                    }
                                    catch (_d) {
                                    }
                                    try {
                                        fs.unlinkSync("./gb_db.txt");
                                    }
                                    catch (_e) {
                                    }
                                    try {
                                        fs.unlinkSync("./gh_auth.txt");
                                    }
                                    catch (_f) {
                                    }
                                    try {
                                        fs.unlinkSync("./break.txt");
                                    }
                                    catch (_g) {
                                    }
                                    try {
                                        fs.unlinkSync("./lang.txt");
                                    }
                                    catch (_h) {
                                    }
                                    try {
                                        fs.unlinkSync("./baileys_store_multi.json");
                                    }
                                    catch (_j) {
                                    }
                                    try {
                                        fs.unlinkSync("./cont.txt");
                                    }
                                    catch (_k) {
                                    }
                                    try {
                                        fs.unlinkSync("./sudo.txt");
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
                    console.log(chalk_1["default"].green("QR Kod Başarıyla Okutuldu!"));
                    return [4 /*yield*/, delay(1500)];
                case 2:
                    _a.sent();
                    console.log(chalk_1["default"].green("Şimdi ise SESSION yenilemek için lütfen Railway hesabınıza giriş yapın. Az sonra giriş linki altta belirecek."));
                    return [4 /*yield*/, delay(5000)];
                case 3:
                    _a.sent();
                    console.clear();
                    console.log(pmsg);
                    command = (0, child_process_1.exec)("bash wb.sh");
                    command.stdout.on('data', function (output) {
                        console.log(output.toString());
                    });
                    command.stdout.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log(chalk_1["default"].green("Railway Hesabına Giriş Yapıldı!"));
                                    return [4 /*yield*/, delay(1500)];
                                case 1:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    return [4 /*yield*/, delay(1500)];
                                case 2:
                                    _a.sent();
                                    console.log(chalk_1["default"].green("Şimdi ise botun kurulu olduğu uygulamaya girin. Ardından 'Settings' kısmından 'Project ID' yazan kodu kopyalayın ve buraya yapıştırın."));
                                    rl.question("\n\nAnahtarı Girin :: ", function (proj) { return __awaiter(_this, void 0, void 0, function () {
                                        var sh1, sh3, prj, tkn, sh6, sh7;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    console.clear();
                                                    console.log(pmsg);
                                                    return [4 /*yield*/, delay(1500)];
                                                case 1:
                                                    _a.sent();
                                                    sh1 = shelljs_1["default"].exec('git clone https://github.com/phaticusthiccy/PrimonProto');
                                                    sh3 = shelljs_1["default"].exec("bash wb3.sh");
                                                    prj = shelljs_1["default"].exec("cd PrimonProto && node railway.js link " + proj);
                                                    tkn = fs.readFileSync("./break_session.txt").toString();
                                                    sh6 = shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION=" + tkn);
                                                    if (!(sh6.stdout == "GraphQL query failed with 1 errors: Problem processing request\n")) return [3 /*break*/, 11];
                                                    console.log(chalk_1["default"].green("QR Kodunuz Bozuk! Lütfen Yeniden Okutun!\n\n"));
                                                    try {
                                                        fs.unlinkSync("./auth_info_multi.json");
                                                    }
                                                    catch (_b) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./baileys_store_multi.json");
                                                    }
                                                    catch (_c) {
                                                    }
                                                    return [4 /*yield*/, delay(3000)];
                                                case 2:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].red("Lütfen Whatsapp Ekranındaki Bağladığınız Cihazın Üstüne Basıp Çıkış Yapın!\n\n"));
                                                    return [4 /*yield*/, delay(3000)];
                                                case 3:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].red("QR Hazırlanıyor..\n\n"));
                                                    return [4 /*yield*/, delay(3000)];
                                                case 4:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].red("5"));
                                                    return [4 /*yield*/, delay(1000)];
                                                case 5:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].red("4"));
                                                    return [4 /*yield*/, delay(1000)];
                                                case 6:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].red("3"));
                                                    return [4 /*yield*/, delay(1000)];
                                                case 7:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].red("2"));
                                                    return [4 /*yield*/, delay(1000)];
                                                case 8:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].red("1"));
                                                    return [4 /*yield*/, delay(1000)];
                                                case 9:
                                                    _a.sent();
                                                    console.clear();
                                                    return [4 /*yield*/, PRIMON_PROTO7()];
                                                case 10: return [2 /*return*/, _a.sent()];
                                                case 11: return [4 /*yield*/, delay(1500)];
                                                case 12:
                                                    _a.sent();
                                                    console.clear();
                                                    console.log(pmsg);
                                                    sh7 = shelljs_1["default"].exec("cd PrimonProto/ && yes n | node railway.js up");
                                                    return [4 /*yield*/, delay(1500)];
                                                case 13:
                                                    _a.sent();
                                                    console.clear();
                                                    console.log(pmsg);
                                                    console.log(chalk_1["default"].green("SESSION Yenilendi! Veri kaybı olmadan eski ayarlar geri getirildi.\n\n"));
                                                    console.log(chalk_1["default"].yellow("Primon Proto Kullandığınız İçin Teşekkürler!\n\n"));
                                                    return [4 /*yield*/, delay(1500)];
                                                case 14:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].green("Lütfen ") + chalk_1["default"].blue("https://railway.app/project/" + proj) + chalk_1["default"].green(" linkini kontrol ediniz."));
                                                    try {
                                                        fs.unlinkSync("./auth_info_multi.json");
                                                    }
                                                    catch (_d) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./gb_db.txt");
                                                    }
                                                    catch (_e) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./gh_auth.txt");
                                                    }
                                                    catch (_f) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./break.txt");
                                                    }
                                                    catch (_g) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./lang.txt");
                                                    }
                                                    catch (_h) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./baileys_store_multi.json");
                                                    }
                                                    catch (_j) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./cont.txt");
                                                    }
                                                    catch (_k) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./sudo.txt");
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
                    console.log(chalk_1["default"].green("QR Code Read Successfully!"));
                    return [4 /*yield*/, delay(1500)];
                case 2:
                    _a.sent();
                    console.log(chalk_1["default"].green("Now, please login to your Railway account to renew the SESSION. The login link will appear below."));
                    return [4 /*yield*/, delay(5000)];
                case 3:
                    _a.sent();
                    console.clear();
                    console.log(pmsg);
                    command = (0, child_process_1.exec)("bash wb.sh");
                    command.stdout.on('data', function (output) {
                        console.log(output.toString());
                    });
                    command.stdout.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log(chalk_1["default"].green("Logged In Railway Account!"));
                                    return [4 /*yield*/, delay(1500)];
                                case 1:
                                    _a.sent();
                                    console.clear();
                                    console.log(pmsg);
                                    return [4 /*yield*/, delay(1500)];
                                case 2:
                                    _a.sent();
                                    console.log(chalk_1["default"].green("Now go to the application where the bot is installed. Then copy the code that says 'Project ID' from 'Settings' and paste it here."));
                                    rl.question("\n\nEnter Key :: ", function (proj) { return __awaiter(_this, void 0, void 0, function () {
                                        var sh1, sh3, prj, tkn, sh6, sh7;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    console.clear();
                                                    console.log(pmsg);
                                                    return [4 /*yield*/, delay(1500)];
                                                case 1:
                                                    _a.sent();
                                                    sh1 = shelljs_1["default"].exec('git clone https://github.com/phaticusthiccy/PrimonProto');
                                                    sh3 = shelljs_1["default"].exec("bash wb3.sh");
                                                    prj = shelljs_1["default"].exec("cd PrimonProto && node railway.js link " + proj);
                                                    tkn = fs.readFileSync("./break_session.txt").toString();
                                                    sh6 = shelljs_1["default"].exec("cd PrimonProto/ && node railway.js variables set SESSION=" + tkn);
                                                    if (!(sh6.stdout == "GraphQL query failed with 1 errors: Problem processing request\n")) return [3 /*break*/, 11];
                                                    console.log(chalk_1["default"].green("Your QR Code is Corrupt! Please Reread!\n\n"));
                                                    try {
                                                        fs.unlinkSync("./auth_info_multi.json");
                                                    }
                                                    catch (_b) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./baileys_store_multi.json");
                                                    }
                                                    catch (_c) {
                                                    }
                                                    return [4 /*yield*/, delay(3000)];
                                                case 2:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].red("Please Exit By Pressing On The Device You Connected On The Whatsapp Screen!\n\n"));
                                                    return [4 /*yield*/, delay(3000)];
                                                case 3:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].red("QR Preparing..\n\n"));
                                                    return [4 /*yield*/, delay(3000)];
                                                case 4:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].red("5"));
                                                    return [4 /*yield*/, delay(1000)];
                                                case 5:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].red("4"));
                                                    return [4 /*yield*/, delay(1000)];
                                                case 6:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].red("3"));
                                                    return [4 /*yield*/, delay(1000)];
                                                case 7:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].red("2"));
                                                    return [4 /*yield*/, delay(1000)];
                                                case 8:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].red("1"));
                                                    return [4 /*yield*/, delay(1000)];
                                                case 9:
                                                    _a.sent();
                                                    console.clear();
                                                    return [4 /*yield*/, PRIMON_PROTO7()];
                                                case 10: return [2 /*return*/, _a.sent()];
                                                case 11: return [4 /*yield*/, delay(1500)];
                                                case 12:
                                                    _a.sent();
                                                    console.clear();
                                                    console.log(penmsg);
                                                    sh7 = shelljs_1["default"].exec("cd PrimonProto/ && yes n | node railway.js up");
                                                    return [4 /*yield*/, delay(1500)];
                                                case 13:
                                                    _a.sent();
                                                    console.clear();
                                                    console.log(penmsg);
                                                    console.log(chalk_1["default"].green("SESSION Renewed! Restored old settings without data loss.\n\n"));
                                                    console.log(chalk_1["default"].yellow("Thanks For Using Primon Proto!\n\n"));
                                                    return [4 /*yield*/, delay(1500)];
                                                case 14:
                                                    _a.sent();
                                                    console.log(chalk_1["default"].green("Please check the ") + chalk_1["default"].blue("https://railway.app/project/" + proj));
                                                    try {
                                                        fs.unlinkSync("./auth_info_multi.json");
                                                    }
                                                    catch (_d) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./gb_db.txt");
                                                    }
                                                    catch (_e) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./gh_auth.txt");
                                                    }
                                                    catch (_f) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./break.txt");
                                                    }
                                                    catch (_g) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./lang.txt");
                                                    }
                                                    catch (_h) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./baileys_store_multi.json");
                                                    }
                                                    catch (_j) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./cont.txt");
                                                    }
                                                    catch (_k) {
                                                    }
                                                    try {
                                                        fs.unlinkSync("./sudo.txt");
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
        var store, _a, state, saveState, sock;
        var _this = this;
        return __generator(this, function (_b) {
            store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'debug', stream: 'store' }) });
            store.readFromFile('./baileys_store_multi.json');
            _a = (0, baileys_1.useSingleFileAuthState)('./auth_info_multi.json'), state = _a.state, saveState = _a.saveState;
            sock = (0, baileys_1["default"])({
                logger: (0, pino_1["default"])({ level: 'silent' }),
                browser: ['Primon Proto', 'Chrome', '1.0'],
                printQRInTerminal: true,
                auth: state
            });
            setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    store.writeToFile('./baileys_store_multi.json');
                    fs.exists("./auth_info_multi.json", function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var s, s1;
                        return __generator(this, function (_a) {
                            if (!e == false) {
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
                                s1 = btoa(fs.readFileSync("./auth_info_multi.json"));
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
            }); }, 15000);
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
            sock.ev.on('creds.update', saveState);
            return [2 /*return*/, sock];
        });
    });
}
function PRIMON_PROTO2() {
    return __awaiter(this, void 0, void 0, function () {
        var store, _a, state, saveState, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'debug', stream: 'store' }) });
            store.readFromFile('./baileys_store_multi.json');
            _a = (0, baileys_1.useSingleFileAuthState)('./auth_info_multi.json'), state = _a.state, saveState = _a.saveState;
            sock = (0, baileys_1["default"])({
                logger: (0, pino_1["default"])({ level: 'silent' }),
                browser: ['Primon Proto', 'Chrome', '1.0'],
                printQRInTerminal: true,
                auth: state
            });
            z = false;
            INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    store.writeToFile('./baileys_store_multi.json');
                    fs.exists("./auth_info_multi.json", function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var s, s1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(!e == false)) return [3 /*break*/, 2];
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
                                    s1 = btoa(fs.readFileSync("./auth_info_multi.json"));
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
            }); }, 15000);
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
            sock.ev.on('creds.update', saveState);
            return [2 /*return*/, sock];
        });
    });
}
function PRIMON_PROTO3() {
    return __awaiter(this, void 0, void 0, function () {
        var store, _a, state, saveState, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'debug', stream: 'store' }) });
            store.readFromFile('./baileys_store_multi.json');
            _a = (0, baileys_1.useSingleFileAuthState)('./auth_info_multi.json'), state = _a.state, saveState = _a.saveState;
            sock = (0, baileys_1["default"])({
                logger: (0, pino_1["default"])({ level: 'silent' }),
                browser: ['Primon Proto', 'Chrome', '1.0'],
                printQRInTerminal: true,
                auth: state
            });
            z = false;
            INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    store.writeToFile('./baileys_store_multi.json');
                    fs.exists("./auth_info_multi.json", function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var s, s1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(!e == false)) return [3 /*break*/, 2];
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
                                    s1 = btoa(fs.readFileSync("./auth_info_multi.json"));
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
            }); }, 15000);
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
            sock.ev.on('creds.update', saveState);
            return [2 /*return*/, sock];
        });
    });
}
function PRIMON_PROTO4() {
    return __awaiter(this, void 0, void 0, function () {
        var store, _a, state, saveState, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'debug', stream: 'store' }) });
            store.readFromFile('./baileys_store_multi.json');
            _a = (0, baileys_1.useSingleFileAuthState)('./auth_info_multi.json'), state = _a.state, saveState = _a.saveState;
            sock = (0, baileys_1["default"])({
                logger: (0, pino_1["default"])({ level: 'silent' }),
                browser: ['Primon Proto', 'Chrome', '1.0'],
                printQRInTerminal: true,
                auth: state
            });
            z = false;
            INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    store.writeToFile('./baileys_store_multi.json');
                    fs.exists("./auth_info_multi.json", function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var s, s1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(!e == false)) return [3 /*break*/, 2];
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
                                    s1 = btoa(fs.readFileSync("./auth_info_multi.json"));
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
            }); }, 15000);
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
            sock.ev.on('creds.update', saveState);
            return [2 /*return*/, sock];
        });
    });
}
function PRIMON_PROTO5() {
    return __awaiter(this, void 0, void 0, function () {
        var store, _a, state, saveState, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'debug', stream: 'store' }) });
            store.readFromFile('./baileys_store_multi.json');
            _a = (0, baileys_1.useSingleFileAuthState)('./auth_info_multi.json'), state = _a.state, saveState = _a.saveState;
            sock = (0, baileys_1["default"])({
                logger: (0, pino_1["default"])({ level: 'silent' }),
                browser: ['Primon Proto', 'Chrome', '1.0'],
                printQRInTerminal: true,
                auth: state
            });
            z = false;
            INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    store.writeToFile('./baileys_store_multi.json');
                    fs.exists("./auth_info_multi.json", function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var s, s1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(!e == false)) return [3 /*break*/, 2];
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
                                    s1 = btoa(fs.readFileSync("./auth_info_multi.json"));
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
            }); }, 15000);
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
            sock.ev.on('creds.update', saveState);
            return [2 /*return*/, sock];
        });
    });
}
function PRIMON_PROTO6() {
    return __awaiter(this, void 0, void 0, function () {
        var store, _a, state, saveState, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'debug', stream: 'store' }) });
            store.readFromFile('./baileys_store_multi.json');
            _a = (0, baileys_1.useSingleFileAuthState)('./auth_info_multi.json'), state = _a.state, saveState = _a.saveState;
            sock = (0, baileys_1["default"])({
                logger: (0, pino_1["default"])({ level: 'silent' }),
                browser: ['Primon Proto', 'Chrome', '1.0'],
                printQRInTerminal: true,
                auth: state
            });
            z = false;
            INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    store.writeToFile('./baileys_store_multi.json');
                    fs.exists("./auth_info_multi.json", function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var s, s1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(!e == false)) return [3 /*break*/, 2];
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
                                    s1 = btoa(fs.readFileSync("./auth_info_multi.json"));
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
            }); }, 15000);
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
            sock.ev.on('creds.update', saveState);
            return [2 /*return*/, sock];
        });
    });
}
function PRIMON_PROTO7() {
    return __awaiter(this, void 0, void 0, function () {
        var store, _a, state, saveState, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'debug', stream: 'store' }) });
            store.readFromFile('./baileys_store_multi.json');
            _a = (0, baileys_1.useSingleFileAuthState)('./auth_info_multi.json'), state = _a.state, saveState = _a.saveState;
            sock = (0, baileys_1["default"])({
                logger: (0, pino_1["default"])({ level: 'silent' }),
                browser: ['Primon Proto', 'Chrome', '1.0'],
                printQRInTerminal: true,
                auth: state
            });
            z = false;
            INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    store.writeToFile('./baileys_store_multi.json');
                    fs.exists("./auth_info_multi.json", function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var s, s1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(!e == false)) return [3 /*break*/, 2];
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
                                    s1 = btoa(fs.readFileSync("./auth_info_multi.json"));
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
            }); }, 15000);
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
            sock.ev.on('creds.update', saveState);
            return [2 /*return*/, sock];
        });
    });
}
function PRIMON_PROTO8() {
    return __awaiter(this, void 0, void 0, function () {
        var store, _a, state, saveState, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'debug', stream: 'store' }) });
            store.readFromFile('./baileys_store_multi.json');
            _a = (0, baileys_1.useSingleFileAuthState)('./auth_info_multi.json'), state = _a.state, saveState = _a.saveState;
            sock = (0, baileys_1["default"])({
                logger: (0, pino_1["default"])({ level: 'silent' }),
                browser: ['Primon Proto', 'Chrome', '1.0'],
                printQRInTerminal: true,
                auth: state
            });
            z = false;
            INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    store.writeToFile('./baileys_store_multi.json');
                    fs.exists("./auth_info_multi.json", function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var s, s1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(!e == false)) return [3 /*break*/, 2];
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
                                    s1 = btoa(fs.readFileSync("./auth_info_multi.json"));
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
            }); }, 15000);
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
            sock.ev.on('creds.update', saveState);
            return [2 /*return*/, sock];
        });
    });
}
function PRIMON_PROTO9() {
    return __awaiter(this, void 0, void 0, function () {
        var store, _a, state, saveState, sock, z, INTERVAL;
        var _this = this;
        return __generator(this, function (_b) {
            store = (0, baileys_1.makeInMemoryStore)({ logger: (0, pino_1["default"])().child({ level: 'debug', stream: 'store' }) });
            store.readFromFile('./baileys_store_multi.json');
            _a = (0, baileys_1.useSingleFileAuthState)('./auth_info_multi.json'), state = _a.state, saveState = _a.saveState;
            sock = (0, baileys_1["default"])({
                logger: (0, pino_1["default"])({ level: 'silent' }),
                browser: ['Primon Proto', 'Chrome', '1.0'],
                printQRInTerminal: true,
                auth: state
            });
            z = false;
            INTERVAL = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    store.writeToFile('./baileys_store_multi.json');
                    fs.exists("./auth_info_multi.json", function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var s, s1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(!e == false)) return [3 /*break*/, 2];
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
                                    s1 = btoa(fs.readFileSync("./auth_info_multi.json"));
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
            }); }, 15000);
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
            sock.ev.on('creds.update', saveState);
            return [2 /*return*/, sock];
        });
    });
}
MAIN();
