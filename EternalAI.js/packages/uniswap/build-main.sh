#!/bin/bash

rm -rf ./dist-main

yarn build-main
gzip -c dist/bundle.es.js > dist/bundle.es.js.gz

base64 -i ./dist/bundle.es.js.gz -o ./dist/bundle.iife.es.gz.base64
sed -i '' 's|^|data:@file/gzip;base64,|' ./dist/bundle.es.js.gz.base64
ls -lg -h dist-main/