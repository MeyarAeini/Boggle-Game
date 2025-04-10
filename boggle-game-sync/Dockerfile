FROM node:lts-alpine

WORKDIR ./app
COPY package.json .

RUN npm install
RUN npm install -g pnpm

COPY . .

EXPOSE 4000

CMD ["pnpm","run","start"]