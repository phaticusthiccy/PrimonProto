const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const yts = require('yt-search');
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function launchBrowserWithExtension(downloadPath, downloadlink, downloadName) {
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath 
    });
    await page.goto('https://mp3-juices.nu/p1aL/'); 
    await sleep(2000);
    
    await page.evaluate(async (downloadlink) => {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        async function dwn() {
            document.querySelector('#query').value = downloadlink;
            const submitButton = document.querySelector('input[type="submit"]');
            await sleep(200);
            submitButton.click();
        }
        dwn();
    }, downloadlink);
    await sleep(3000);
    await page.evaluate(async () => {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        async function next() {
            const xpath = '/html/body/div[4]/div/div[2]/a[1]'; 
            const navLink = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            await sleep(500);
            navLink.click();
            await sleep(1500);
            const xpathh = '/html/body/div[4]/div/div[2]/a[1]'; 
            const navLinkk = document.evaluate(xpathh, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            await navLinkk.click();
        }
        next();
    });
    await sleep(5000);
    const downloadedFiles = fs.readdirSync(downloadPath);
    const downloadedFile = downloadedFiles.find(file => file.endsWith('.mp3') || file.endsWith('.mp4')); 
    if (downloadedFile) {
        const oldPath = path.join(downloadPath, downloadedFile);
        const newPath = path.join(downloadPath, `${downloadName}`); 
        fs.renameSync(oldPath, newPath); 
        console.log(`Dosya başarıyla ${newPath} olarak kaydedildi.`);
    } else {
        console.log('İndirilen dosya bulunamadı.');
    }
    await browser.close();
}
async function searchYouTube(query) {
    try {
        const result = await yts(query);
        const links = result.videos.map(video => video.url);
        return links[0]; 
    } catch (error) {
        console.error('Arama sırasında hata oluştu:', error);
    }
}

async function download(arg, downloadnName, dwnPath) {
    const link = await searchYouTube(`${arg}`);
    console.log(`İndirilecek bağlantı: ${link}`);
    await launchBrowserWithExtension(dwnPath, link, downloadnName)
        .then(() => console.log('Tarayıcı başlatıldı!'))
        .catch(err => console.error('Hata:', err));
}
module.exports = download;