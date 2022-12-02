FROM node:16.18-alphine3.15
COPY ./package.json /app/package.json

WORKDIR /app

RUN npm install

COPY . /app

CMD [ "npm start" ]