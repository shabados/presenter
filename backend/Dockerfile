FROM node:8

WORKDIR /usr/src/app

RUN npm install -g bunyan nodemon

COPY ./package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
