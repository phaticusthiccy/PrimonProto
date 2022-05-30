#!/usr/bin/env bash

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
