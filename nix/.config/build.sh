# Primon Proto 
# Headless WebSocket, type-safe Whatsapp Bot
# 
# Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
# Multi-Device Lightweight ES6 Module (can usable with mjs)
#
# Phaticusthiccy - 2022

set -e

rm -rf .build
mkdir -p ./.build

ENTRYPOINTS=$(find -type f -name '*.[tj]s' -not -path './node_modules/*')

esbuild $ENTRYPOINTS \
	--log-level=warning \
	--outdir='./.build' \
	--outbase=. \
	--sourcemap \
	--target='node16' \
	--platform='node' \
	--format='cjs'
