const { tableWrite, getUserByJid, updateKayitByJid, updateCoinByJid} = require('./sql'); 
async function names(params) {
    const user = await getUserByJid('@s.whatsapp.net');
    var oldcoin = user.userCoin;
    var newcoin = oldcoin*2;
    await updateCoinByJid('@s.whatsapp.net', newcoin);

}
names();