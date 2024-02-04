FROM --platform=$BUILDPLATFORM node:21-alpine
ARG BUILDPLATFORM
WORKDIR /Friskainet

RUN apk update
RUN apk add ffmpeg

COPY package.json .
RUN npm install

COPY . .

CMD ["node", "app.js"]
