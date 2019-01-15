FROM node:alpine

RUN mkdir /app
WORKDIR /app

COPY package.json /app
COPY index.js /app
COPY Queries.js /app


RUN yarn

CMD ["npm", "start"]

EXPOSE 8080