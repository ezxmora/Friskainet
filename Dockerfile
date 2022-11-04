FROM node:19-alpine

WORKDIR /Friskainet

RUN apk update
RUN apk add
RUN apk add ffmpeg

COPY package.json .
RUN npm install

COPY . .

CMD ["node", "app.js"]
