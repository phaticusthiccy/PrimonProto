// Primon Proto 
// Headless WebSocket, type-safe Whatsapp UserBot
// 
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can ysable with mjs)
//
// Phaticusthiccy - 2022

var exec = require("child_process").exec
var fs = require("fs")
var axios = require("axios")
require("util").inspect.defaultOptions.depth = null;

// https://open-apis-rest.up.railway.app/api
// Official Public API From https://github.com/phaticusthiccy/Open-APIs
class build_lang {
    construtor(lang, args) {
        this.lang = lang
        this.args = args
    }
    async build_lang() {
        var def = {
            lang: "en",
            to: lang,
            dict: Infinity,
            base_url: "https://open-apis-rest.up.railway.app/api/",
            getaway: "translate?from=en&to={%c}&text={%c}"
        }
        var json = JSON.parse(fs.readFileSync("./langs/EN.json"))
        json = json.STRINGS
        let payload = base_url + getaway.replace("{%c}", this.lang)
        var arr = []
        var menu = {
            menu: async function() {
                var s = await axios.get(payload.replace("{%c}", json.menu.menu))
                return s.data.data.text
            },
            owner: async function() {
                var s = await axios.get(payload.replace("{%c}", json.menu.owner))
                return s.data.data.text
            },
            star: async function() {
                var s = await axios.get(payload.replace("{%c}", json.menu.star))
                return s.data.data.text
            }
        }
        var session = {
            bad: async function() {
                var s = await axios.get(payload.replace("{%c}", json.session.bad))
                return s.data.data.text
            },
            recon: async function() {
                var s = await axios.get(payload.replace("{%c}", json.session.recon))
                return s.data.data.text
            },
            out: async function() {
                var s = await axios.get(payload.replace("{%c}", json.session.out))
                return s.data.data.text
            },
            run: async function() {
                var s = await axios.get(payload.replace("{%c}", json.session.run))
                return s.data.data.text
            }
        }
        var tagall = {
            msg: async function() {
                var s = await axios.get(payload.replace("{%c}", json.tagall.msg))
                return s.data.data.text
            }
        }
        var json2 = JSON.parse(fs.readFileSync("./langs/EN.json"))
        json2.STRINGS.menu.menu = await menu.menu()
        json2.STRINGS.menu.owner = await menu.owner()
        json2.STRINGS.menu.star = await menu.star()
        json2.STRINGS.session.bad = await session.bad()
        json2.STRINGS.session.recon = await session.recon()
        json2.STRINGS.session.out = await session.out()
        json2.STRINGS.session.run = await session.run()
        json2.STRINGS.tagall.msg = await tagall.msg()
        return fs.writeFileSync("./langs/" + this.lang.toUpperCase(), JSON.stringify(json2))
    }
}
module.exports = build_lang;