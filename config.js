const { Sequelize } = require('sequelize');
const fs = require('fs');
var DATABASE_URL = process.env.DATABASE_URL === undefined ? './userbot.db' : process.env.DATABASE_URL;
module.exports = {
    SESSION: process.env.SESSION === undefined ? '' : process.env.SESSION,
    DATABASE_URL: DATABASE_URL,
    DATABASE: DATABASE_URL === './userbot.db' ? new Sequelize({ dialect: "sqlite", storage: DATABASE_URL, logging: false  }) : new Sequelize(DATABASE_URL, { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }, logging: false  })
};