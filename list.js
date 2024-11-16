let command = [];
let descCommand = [];
let pmap = [];
let clist = [];
let dns = false;
let cns = false;
function checkArg(arg) {
    dns = false;
    for (var com of command) {
        if (com === arg) {
            dns = true;
            return dns;
        }
    }
}
function addCommand(commnd) {
    if (commnd.length===0) {
        const check = checkArg(commnd);
        // console.log(check);
        if (!check) command.push(commnd);
        // console.log(command);
    }
    else {
        for (var i of commnd) {
            const check = checkArg(i);
            if (!check) command.push(i);
        }
    }
}
function addDescription(params) {
    try {
        if (Array.isArray(params)) {
            for (const param of params) {
                if (typeof param === 'object' && 'name' in param) {
                    const exists = descCommand.some(cmd => cmd.name === param.name);
                    
                    if (!exists) {
                        descCommand.push(param);
                    } else {
                        console.error(`Hata: '${param.name}' zaten mevcut.`);
                    }
                } else {
                    console.error('Yanlış argüman: Bir nesne bekleniyor, gelen:', param);
                }
            }
        } else if (typeof params === 'object' && 'name' in params) {
            const exists = descCommand.some(cmd => cmd.name === params.name);
            
            if (!exists) {
                descCommand.push(params);
            } else {
                console.error(`Hata: '${params.name}' zaten mevcut.`);
            }
        } else {
            console.error('Yanlış argüman: Bir nesne veya dizi bekleniyor, gelen:', params);
        }
    } catch (error) {
        console.error('Hata:', error);
    }
}

module.exports = {
    addCommand: addCommand,
    addDesc: addDescription,
    command: command,
    desc: descCommand,
}