FROM node:14.15.4-alpine

WORKDIR /app
COPY ./package.json .
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]