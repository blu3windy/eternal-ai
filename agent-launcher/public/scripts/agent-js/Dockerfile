FROM node:22-alpine

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./server.js /app/src/server.js

RUN yarn

CMD ["yarn", "server"]