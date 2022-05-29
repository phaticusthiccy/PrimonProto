// Primon Proto 
// Headless WebSocket, type-safe Whatsapp UserBot
// 
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can ysable with mjs)
//
// Phaticusthiccy - 2022

const Language = require("./lang");
const MenuLang = Language.getString("menu");
const { Octokit } = require("@octokit/core");
require("util").inspect.defaultOptions.depth = null;
const get_db = require("./db.json");

var Primondb = get_db

var DEBUG = Primondb.debug === true ? true : false
let btn = [
  [
    {
      buttonId: "MENU",
      buttonText: { displayText: MenuLang.menu },
      type: 1,
    },
    {
      buttonId: "OWNER",
      buttonText: { displayText: MenuLang.owner },
      type: 1,
    },
    {
      buttonId: "STAR",
      buttonText: { displayText: MenuLang.star },
      type: 1,
    },
  ],
  [
    {
      buttonId: "ALIVE",
      buttonText: { displayText: "Alive" },
      type: 1,
    },
    {
      buttonId: "PİNG",
      buttonText: { displayText: "Ping" },
      type: 1,
    },
    {
      buttonId: "TAGALL",
      buttonText: { displayText: "Tagall" },
      type: 1,
    },
  ]
];
module.exports = {
  DEBUG: DEBUG,
  VERSION: "v1.0 Beta",
  TEXTS: {
    MENU: [
      {
        text: "Primon Proto",
        footer: "ES5 Lightweight Userbot",
        buttons: btn[0],
        headerType: 1,
      },
      {
        text: MenuLang.pp,
        footer: "ES5 Lightweight Userbot",
        buttons: btn[1],
        headerType: 1,
      }
    ]
  }
};
