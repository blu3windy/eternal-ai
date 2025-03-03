FROM node:22-alpine
WORKDIR /app
COPY ./package.json /app/package.json
RUN yarn
COPY ./server.js /app/src/server.js
CMD ["yarn", "server"]