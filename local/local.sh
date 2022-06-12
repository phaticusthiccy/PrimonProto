clear
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
yes n | pkg update
yes n | pkg upgrade
yes n | pkg install nodejs
yes n | npm install @railway/cli
yes n | npm install -g typescript
npm install pino
yes n | npm install @hapi/boom
yes n | npm install @adiwajshing/baileys
yes n | npm install @adiwajshing/keyed-db
npm install chalk@4.1.2
npm install qrcode-terminal
yes n | npm install shelljs
yes n | npm install axios
git clone https://github.com/phaticusthiccy/PrimonProto
cd PrimonProto && cd local
tsc local.ts
clear
node local.js
