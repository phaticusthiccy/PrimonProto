const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const clspath = path.join(__dirname);

// Veritabanını oluştur
let db = new sqlite3.Database(`${clspath}\\coinSystem.db`, (err) => {
    if (err) {
        console.error(err.message);
    }
});

// Tablo oluştur
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        userjid TEXT PRIMARY KEY,
        coin INTEGER,
        yetki INTEGER,
        onay BOOLEAN,
        kayit BOOLEAN
    )`);
});

// Kullanıcı verisi yazma fonksiyonu
async function tableWrite(userjid, coin, admin) {
    if (!coin || admin === '') {
        console.log('Girilen veri boş.');
        return;
    }

    const cnnum = Number(coin);
    const adnum = Number(admin);

    let stmt = db.prepare(`INSERT INTO users (userjid, coin, yetki, onay, kayit) VALUES (?, ?, ?, ?, ?)`);
    stmt.run(`${userjid}`, cnnum, adnum, true, false, function(err) {
        if (err) {
            console.error('Hata:', err.message);
        }
    });
    stmt.finalize();
}

// Kullanıcı bilgilerini alma fonksiyonu
async function getUserByJid(userjid) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE userjid = ?`, [userjid], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row) {
                    const userCoin = row.coin;
                    const userYetki = row.yetki;
                    const userOnay = row.onay;
                    resolve({ userCoin, userYetki, userOnay });
                } else {
                    resolve(null);
                }
            }
        });
    });
}
async function checkUserExists(userjid) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT userjid FROM users WHERE userjid = ?`, [userjid], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
}
async function updateCoinByJid(userjid, newCoinValue) {
    if (newCoinValue === undefined) {
        console.log('Yeni coin değeri belirtilmemiş.');
        return;
    }

    const cnnum = Number(newCoinValue);
    
    let stmt = db.prepare(`UPDATE users SET coin = ? WHERE userjid = ?`);
    stmt.run(cnnum, userjid, function(err) {
        if (err) {
            console.error('Güncelleme hatası:', err.message);
        } else {
            console.log(`Kullanıcının coin değeri güncellendi: ${userjid} için yeni değer ${cnnum}`);
        }
    });
    stmt.finalize();
}
async function updateOnayByJid(userjid, onay) {
    if (onay !== true && onay !== false) {
        console.log('Yeni coin değeri belirtilmemiş.');
        return;
    }
    let stmt = db.prepare(`UPDATE users SET onay = ? WHERE userjid = ?`);
    stmt.run(onay, userjid, function(err) {
        if (err) {
            console.error('Güncelleme hatası:', err.message);
        } else {
            console.log(`Kullanıcının onay değeri güncellendi: ${userjid} için yeni değer ${onay}`);
        }
    });
    stmt.finalize();
}
async function updateKayitByJid(userjid) {
    let stmt = db.prepare(`UPDATE users SET kayit = ? WHERE userjid = ?`);
    stmt.run(true, userjid, function(err) {
        if (err) {
            console.error('Güncelleme hatası:', err.message);
        } else {
            console.log(`Kullanıcının kayit değeri güncellendi: ${userjid} için yeni değer true`);
        }
    });
    stmt.finalize();
}
module.exports = { tableWrite, getUserByJid, updateKayitByJid , updateOnayByJid, updateCoinByJid, checkUserExists };
