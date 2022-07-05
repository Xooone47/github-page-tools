#!/bin/sh
set -e

echo 'node version:'
node -v
echo 'yarn version:'
yarn -v

yarn clean

# NOTE: --ignore-engines: fix the node version problem in docker image
# yarn --registry=https://npm.shopee.io --frozen-lockfile --ignore-engines

NODE_ENV=production NODE_OPTIONS=--max-old-space-size=4096 webpack --mode production

# cp -r static build/static/assets
# cp -r public/* build

echo "Done: Build."
