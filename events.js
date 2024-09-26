const config = require('./config');
let Commands = [];

function addCommand(info, func) {
    const types = ['photo', 'image', 'text', 'message'];

    const infos = {
        fromMe: info['fromMe'] === undefined ? true : info['fromMe'],
        onlyGroup: info['onlyGroup'] === undefined ? false : info['onlyGroup'],
        onlyPm: info['onlyPm'] === undefined ? false : info['onlyPm'],
        desc: info['desc'] === undefined ? '' : info['desc'],
        usage: info['usage'] === undefined ? '' : info['usage'],
        dontAddCommandList: info['dontAddCommandList'] === undefined ? false : info['dontAddCommandList'],
        function: func,
    };

    if (info['on'] === undefined && info['pattern'] === undefined) {
        infos.on = 'message';
        infos.fromMe = false;
    } else if (info['on'] !== undefined && types.includes(info['on'])) {
        infos.on = info['on'];
        if (info['pattern'] !== undefined) {
            infos.pattern = new RegExp(
                (info['handler'] === undefined || info['handler'] === true
                    ? config.HANDLERS
                    : '') + info.pattern,
                info['flags'] !== undefined ? info['flags'] : ''
            );
        }
    } else {
        infos.pattern = new RegExp(
            (info['handler'] === undefined || info['handler'] === true
                ? config.HANDLERS
                : '') + info.pattern,
            info['flags'] !== undefined ? info['flags'] : ''
        );
    }

    Commands.push(infos);
    return infos;
}

function deleteCommand(pattern_toDel) {
    const fnd = Commands.findIndex(
        (obj) =>
            obj.pattern
                .toString()
                .match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)[2]
                .trim() == pattern_toDel
    );
    Commands[fnd].deleted = true;
    Commands[fnd].dontAddCommandList = true;
}

module.exports = {
    addCommand: addCommand,
    commands: Commands,
    deleteCommand: deleteCommand
};
