#!/bin/zsh
npm install
npm run build:prod

rm -f ./dcc.zip
cd dist
zip -r ../dcc.zip .
cd ..

