// Primon Proto 
// Headless WebSocket, type-safe Whatsapp UserBot
// 
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES5 Module (can ysable with mjs)
//
// Phaticusthiccy - 2022

const { Sequelize } = require("sequelize");
const Language = require("./lang");
const MenuLang = Language.getString("menu");

DATABASE_URL =
  process.env.DATABASE_URL === undefined
    ? "./primon.db"
    : process.env.DATABASE_URL;
DEBUG = process.env.DEBUG == true ? true : false;
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
  DEBUG: this.DEBUG,
  VERSION: "v1.0 Beta",
  DATABASE_URL: DATABASE_URL,
  DATABASE:
    DATABASE_URL === "./primon.db"
      ? new Sequelize({
          dialect: "sqlite",
          storage: DATABASE_URL,
          logging: DEBUG,
        })
      : new Sequelize(DATABASE_URL, {
          dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
          logging: DEBUG,
        }),
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
