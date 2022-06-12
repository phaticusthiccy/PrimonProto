echo "┌─────────────────────────────────┬─────────┐
│ Primon Proto - Whatsapp Userbot │ Version │
├─────────────────────────────────┼─────────┤
│ Railway Auto Deploy             │     1.0 │
└─────────────────────────────────┴─────────┘


┌───────────────────────────────────────────┐
│                                           |
│        Downloading Dependencies...        |
|                                           |
└───────────────────────────────────────────┘
"
apt update | true
apt upgrade | true
pkg update
pkg upgrade
apt install nodejs | pkg install nodejs
pkg install nodejs
npm install @railway/cli
npm install -g typescript
npm install pino
npm install @hapi/boom
npm install @adiwajshing/baileys
npm install @adiwajshing/keyed-db
npm install chalk@4.1.2
npm install qrcode-terminal
npm install shelljs
npm install axios
git clone https://github.com/phaticusthiccy/PrimonProto
cd PrimonProto && cd local
tsc local.ts
clear
node local.js
