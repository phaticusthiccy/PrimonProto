const { exec } = require('child_process');
const fs = require('fs');

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
async function qr() {
    const process = exec('node qr.js');
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


async function start() {
    if (fs.existsSync('.started')) {
        return await stindex()
    } else {
        return await qr()
    }
}
start();
