#!/bin/bash

rm -rf ./dist-main

yarn build-main
gzip -c dist-main/bundle.es.js > dist-main/bundle.es.js.gz

base64 -i ./dist-main/bundle.es.js.gz -o ./dist-main/bundle.es.js.gz.base64
cp dist-main/bundle.es.js test/
cp dist-main/bundle.es.js.gz.base64 test/
ls -lg -h dist-main/
ls -lg -h test/