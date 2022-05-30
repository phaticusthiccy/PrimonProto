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