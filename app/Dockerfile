FROM node:8

WORKDIR /usr/src/app

RUN npm -g config set user root

RUN npm install -g bunyan nodemon

COPY ./package*.json ./

RUN npm install

COPY . .

EXPOSE 42425

CMD ["npm", "start"]
