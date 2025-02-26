#!/bin/bash

rm -rf ./dist

yarn build
gzip -c dist/bundle.iife.js > dist/bundle.iife.js.gz

base64 -i ./dist/bundle.iife.js.gz -o ./dist/bundle.iife.js.gz.base64
sed -i '' 's|^|data:@file/gzip;base64,|' ./dist/bundle.iife.js.gz.base64
ls -lg -h dist/

