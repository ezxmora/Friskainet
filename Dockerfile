FROM arm64v8/node:lts-alpine

WORKDIR /Friskainet

RUN apk update
RUN apk add ffmpeg

COPY package.json .
RUN npm install

COPY . .

CMD ["node", "app.js"]
