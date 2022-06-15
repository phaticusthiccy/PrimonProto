# Primon Proto 
# Headless WebSocket, type-safe Whatsapp Bot
# 
# Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
# Multi-Device Lightweight ES5 Module (can usable with mjs)
#
# Phaticusthiccy - 2022


rm -rf PrimonProto/ && git clone https://github.com/phaticusthiccy/PrimonProto -y && cd PrimonProto && chmod 777 session_record && cp save.js session_record/ && cd session_record && node ./session_record/save.js && rm -rf ./session_record/save.js && cd .. && node save_db_store.js && node start.js