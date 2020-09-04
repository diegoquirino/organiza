FROM node:14.9.0-alpine3.10
EXPOSE 8080
COPY . .
RUN npm install
CMD node index.js
