const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;
const qrFilePath = path.join(__dirname, 'qr-code.png');
let lastModified = null;
app.use(express.static('public'));
app.get('/qr.png', (req, res) => {
    fs.stat(qrFilePath, (err, stats) => {
        if (err) {
            res.status(404).send('QR kodu bulunamadı.');
            return;
        }

        if (!lastModified || lastModified < stats.mtimeMs) {
            lastModified = stats.mtimeMs;
            res.sendFile(qrFilePath);
        } else {
            res.sendFile(qrFilePath);
        }
    });
});
function checkForQRCodeUpdate() {
    fs.stat(qrFilePath, (err, stats) => {
        if (err) {
            console.error('QR kodu dosyası bulunamadı:', err);
            return;
        }

        if (!lastModified || lastModified < stats.mtimeMs) {
            console.log('QR kodu dosyası değişti, güncelleniyor...');
            lastModified = stats.mtimeMs;
        }
    });
}

setInterval(checkForQRCodeUpdate, 2000);
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});
