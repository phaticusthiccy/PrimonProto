const { Sequelize } = require('sequelize');
DATABASE_URL = process.env.DATABASE_URL === undefined ? './primon.db' : process.env.DATABASE_URL;
DEBUG = false
module.exports = {
  VERSION: 'v1.0 Beta',
  DATABASE_URL: DATABASE_URL,
  DATABASE: DATABASE_URL === './primon.db' ? new Sequelize({ dialect: "sqlite", storage: DATABASE_URL, logging: DEBUG }) : new Sequelize(DATABASE_URL, { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }, logging: DEBUG }),
}
