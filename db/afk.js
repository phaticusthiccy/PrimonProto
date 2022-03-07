const config = require('../../config');
const { DataTypes } = require('sequelize');

const AFKDB = config.DATABASE.define('AFK', {
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

async function getAFK(tip = 'SET') {
    var Msg = await GreetingsDB.findAll({
        where: {
            type: tip
        }
    });

    if (Msg.length < 1) {
        return false;
    } else {
        return Msg[0].dataValues;
    }
}

async function setAFK(tip = 'SET', text = null) {
    var Msg = await GreetingsDB.findAll({
        where: {
            type: tip
        }
    });

    if (Msg.length < 1) {
        return await GreetingsDB.create({ type: tip, message: text });
    } else {
        return await Msg[0].update({ type: tip, message: text });
    }
}

async function deleteAFK(tip = 'SET') {
    var Msg = await GreetingsDB.findAll({
        where: {
            type: tip
        }
    });
    return await Msg[0].destroy();
}

module.exports = {
    AFKDB: AFKDB,
    getAFK: getAFK,
    setAFK: setAFK,
    deleteAFK: deleteAFK
};