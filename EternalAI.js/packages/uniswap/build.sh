#!/bin/bash

yarn build
gzip -c dist/bundle.iife.js > dist/bundle.iife.js.gz
ls -lg -h dist/

