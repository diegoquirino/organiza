FROM node:12.2.0-alpine
EXPOSE 8080
COPY . .
RUN npm install
CMD node index.js