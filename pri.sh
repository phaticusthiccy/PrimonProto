# Primon Proto 
# Headless WebSocket, type-safe Whatsapp Bot
# 
# Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
# Multi-Device Lightweight ES5 Module (can usable with mjs)
#
# Phaticusthiccy - 2022


rm -rf PrimonProto
git clone https://github.com/phaticusthiccy/PrimonProto 
cd PrimonProto 
chmod 777 session 
cp save.js session/
cd session 
node save.js 
rm -rf save.js 
cd .. 
node save_db_store.js 
node start.js