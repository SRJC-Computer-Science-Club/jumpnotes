FROM node:latest

RUN mkdir /server

WORKDIR /server


ADD package.json      /server/package.json
ADD server.js         /server/server.js
COPY app              /server/app
COPY public           /server/public
COPY ssl_certificates /server/ssl_certificates
#COPY data             /server/data

RUN npm install --save

EXPOSE 3000

CMD node server.js