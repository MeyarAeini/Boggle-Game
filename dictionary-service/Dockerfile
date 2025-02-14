FROM node:lts-alpine

COPY package.json .

RUN npm install
RUN npm install -g pnpm

COPY . .

EXPOSE 3003

CMD ["pnpm","run","start"]