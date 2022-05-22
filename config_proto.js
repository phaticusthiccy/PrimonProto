const { Sequelize } = require("sequelize");
const Language = require("./lang");
const MenuLang = Language.getString("menu");
DATABASE_URL =
  process.env.DATABASE_URL === undefined
    ? "./primon.db"
    : process.env.DATABASE_URL;
DEBUG = false;
let btn = [
  [
    {
      buttonId: "id1",
      buttonText: { displayText: MenuLang.menu },
      type: 1,
    },
    {
      buttonId: "id2",
      buttonText: { displayText: MenuLang.owner },
      type: 1,
    },
    {
      buttonId: "id3",
      buttonText: { displayText: MenuLang.star },
      type: 1,
    },
  ],
];
module.exports = {
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
    ],
  },
};

