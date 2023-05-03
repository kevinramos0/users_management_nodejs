FROM node:16

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .

EXPOSE 8002

CMD npm start