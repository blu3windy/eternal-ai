#!/bin/bash

rm -rf ./dist-main

yarn build-main
gzip -c dist-main/bundle.umd.js > dist-main/bundle.umd.js.gz

base64 -i ./dist-main/bundle.umd.js.gz -o ./dist-main/bundle.umd.js.gz.base64
cp dist-main/bundle.umd.js test/
cp dist-main/bundle.umd.js.gz.base64 test/
ls -lg -h dist-main/
ls -lg -h test/