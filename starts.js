const { exec } = require('child_process');
const config = require('./config');
const onestart = config.ONESTART;
const fsp = require('fs').promises;
const path = require('path');
const { error } = require('console');
const configPath = path.join(__dirname, 'config.js');
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateBooleanInConfig(newValue, variableName) {
    try {
        let configFile = await fsp.readFile(configPath, 'utf-8');
        const variableRegex = new RegExp(`(${variableName}:\\s*)(true|false)`, 's');
        
        if (configFile.match(variableRegex)) {
            const updatedVariable = `${variableName}: ${newValue.toString()}`;
            configFile = configFile.replace(variableRegex, updatedVariable);
            await saveConfig(configFile);
            console.log(`${variableName} değişkeni güncellendi ve yeni değer: ${newValue}`);
        } else {
            console.error(`${variableName} değişkeni bulunamadı veya uygun formatta değil.`);
        }
    } catch (error) {
        console.error('Dosya okuma veya yazma hatası:', error);
    }
}
async function saveConfig(configContent) {
    await fsp.writeFile(configPath, configContent, 'utf-8');
}
async function nodeins() {
    return new Promise((resolve, reject) => {
        const process = exec('npm i');

        process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        process.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        process.on('close', (code) => {
            if (code === 0) {
                console.log(`Process exited successfully with code ${code}`);
                resolve(code);  // Başarıyla tamamlandığında resolve et
            } else {
                console.log(`Process exited with code ${code}`);
                reject(new Error(`Process failed with code ${code}`));  // Hata varsa reject et
            }
        });
    });
}
async function gitins() {
    return new Promise((resolve, reject) => {
        const process = exec('git clone https://github.com/abdullah5151/WhatsAsena');

        process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        process.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        process.on('close', (code) => {
            if (code === 0) {
                console.log(`Process exited successfully with code ${code}`);
                resolve(code);
            } else {
                console.log(`Process exited with code ${code}`);
                reject(new Error(`Process failed with code ${code}`)); 
            }
        });
        const processs = exec('cd WhatsAsena');

        processs.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        processs.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        processs.on('close', (code) => {
            if (code === 0) {
                console.log(`Process exited successfully with code ${code}`);
                resolve(code);
            } else {
                console.log(`Process exited with code ${code}`);
                reject(new Error(`Process failed with code ${code}`)); 
            }
        });
    });
}
async function stindex() {
    const process = exec('node index.js');
    process.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    process.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    process.on('close', (code) => {
      console.log(`Process exited with code ${code}`);
    });
}
async function qrsite() {
    const process = exec('node qrsite/server.js');
    process.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    process.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    process.on('close', (code) => {
      console.log(`Process exited with code ${code}`);
    });
}
async function qrcode() {
    return new Promise((resolve, reject) => {
        const process = exec('node qr.js');

        process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        process.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            resolve(data);
        });

        process.on('close', (code) => {
            console.log(`Process exited with code ${code}`);
            resolve(code);
        });
    });
}

async function start() {
    if (onestart) {
        await gitins();
        const result = await nodeins();
        qrcode();
        qrsite();
        await updateBooleanInConfig(false, 'ONESTART');
    } else {
        stindex();
    }
}

start();