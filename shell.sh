# Primon Proto 
# Headless WebSocket, type-safe Whatsapp UserBot
# 
# Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
# Multi-Device Lightweight ES5 Module (can ysable with mjs)
#
# Phaticusthiccy - 2022


echo "Loading Packages.."
sleep 2
npm install -g --silent typescript 
clear
sleep 1
echo "Building Env.."
sleep 1
tsc --init
git clone https://www.github.com/phaticusthiccy/PrimonProto
cd ./PrimonProto
npm install --silent
clear
sleep 1
echo "Starting Script.."
sleep 2
clear
tsc --init
tsc ./qr.ts
node ./qr.js
