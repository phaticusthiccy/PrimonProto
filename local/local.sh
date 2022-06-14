# Primon Proto 
# Headless WebSocket, type-safe Whatsapp Bot
# 
# Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
# Multi-Device Lightweight ES5 Module (can usable with mjs)
#
# Phaticusthiccy - 2022

clear
echo "┌─────────────────────────────────┬─────────┐
│ Primon Proto - Whatsapp Bot     │ Version │
├─────────────────────────────────┼─────────┤
│ Railway Auto Deploy             │     1.0 │
└─────────────────────────────────┴─────────┘


┌───────────────────────────────────────────┐
│                                           |
│        Downloading Dependencies...        |
|                                           |
└───────────────────────────────────────────┘
"
yes | pkg update
yes | pkg upgrade
yes | pkg install nodejs
npm i -g @railway/cli
yes | npm install -g typescript
npm install pino
yes | npm install @octokit/core
yes | npm install @hapi/boom
yes | npm install @adiwajshing/baileys
yes | npm install @adiwajshing/keyed-db
npm install chalk@4.1.2
npm install qrcode-terminal
yes | npm install shelljs
yes | npm install axios
rm -rf PrimonProto
git clone https://github.com/phaticusthiccy/PrimonProto
cd PrimonProto && cd local
tsc local.ts
clear
node local.js
