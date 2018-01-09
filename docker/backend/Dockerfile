FROM node:8

WORKDIR /usr/src/app

RUN npm install -g bunyan nodemon

COPY ./backend/package*.json ./

RUN npm install

COPY ./backend .

EXPOSE 8080

CMD ["npm", "start"]
