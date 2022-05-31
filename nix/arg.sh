# Primon Proto 
# Headless WebSocket, type-safe Whatsapp UserBot
# 
# Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
# Multi-Device Lightweight ES5 Module (can ysable with mjs)
#
# Phaticusthiccy - 2022


pnpm add typescript -D
yarn tsc
tsc --generateTrace	
tsc --watch	./index.ts
tsc --init
function install()
{
if [[ process.env.node > 12 ]]
then
npm install typescript -g
else
yarn install typescript
fi
}
install()
yarn pbjs -t static-module -w commonjs -o ./index.js ./types.proto;
yarn pbts -o ./main.d.ts ./index.js;