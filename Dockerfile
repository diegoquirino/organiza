FROM node:12.2.0-alpine
EXPOSE 3000
COPY .
RUN npm install
CMD node index.js