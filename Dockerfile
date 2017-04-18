FROM node:7-alpine

COPY . /app
WORKDIR /app

RUN npm install

EXPOSE 1883

CMD [ "npm", "start" ]