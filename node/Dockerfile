FROM node:16-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY ./target ./target

COPY ./data ./data

CMD ["node", "./target/index.js"]