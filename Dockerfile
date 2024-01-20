FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY app/* ./
RUN npm ci --omit=dev && npm run build
COPY . .

ENV ADDRESS=0.0.0.0 PORT=80

CMD ["node", "app/api.js"]
